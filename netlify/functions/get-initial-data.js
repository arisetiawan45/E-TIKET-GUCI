// File: netlify/functions/get-initial-data.js
const postgres = require('postgres');

exports.handler = async (event, context) => {
  // Hubungkan ke database Neon menggunakan connection string dari environment variable
  const sql = postgres(process.env.NEON_DATABASE_URL, {
    ssl: 'require',
  });

  try {
    // Jalankan beberapa query SQL secara bersamaan dalam satu transaksi
    const [destinasi, paket] = await sql.begin(async sql => [
      await sql`SELECT * FROM destinasi`,
      await sql`SELECT * FROM paket_wisata`,
    ]);
    
    // Kirim data kembali ke frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ destinasi, paket }),
    };

  } catch (error) {
    console.error("Error fetching initial data:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengambil data dari database.' }) };
  }
};


