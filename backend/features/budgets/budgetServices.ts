import type { BudgetCreateDTO, UpdateBudgetData, CategoriasLimites } from './budget.d.ts'
import type { BudgetData } from '../../shared/types/budget.js'
import * as budgetModel from './budgetModel.ts'
import { budgetQuerySchema } from './budget.schema.ts'
import { NotFoundError, BadRequestError } from '../../core/utils/errorTypes.ts'

const createBudgetService = async (userId: number, budgetData: BudgetCreateDTO): Promise<void> => {
    const { data_inicio } = budgetQuerySchema.parse(budgetData)
    const budget = await budgetModel.checkValidDate(data_inicio, userId)
    if (budget) throw new BadRequestError('Já existe um orçamento para este período')
    await budgetModel.createBudget(userId, budgetData)
}

const getBudgetService = async (userId: number): Promise<BudgetData[]> => {
    const budget = await budgetModel.getBudgets(userId)
    if (!budget) throw new NotFoundError('Nenhum orçamento encontrado')
    return budget
}

const getBudgetByIdService = async (userId: number, budgetId: number): Promise<BudgetData> => {
    const budget = await budgetModel.getBudgetById(budgetId, userId)
    if (!budget) throw new Error('Nenhum orçamento com esse ID foi encontrado')
    return budget
}

const getActiveService = async (userId: number): Promise<BudgetData> => {
    const ActiveBudget = await budgetModel.getActiveBudget(userId)
    if (!ActiveBudget) throw new Error('Nenhum orçamento com esse ID foi encontrado')
    const budget = await budgetModel.getBudgetById(ActiveBudget.id, userId)
    if (!budget) throw new Error('Nenhum orçamento com esse ID foi encontrado')
    return budget
}

const getAllActiveService = async (): Promise<BudgetData[]> => {
    const budgets = await budgetModel.getAllActiveBudgets()
    if (!budgets) return []
    return budgets
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