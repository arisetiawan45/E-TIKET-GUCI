// File: netlify/functions/create-transaction.js
const postgres = require('postgres');
const midtransClient = require('midtrans-client'); // Pastikan install: npm install midtrans-client

exports.handler = async (event, context) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  
  // Dapatkan informasi pengguna yang sedang login
  const { user } = context.clientContext;
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Anda harus login untuk membuat pesanan.' }) };
  }
  
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });

  // --- KONFIGURASI MIDTRANS ---
  // Pastikan env variable MIDTRANS_SERVER_KEY sudah ada di Netlify
  let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY
  });

  try {
    const dataFromFrontend = JSON.parse(event.body);
    console.log('Menerima data dari frontend:', dataFromFrontend);

    const {
      nama_pemesan,
      tanggal_kunjungan,
      jenis_tiket,
      jumlah_tiket,
      total_harga,
      item_dipilih // Tambahan dari frontend untuk label di Midtrans (Opsional)
    } = dataFromFrontend;

    if (!nama_pemesan || !tanggal_kunjungan || !jenis_tiket || !jumlah_tiket || total_harga === undefined) {
      console.error('Validasi gagal: Data tidak lengkap.', dataFromFrontend);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Data yang dikirim tidak lengkap.' }),
      };
    }

    // --- BAGIAN DATABASE (QUERY TIDAK DIUBAH SAMA SEKALI) ---
    const result = await sql.begin(async sql => {
      console.log('Memulai transaksi database...');
      
      console.log('Menjalankan INSERT ke tabel pemesanan...');
      // QUERY PERTAMA: PEMESANAN (TETAP SAMA)
      const [pemesanan] = await sql`
        INSERT INTO pemesanan (
          nama_pemesan, tanggal_kunjungan, jenis_tiket, jumlah, total, id_user, 
          id_destinasi, id_paket, tanggal_transaksi
        )
        VALUES (
          ${nama_pemesan}, ${tanggal_kunjungan}, ${jenis_tiket}, ${jumlah_tiket}, ${total_harga}, ${user.sub}, 
          NULL, NULL, NOW() AT TIME ZONE 'Asia/Jakarta'
        )
        RETURNING id_pemesanan;
      `;
      console.log('Sukses INSERT ke pemesanan. ID baru:', pemesanan.id_pemesanan);
      
      console.log('Menjalankan INSERT ke tabel transaksi...');
      // QUERY KEDUA: TRANSAKSI (TETAP SAMA)
      // Mengandalkan default value database untuk kolom status jika ada
      const [transaksi] = await sql`
        INSERT INTO transaksi (id_pemesanan)
        VALUES (${pemesanan.id_pemesanan})
        RETURNING id_transaksi, status;
      `;
      console.log('Sukses INSERT ke transaksi. ID baru:', transaksi.id_transaksi);
      
      return transaksi;
    });
    
    console.log('Transaksi database berhasil di-commit.');

    // --- BAGIAN BARU: INTEGRASI MIDTRANS ---
    // Kode ini berjalan SETELAH database sukses disimpan
    
    // Kita gunakan ID Transaksi dari database agar sinkron
    const orderIdMidtrans = `GUCI-${result.id_transaksi}-${Date.now()}`;

    let midtransParams = {
        "transaction_details": {
            "order_id": orderIdMidtrans,
            "gross_amount": parseInt(total_harga)
        },
        "customer_details": {
            "first_name": nama_pemesan,
            "email": user.email // Menggunakan email user yang login
        },
        "item_details": [{
            "id": jenis_tiket,
            "price": parseInt(total_harga) / parseInt(jumlah_tiket),
            "quantity": parseInt(jumlah_tiket),
            "name": item_dipilih || "Tiket Wisata" // Nama tiket (misal: Paket 1)
        }]
    };

    // Minta Token ke Midtrans
    const midtransTransaction = await snap.createTransaction(midtransParams);
    console.log('Midtrans Token didapat:', midtransTransaction.token);

    // --- RESPONSE ---
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Transaksi dan pemesanan berhasil dibuat",
        data: result,           // Data asli dari database
        token: midtransTransaction.token, // Token untuk Popup Frontend
        orderId: orderIdMidtrans
      }),
    };

  } catch (error) {
    console.error("!!! ERROR SAAT MEMBUAT TRANSAKSI !!!", {
      errorMessage: error.message,
      errorStack: error.stack,
      requestBody: event.body,
    });
    return { 
        statusCode: 500, 
        body: JSON.stringify({ 
            error: 'Gagal memproses transaksi.',
            details: error.message 
        }) 
    };
  }
};