const postgres = require('postgres');

exports.handler = async (event) => {
    if (event.httpMethod !== 'PUT') return { statusCode: 405, body: 'Method Not Allowed' };
    const sql = postgres(process.env.NEON_DATABASE_URL, { ssl: 'require' });
    try {
        const { id, status } = JSON.parse(event.body);
        if (!id || !status || !['Pending', 'Dibayar'].includes(status)) {
          throw new Error('ID dan status (Pending/Dibayar) diperlukan dan valid');
        }
        const [updatedTransaction] = await sql`UPDATE transaksi SET status = ${status} WHERE id_transaksi = ${id} returning *`;
        if (!updatedTransaction) throw new Error('Transaksi tidak ditemukan');
        return { statusCode: 200, body: JSON.stringify(updatedTransaction) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
