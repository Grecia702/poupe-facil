import type { CreateBudgetData, UpdateBudgetData } from '@/features/budgets/budget.js'
import * as budgetModel from './budgetModel.ts'
import { budgetQuerySchema } from './budget.schema.ts'
import { NotFoundError, UnprocessableEntityError, BadRequestError } from '@core/utils/errorTypes.ts'
import type { CategoriasLimites, QueryBudgetData } from './budget.js'

const createBudgetService = async (userId: number, queryParams: CreateBudgetData): Promise<void> => {
    const { data_inicio, quantia_limite, limites_categorias } = budgetQuerySchema.parse(queryParams)
    const validatedQuery = budgetQuerySchema.parse(queryParams)
    const budget = await budgetModel.checkValidDate(data_inicio, userId)
    if (budget) throw new BadRequestError('Já existe um orçamento para este período')
    if (limites_categorias) {
        const values = limites_categorias.reduce((acc, item) => acc + item.value, 0)
        if (values > quantia_limite) throw new UnprocessableEntityError('Valores de sub-categorias exce o valor limite total')
    }
    await budgetModel.createBudget(userId, validatedQuery)
    return
}

const getBudgetService = async (userId: number): Promise<QueryBudgetData> => {
    const budget = await budgetModel.getBudgets(userId)
    if (!budget) throw new NotFoundError('Nenhum orçamento encontrado')
    return budget
}

const getBudgetByIdService = async (userId: number, budgetId: number): Promise<QueryBudgetData> => {
    const budget = await budgetModel.getBudgetById(budgetId, userId)
    if (!budget) throw new Error('Nenhum orçamento com esse ID foi encontrado')
    return budget
}

const getActiveService = async (userId: number): Promise<QueryBudgetData> => {
    const ActiveBudget = await budgetModel.getActiveBudget(userId)
    if (!ActiveBudget) return []
    const budget = await budgetModel.getBudgetById(ActiveBudget.id, userId)
    const limites_categorias = budget.limites_categorias ?? {}
    const quantia_gasta_categorias = budget.quantia_gasta_categorias ?? {}
    const processedBudget = {
        ...budget,
        limite: Math.abs(parseFloat(budget.limite)),
        quantia_gasta: Math.abs(parseFloat(budget.quantia_gasta)),
        limites_categorias: limites_categorias.map((item: CategoriasLimites) => ({
            ...item,
            value: Math.abs(item.value)
        })),
        quantia_gasta_categorias: quantia_gasta_categorias.map((item: CategoriasLimites) => ({
            ...item,
            value: Math.abs(item.value)
        }))
    }
    return processedBudget
}

const getAllActiveService = async (): Promise<QueryBudgetData> => {
    const budgets = await budgetModel.getAllActiveBudgets()

    const processedBudgets = budgets.map(budget => {
        const limites_categorias = budget.limites_categorias ?? {}
        const quantia_gasta_categorias = budget.quantia_gasta_categorias ?? {}
        return {
            ...budget,
            limite: Math.abs(parseFloat(budget.limite)),
            quantia_gasta: Math.abs(parseFloat(budget.quantia_gasta)),
            limites_categorias: limites_categorias.map((item: CategoriasLimites) => ({
                ...item,
                value: Math.abs(item.value)
            })),
            quantia_gasta_categorias: quantia_gasta_categorias.map((item: CategoriasLimites) => ({
                ...item,
                value: Math.abs(item.value)
            }))
        }
    })
    return processedBudgets
}

const updateBudgetService = async (userId: number, budgetId: number, queryParams: UpdateBudgetData): Promise<void> => {
    const { quantia_limite, limites_categorias, data_inicio, data_termino } = queryParams
    const budget = await budgetModel.checkExisting(budgetId, userId)

    if (!budget) throw new NotFoundError('Orçamento não encontrado')
    if (limites_categorias) {
        const values = limites_categorias.reduce((acc: number, item: CategoriasLimites) => acc + item.value, 0)
        if (quantia_limite && values > quantia_limite) throw new Error('Limite de sub-categorias não pode exceder o valor limite total')
    }

    if (data_inicio && data_termino) {
        if (data_inicio > data_termino) throw new Error('Data de termino do orçamento não pode vir antes da data de inicio')
    }
    await budgetModel.updateBudget(userId, budgetId, queryParams)
}

const deleteBudgetService = async (budgetId: number, userId: number): Promise<void> => {
    const budget = await budgetModel.checkExisting(budgetId, userId)
    if (!budget) throw new Error('Orçamento não encontrado');
    await budgetModel.deleteBudget(budgetId, userId)
}

export {
    createBudgetService,
    getBudgetService,
    getBudgetByIdService,
    getActiveService,
    updateBudgetService,
    deleteBudgetService,
    getAllActiveService
}