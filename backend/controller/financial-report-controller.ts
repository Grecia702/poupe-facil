import { BadRequestError } from '../utils/errorTypes.ts'
import * as FinancialReportService from '../services/financial-report-service.ts'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

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
        res.status(200).json(reports)
    } catch (error) {
        next(error)
    }
}

const getReportByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const { id } = req.params
        if (!id) throw new BadRequestError("ID inválida.");
        const reportId = parseInt(id)
        const reports = await FinancialReportService.getReportByID(userId, reportId)
        res.status(200).json(reports)
    } catch (error) {
        next(error)
    }
}

export { getReport, getReportByID }