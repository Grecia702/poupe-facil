import type { FinancialReportDB } from '../types/financialreport.js';
import pool from '../db.ts'

const list_reports = async (userId: number, period: Date): Promise<FinancialReportDB[] | null> => {
    const query = `
    SELECT 
    id,
    periodo_inicio,
    periodo_fim,
    limite_total,
    limite_categorias,
    quantia_gasta,
    quantia_gasta_categorias,
    status,
    analise_textual,
    recomendacoes
    FROM relatorios
    WHERE id_usuario = $1
    AND $2 BETWEEN periodo_inicio AND periodo_fim
    `;
    const { rows, rowCount } = await pool.query(query, [userId, period]);
    if (rowCount === 0) return null
    return rows
}

const get_report_by_id = async (userId: number, reportId: number): Promise<FinancialReportDB | null> => {
    const query = `
    SELECT 
    id,
    periodo_inicio,
    periodo_fim,
    limite_total,
    limite_categorias,
    quantia_gasta,
    quantia_gasta_categorias,
    status,
    analise_textual,
    recomendacoes
    FROM relatorios
    WHERE id_usuario = $1
    AND id = $2
    `;
    const { rows, rowCount } = await pool.query(query, [userId, reportId]);
    if (rowCount === 0) return null
    return rows[0]
}

export { list_reports, get_report_by_id }