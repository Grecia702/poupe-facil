import type { CreateGoalsData, GoalsOverview, UpdateGoalsData } from './goals.js'
import * as goalsModel from './goalsModel.ts'
import { NotFoundError } from '../../core/utils/errorTypes.ts'

const createGoalService = async (userId: number, goalsData: CreateGoalsData): Promise<void> => {
    await goalsModel.createGoal(userId, goalsData)
}

const getGoalService = async (userId: number, query: string): Promise<GoalsOverview | []> => {
    const soma = await goalsModel.totalConcluded(userId, query)
    const goals = await goalsModel.getGoals(userId, query)
    if (!goals) return []
    return {
        metas: goals.map(row => ({
            ...row,
            saldo_meta: parseFloat(row.saldo_meta),
            valor_meta: parseFloat(row.valor_meta),

        })),
        total: {
            total_ocorrencias: parseInt(soma.total_ocorrencias),
            total_metas: parseFloat(soma.total_metas),
            total_economizado: parseFloat(soma.total_economizado),
        },
    }
}

const getGoalByIdService = async (userId: number, goalId: number) => {
    const goals = await goalsModel.getGoalById(userId, goalId)
    if (!goals) throw new NotFoundError('Meta não encontrada');
    const data = ({
        ...goals,
        saldo_meta: parseFloat(goals.saldo_meta),
        valor_meta: parseFloat(goals.valor_meta)
    })
    return data
}

const updateGoalService = async (userId: number, goalId: number, queryParams: UpdateGoalsData): Promise<void> => {
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