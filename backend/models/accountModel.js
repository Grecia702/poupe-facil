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

const FindAccountByID = async (id, userId) => {
    const { rows, rowCount } = await pool.query(`SELECT id, nome_conta, data_criacao, saldo FROM contasBancarias WHERE id = $1 AND id_usuario = $2`, [id, userId]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const UpdateAccount = async (id, nome_conta) => {
    await pool.query("UPDATE contasBancarias SET nome_conta = $1  WHERE id = $2", [nome_conta, id])
}

const DeleteAccount = async (id) => {
    await pool.query("DELETE FROM contasBancarias WHERE id = $1", [id])
}

const ListAllAccounts = async (id) => {
    const { rows, rowCount } = await pool.query("SELECT * FROM contasBancarias WHERE id_usuario = $1", [id]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const ListTransactionsByAccount = async (accountId, userId) => {
    const query = `
    SELECT b.nome_conta, t.categoria, t.tipo, t.valor, t.data_transacao 
    FROM contasBancarias AS b 
    JOIN transacoes AS t ON t.id_contaBancaria = b.id 
    WHERE id_usuario = $1 AND b.id= $2`;

    const { rows, rowCount } = await pool.query(query, [userId, accountId]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

module.exports = { CreateAccount, FindAccountByID, UpdateAccount, DeleteAccount, ListAllAccounts, ListTransactionsByAccount };