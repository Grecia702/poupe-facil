import pool from '../db.ts'
import type { DadosBancarios, ContaCreate, ContaUpdate, UserBalance, UserBalanceDB } from '@/types/AccountBank.js'

const CreateAccount = async (userId: string, bankAccountDTO: ContaCreate): Promise<void> => {
    const { nome_conta, saldo, tipo_conta, icone, desc_conta, is_primary } = bankAccountDTO;
    const query = `
    INSERT INTO contasBancarias 
    (id_usuario , nome_conta, saldo, tipo_conta, icone, desc_conta, is_primary) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    await pool.query(query, [userId, nome_conta, saldo, tipo_conta, icone, desc_conta, is_primary]);
}

const FindAccountByID = async (accountId: string, userId: string): Promise<DadosBancarios | null> => {
    const query = `
    SELECT id, nome_conta, saldo, tipo_conta, icone, desc_conta 
    FROM contasBancarias 
    WHERE id = $1 AND id_usuario = $2
    `;
    const { rows, rowCount } = await pool.query(query, [accountId, userId]);
    if (rowCount === 0) return null
    return rows[0]
}

const UpdateAccount = async (accountId: string, userId: string, updateFields: ContaUpdate): Promise<void> => {
    const keys = Object.keys(updateFields);
    if (keys.length === 0) {
        throw new Error('Nenhum campo para atualizar');
    }
    const values = Object.values(updateFields);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const params = [...values, userId, accountId]

    const query = `
    UPDATE contasBancarias
    SET ${setClause}, updated_at = NOW()
    WHERE id_usuario = $${keys.length + 1}
    AND id = $${keys.length + 2}
    `;
    await pool.query(query, params)
}

const DeleteAccount = async (accountId: string, userId: string): Promise<void> => {
    await pool.query("DELETE FROM contasBancarias WHERE id = $1 AND id_usuario = $2", [accountId, userId])
}

const ListAllAccounts = async (userId: string, last_date: Date): Promise<DadosBancarios[] | null> => {
    const query = `
    SELECT 
    c.id,
    c.nome_conta,
    c.desc_conta,
    c.icone,
    c.tipo_conta,
    c.is_primary,
    c.saldo + COALESCE(SUM(t.valor), 0) AS saldo
    FROM contasBancarias AS c
    LEFT JOIN transacoes AS t 
    ON t.id_contabancaria = c.id 
    AND t.data_transacao BETWEEN c.created_at AND $2
    WHERE c.id_usuario = $1
    GROUP BY c.id, c.saldo, c.created_at
    `;
    const { rows, rowCount } = await pool.query(query, [userId, last_date]);
    if (rowCount === 0) return null
    const data = rows.map(row => ({
        ...row,
        saldo: parseFloat(row.saldo)
    }));
    return data
}

const setAsPrimary = async (accountId: string, userId: string): Promise<void> => {
    const query = `
    UPDATE contasBancarias
    SET is_primary = (id = $1)
    WHERE id_usuario = $2
    `;
    await pool.query(query, [accountId, userId]);
}


const getSumAccounts = async (userId: string, last_date: Date): Promise<UserBalanceDB | null> => {
    const query = `
SELECT 
    COALESCE(SUM(valor) FILTER (WHERE tipo = 'receita'), 0) AS receita,
    COALESCE(SUM(valor) FILTER (WHERE tipo = 'despesa'), 0) AS despesa,
    COALESCE((SELECT SUM(saldo) FROM contasBancarias WHERE id_usuario = $1), 0)
    + COALESCE(SUM(valor), 0) AS saldo_total,
    COALESCE(SUM(valor), 0) AS balanco_geral
FROM user_transactions
WHERE user_id = $1
  AND data_transacao BETWEEN 
    (SELECT created_at FROM usuario WHERE id = $1) 
    AND $2
    `;

    const { rows, rowCount } = await pool.query(query, [userId, last_date]);
    if (rowCount === 0) return null
    return rows[0]
}

const ListTransactionsByAccount = async (accountId: string, userId: string) => {
    const query = `
    SELECT b.nome_conta, t.categoria, t.tipo, t.valor, t.data_transacao 
    FROM contasBancarias AS b 
    JOIN transacoes AS t ON t.id_contaBancaria = b.id 
    WHERE id_usuario = $1 AND b.id= $2`;
    const { rows, rowCount } = await pool.query(query, [accountId, userId]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const AccountExists = async (account_name: string, userId: string): Promise<boolean> => {
    const { rows } = await pool.query(`SELECT EXISTS (SELECT 1 FROM contasBancarias WHERE nome_conta = $1 AND userId = $2);`, [account_name, userId]);
    return rows[0].exists;
}

const listAccountsPrimary = async (userId: string) => {
    const query = `
    SELECT 
    id, 
    nome_conta,
    is_primary
    FROM contasBancarias
    WHERE id_usuario = $1 
    `;
    const { rows, rowCount } = await pool.query(query, [userId]);
    return { rows, total: rowCount, result: rows };
}

export {
    CreateAccount,
    FindAccountByID,
    UpdateAccount,
    DeleteAccount,
    ListAllAccounts,
    setAsPrimary,
    ListTransactionsByAccount,
    getSumAccounts,
    AccountExists,
    listAccountsPrimary
};