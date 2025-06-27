// File: netlify/functions/create-transaction.js
const postgres = require('postgres');

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

  try {
    const dataFromFrontend = JSON.parse(event.body);
    console.log('Menerima data dari frontend:', dataFromFrontend);

    const {
      nama_pemesan,
      tanggal_kunjungan,
      jenis_tiket,
      jumlah_tiket,
      total_harga
    } = dataFromFrontend;

    if (!nama_pemesan || !tanggal_kunjungan || !jenis_tiket || !jumlah_tiket || total_harga === undefined) {
      console.error('Validasi gagal: Data tidak lengkap.', dataFromFrontend);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Data yang dikirim tidak lengkap.' }),
      };
    }

    // Menggunakan transaksi database untuk keamanan data
    const result = await sql.begin(async sql => {
      console.log('Memulai transaksi database...');
      
      console.log('Menjalankan INSERT ke tabel pemesanan...');
      const [pemesanan] = await sql`
        INSERT INTO pemesanan (nama_pemesan, tanggal_kunjungan, jenis_tiket, jumlah, total, id_user, id_destinasi, id_paket)
        VALUES (${nama_pemesan}, ${tanggal_kunjungan}, ${jenis_tiket}, ${jumlah_tiket}, ${total_harga}, ${user.sub}, NULL, NULL)
        RETURNING id_pemesanan;
      `;
      console.log('Sukses INSERT ke pemesanan. ID baru:', pemesanan.id_pemesanan);
      
      console.log('Menjalankan INSERT ke tabel transaksi...');
      const [transaksi] = await sql`
        INSERT INTO transaksi (id_pemesanan)
        VALUES (${pemesanan.id_pemesanan})
        RETURNING id_transaksi, status;
      `;
      console.log('Sukses INSERT ke transaksi. ID baru:', transaksi.id_transaksi);
      
      return transaksi;
    });
    
    console.log('Transaksi database berhasil di-commit.');
      
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Transaksi dan pemesanan berhasil dibuat",
        data: result
      }),
    };

  } catch (error) {
    // Logging yang lebih detail untuk debugging
    console.error("!!! ERROR SAAT MEMBUAT TRANSAKSI !!!", {
      errorMessage: error.message,
      errorStack: error.stack,
      requestBody: event.body,
    });
    return { 
        statusCode: 500, 
        body: JSON.stringify({ 
            error: 'Gagal menyimpan transaksi ke database.',
            details: error.message // Memberikan detail error ke client
        }) 
    };
  }
};
