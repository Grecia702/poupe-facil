import pool from '../../core/config/db.ts'
import type { CreateGoalInput, UpdateGoalInput } from './goals.d.ts';
import type { GoalsOverview, Goal } from '../../shared/types/goals.js';
import { formatCurrency } from '../../shared/formatCurrency.ts';

const createGoal = async (userId: number, goalsData: CreateGoalInput): Promise<void> => {
    const data_inicio = new Date()
    const { desc_meta, valor_meta, status_meta, data_termino } = goalsData
    const query = `
    INSERT INTO metas 
    (id_usuario, desc_meta, valor_meta, status_meta, data_inicio, deadline)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [userId, desc_meta, valor_meta, status_meta, data_inicio, data_termino])
}

const getGoals = async (userId: number, status_meta: string): Promise<GoalsOverview> => {
    const params = []
    params.push(userId)
    let whereClause = "WHERE id_usuario = $1 "
    if (status_meta) {
        whereClause += `AND status_meta = $2`
        params.push(status_meta)
    }
    let queryBase = `
    WITH metas_data AS (
        SELECT 
            id, 
            desc_meta,
            saldo_meta,
            valor_meta,
            status_meta,
            data_inicio,
            data_concluida,
            deadline
        FROM metas
        ${whereClause}
    ),
    totals AS (
        SELECT
            COUNT(*)::int as total_ocorrencias,
            COALESCE(SUM(valor_meta), 0) as total_metas,
            COALESCE(SUM(saldo_meta), 0) as total_economizado
        FROM metas
        ${whereClause}
    )
    SELECT 
        COALESCE(json_agg(metas_data.* ORDER BY metas_data.id DESC) FILTER (WHERE metas_data.id IS NOT NULL), '[]'::json) as metas,
        (SELECT row_to_json(totals.*) FROM totals) as totals
    FROM metas_data
    `;
    const { rows } = await pool.query(queryBase, params)
    return {
        metas: rows[0].metas,
        totals: rows[0].totals
    };
}

const getGoalById = async (userId: number, goalId: number): Promise<Goal | null> => {
    const query = `
    SELECT 
    g.id, 
    g.id_usuario, 
    g.desc_meta, 
    g.saldo_meta g.saldo_meta,
    g.valor_meta as valor_meta,
    g.data_inicio,
    g.deadline
    FROM metas as g	
    WHERE g.id_usuario = $1 AND g.id = $2 
    GROUP BY g.id_usuario, g.id, g.desc_meta, g.valor_meta, g.data_inicio, g.deadline
    `;
    const { rows, rowCount } = await pool.query(query, [userId, goalId])
    if (rowCount === 0) return null
    const data = {
        ...rows[0],
        saldo_meta: formatCurrency(rows[0].saldo_meta),
        valor_meta: formatCurrency(rows[0].valor_meta)
    }
    return data
}

const updateGoal = async (userId: number, goalId: number, updateFields: UpdateGoalInput): Promise<void> => {
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

export { createGoal, getGoals, getGoalById, updateGoal, deleteGoal, updateSaldo, checkExisting, checkActiveGoal }