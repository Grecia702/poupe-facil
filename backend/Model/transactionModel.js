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

const UpdateTransaction = async (id, email) => {
    await pool.query("UPDATE transacoes SET email = $1  WHERE id = $2", [email, id])
}

const DeleteTransaction = async (id) => {
    await pool.query("DELETE FROM transacoes WHERE id = $1", [id])
}

const ListTransactions = async (id) => {
    const { rows, rowCount } = await pool.query("SELECT transaction_id, conta, categoria, tipo, valor, data_compra FROM user_transactions WHERE user_id = $1", [id]);
    return { rows, total: rowCount, firstResult: rows[0] };

}
module.exports = { CreateTransaction, ReadTransaction, UpdateTransaction, DeleteTransaction, ListTransactions };