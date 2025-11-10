import * as goalsService from "../services/goalsServices.ts"
import type { Request, Response, NextFunction } from "express"
import { goalsQuerySchema } from "../schemas/goals.schema.ts"

const createGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = goalsQuerySchema.parse(req.body)
        const { userId } = req.user
        await goalsService.createGoalService(userId, query)
        res.status(201).json({ message: "Meta criada com sucesso" })
    } catch (error) {
        next(error)
    }
}

const getGoals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.user
        console.log(req.user)
        const query = (req.query.status_meta as string) || 'ativa';
        const goals = await goalsService.getGoalService(userId, query)
        res.status(200).json(goals)
    } catch (error) {
        next(error)
    }
}

const getGoalById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const goalId = Number(req.params.id)
        const { userId } = req.user
        const goals = await goalsService.getGoalByIdService(userId, goalId)
        res.status(200).json(goals)
    } catch (error) {
        next(error)
    }
}

const updateGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = req.body
        const goalId = Number(req.params.id)
        const { userId } = req.user
        await goalsService.updateGoalService(userId, goalId, query)
        res.status(200).json({ message: "Meta atualizada com sucesso" })
    } catch (error) {
        next(error)
    }
}

const updateSaldo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { saldo } = req.body
        const goalId = Number(req.params.id)
        const { userId } = req.user
        await goalsService.updateSaldoService(saldo, userId, goalId)
        res.status(200).json({ message: "Saldo adicionado com sucesso" })
    } catch (error) {
        next(error)
    }
}

const deleteGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const goalId = Number(req.params.id)
        const { userId } = req.user
        await goalsService.deleteGoalService(userId, goalId)
        res.status(204).json()
    } catch (error) {
        next(error)
    }
}

export { createGoal, getGoals, getGoalById, updateGoal, deleteGoal, updateSaldo }