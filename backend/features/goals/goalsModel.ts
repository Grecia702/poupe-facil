import pool from '@/core/config/db.ts'
import type { CreateGoalsData, UpdateGoalsData, QueryGoalsData, GoalsTotal } from './goals.ts';

const createGoal = async (userId: number, goalsData: CreateGoalsData): Promise<void> => {
    const data_inicio = new Date()
    const { desc_meta, valor_meta, status_meta, data_termino } = goalsData
    const query = `
    INSERT INTO metas 
    (id_usuario, desc_meta, valor_meta, status_meta, data_inicio, deadline)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [userId, desc_meta, valor_meta, status_meta, data_inicio, data_termino])
}

const getGoals = async (userId: number, status_meta: string): Promise<QueryGoalsData[] | null> => {
    const query = `
    SELECT 
    g.id, 
    g.desc_meta,
    g.saldo_meta,
    g.valor_meta,
    g.status_meta,
    g.data_inicio,
    g.data_concluida,
    g.deadline
    FROM metas as g	
    WHERE g.id_usuario = $1 
    AND status_meta = $2
    GROUP BY g.id, g.desc_meta, g.valor_meta, g.data_inicio, g.deadline
    ORDER BY g.id DESC
    `;
    const { rows, rowCount } = await pool.query(query, [userId, status_meta])
    if (rowCount === 0) return null
    return rows
}

const getGoalById = async (userId: number, goalId: number): Promise<QueryGoalsData | null> => {
    const query = `
    SELECT 
    g.id, 
    g.id_usuario, 
    g.desc_meta, 
    g.valor_meta,
    g.saldo_meta,
    g.data_inicio,
    g.deadline
    FROM metas as g	
    WHERE g.id_usuario = $1 AND g.id = $2 
    GROUP BY g.id_usuario, g.id, g.desc_meta, g.valor_meta, g.data_inicio, g.deadline
    `;
    const { rows, rowCount } = await pool.query(query, [userId, goalId])
    if (rowCount === 0) return null
    return rows[0]
}

const updateGoal = async (userId: number, goalId: number, updateFields: UpdateGoalsData): Promise<void> => {
    const forbiddenFields = ['id', 'id_usuario', 'data_inicio'];
    const keys = Object.keys(updateFields).filter(key => !forbiddenFields.includes(key));
    const values = keys.map(key => updateFields[key]);
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

const updateSaldo = async (saldo: number, userId: number, goalId: number): Promise<void> => {
    const query = `
    UPDATE metas
    SET saldo_meta = saldo_meta + $1
    WHERE id_usuario = $2
    AND id = $3
    `;
    await pool.query(query, [saldo, userId, goalId])
}


const deleteGoal = async (userId: number, goalId: number): Promise<void> => {
    const query = ` 
    DELETE FROM metas
    WHERE id_usuario = $1
    AND id = $2
    `;
    await pool.query(query, [userId, goalId])
}

const checkExisting = async (userId: number, goalId: number): Promise<boolean> => {
    const query = `
    SELECT EXISTS(
        SELECT 1 FROM metas
        WHERE id_usuario = $1
        AND id = $2
    )`;
    const { rows } = await pool.query(query, [userId, goalId])
    return rows[0].exists
}

const checkActiveGoal = async (userId: number): Promise<{ id: number } | null> => {
    const query = `
    SELECT
    id
    FROM metas
    WHERE id_usuario = $1
    AND status_meta = 'ativa'
    `;
    const { rows, rowCount } = await pool.query(query, [userId])
    if (rowCount === 0) return null
    return rows[0]
}

const totalConcluded = async (userId: number, status_meta: string): Promise<GoalsTotal> => {
    const query = `
    SELECT
    COUNT(*) AS total_ocorrencias,
    COALESCE(SUM(valor_meta), 0) AS total_metas,
    COALESCE(SUM(saldo_meta), 0) AS total_economizado
    FROM metas g
    WHERE g.id_usuario = $1
    AND status_meta = $2 
    `;
    const { rows } = await pool.query(query, [userId, status_meta])
    return rows[0]
}

export { createGoal, getGoals, getGoalById, updateGoal, deleteGoal, updateSaldo, checkExisting, totalConcluded, checkActiveGoal }