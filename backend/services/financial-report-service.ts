import type { FinancialReport } from '@/types/financialreport.js'
import * as financialReportModel from '../models/financial-report-model.ts'

const getReports = async (userId: number, period: Date): Promise<FinancialReport[]> => {
    const financialReports = await financialReportModel.list_reports(userId, period)
    if (!financialReports) return []
    const data = financialReports.map((rows) => ({
        ...rows,
        limite_total: parseFloat(rows?.limite_total),
        quantia_gasta: parseFloat(rows?.quantia_gasta)
    }))
    return data
}

const getReportByID = async (userId: number, reportId: number): Promise<FinancialReport | null> => {
    const financialReport = await financialReportModel.get_report_by_id(userId, reportId)
    if (!financialReport) throw new Error('Nenhum relatório com esse ID foi encontrado');
    const data = {
        ...financialReport,
        limite_total: parseFloat(financialReport?.limite_total),
        quantia_gasta: parseFloat(financialReport?.quantia_gasta)
    }
    return data
}
export { getReports, getReportByID }