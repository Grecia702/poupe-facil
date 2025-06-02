const budgetModel = require('../models/budgetModel')
const { z } = require('zod');

const budgetQuerySchema = z.object({
    data_inicio: z.string()
        .transform(str => new Date(str))
        .refine(date => !isNaN(date.getTime()), {
            message: "data_inicio deve ser uma data válida",
        }),

    data_termino: z.string()
        .transform(str => new Date(str))
        .refine(date => !isNaN(date.getTime()), {
            message: "data_termino deve ser uma data válida",
        }),
    quantia_limite: z.number().min(0.01, { message: "quantia_limite deve ser maior que zero" }),
    desc_budget: z.string().optional(),
    ativo: z.boolean().optional().default(true),
    limites_categorias: z.record(z.string(), z.number().min(0.01)).nullable(),
});

const createBudgetService = async (userId, queryParams) => {
    const { data_inicio, quantia_limite, limites_categorias } = budgetQuerySchema.parse(queryParams)
    const validatedQuery = budgetQuerySchema.parse(queryParams)
    const budget = await budgetModel.checkValidDate(data_inicio, userId)

    if (budget.exists) {
        throw new Error('Já existe um orçamento para este período')
    }
    if (limites_categorias) {

        const values = Object.values(limites_categorias)
            .reduce((acc, item) => {
                return acc + item
            }, 0)

        if (values > quantia_limite) {
            throw new Error('Valores de sub-categorias excedendo o valor limite total')
        }

        const validCategories = Object.fromEntries(
            Object.entries(limites_categorias)
        );
        const newQuery = { ...validatedQuery, validCategories }
        await budgetModel.createBudget(userId, newQuery)
        return
    }
    await budgetModel.createBudget(userId, validatedQuery)
    return
}

const getBudgetService = async (userId) => {
    const budget = await budgetModel.getBudgets(userId)
    if (!budget.exists) {
        throw new Error('Nenhum orçamento encontrado')
    }
    return budget.result
}

const getBudgetByIdService = async (userId, budgetId) => {
    const budget = await budgetModel.getBudgetById(budgetId, userId)
    if (!budget.exists) {
        throw new Error('Nenhum orçamento com esse ID foi encontrado')
    }
    return budget.result
}

const getActiveService = async (userId) => {
    const { result, exists } = await budgetModel.getActiveBudget(userId)
    if (!exists) {
        return []
    }
    const budget = await budgetModel.getBudgetById(result.id, userId)

    const limites_categorias = budget.result.limites_categorias ?? {}
    const quantia_gasta_categorias = budget.result.quantia_gasta_categorias ?? {}

    const processedBudget = {
        ...budget.result,
        limite: Math.abs(parseFloat(budget.result.limite)),
        quantia_gasta: Math.abs(parseFloat(budget.result.quantia_gasta)),
        limites_categorias: Object.fromEntries(
            Object.entries(limites_categorias).map(([key, val]) => [key, Math.abs(val)])
        ),
        quantia_gasta_categorias: Object.fromEntries(
            Object.entries(quantia_gasta_categorias).map(([key, val]) => [key, Math.abs(val)])
        )
    }
    return processedBudget
}

const getAllActiveService = async () => {
    const budgets = await budgetModel.getAllActiveBudgets()

    const processedBudgets = budgets.result.map(budget => {
        const limites_categorias = budget.limites_categorias ?? {}
        const quantia_gasta_categorias = budget.quantia_gasta_categorias ?? {}
        return {
            ...budget,
            limite: Math.abs(parseFloat(budget.limite)),
            quantia_gasta: Math.abs(parseFloat(budget.quantia_gasta)),
            limites_categorias: Object.fromEntries(
                Object.entries(limites_categorias).map(([key, val]) => [key, Math.abs(val)])
            ),
            quantia_gasta_categorias: Object.fromEntries(
                Object.entries(quantia_gasta_categorias).map(([key, val]) => [key, Math.abs(val)])
            )
        }
    })
    return processedBudgets
}



const updateBudgetService = async (userId, budgetId, queryParams) => {
    const { quantia_limite, limites_categorias, data_inicio, data_termino } = queryParams
    const checkBudget = await budgetModel.checkExisting(budgetId, userId)

    if (!checkBudget.exists) {
        throw new Error('Orçamento não encontrado')
    }


    if (limites_categorias) {
        const values = Object.values(limites_categorias)
            .reduce((acc, item) => {
                return acc + item
            }, 0)

        if (values > quantia_limite) {
            throw new Error('Limite de sub-categorias não pode exceder o valor limite total')
        }
    }

    if (data_inicio) {
        if (data_inicio > data_termino) {
            throw new Error('Data de termino do orçamento não pode vir antes da data de inicio')
        }
    }

    await budgetModel.updateBudget(userId, budgetId, queryParams)
    return
}

const deleteBudgetService = async (budgetId, userId) => {
    const budget = await budgetModel.checkExisting(budgetId, userId)
    if (!budget.exists) {
        throw new Error('Orçamento não encontrado')
    }
    await budgetModel.deleteBudget(budgetId, userId)
}

module.exports = {
    createBudgetService,
    getBudgetService,
    getBudgetByIdService,
    getActiveService,
    updateBudgetService,
    deleteBudgetService,
    getAllActiveService
}