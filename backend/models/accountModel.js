require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const CreateAccount = async (id_usuario, nome_conta, timestamp, saldo, desc_conta) => {
    await pool.query("INSERT INTO contasBancarias (id_usuario , nome_conta, data_criacao, saldo, desc_conta) VALUES ($1, $2, $3, $4, $5)",
        [id_usuario, nome_conta, timestamp, saldo, desc_conta]
    );
}

const ReadAccount = async (valor, nome_campo) => {
    const { rows, rowCount } = await pool.query(`SELECT id, nome_conta, data_criacao, saldo FROM contasBancarias WHERE ${nome_campo} = $1`, [valor]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const UpdateAccount = async (id, nome_conta) => {
    await pool.query("UPDATE contasBancarias SET nome_conta = $1  WHERE id = $2", [nome_conta, id])
}

const DeleteAccount = async (id) => {
    await pool.query("DELETE FROM contasBancarias WHERE id = $1", [id])
}

const ListAccount = async (id, id_usuario) => {
    const { rows, rowCount } = await pool.query("SELECT * FROM contasBancarias WHERE id = $1 AND id_usuario = $2", [id, id_usuario]);
    return { rows, total: rowCount, firstResult: rows[0] };
}
module.exports = { CreateAccount, ReadAccount, UpdateAccount, DeleteAccount, ListAccount };