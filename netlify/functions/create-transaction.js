const postgres_create_trans = require('postgres'); // Nama variabel unik

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  
  const sql = postgres_create_trans(process.env.NEON_DATABASE_URL, { ssl: 'require' });

  try {
    const dataFromFrontend = JSON.parse(event.body);
    console.log('Menerima data dari frontend:', dataFromFrontend);

    const {
      nama_pemesan,
      tanggal_kunjungan,
      jenis_tiket,
      jumlah_tiket,
      total_harga
    } = dataFromFrontend;

    if (!nama_pemesan || !tanggal_kunjungan || !jenis_tiket || !jumlah_tiket || total_harga === undefined) {
      console.error('Validasi gagal: Data tidak lengkap.', dataFromFrontend);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Data yang dikirim tidak lengkap.' }),
      };
    }

    // Menggunakan transaksi database untuk keamanan data
    const result = await sql.begin(async sql => {
      const [pemesanan] = await sql`
        INSERT INTO pemesanan (nama_pemesan, tanggal_kunjungan, jenis_tiket, jumlah, total, destinasi_id, paket_id)
        VALUES (${nama_pemesan}, ${tanggal_kunjungan}, ${jenis_tiket}, ${jumlah_tiket}, ${total_harga}, NULL, NULL)
        RETURNING id_pemesanan;
      `;
      
      const [transaksi] = await sql`
        INSERT INTO transaksi (id_pemesanan)
        VALUES (${pemesanan.id_pemesanan})
        RETURNING id_transaksi, status;
      `;
      
      return transaksi;
    });
      
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Transaksi dan pemesanan berhasil dibuat",
        data: result
      }),
    };

  } catch (error) {
    // Logging yang lebih detail untuk debugging
    console.error("!!! ERROR SAAT MEMBUAT TRANSAKSI !!!", {
      errorMessage: error.message,
      errorStack: error.stack,
      requestBody: event.body,
    });
    return { 
        statusCode: 500, 
        body: JSON.stringify({ 
            error: 'Gagal menyimpan transaksi ke database.',
            details: error.message // Memberikan detail error ke client
        }) 
    };
  }
};
