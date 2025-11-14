import { budgetQuerySchema } from "./budget.schema.ts";

export type CreateBudgetService = z.infer<typeof budgetQuerySchema>

export type CreateBudgetData = CreateBudgetService & {
    id_usuario: number;
}

export type CategoriasLimites = {
    category: string
    value: number
}

export type QueryBudgetData = CreateBudgetData & {
    id: number;
    quantia_gasta: number;
    quantia_gasta_categorias?: CategoriasLimites[];
    ativo: boolean;
}

export type UpdateBudgetData = Partial<CreateBudgetData>