const financialReportModel = require('../models/financial-report-model')

const getReportsService = async (userId, period) => {
    const { result, exists } = await financialReportModel.list_reports(userId, period)
    const data = exists ? {
        ...result,
        limite_total: parseFloat(result?.limite_total),
        quantia_gasta: parseFloat(result?.quantia_gasta)
    } : undefined
    return data
}

const getReportByIDService = async (userId, reportId) => {
    const { result, exists } = await financialReportModel.get_report_by_id(userId, reportId)
    if (!exists) {
        throw new Error('Nenhum relatório com esse ID foi encontrado')
    }
    return result
}

module.exports = { getReportsService, getReportByIDService }