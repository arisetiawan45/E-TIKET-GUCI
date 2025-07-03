// File: netlify/functions/get-initial-data.js
const postgres = require('postgres');

// PERBAIKAN: Menggunakan 'exports.handler' untuk kompatibilitas Netlify
exports.handler = async (event, context) => {
  // Hubungkan ke database Neon menggunakan connection string dari environment variable
  const sql = postgres(process.env.NEON_DATABASE_URL, {
    ssl: 'require',
  });

  try {
    // Jalankan beberapa query SQL secara bersamaan dalam satu transaksi
    const [destinasi, paket] = await sql.begin(async sql => [
      
      // Mengambil data destinasi dan menggunakan alias agar konsisten

      await sql`SELECT id_destinasi as id, nama, deskripsi, harga FROM destinasi ORDER BY nama ASC`,
      
      // Mengambil data paket dan menggunakan alias agar konsisten

      await sql`SELECT id_paket as id, nama_paket as nama, deskripsi, harga_paket as harga FROM paket_wisata ORDER BY nama_paket ASC`,
    ]);
    
    // Kirim data kembali ke frontend dengan struktur yang diharapkan
    return {
      statusCode: 200,
      body: JSON.stringify({ destinasi, paket }),
    };

  } catch (error) {
    console.error("Error fetching initial data:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengambil data dari database.' }) };
  }
};