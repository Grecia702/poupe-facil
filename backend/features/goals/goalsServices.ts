import * as goalsModel from './goalsModel.ts'
import { NotFoundError } from '../../core/utils/errorTypes.ts'
import type { CreateGoalInput, UpdateGoalInput, StatusMeta } from './goals.d.ts'
import type { GoalsOverview, Goal } from '../../shared/types/goals.d.ts'

const createGoalService = async (userId: number, goalsData: CreateGoalInput): Promise<void> => {
    await goalsModel.createGoal(userId, goalsData)
}

const getGoalService = async (userId: number, query: StatusMeta): Promise<GoalsOverview> => {
    const goals = await goalsModel.getGoals(userId, query)
    return goals
}

const getGoalByIdService = async (userId: number, goalId: number): Promise<Goal> => {
    const goals = await goalsModel.getGoalById(userId, goalId)
    if (!goals) throw new NotFoundError('Meta não encontrada');
    return goals
}

const updateGoalService = async (userId: number, goalId: number, queryParams: UpdateGoalInput): Promise<void> => {
    const goals = await goalsModel.checkExisting(userId, goalId)
    if (!goals) throw new NotFoundError('Meta não encontrada');
    await goalsModel.updateGoal(userId, goalId, queryParams)
}

const updateSaldoService = async (saldo: number, userId: number, goalId: number): Promise<void> => {
    const goals = await goalsModel.checkExisting(userId, goalId)
    if (!goals) throw new Error('Meta não encontrada');
    await goalsModel.updateSaldo(saldo, userId, goalId)
}

const deleteGoalService = async (userId: number, goalId: number): Promise<void> => {
    const goals = await goalsModel.checkExisting(userId, goalId)
    if (!goals) throw new Error('Meta não encontrada');
    await goalsModel.deleteGoal(userId, goalId)
}

export { createGoalService, getGoalService, getGoalByIdService, updateGoalService, deleteGoalService, updateSaldoService }