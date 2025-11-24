import * as FinancialReportService from './financial-report-service.ts'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import type { ApiSuccess } from '../../shared/types/ApiResponse.d.ts'
import type { FinancialReport } from '../../shared/types/financialReport.d.ts'

const reportSchema = z.object({
    period: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida" })
        .transform((val) => new Date(val))
})

const getReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const { period } = reportSchema.parse(req.query)
        const reports = await FinancialReportService.getReports(userId, period)
        return res.status(200).json({ success: true, data: reports } satisfies ApiSuccess<FinancialReport[]>)
    } catch (error) {
        next(error)
    }
}

const getReportByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const id = Number(req.params.id)
        const report = await FinancialReportService.getReportByID(userId, id)
        return res.status(200).json({ success: true, data: report } satisfies ApiSuccess<FinancialReport>)
    } catch (error) {
        next(error)
    }
}

export { getReport, getReportByID }