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

const getBudgetById = async (userId, budgetId) => {
    const query = `
    SELECT * FROM planejamento
    WHERE id_usuario = $1
    AND id = $2
    `;
    const { rows, rowCount } = await pool.query(query, [userId, budgetId])
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
    SELECT EXISTS(
        SELECT 1 FROM planejamento
        WHERE $1::date
        BETWEEN data_inicio 
        AND data_termino
        AND id_usuario = $2
    )`;
    const { rows } = await pool.query(query, [date, userId])
    return rows[0]
}

const checkExisting = async (budgetId, userId) => {
    const query = `
    SELECT EXISTS(
        SELECT 1 FROM planejamento
        WHERE id = $1
        AND id_usuario = $2
    )`;
    const { rows } = await pool.query(query, [budgetId, userId])
    return rows[0]
}

module.exports = { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget, checkValidDate, checkExisting };