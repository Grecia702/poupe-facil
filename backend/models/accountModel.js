require('dotenv').config();
const pool = require('../db.js')


const CreateAccount = async (id_usuario, nome_conta, timestamp, saldo, tipo_conta, icone, desc_conta) => {
    const query = `
    INSERT INTO contasBancarias 
    (id_usuario , nome_conta, created_at, saldo, tipo_conta, icone, desc_conta) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    await pool.query(query, [id_usuario, nome_conta, timestamp, saldo, tipo_conta, icone, desc_conta]);
}

const FindAccountByID = async (accountId, userId) => {
    const query = `
    SELECT id, nome_conta, saldo, tipo_conta, icone, desc_conta 
    FROM contasBancarias 
    WHERE id = $1 AND id_usuario = $2
    `;
    const { rows, rowCount } = await pool.query(query, [accountId, userId]);
    return { rows, total: rowCount, exists: rowCount > 0, firstResult: rows[0] };
}

const UpdateAccount = async (userId, account_id, queryParams) => {
    const keys = Object.keys(queryParams);
    if (keys.length === 0) {
        throw new Error('Nenhum campo para atualizar');
    }
    const values = Object.values(queryParams);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const params = [...values, userId, account_id]
    const query = `
    UPDATE contasBancarias
    SET ${setClause}, updated_at = NOW()
    WHERE id_usuario = $${keys.length + 1}
    AND id = $${keys.length + 2}
    `;
    await pool.query(query, params)
}
const DeleteAccount = async (id, userId) => {
    await pool.query("DELETE FROM contasBancarias WHERE id = $1 AND id_usuario = $2", [id, userId])
}

const ListAllAccounts = async (userId) => {
    const query = `
    SELECT 
    id,
	nome_conta,
	saldo,
	desc_conta,
	icone,
	tipo_conta
    FROM contasBancarias 
    WHERE id_usuario = $1 
    ORDER BY id
    `;
    const { rows, rowCount } = await pool.query(query, [userId]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const getSumAccounts = async (userId, first_date, last_date) => {
    const query = `
SELECT 
    COALESCE(SUM(valor) FILTER (WHERE tipo = 'receita'), 0) AS receita,
    COALESCE(SUM(valor) FILTER (WHERE tipo = 'despesa'), 0) AS despesa,
	    COALESCE((SELECT SUM(saldo) FROM contasBancarias WHERE id_usuario = $1), 0)
    + COALESCE(SUM(valor), 0) AS saldo_total,
	COALESCE(SUM(valor), 0) AS balanco_geral
FROM user_transactions
WHERE user_id = $1
  AND data_transacao BETWEEN $2 AND $3
    `;

    const { rows, rowCount } = await pool.query(query, [userId, first_date, last_date]);
    return { rows, total: rowCount, result: rows[0] };
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

const AccountExists = async (account_name, userId) => {
    const { rows } = await pool.query(`SELECT EXISTS (SELECT 1 FROM contasBancarias WHERE nome_conta = $1 AND id_usuario = $2);`, [account_name, userId]);
    return rows[0].exists;
}

module.exports = {
    CreateAccount,
    FindAccountByID,
    UpdateAccount,
    DeleteAccount,
    ListAllAccounts,
    ListTransactionsByAccount,
    getSumAccounts,
    AccountExists
};