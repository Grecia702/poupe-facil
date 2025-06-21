const pool = require('../db.js')

const createBudget = async (userId, queryParams) => {
  const { desc_budget, quantia_limite, data_inicio, data_termino, validCategories } = queryParams
  const query = `
    INSERT INTO planejamento
    (id_usuario, desc_budget, quantia_limite, data_inicio, data_termino, limites_categorias)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    `;
  await pool.query(query, [userId, desc_budget, quantia_limite, data_inicio, data_termino, validCategories])
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
  b.desc_budget,
  b.quantia_limite AS limite,
COALESCE(SUM(ABS(t.valor)), 0) AS quantia_gasta,
  b.limites_categorias,
  cat_agg.quantia_gasta_categorias,
  b.data_inicio,
  b.data_termino,
  b.ativo
FROM planejamento b
LEFT JOIN transacoes t ON t.budget_id = b.id
LEFT JOIN LATERAL (
  SELECT jsonb_object_agg(key, COALESCE(soma.valor, 0)) AS quantia_gasta_categorias
  FROM jsonb_object_keys(b.limites_categorias) AS key
  LEFT JOIN LATERAL (
    SELECT SUM(ABS(t2.valor)) AS valor
    FROM transacoes t2
    WHERE t2.budget_id = b.id AND t2.categoria = key
  ) soma ON true
) cat_agg ON true
WHERE  b.id = $1 AND b.id_usuario = $2
GROUP BY 
  b.id, b.id_usuario, b.desc_budget, b.quantia_limite,
  b.limites_categorias, b.data_inicio, b.data_termino, b.ativo,
  cat_agg.quantia_gasta_categorias`;
  const { rows, rowCount } = await pool.query(query, [budgetId, userId])
  return { exists: rowCount > 0, result: rows[0] }
}

const getActiveBudget = async (userId) => {
  const query = `
    SELECT id FROM planejamento
    WHERE id_usuario = $1
    AND ativo = true
    `;
  const { rows, rowCount } = await pool.query(query, [userId])
  return { exists: rowCount > 0, result: rows[0] }
}

const updateBudget = async (userId, budgetId, queryParams) => {
  const keys = Object.keys(queryParams);
  if (keys.length === 0) {
    throw new Error('Nenhum campo para atualizar');
  }
  const values = Object.values(queryParams);
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const params = [...values, userId, budgetId]
  const query = `
    UPDATE planejamento
    SET ${setClause}, atualizado_em = NOW()
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
        SELECT 
        id,
        quantia_limite,
        limites_categorias
        FROM planejamento
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

const getAllActiveBudgets = async () => {
  const query = `
    SELECT 
  b.id,
  b.id_usuario,
  b.desc_budget,
  b.quantia_limite AS limite,
  COALESCE(SUM(t.valor), 0) AS quantia_gasta,
  b.limites_categorias,
  cat_agg.quantia_gasta_categorias,
  b.data_inicio,
  b.data_termino,
  b.ativo
FROM planejamento b
LEFT JOIN transacoes t ON t.budget_id = b.id
LEFT JOIN LATERAL (
  SELECT jsonb_object_agg(key, COALESCE(soma.valor, 0)) AS quantia_gasta_categorias
  FROM jsonb_object_keys(b.limites_categorias) AS key
  LEFT JOIN LATERAL (
    SELECT SUM(t2.valor) AS valor
    FROM transacoes t2
    WHERE t2.budget_id = b.id AND t2.categoria = key
  ) soma ON true
) cat_agg ON true
WHERE ativo = true
GROUP BY 
  b.id, b.id_usuario, b.desc_budget, b.quantia_limite,
  b.limites_categorias, b.data_inicio, b.data_termino, b.ativo,
  cat_agg.quantia_gasta_categorias`;
  const { rows, rowCount } = await pool.query(query)
  return { exists: rowCount > 0, result: rows }
}

module.exports = { createBudget, getBudgets, getBudgetById, getActiveBudget, updateBudget, deleteBudget, checkValidDate, checkExisting, getAllActiveBudgets };