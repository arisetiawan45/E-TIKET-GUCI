// File: netlify/functions/get-admin-data.js
const postgres = require('postgres');

exports.handler = async () => {
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });
  try {
    // MENYESUAIKAN NAMA TABEL DAN KOLOM, MENGGUNAKAN ALIAS (as) AGAR FRONTEND TIDAK RUSAK
    const [destinasi, paket_wisata, transaksi] = await sql.begin(async sql => [
      await sql`SELECT id as id, nama as nama, deskripsi, harga FROM destinasi ORDER BY nama_destinasi ASC`,
      await sql`SELECT id_paket as id, nama_paket as nama, deskripsi, harga FROM paket_wisata ORDER BY nama_paket ASC`,
      await sql`SELECT id_transaksi as id, jumlah_tiket, total_harga FROM transaksi`,
    ]);
    // Nama properti 'paket' diubah menjadi 'paket_wisata' agar lebih jelas
    return {
      statusCode: 200,
      body: JSON.stringify({ destinasi, paket: paket_wisata, transaksi }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengambil data admin.' }) };
  }
};





