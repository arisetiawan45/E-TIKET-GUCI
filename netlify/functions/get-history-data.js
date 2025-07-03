// File: netlify/functions/get-history-data.js
// Fungsi ini menjadi satu-satunya sumber untuk mengambil data terkait transaksi,
// destinasi, dan paket, berdasarkan 'scope' yang diberikan.

const postgres = require('postgres');

exports.handler = async (event, context) => {
  // Ambil 'scope' dari query string, default ke 'user' jika tidak ada
  const scope = event.queryStringParameters.scope || 'user';
  const { user } = context.clientContext;
  
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });

  try {
    // Logika berbeda berdasarkan scope
    switch (scope) {
      case 'initial':
        // Hanya untuk form pemesanan, ambil destinasi dan paket
        const [destinasi, paket] = await sql.begin(async sql => [
          await sql`SELECT id_destinasi as id, nama, deskripsi, harga FROM destinasi ORDER BY nama ASC`,
          await sql`SELECT id_paket as id, nama_paket as nama, deskripsi, harga_paket as harga FROM paket_wisata ORDER BY nama_paket ASC`,
        ]);
        return { statusCode: 200, body: JSON.stringify({ destinasi, paket }) };

      case 'user':
        // Untuk riwayat transaksi pengguna biasa
        if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Akses ditolak.' }) };
        const userTransactions = await sql`
          SELECT t.id_transaksi, p.nama_pemesan, p.tanggal_kunjungan, p.jumlah, p.total, t.status, p.tanggal_transaksi 
          FROM transaksi t
          INNER JOIN pemesanan p ON t.id_pemesanan = p.id_pemesanan
          WHERE p.id_user = ${user.sub}
          ORDER BY p.tanggal_transaksi DESC
        `;
        return { statusCode: 200, body: JSON.stringify(userTransactions) };

      case 'admin':
      case 'pimpinan':
        // Untuk halaman Admin dan Pimpinan, ambil semua data
        if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Akses ditolak.' }) };
        // Anda bisa menambahkan pengecekan peran di sini jika perlu
        // if (!user.app_metadata.roles.includes('admin')) { ... }
        
        const [allDestinasi, allPaket, allTransaksi] = await sql.begin(async sql => [
            await sql`SELECT id_destinasi as id, nama, deskripsi, harga FROM destinasi ORDER BY nama ASC`,
            await sql`SELECT id_paket as id, nama_paket as nama, deskripsi, harga_paket as harga FROM paket_wisata ORDER BY nama_paket ASC`,
            await sql`
                SELECT t.id_transaksi, p.nama_pemesan, p.tanggal_kunjungan, p.jumlah, p.total, t.status, p.tanggal_transaksi
                FROM transaksi t
                INNER JOIN pemesanan p ON t.id_pemesanan = p.id_pemesanan
                ORDER BY p.tanggal_transaksi DESC
            `,
        ]);
        return { statusCode: 200, body: JSON.stringify({ destinasi: allDestinasi, paket: allPaket, transaksi: allTransaksi }) };

      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Scope tidak valid.' }) };
    }
  } catch (error) {
    console.error(`Error pada scope '${scope}':`, error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengambil data.' }) };
  }
};