const postgres_delete = require('postgres');

exports.handler = async (event) => {
  if (event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' };
  const sql = postgres_delete(process.env.NEON_DATABASE_URL, { ssl: 'require' });
  try {
    const { type, id } = event.queryStringParameters;
    let query;
    if (type === 'destinasi') {
      query = sql`DELETE FROM destinasi WHERE id_destinasi = ${id}`;
    } else if (type === 'paket') {
      query = sql`DELETE FROM paket_wisata WHERE id_paket = ${id}`;
    } else {
      throw new Error('Tipe item tidak valid');
    }
    const result = await query;
    if (result.count === 0) throw new Error('Item tidak ditemukan');
    return { statusCode: 200, body: JSON.stringify({ message: 'Item berhasil dihapus' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};