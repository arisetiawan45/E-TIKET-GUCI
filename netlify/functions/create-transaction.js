// File: netlify/functions/create-transaction.js
// Fungsi ini sekarang menangani pembuatan 'pemesanan' dan 'transaksi' sekaligus.
import { Pool } from '@neondatabase/serverless';

export const handler = async (event) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let pool;

  try {
    const dataFromFrontend = JSON.parse(event.body);
    console.log('Menerima data dari frontend:', JSON.stringify(dataFromFrontend, null, 2));

    const {
      nama,
      tanggal_kunjungan,
      jenis_tiket,
      jumlah_tiket,
      total_harga
    } = dataFromFrontend;

    // Validasi input
    if (!nama || !tanggal_kunjungan || !jenis_tiket || !jumlah_tiket || total_harga === undefined) {
      console.error('Validasi gagal: Data dari frontend tidak lengkap.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Data yang dikirim tidak lengkap.' }),
      };
    }

    pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    const client = await pool.connect();

    try {
      // Memulai transaksi database
      await client.query('BEGIN');

      // Langkah 1: Masukkan data ke dalam tabel 'pemesanan'
      const pemesananQuery = `
        INSERT INTO pemesanan (nama, tanggal_kunjungan, jenis_tiket, jumlah, total, destinasi_id, paket_id)
        VALUES ($1, $2, $3, $4, $5, NULL, NULL)
        RETURNING id_pemesanan;
      `;
      const pemesananValues = [nama, tanggal_kunjungan, jenis_tiket, jumlah_tiket, total_harga];
      const pemesananResult = await client.query(pemesananQuery, pemesananValues);
      const newPemesananId = pemesananResult.rows[0].id_pemesanan;

      console.log('Pemesanan berhasil dibuat dengan ID:', newPemesananId);

      // Langkah 2: Masukkan referensi ke dalam tabel 'transaksi'
      const transaksiQuery = `
        INSERT INTO transaksi (id_pemesanan)
        VALUES ($1)
        RETURNING id_transaksi, status;
      `;
      const transaksiResult = await client.query(transaksiQuery, [newPemesananId]);
      
      // Menyelesaikan transaksi
      await client.query('COMMIT');

      console.log('Transaksi berhasil dibuat dengan ID:', transaksiResult.rows[0].id_transaksi);
      
      return {
        statusCode: 201, // 201 Created
        body: JSON.stringify({
          message: "Transaksi dan pemesanan berhasil dibuat",
          data: transaksiResult.rows[0]
        }),
      };

    } catch (e) {
      // Jika terjadi error, batalkan semua perubahan dalam transaksi
      await client.query('ROLLBACK');
      throw e;
    } finally {
      // Pastikan koneksi dilepaskan
      client.release();
      await pool.end();
    }

  } catch (error) {
    console.error("Error saat membuat transaksi:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal menyimpan transaksi.' }) };
  }
};