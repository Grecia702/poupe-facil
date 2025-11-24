import * as budgetService from './budgetServices.ts'
import type { Request, Response, NextFunction } from 'express'
import { budgetQuerySchema } from './budget.schema.ts'
import type { ApiSuccess } from '../../shared/types/ApiResponse.d.ts'
import type { BudgetData } from '@/shared/types/budget.d.ts'

const createBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const query = budgetQuerySchema.parse(req.body)
        await budgetService.createBudgetService(userId, query)
        res.status(201).json({ message: 'Orçamento criado com sucesso' })
    } catch (error) {
        next(error)
    }
}

const getBudgets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const budget = await budgetService.getBudgetService(userId)
        return res.status(200).json({ success: true, data: budget } satisfies ApiSuccess<BudgetData[]>)
    } catch (error) {
        next(error)
    }
}

const getBudgetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const id = Number(req.params.id)
        const budget = await budgetService.getBudgetByIdService(userId, id)
        return res.status(200).json({ success: true, data: budget } satisfies ApiSuccess<BudgetData>)
    } catch (error) {
        next(error)
    }
}

const getActiveBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const budget = await budgetService.getActiveService(userId)
        return res.status(200).json({ success: true, data: budget } satisfies ApiSuccess<BudgetData>)
    } catch (error) {
        next(error)
    }
}

const updateBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const id = Number(req.params.id)
        const query = req.body
        await budgetService.updateBudgetService(userId, id, query)
        res.status(200).json({ message: 'Orçamento atualizado com sucesso' })
    } catch (error) {
        next(error)
    }
}

const deleteBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const id = Number(req.params.id)
        await budgetService.deleteBudgetService(id, userId)
        res.status(200).json({ message: 'Orçamento deletado com sucesso' })
    } catch (error) {
        next(error)
    }
}

export {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getActiveBudget,
}