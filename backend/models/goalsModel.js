const pool = require('../db.js')

const createGoal = async (userId, desc_meta, valor_meta, meta_ativa, data_inicio) => {
    const query = `
    INSERT INTO metas 
    (id_usuario, desc_meta, valor_meta, meta_ativa, data_inicio)
    VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(query, [userId, desc_meta, valor_meta, meta_ativa, data_inicio])
}

const getGoals = async (userId) => {
    const query = `
    SELECT g.id, g.id_usuario, g.desc_meta, g.valor_meta,
    (
        COALESCE(SUM(t.valor) FILTER (WHERE t.tipo = 'receita'), 0) -  
        COALESCE(SUM(t.valor) FILTER (WHERE t.tipo = 'despesa'), 0)
    ) AS saldo_meta,
    g.data_inicio,
    g.data_concluida
    FROM metas as g	
    LEFT JOIN transacoes AS t ON t.goals_id = g.id
    WHERE g.id_usuario = $1 
    GROUP BY g.id_usuario, g.id, g.desc_meta, g.valor_meta, g.data_inicio
    `;
    const { rows, rowCount } = await pool.query(query, [userId])
    return { exists: rowCount > 0, result: rows }
}

const getGoalById = async (userId, goalId) => {
    const query = `
    SELECT g.id, g.id_usuario, g.desc_meta, g.valor_meta,
    (
        COALESCE(SUM(t.valor) FILTER (WHERE t.tipo = 'receita'), 0) -  
        COALESCE(SUM(t.valor) FILTER (WHERE t.tipo = 'despesa'), 0)
    ) AS saldo_meta,
    g.data_inicio
    FROM metas as g	
    LEFT JOIN transacoes AS t ON t.goals_id = g.id
    WHERE g.id_usuario = $1 AND g.id = $2 
    GROUP BY g.id_usuario, g.id, g.desc_meta, g.valor_meta, g.data_inicio
    `;
    const { rows, rowCount } = await pool.query(query, [userId, goalId])
    return { exists: rowCount > 0, result: rows[0] }
}

const updateGoal = async (userId, goalId, queryParams) => {
    const forbiddenFields = ['id', 'id_usuario', 'data_inicio'];
    const keys = Object.keys(queryParams).filter(key => !forbiddenFields.includes(key));
    const values = keys.map(key => queryParams[key]);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const params = [...values, userId, goalId]
    const query = `
    UPDATE metas
    SET ${setClause}
    WHERE id_usuario = $${keys.length + 1}
    AND id = $${keys.length + 2}
    `;
    await pool.query(query, params)
}

const deleteGoal = async (userId, goalId) => {
    const query = `
    DELETE FROM metas
    WHERE id_usuario = $1
    AND id = $2
    `;
    await pool.query(query, [userId, goalId])
}

const checkActiveGoal = async (userId) => {
    const query = `
    SELECT * FROM metas
    WHERE id_usuario = $1
    AND meta_ativa = true
    `;
    const { rows, rowCount } = await pool.query(query, [userId])
    return { exists: rowCount > 0, result: rows[0] }
}

const checkExisting = async (userId, goalId) => {
    const query = `
    SELECT EXISTS(
        SELECT 1 FROM metas
        WHERE id_usuario = $1
        AND id = $2
    )`;
    const { rows } = await pool.query(query, [userId, goalId])
    return rows[0]
}


module.exports = { createGoal, getGoals, getGoalById, updateGoal, deleteGoal, checkActiveGoal, checkExisting }