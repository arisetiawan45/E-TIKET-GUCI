// Nama file ini bisa create-pemesanan.js atau nama lain yang sesuai
import { Pool } from '@neondatabase/serverless';

export const handler = async (event) => {
  // Log untuk menandakan fungsi dimulai
  console.log('Fungsi createPemesanan dipanggil.');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Hanya metode POST yang diizinkan' }),
    };
  }

  let pool;

  try {
    // 1. Ambil data yang dikirim dari frontend (Pemesanan.js)
    const data = JSON.parse(event.body);
    console.log('Menerima data dari frontend:', JSON.stringify(data, null, 2));

    const { 
      tanggal_kunjungan, 
      jenis_tiket, 
      nama_item, 
      jumlah_tiket, 
      total_harga 
    } = data;
    
    // Validasi data yang diterima
    if (!tanggal_kunjungan || !jenis_tiket || !nama_item || !jumlah_tiket || total_harga === undefined) {
        console.error('Validasi gagal: Data dari frontend tidak lengkap.');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Data yang dikirim tidak lengkap.' }),
        };
    }

    pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

    // 2. Query SQL disesuaikan dengan nama kolom di tabel baru Anda
    const sqlQuery = `
      INSERT INTO pemesanan (
        tanggal_kunjungan, 
        jenis_tiket, 
        nama, 
        jumlah, 
        total,
        destinasi_id, 
        paket_id
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id;
    `;

    // 3. Siapkan values sesuai urutan kolom di query
    // Untuk destinasi_id dan paket_id, kita isi dengan null untuk sementara
    // karena frontend mengirimkan nama, bukan ID.
    const values = [
      tanggal_kunjungan,       // $1
      jenis_tiket,             // $2
      nama_item,               // $3 (Mengisi kolom 'nama' dengan nama destinasi/paket)
      parseInt(jumlah_tiket, 10),// $4 (Mengisi kolom 'jumlah')
      parseInt(total_harga, 10), // $5 (Mengisi kolom 'total')
      null,                    // $6 -> untuk destinasi_id
      null                     // $7 -> untuk paket_id
    ];
    
    console.log('Akan menjalankan query SQL:', sqlQuery);
    console.log('Dengan values:', values);

    const result = await pool.query(sqlQuery, values);
    
    // Pastikan koneksi ditutup setelah selesai
    await pool.end();
    
    const newId = result.rows[0].id;
    console.log('Pemesanan berhasil, ID baru:', newId);

    return {
      statusCode: 201, // 201 Created adalah status yang lebih tepat
      body: JSON.stringify({ 
        message: 'Pemesanan berhasil dibuat!', 
        id: newId
      }),
    };

  } catch (error) {
    console.error('!!! TERJADI ERROR DI DALAM FUNGSI !!!:', error);
    
    if (pool) {
      await pool.end();
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Terjadi kesalahan pada server saat menyimpan pesanan.' }),
    };
  }
};
