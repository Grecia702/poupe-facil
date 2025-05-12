
const {
    createBudgetService,
    getBudgetService,
    getBudgetByIdService,
    updateBudgetService,
    deleteBudgetService
} = require('../services/budgetServices')

const createBudget = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const query = req.body
        await createBudgetService(userId, query)
        res.status(201).json({ message: 'Orçamento criado com sucesso' })
    } catch (error) {
        if (error.message === 'Já existe um orçamento para este período') {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: 'Erro ao fazer a requisição: ', error: error.message })
    }
}

const getBudgets = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const budget = await getBudgetService(userId)
        res.status(200).json(budget)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer a requisição: ', error: error.message })
    }
}

const getBudgetById = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params
        const budget = await getBudgetByIdService(userId, id)
        res.status(200).json(budget)
    } catch (error) {
        if (error.message === 'Nenhum orçamento com esse ID foi encontrado') {
            return res.status(404).json({ message: error.message })
        }
        res.status(500).json({ message: 'Erro ao fazer a requisição: ', error: error.message })
    }
}

const updateBudget = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params
        const query = req.body
        await updateBudgetService(userId, id, query)
        res.status(200).json({ message: 'Orçamento atualizado com sucesso' })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer a requisição: ', error: error.message })
    }
}

const deleteBudget = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params
        await deleteBudgetService(id, userId)
        res.status(200).json({ message: 'Orçamento deletado com sucesso' })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer a requisição: ', error: error.message })
    }
}

module.exports = { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget }