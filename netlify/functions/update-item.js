/ File: netlify/functions/update-item.js
const postgres = require('postgres');

exports.handler = async (event) => {
    if (event.httpMethod !== 'PUT') return { statusCode: 405 };
    const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });
    try {
        const { type, id, nama, deskripsi, harga } = JSON.parse(event.body);
        
        let query;
        if (type === 'destinasi') {
            query = sql`UPDATE destinasi SET nama_destinasi = ${nama}, deskripsi = ${deskripsi}, harga = ${harga} WHERE id_destinasi = ${id} returning id_destinasi as id, nama_destinasi as nama, deskripsi, harga`;
        } else if (type === 'paket') {
            query = sql`UPDATE paket_wisata SET nama_paket = ${nama}, deskripsi = ${deskripsi}, harga = ${harga} WHERE id_paket = ${id} returning id_paket as id, nama_paket as nama, deskripsi, harga`;
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