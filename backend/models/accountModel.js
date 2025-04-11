require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const CreateAccount = async (id, nome_banco, data_fatura, saldo) => {
    await pool.query("INSERT INTO transacoes (id_usuario , nome_banco, data_fatura, saldo) VALUES ($1, $2, $3, $4)", [id, nome_banco, data_fatura, saldo]);
}

const ReadAccount = async (id) => {
    const { rows, rowCount } = await pool.query("SELECT id, id_usuario , nome_banco, data_fatura, saldo FROM contasBancarias WHERE id = $1", [id]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const UpdateAccount = async (id, nome_banco) => {
    await pool.query("UPDATE contasBancarias SET nome_banco = $1  WHERE id = $2", [nome_banco, id])
}

const DeleteAccount = async (id) => {
    await pool.query("DELETE FROM contasBancarias WHERE id = $1", [id])
}

const ListAccount = async (id) => {
    const { rows, rowCount } = await pool.query("SELECT * FROM contasBancarias WHERE id_usuario = $1", [id]);
    return { rows, total: rowCount, firstResult: rows[0] };
}
module.exports = { CreateAccount, ReadAccount, UpdateAccount, DeleteAccount, ListAccount };