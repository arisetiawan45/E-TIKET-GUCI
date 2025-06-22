import { Pool } from '@neondatabase/serverless';

export const handler = async (event) => {
  // 1. Pastikan request datang menggunakan metode POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan' }),
    };
  }

  let pool;

  try {
    // 2. Ambil dan parse data dari body request
    const data = JSON.parse(event.body);

    // Destructuring data dari frontend
    const { tanggal, jenis, jumlah, destinasi, paket } = data;

    // 3. Validasi data yang masuk
    // Memastikan field inti tidak kosong
    if (!tanggal || !jenis || !jumlah) {
        return {
            statusCode: 400, // Bad Request
            body: JSON.stringify({ error: 'Data tidak lengkap. Tanggal, jenis, dan jumlah tiket wajib diisi.' }),
        };
    }
    
    // 4. Buat koneksi ke database Neon
    pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 5. Siapkan query SQL untuk memasukkan data
    // Nama kolom di sini harus sama persis dengan yang ada di tabel database Anda
    const sqlQuery = `
      INSERT INTO pemesanan (tanggal, jenis_tiket, jumlah_tiket, destinasi_wisata, paket_wisata) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id;
    `;

    // 6. Siapkan array 'values' sesuai urutan di query
    // Nilai untuk 'destinasi' dan 'paket' bisa berupa string atau null,
    // yang akan diterima dengan baik oleh database.
    const values = [
      tanggal, 
      jenis, 
      parseInt(jumlah, 10), 
      destinasi, 
      paket
    ];

    // 7. Eksekusi query
    const result = await pool.query(sqlQuery, values);
    
    // 8. Tutup koneksi database
    await pool.end();

    // 9. Kirim respons sukses kembali ke frontend
    return {
      statusCode: 201, // Created
      body: JSON.stringify({ 
        message: 'Pemesanan berhasil dibuat!', 
        id: result.rows[0].id 
      }),
    };

  } catch (error) {
    // Tangani jika terjadi error di dalam blok try
    console.error('!!! ERROR DI DALAM FUNGSI createPemesanan !!!:', error);
    
    // Pastikan koneksi ditutup bahkan saat ada error
    if (pool) {
      await pool.end();
    }

    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({ error: 'Terjadi kesalahan internal pada server saat menyimpan pesanan.' }),
    };
  }
};
