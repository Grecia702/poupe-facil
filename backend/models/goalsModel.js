const pool = require('../db.js')

const createGoal = async (userId, desc_meta, valor_meta, status_meta, data_inicio, deadline) => {
    const query = `
    INSERT INTO metas 
    (id_usuario, desc_meta, valor_meta, status_meta, data_inicio, deadline)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [userId, desc_meta, valor_meta, status_meta, data_inicio, deadline])
}

const getGoals = async (userId, status_meta) => {
    const query = `
    SELECT g.id, g.desc_meta, g.valor_meta,
    (
        COALESCE(SUM(t.valor) FILTER (WHERE t.tipo = 'receita'), 0)
    ) AS saldo_meta,
    g.data_inicio,
    g.deadline,
    g.data_concluida
    FROM metas as g	
    LEFT JOIN transacoes AS t ON t.goals_id = g.id
    WHERE g.id_usuario = $1 
    AND status_meta = $2
    GROUP BY g.id, g.desc_meta, g.valor_meta, g.data_inicio, g.deadline
    ORDER BY g.id DESC
    `;
    const { rows, rowCount } = await pool.query(query, [userId, status_meta])
    return { exists: rowCount > 0, result: rows }
}

const getGoalById = async (userId, goalId) => {
    const query = `
    SELECT g.id, g.id_usuario, g.desc_meta, g.valor_meta,
    (
        COALESCE(SUM(t.valor) FILTER (WHERE t.tipo = 'receita'), 0) 
    ) AS saldo_meta,
    g.data_inicio,
    g.deadline
    FROM metas as g	
    LEFT JOIN transacoes AS t ON t.goals_id = g.id
    WHERE g.id_usuario = $1 AND g.id = $2 
    GROUP BY g.id_usuario, g.id, g.desc_meta, g.valor_meta, g.data_inicio, g.deadline
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

const checkActiveGoal = async (userId) => {
    const query = `
    SELECT
    id
    FROM metas
    WHERE id_usuario = $1
    AND status_meta = 'ativa'
    `;
    const { rows, rowCount } = await pool.query(query, [userId])
    return { result: rows[0], exists: rowCount > 0 }
}

const totalConcluded = async (userId, status_meta) => {
    const query = `
SELECT
  COUNT(*) AS total_ocorrencias,
  COALESCE(SUM(g.valor_meta), 0) AS total_metas,
  COALESCE(SUM(t.total_receita), 0) AS total_economizado
FROM metas g
LEFT JOIN (
  SELECT goals_id, SUM(valor) AS total_receita
  FROM transacoes
  WHERE tipo = 'receita'
  GROUP BY goals_id
) t ON t.goals_id = g.id
 WHERE g.id_usuario = $1
 AND status_meta = $2 

    `;
    const { rows } = await pool.query(query, [userId, status_meta])
    return { result: rows[0] }
}

module.exports = { createGoal, getGoals, getGoalById, updateGoal, deleteGoal, checkExisting, totalConcluded, checkActiveGoal }