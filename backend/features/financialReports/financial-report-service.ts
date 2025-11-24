import type { FinancialReport } from '../../shared/types/financialReport.js';
import * as financialReportModel from './financial-report-model.ts'
import OpenAI from 'openai';

const promptFinancialReport = async () => {
    const client = new OpenAI({ apiKey: process.env.API_KEY_OPENAI });
    const structuredResponse = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'system', content: `Você é um assistente financeiro especializado em análise de gastos pessoais.
Você deve analisar dados financeiros e gerar insights acionáveis.
Seja empático, direto e específico nas recomendações.`
        }],
        max_tokens: 1000,
        tool_choice: 'auto'
    });
}

const getReports = async (userId: number, period: Date): Promise<FinancialReport[]> => {
    const financialReports = await financialReportModel.list_reports(userId, period)
    if (!financialReports) return []
    return financialReports
}

const getReportByID = async (userId: number, reportId: number): Promise<FinancialReport> => {
    const financialReport = await financialReportModel.get_report_by_id(userId, reportId)
    if (!financialReport) throw new Error('Nenhum relatório com esse ID foi encontrado');
    return financialReport
}
export { getReports, getReportByID }