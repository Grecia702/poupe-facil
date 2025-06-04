const pool = require('../db.js')

const list_reports = async (userId, period) => {
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
    return { result: rows[0], exists: rowCount > 0 }
}

const get_report_by_id = async (userId, reportId) => {
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
    return { result: rows[0], exists: rowCount > 0 }
}

module.exports = { list_reports, get_report_by_id }