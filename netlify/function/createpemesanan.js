import { Pool } from '@neondatabase/serverless';

export const handler = async (event) => {
  // 1. Pastikan request datang menggunakan metode POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan' }),
    };
  }

  try {
    // 2. Ambil data dari body request yang dikirim frontend
    const { nama, paket, jumlah, tanggal } = JSON.parse(event.body);
    
    // Validasi sederhana (bisa Anda kembangkan)
    if (!nama || !paket || !jumlah || !tanggal) {
        return {
            statusCode: 400, // Bad Request
            body: JSON.stringify({ error: 'Semua field wajib diisi' }),
        };
    }

    // 3. Buat koneksi ke database Neon menggunakan environment variable
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 4. Siapkan query SQL untuk memasukkan data
    //    Gunakan $1, $2, dst. untuk mencegah SQL Injection!
    const sqlQuery = `
      INSERT INTO pemesanan (nama, paket_wisata, jumlah_tiket, tanggal_kunjungan) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id;
    `;
    const values = [nama, paket, parseInt(jumlah, 10), tanggal];

    // 5. Eksekusi query
    const result = await pool.query(sqlQuery, values);
    
    // 6. Tutup koneksi (penting di lingkungan serverless)
    await pool.end();

    // 7. Kirim respons sukses kembali ke frontend
    return {
      statusCode: 201, // Created
      body: JSON.stringify({ 
        message: 'Pemesanan berhasil dibuat!', 
        id: result.rows[0].id 
      }),
    };

  } catch (error) {
    console.error('Database Error:', error);
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({ error: 'Gagal menyimpan pesanan ke database' }),
    };
  }
};
