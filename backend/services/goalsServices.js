const goalsModel = require('../models/goalsModel')
const { z } = require('zod')

const goalQuerySchema = z.object({
    desc_meta: z.string().min(1),
    valor_meta: z.number().min(0.01),
})

const createGoalService = async (userId, query) => {
    let status_meta = query.status_meta
    const { desc_meta, valor_meta } = goalQuerySchema.parse(query)
    const goal = await goalsModel.checkActiveGoal(userId)
    if (goal.exists) {
        status_meta = false
    }
    const data_inicio = new Date()
    await goalsModel.createGoal(userId, desc_meta, valor_meta, status_meta, data_inicio)
}

const getGoalService = async (userId) => {
    const goals = await goalsModel.getGoals(userId)
    if (!goals.exists) {
        throw new Error('Nenhuma meta encontrada')
    }
    return goals.result

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