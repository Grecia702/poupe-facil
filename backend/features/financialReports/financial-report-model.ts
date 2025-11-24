import type { FinancialReport } from '../../shared/types/financialReport.d.ts';
import pool from '../../core/config/db.ts'
import { formatCurrency } from '../../shared/formatCurrency.ts';

interface CategoryValue {
    category: string,
    value: string
}

const list_reports = async (userId: number, period: Date): Promise<FinancialReport[] | null> => {
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

    const data = rows?.map(row => ({
        ...row,
        limite_total: formatCurrency(row.limite_total),
        quantia_gasta: formatCurrency(row.quantia_gasta),
        limite_categorias: row.limite_categorias?.map((row: CategoryValue) => ({
            ...row,
            value: formatCurrency(row.value)
        })),
        quantia_gasta_categorias: row.quantia_gasta_categorias?.map((row: CategoryValue) => ({
            ...row,
            value: formatCurrency(row.value)
        })),
    }))
    return data
}

const get_report_by_id = async (userId: number, reportId: number): Promise<FinancialReport | null> => {
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

    const data = {
        ...rows[0],
        limite_total: formatCurrency(rows[0].limite_total),
        quantia_gasta: formatCurrency(rows[0].quantia_gasta),
        limite_categorias: rows[0].limite_categorias?.map((row: CategoryValue) => ({
            ...row,
            value: formatCurrency(row.value)
        })),
        quantia_gasta_categorias: rows[0].quantia_gasta_categorias?.map((row: CategoryValue) => ({
            ...row,
            value: formatCurrency(row.value)
        })),
    }
    return data
}

export { list_reports, get_report_by_id }