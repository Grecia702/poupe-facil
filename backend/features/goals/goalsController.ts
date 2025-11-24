import * as goalsService from "./goalsServices.ts"
import type { Request, Response, NextFunction } from "express"
import { goalsQuerySchema, statusQuerySchema } from "./goals.schema.ts"
import type { ApiSuccess } from "../../shared/types/ApiResponse.d.ts"
import type { Goal, GoalsOverview } from "../../shared/types/goals.d.ts"

const createGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = goalsQuerySchema.parse(req.body)
        const { userId } = req.user
        await goalsService.createGoalService(userId, query)
        res.status(201).json({ message: "Meta criada com sucesso" })
    } catch (error) {
        next(error)
    }
}

const getGoals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const { status_meta } = statusQuerySchema.parse(req.query)
        const goals = await goalsService.getGoalService(userId, status_meta)
        return res.status(200).json({ success: true, data: goals } satisfies ApiSuccess<GoalsOverview>)
    } catch (error) {
        next(error)
    }
}

const getGoalById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const goalId = Number(req.params.id)
        const { userId } = req.user
        const goal = await goalsService.getGoalByIdService(userId, goalId)
        return res.status(200).json({ success: true, data: goal } satisfies ApiSuccess<Goal>)
    } catch (error) {
        next(error)
    }
}

const updateGoal = async (req: Request, res: Response, next: NextFunction) => {
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

const updateSaldo = async (req: Request, res: Response, next: NextFunction) => {
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

const deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
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