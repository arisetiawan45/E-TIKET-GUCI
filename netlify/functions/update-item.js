const postgres_update = require('postgres');

exports.handler = async (event) => {
    if (event.httpMethod !== 'PUT') return { statusCode: 405, body: 'Method Not Allowed' };
    const sql = postgres_update(process.env.NEON_DATABASE_URL, { ssl: 'require' });
    try {
        const { type, id, nama, deskripsi, harga } = JSON.parse(event.body);
        
        let query;
        if (type === 'destinasi') {
            query = sql`UPDATE destinasi SET nama = ${nama}, deskripsi = ${deskripsi}, harga = ${harga} WHERE id_destinasi = ${id} returning id_destinasi as id, nama, deskripsi, harga`;
        } else if (type === 'paket') {
            query = sql`UPDATE paket_wisata SET nama_paket = ${nama}, deskripsi = ${deskripsi}, harga_paket = ${harga} WHERE id_paket = ${id} returning id_paket as id, nama_paket as nama, deskripsi, harga_paket as harga`;
        } else {
            throw new Error('Tipe tidak valid');
        }

        const [updatedItem] = await query;
        if (!updatedItem) throw new Error('Item tidak ditemukan');
        
        return { statusCode: 200, body: JSON.stringify(updatedItem) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
