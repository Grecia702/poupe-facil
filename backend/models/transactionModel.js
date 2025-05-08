require('dotenv').config();
const pool = require('../db.js')

const checkValidAccount = async (accountId, userId) => {
    const query = `
    SELECT 1 
    FROM contasBancarias 
    WHERE id = $1 AND id_usuario = $2
  `;
    const { rowCount } = await pool.query(query, [accountId, userId]);
    return rowCount > 0;
}

const CreateTransaction = async (id_contabancaria, categoria, tipo, valor, data_transacao, natureza, recorrente, frequencia_recorrencia, proxima_ocorrencia) => {
    const query = `
    INSERT INTO transacoes (id_contabancaria, categoria, tipo, valor, data_transacao, natureza , recorrente, frequencia_recorrencia, proxima_ocorrencia) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    await pool.query(query, [id_contabancaria, categoria, tipo, valor, data_transacao, natureza, recorrente, frequencia_recorrencia, proxima_ocorrencia]);
}

const ReadTransaction = async (userId, transactionId) => {
    const { rows, rowCount } = await pool.query("SELECT * FROM user_transactions WHERE user_id = $1 AND transaction_id = $2 ", [userId, transactionId]);
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

const DeleteTransaction = async (userId, transactionId) => {
    const query = `
    DELETE FROM transacoes AS t
    USING contasBancarias AS c 
    WHERE t.id_contabancaria = c.id
    AND c.id_usuario = $1
    AND t.id = $2
    `;
    await pool.query(query, [userId, transactionId])
}

const ListTransactions = async (userId, queryParams) => {
    const { tipo, natureza, limit, offset, orderBy, orderDirection } = queryParams
    const query = `
    SELECT transaction_id, tipo, natureza, categoria, valor, 
    data_transacao, recorrente, frequencia_recorrencia, proxima_ocorrencia
    FROM user_transactions 
    WHERE user_id = $1
      AND ($2::text IS NULL OR tipo = $2::text)
      AND ($3::text IS NULL OR natureza = $3::text)
    ORDER BY ${orderBy} ${orderDirection}
    LIMIT $4
    OFFSET $5
  `;
    const { rows, rowCount } = await pool.query(query, [userId, tipo, natureza, limit, offset]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const countTransactionsResult = async (userId, queryParams) => {
    const { tipo, natureza } = queryParams
    const query = `
    SELECT COUNT(*) FROM user_transactions 
    WHERE user_id = $1
      AND ($2::text IS NULL OR tipo = $2::text)
      AND ($3::text IS NULL OR natureza = $3::text)
    `;
    const { rows } = await pool.query(query, [userId, tipo, natureza]);
    return parseInt(rows[0].count)
}

const GroupTransactionsByType = async (userId) => {
    const query = `
    SELECT 
    COALESCE(tipo, 'Total') AS tipo,
    COALESCE(natureza, 'Total') AS natureza,
    COUNT(*) AS ocorrencias,
    SUM(valor) AS valor
    FROM user_transactions
    WHERE user_id = $1
    AND tipo IN ('receita', 'despesa')
    GROUP BY GROUPING SETS (
    (tipo, natureza), 
    (tipo),            
    ()                 
    )`;
    const { rows, rowCount } = await pool.query(query, [userId]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const GroupTransactionsByCategories = async (userId) => {
    const query = `
    SELECT categoria, COUNT(*) AS ocorrencias, SUM(valor) AS total
    FROM user_transactions
    WHERE user_id = $1
    AND tipo = 'despesa'
    AND categoria IN ('Lazer', 'Carro', 'Educação', 'Alimentação', 'Internet', 'Contas', 'Compras', 'Outros')
    GROUP BY categoria
    ORDER BY total ASC`;
    const { rows, rowCount } = await pool.query(query, [userId]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const transactionSummary = async (date_start, date_end, interval, name_interval, userId) => {
    const query = `
    WITH meses AS (  
        SELECT generate_series($1::date, $2::date, $3::interval) AS date_interval 
    ),  
    tipos AS (  
        SELECT 'receita' AS tipo UNION SELECT 'despesa'  
    ),  
    naturezas AS (  
        SELECT 'fixa' AS natureza UNION SELECT 'variavel'  
    )  
    SELECT   
        TO_CHAR(m.date_interval, $4) AS time_group,  
        t.tipo,  
        n.natureza,  
        COUNT(ut.user_id) AS ocorrencias,  
        COALESCE(SUM(ut.valor), 0) AS valor  
    FROM meses m  
    CROSS JOIN tipos t  
    CROSS JOIN naturezas n  
    LEFT JOIN user_transactions ut   
        ON DATE_TRUNC('month', ut.data_transacao) = m.date_interval  
        AND ut.user_id = $5  
        AND ut.tipo = t.tipo  
        AND ut.natureza = n.natureza  
    GROUP BY m.date_interval, t.tipo, n.natureza, time_group
    ORDER BY m.date_interval, t.tipo, n.natureza`;
    const { rows, rowCount } = await pool.query(query, [date_start, date_end, interval, name_interval, userId]);
    return { rows, total: rowCount, firstResult: rows[0] };
}

const getFirstTransaction = async (userId) => {
    const query = `
    SELECT data_transacao 
    FROM user_transactions 
    WHERE user_id = $1 
    ORDER BY data_transacao ASC
    LIMIT 1
    `;
    const { rows, rowCount } = await pool.query(query, [userId]);
    return { rows, total: rowCount, result: rows[0] };
}


module.exports = {
    checkValidAccount,
    CreateTransaction,
    ReadTransaction,
    UpdateTransaction,
    DeleteTransaction,
    ListTransactions,
    countTransactionsResult,
    GroupTransactionsByType,
    GroupTransactionsByCategories,
    transactionSummary,
    getFirstTransaction,
};