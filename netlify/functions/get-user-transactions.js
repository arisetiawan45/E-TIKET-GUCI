// File: netlify/functions/get-user-transactions.js
const postgres = require('postgres');

exports.handler = async (event, context) => {
  // Pastikan pengguna sudah login
  const { user } = context.clientContext;
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Akses ditolak. Silakan login.' }) };
  }
  
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });

  try {
    const userId = user.sub; // ID unik pengguna dari Netlify Identity

    // Query untuk mengambil transaksi milik pengguna yang sedang login
    const userTransactions = await sql`
      SELECT
        t.id_transaksi,
        p.nama_pemesan,
        p.tanggal_kunjungan,
        p.jumlah,
        p.total,
        t.status,
        p.tanggal_transaksi
      FROM transaksi t
      INNER JOIN pemesanan p ON t.id_pemesanan = p.id_pemesanan
      WHERE p.id_user = ${userId} -- Menggunakan kolom id_user yang benar
      ORDER BY p.tanggal_transaksi DESC
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(userTransactions),
    };

  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal memuat riwayat transaksi.' }) };
  }
};