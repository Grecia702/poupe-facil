import { budgetQuerySchema } from "./budget.schema.ts";

export type CreateBudgetService = z.infer<typeof budgetQuerySchema>

export type BudgetCreateDTO = CreateBudgetService & {
    id_usuario: number;
}

export type CategoriasLimites = {
    category: string
    value: number
}

export type UpdateBudgetData = Partial<BudgetCreateDTO>