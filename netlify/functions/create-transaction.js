// File: netlify/functions/create-transaction.js
// Fungsi ini menangani pembuatan 'pemesanan' dan 'transaksi' sekaligus.
// Pastikan frontend memanggil endpoint ini.
const postgres = require('postgres');

exports.handler = async (event) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });

  try {
    const dataFromFrontend = JSON.parse(event.body);
    console.log('Menerima data dari frontend:', JSON.stringify(dataFromFrontend, null, 2));

    const {
      nama_pemesan, // Mengambil nama pemesan dari data frontend
      tanggal_kunjungan,
      jenis_tiket,
      jumlah_tiket,
      total_harga
    } = dataFromFrontend;

    // Validasi input
    if (!nama_pemesan || !tanggal_kunjungan || !jenis_tiket || !jumlah_tiket || total_harga === undefined) {
      console.error('Validasi gagal: Data dari frontend tidak lengkap.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Data yang dikirim tidak lengkap. Pastikan semua field terisi.' }),
      };
    }

    // Memulai transaksi database untuk memastikan kedua insert berhasil atau gagal bersamaan
    const result = await sql.begin(async sql => {
      // Langkah 1: Masukkan data ke dalam tabel 'pemesanan'
      // PERBAIKAN: Menambahkan kolom 'nama_pemesan'
      const [pemesanan] = await sql`
        INSERT INTO pemesanan (nama_pemesan, tanggal_kunjungan, jenis_tiket, jumlah, total, destinasi_id, paket_id)
        VALUES (${nama_pemesan}, ${tanggal_kunjungan}, ${jenis_tiket}, ${jumlah_tiket}, ${total_harga}, NULL, NULL)
        RETURNING id_pemesanan;
      `;
      
      console.log('Pemesanan berhasil dibuat dengan ID:', pemesanan.id_pemesanan);

      // Langkah 2: Masukkan referensi ke dalam tabel 'transaksi'
      const [transaksi] = await sql`
        INSERT INTO transaksi (id_pemesanan)
        VALUES (${pemesanan.id_pemesanan})
        RETURNING id_transaksi, status;
      `;
      
      console.log('Transaksi berhasil dibuat dengan ID:', transaksi.id_transaksi);
      
      return transaksi;
    });
      
    return {
      statusCode: 201, // 201 Created
      body: JSON.stringify({
        message: "Transaksi dan pemesanan berhasil dibuat",
        data: result
      }),
    };

  } catch (error) {
    console.error("Error saat membuat transaksi:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal menyimpan transaksi.' }) };
  }
};
