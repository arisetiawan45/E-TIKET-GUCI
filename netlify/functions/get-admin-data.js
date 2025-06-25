// File: netlify/functions/get-admin-data.js
const postgres = require('postgres');

exports.handler = async () => {
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });
  try {
    // MENYESUAIKAN NAMA TABEL DAN KOLOM, MENGGUNAKAN ALIAS (as) AGAR FRONTEND TIDAK RUSAK
    const [destinasi, paket_wisata, transaksi] = await sql.begin(async sql => [
      await sql`SELECT id_destinasi as id, nama_destinasi as nama, deskripsi, harga FROM destinasi ORDER BY nama_destinasi ASC`,
      await sql`SELECT id_paket as id, nama_paket as nama, deskripsi, harga FROM paket_wisata ORDER BY nama_paket ASC`,
      await sql`SELECT id_transaksi as id, jumlah_tiket, total_harga FROM transaksi`,
    ]);
    // Nama properti 'paket' diubah menjadi 'paket_wisata' agar lebih jelas
    return {
      statusCode: 200,
      body: JSON.stringify({ destinasi, paket: paket_wisata, transaksi }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengambil data admin.' }) };
  }
};

// File: netlify/functions/add-item.js
const postgres = require('postgres');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });
  try {
    const { type, nama, deskripsi, harga } = JSON.parse(event.body);
    
    let query;
    if (type === 'destinasi') {
      query = sql`INSERT INTO destinasi (nama_destinasi, deskripsi, harga) VALUES (${nama}, ${deskripsi}, ${harga}) returning id_destinasi as id, nama_destinasi as nama, deskripsi, harga`;
    } else if (type === 'paket') {
      query = sql`INSERT INTO paket_wisata (nama_paket, deskripsi, harga) VALUES (${nama}, ${deskripsi}, ${harga}) returning id_paket as id, nama_paket as nama, deskripsi, harga`;
    } else {
      throw new Error('Tipe tidak valid');
    }

    const [newItem] = await query;
    return { statusCode: 200, body: JSON.stringify(newItem) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

// File: netlify/functions/delete-item.js
const postgres = require('postgres');

exports.handler = async (event) => {
  if (event.httpMethod !== 'DELETE') return { statusCode: 405 };
  const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });
  try {
    const { type, id } = event.queryStringParameters;
    
    let query;
    if (type === 'destinasi') {
      query = sql`DELETE FROM destinasi WHERE id_destinasi = ${id}`;
    } else if (type === 'paket') {
      query = sql`DELETE FROM paket_wisata WHERE id_paket = ${id}`;
    } else {
      throw new Error('Tipe tidak valid');
    }
    
    const result = await query;
    if (result.count === 0) throw new Error('Item tidak ditemukan');
    
    return { statusCode: 200, body: JSON.stringify({ message: 'Item berhasil dihapus' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

// File: netlify/functions/update-item.js
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