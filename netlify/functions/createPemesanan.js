import { Pool } from '@neondatabase/serverless';

export const handler = async (event) => {
  // Log untuk menandakan fungsi dimulai
  console.log('Function createPemesanan dipanggil.');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan' }),
    };
  }

  let pool;

  try {
    const data = JSON.parse(event.body);
    // Log data yang diterima dari frontend agar kita bisa memeriksanya
    console.log('Menerima data dari frontend:', JSON.stringify(data, null, 2));

    const { tanggal, jumlah, destinasi, paket } = data;
    
    if (!tanggal || !jumlah) {
        console.error('Validasi gagal: Tanggal atau jumlah tiket kosong.');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Data tidak lengkap. Tanggal dan jumlah tiket wajib diisi.' }),
        };
    }

    pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

    // Query SQL disesuaikan untuk menyertakan SEMUA kolom yang mungkin
    // Kita akan memberikan nilai NULL untuk id_paket dan id_pembayaran
    const sqlQuery = `
      INSERT INTO pemesanan (tanggal, jumlah_tiket, destinasi_wisata, id_paket, id_pembayaran) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id_pemesanan;
    `;

    // Siapkan values. Untuk kolom yang belum ada datanya, kita isi dengan null.
    const values = [
      tanggal,                   // $1
      parseInt(jumlah, 10),      // $2
      destinasi,                 // $3
      null,                      // $4 -> untuk id_paket
      null                       // $5 -> untuk id_pembayaran
    ];
    
    console.log('Akan menjalankan query SQL:', sqlQuery);
    console.log('Dengan values:', values);

    const result = await pool.query(sqlQuery, values);
    
    await pool.end();
    console.log('Pemesanan berhasil, ID baru:', result.rows[0].id_pemesanan);

    return {
      statusCode: 201,
      body: JSON.stringify({ 
        message: 'Pemesanan berhasil dibuat!', 
        id: result.rows[0].id_pemesanan
      }),
    };

  } catch (error) {
    // Log error yang sebenarnya dan detail dari server
    console.error('!!! TERJADI ERROR FATAL DI DALAM FUNGSI !!!:', error);
    
    if (pool) {
      await pool.end();
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Terjadi kesalahan internal pada server saat menyimpan pesanan.' }),
    };
  }
};