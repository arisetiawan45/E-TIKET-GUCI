const postgres_add = require('postgres');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const sql = postgres_add(process.env.NEON_DATABASE_URL, { ssl: 'require' });
  try {
    const { type, nama, deskripsi, harga } = JSON.parse(event.body);
    let query;
    if (type === 'destinasi') {
      query = sql`INSERT INTO destinasi (nama, deskripsi, harga) VALUES (${nama}, ${deskripsi}, ${harga}) returning id_destinasi as id, nama, deskripsi, harga`;
    } else if (type === 'paket') {
      query = sql`INSERT INTO paket_wisata (nama_paket, deskripsi, harga_paket) VALUES (${nama}, ${deskripsi}, ${harga}) returning id_paket as id, nama_paket as nama, deskripsi, harga_paket as harga`;
    } else {
      throw new Error('Tipe item tidak valid');
    }
    const [newItem] = await query;
    return { statusCode: 201, body: JSON.stringify(newItem) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

