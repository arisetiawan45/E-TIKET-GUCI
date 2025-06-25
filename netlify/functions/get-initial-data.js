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
      await sql`SELECT * FROM paket`,
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


// File: netlify/functions/create-transaction.js
const postgres = require('postgres');

exports.handler = async (event, context) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sql = postgres(process.env.NEON_DATABASE_URL, {
    ssl: 'require',
  });

  try {
    const dataPemesanan = JSON.parse(event.body);
    const user = context.clientContext && context.clientContext.user;

    // Siapkan data untuk dimasukkan ke tabel 'transaksi'
    const { 
      tanggal_kunjungan, 
      jenis_tiket, 
      nama_item, 
      jumlah_tiket, 
      harga_satuan, 
      total_harga 
    } = dataPemesanan;

    // Jalankan perintah INSERT SQL
    // 'returning *' akan mengembalikan baris yang baru saja dimasukkan
    const [newTransaction] = await sql`
      INSERT INTO transaksi (
        tanggal_kunjungan, 
        jenis_tiket, 
        nama_item, 
        jumlah_tiket, 
        harga_satuan, 
        total_harga,
        user_id,
        user_email,
        tanggal_transaksi
      ) VALUES (
        ${tanggal_kunjungan}, 
        ${jenis_tiket}, 
        ${nama_item}, 
        ${jumlah_tiket}, 
        ${harga_satuan}, 
        ${total_harga},
        ${user ? user.sub : null},
        ${user ? user.email : null},
        ${new Date().toISOString()}
      ) returning *
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Transaksi berhasil dibuat", data: newTransaction }),
    };

  } catch (error) {
    console.error("Error creating transaction:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal menyimpan transaksi.' }) };
  }
};
