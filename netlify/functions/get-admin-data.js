const postgres = require('postgres');

exports.handler = async () => {
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });
  try {
    const [destinasi, paket_wisata, transaksi] = await sql.begin(async sql => [
      await sql`SELECT id_destinasi as id, nama, deskripsi, harga FROM destinasi ORDER BY nama ASC`,
      await sql`SELECT id_paket as id, nama_paket as nama, deskripsi, harga_paket as harga FROM paket_wisata ORDER BY nama_paket ASC`,
      await sql`SELECT id_transaksi as id, jumlah, total FROM pemesanan INNER JOIN transaksi ON pemesanan.id_pemesanan = transaksi.id_pemesanan`,
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({ destinasi, paket: paket_wisata, transaksi }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengambil data admin.' }) };
  }
};