const postgres = require('postgres');

exports.handler = async () => {
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });
  try {
    const [destinasi, paket_wisata, transaksi] = await sql.begin(async sql => [
      await sql`SELECT id_destinasi as id, nama, deskripsi, harga FROM destinasi ORDER BY nama ASC`,
      await sql`SELECT id_paket as id, nama_paket as nama, deskripsi, harga_paket as harga FROM paket_wisata ORDER BY nama_paket ASC`,
      // Query diubah untuk mengambil detail lengkap transaksi untuk ditampilkan
      await sql`
        SELECT 
          t.id_transaksi, 
          p.nama_pemesan,
          p.tanggal_kunjungan,
          p.jenis_tiket,
          p.jumlah,
          p.total,
          t.status
        FROM transaksi t
        INNER JOIN pemesanan p ON t.id_pemesanan = p.id_pemesanan
        ORDER BY p.tanggal_kunjungan DESC
      `,
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({ destinasi, paket: paket_wisata, transaksi }),
    };
  } catch (error) {
    console.error("Error di get-admin-data:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengambil data admin.' }) };
  }
};