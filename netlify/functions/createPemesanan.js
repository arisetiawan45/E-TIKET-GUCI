import { Pool } from '@neondatabase/serverless';

export const handler = async (event) => {
  // Log bahwa fungsi dimulai
  console.log('Function createPemesanan dipanggil.');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan' }),
    };
  }

  let pool; // Definisikan pool di luar try-catch

  try {
    const data = JSON.parse(event.body);
    console.log('Menerima data dari frontend:', data);

    const { nama, paket, jumlah, tanggal } = data;
    
    if (!nama || !paket || !jumlah || !tanggal) {
        console.error('Validasi gagal: Data tidak lengkap.');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Semua field wajib diisi' }),
        };
    }

    console.log('Menghubungkan ke database...');
    pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const sqlQuery = `
      INSERT INTO pemesanan (nama, paket_wisata, jumlah_tiket, tanggal_kunjungan) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id;
    `;
    const values = [nama, paket, parseInt(jumlah, 10), tanggal];

    console.log('Menjalankan query SQL...');
    const result = await pool.query(sqlQuery, values);
    console.log('Query berhasil, ID baru:', result.rows[0].id);
    
    await pool.end();
    console.log('Koneksi database ditutup.');

    return {
      statusCode: 201,
      body: JSON.stringify({ 
        message: 'Pemesanan berhasil dibuat!', 
        id: result.rows[0].id 
      }),
    };

  } catch (error) {
    // Ini adalah log error yang paling penting!
    console.error('!!! TERJADI ERROR DI DALAM FUNGSI !!!:', error);
    
    // Pastikan koneksi ditutup bahkan saat ada error
    if (pool) {
      await pool.end();
      console.log('Koneksi database ditutup setelah terjadi error.');
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gagal menyimpan pesanan ke database' }),
    };
  }
};
