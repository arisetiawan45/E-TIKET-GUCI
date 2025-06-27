const postgres_create = require('postgres');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  
  // Dapatkan informasi pengguna yang sedang login
  const { user } = context.clientContext;
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Anda harus login untuk membuat pesanan.' }) };
  }

  const sql = postgres_create(process.env.NEON_DATABASE_URL, { ssl: 'require' });

  try {
    const dataFromFrontend = JSON.parse(event.body);
    const { nama_pemesan, tanggal_kunjungan, jenis_tiket, jumlah_tiket, total_harga } = dataFromFrontend;

    if (!nama_pemesan || !tanggal_kunjungan || !jenis_tiket || !jumlah_tiket || total_harga === undefined) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Data yang dikirim tidak lengkap.' }) };
    }

    const result = await sql.begin(async sql => {
      // Langkah 1: Masukkan data pemesanan DAN ID pengguna
      const [pemesanan] = await sql`
        INSERT INTO pemesanan (nama_pemesan, tanggal_kunjungan, jenis_tiket, jumlah, total, user_id)
        VALUES (${nama_pemesan}, ${tanggal_kunjungan}, ${jenis_tiket}, ${jumlah_tiket}, ${total_harga}, ${user.sub})
        RETURNING id_pemesanan;
      `;
      
      // Langkah 2: Buat entri transaksi yang merujuk pada pemesanan
      const [transaksi] = await sql`
        INSERT INTO transaksi (id_pemesanan) VALUES (${pemesanan.id_pemesanan})
        RETURNING id_transaksi, status;
      `;
      
      return transaksi;
    });
      
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Transaksi berhasil dibuat", data: result }),
    };

  } catch (error) {
    console.error("Error saat membuat transaksi:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal menyimpan transaksi.' }) };
  }
};

