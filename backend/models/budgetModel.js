const pool = require('../db.js')

const createBudget = async (userId, queryParams) => {
    const { nome, quantia_limite, data_inicio, data_termino, validCategories } = queryParams
    const query = `
    INSERT INTO planejamento
    (id_usuario, nome, quantia_limite, data_inicio, data_termino, limites_categorias)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, [userId, nome, quantia_limite, data_inicio, data_termino, validCategories])
}

const getBudgets = async (userId) => {
    const query = `
    SELECT * FROM planejamento
    WHERE id_usuario = $1
    `;
    const { rows, rowCount } = await pool.query(query, [userId])
    return { exists: rowCount > 0, result: rows[0] }
}

const getBudgetById = async (budgetId, userId) => {
    const query = `
    SELECT 
        b.id,
        b.id_usuario,
        b.nome,
        b.quantia_limite AS limite, 
        COALESCE(tg.total_gasto, 0) AS quantia_gasta, 
        b.limites_categorias, 
        COALESCE(jsonb_object_agg(tc.categoria, tc.total_valor) FILTER (WHERE tc.categoria IS NOT NULL),'{}'::jsonb) AS quantia_gasta_categorias,
        b.data_inicio, 
        b.data_termino,
        b.ativo
        FROM planejamento AS b
    LEFT JOIN (
        SELECT budget_id, categoria, SUM(valor) AS total_valor
        FROM transacoes
        WHERE categoria IS NOT NULL
        GROUP BY budget_id, categoria
    ) tc ON tc.budget_id = b.id
    LEFT JOIN (
        SELECT budget_id, SUM(valor) AS total_gasto
        FROM transacoes
        GROUP BY budget_id
    ) tg ON tg.budget_id = b.id
    WHERE b.id = $1 AND b.id_usuario = $2   
    GROUP BY b.id, b.id_usuario, b.nome, b.quantia_limite, b.data_inicio, b.data_termino, b.limites_categorias, b.ativo, tg.total_gasto`;
    const { rows, rowCount } = await pool.query(query, [budgetId, userId])
    return { exists: rowCount > 0, result: rows[0] }
}


const updateBudget = async (userId, budgetId, queryParams) => {
    const keys = Object.keys(queryParams);
    const values = Object.values(queryParams);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const params = [...values, userId, budgetId]
    const query = `
    UPDATE planejamento
    SET ${setClause}
    WHERE id_usuario = $${keys.length + 1}
    AND id = $${keys.length + 2}
    `;
    await pool.query(query, params)
}

const deleteBudget = async (budgetId, userId) => {
    const query = `
    DELETE FROM planejamento
    WHERE id = $1
    AND id_usuario = $2
    `;
    await pool.query(query, [budgetId, userId])
}


const checkValidDate = async (date, userId) => {
    const query = `
        SELECT * FROM planejamento
        WHERE $1::timestamp
        BETWEEN data_inicio 
        AND data_termino
        AND id_usuario = $2
        AND ativo = true
    `;
    const { rows, rowCount } = await pool.query(query, [date, userId])
    return { result: rows[0], exists: rowCount > 0 }
}

const checkExisting = async (budgetId, userId) => {
    const query = `
    SELECT EXISTS(
        SELECT 1 FROM planejamento
        WHERE id = $1
        AND id_usuario = $2
        AND ativo = true
    )`;
    const { rows } = await pool.query(query, [budgetId, userId])
    return rows[0]
}

module.exports = { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget, checkValidDate, checkExisting };