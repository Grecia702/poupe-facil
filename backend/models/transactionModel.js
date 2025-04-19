require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const CreateTransaction = async (id_contabancaria, categoria, tipo, valor, data_transacao) => {
    await pool.query("INSERT INTO transacoes (id_contabancaria, categoria, tipo, valor, data_transacao) VALUES ($1, $2, $3, $4, $5)", [id_contabancaria, categoria, tipo, valor, data_transacao]);
}

const ReadTransaction = async (id) => {
    const { rows, rowCount } = await pool.query("SELECT id, id_contabancaria, categoria, tipo, valor, data_transacao FROM transacoes WHERE id = $1", [id]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const UpdateTransaction = async (id, campos) => {
    const setClause = Object.keys(campos)
        .map((campo, i) => `${campo} = $${i + 1}`)
        .join(', ');

    const valores = Object.values(campos);

    const query = `
        UPDATE transacoes t
        SET ${setClause} 
        FROM usuario u
        JOIN contasBancarias b ON b.id = u.id 
        WHERE u.id = $1
        AND t.id = $2
        RETURNING u.*;
    `;
    const parametros = [...valores, id, campos.id_transacao];
    return await pool.query(query, parametros);
};

const DeleteTransaction = async (id) => {
    await pool.query("DELETE FROM transacoes WHERE id = $1", [id])
}

const ListTransactions = async (id) => {
    const { rows, rowCount } = await pool.query("SELECT transaction_id, conta, categoria, tipo, valor, data_compra FROM user_transactions WHERE user_id = $1", [id]);
    return { rows, total: rowCount, firstResult: rows[0] };

}
module.exports = { CreateTransaction, ReadTransaction, UpdateTransaction, DeleteTransaction, ListTransactions };