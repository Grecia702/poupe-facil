const goalsModel = require('../models/goalsModel')
const { z } = require('zod')

const goalQuerySchema = z.object({
    desc_meta: z.string().min(1),
    valor_meta: z.number().min(0.01),
    status_meta: z.enum(['ativa', 'concluída', 'pausada', 'cancelada']).optional(),
    // deadline: z.date(),
})

const createGoalService = async (userId, query) => {
    const { desc_meta, valor_meta, status_meta } = goalQuerySchema.parse(query)
    const { deadline } = query
    const goal = await goalsModel.checkActiveGoal(userId)
    // if (goal.exists) {
    //     status_meta = false
    // }
    const data_inicio = new Date()

    console.log(userId, desc_meta, valor_meta, status_meta, data_inicio, deadline)

    await goalsModel.createGoal(userId, desc_meta, valor_meta, status_meta, data_inicio, deadline)
}

const getGoalService = async (userId, query) => {
    const { status_meta } = query
    const soma = await goalsModel.totalConcluded(userId, status_meta)
    const { result } = await goalsModel.getGoals(userId, status_meta)

    return {
        metas: result.map(row => ({
            ...row,
            saldo_meta: parseFloat(row.saldo_meta),
            valor_meta: parseFloat(row.valor_meta),
        })),
        total: {
            total_ocorrencias: parseInt(soma.result.total_ocorrencias),
            total_metas: parseFloat(soma.result.total_metas),
            total_economizado: parseFloat(soma.result.total_economizado),
        },
    }
}

const getGoalByIdService = async (userId, goalId) => {
    const goals = await goalsModel.getGoalById(userId, goalId)
    if (!goals.exists) {
        throw new Error('Meta não encontrada')
    }
    return goals.result

}

const updateGoalService = async (userId, goalId, queryParams) => {
    const goals = await goalsModel.checkExisting(userId, goalId)
    if (!goals.exists) {
        throw new Error('Meta não encontrada')
    }

    await goalsModel.updateGoal(userId, goalId, queryParams)
}
const deleteGoalService = async (userId, goalId) => {
    const goals = await goalsModel.checkExisting(userId, goalId)
    if (!goals.exists) {
        throw new Error('Meta não encontrada')
    }

    await goalsModel.deleteGoal(userId, goalId)
}

module.exports = { createGoalService, getGoalService, getGoalByIdService, updateGoalService, deleteGoalService }