import { Pool } from '@neondatabase/serverless';

export const handler = async (event) => {
  // 1. Pastikan request datang menggunakan metode POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan' }),
    };
  }

  let pool;

  try {
    // 2. Ambil dan parse data dari body request
    const data = JSON.parse(event.body);

    // Ambil data yang relevan dari frontend
    const { tanggal, jumlah, destinasi, paket } = data;

    // 3. Validasi data yang masuk
    if (!tanggal || !jumlah) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Data tidak lengkap. Tanggal dan jumlah tiket wajib diisi.' }),
        };
    }
    
    // 4. Buat koneksi ke database Neon
    pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 5. Query SQL disesuaikan dengan nama kolom di tabel Anda
    //    Perhatikan bahwa kita tidak memasukkan 'id_paket' dan 'id_pembayaran'
    //    dengan asumsi kolom tersebut boleh NULL untuk saat ini.
    const sqlQuery = `
      INSERT INTO pemesanan (tanggal, jumlah_tiket, destinasi_wisata) 
      VALUES ($1, $2, $3) 
      RETURNING id_pemesanan;
    `;

    // 6. Array 'values' disesuaikan dengan query di atas
    const values = [
      tanggal,                  // $1
      parseInt(jumlah, 10),     // $2
      destinasi                 // $3
    ];

    // 7. Eksekusi query
    const result = await pool.query(sqlQuery, values);
    
    // 8. Tutup koneksi database
    await pool.end();

    // 9. Kirim respons sukses kembali ke frontend
    //    Ambil nilai dari 'id_pemesanan' sesuai hasil RETURNING
    return {
      statusCode: 201, // Created
      body: JSON.stringify({ 
        message: 'Pemesanan berhasil dibuat!', 
        id: result.rows[0].id_pemesanan
      }),
    };

  } catch (error) {
    console.error('!!! ERROR DI DALAM FUNGSI createPemesanan !!!:', error);
    
    if (pool) {
      await pool.end();
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Terjadi kesalahan internal pada server saat menyimpan pesanan.' }),
    };
  }
};
