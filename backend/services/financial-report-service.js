const financialReportModel = require('../models/financial-report-model')

const getReportsService = async (userId) => {
    const { result } = await financialReportModel.list_reports(userId)
    return result
}

const getReportByIDService = async (userId, reportId) => {
    const { result, exists } = await financialReportModel.get_report_by_id(userId, reportId)
    if (!exists) {
        throw new Error('Nenhum relatório com esse ID foi encontrado')
    }
    return result
}

module.exports = { getReportsService, getReportByIDService }