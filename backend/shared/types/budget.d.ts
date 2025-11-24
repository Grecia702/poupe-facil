import type { BudgetCreateDTO, CategoriasLimites } from "../../features/budgets/budget";

export type BudgetData = Omit<BudgetCreateDTO, 'id_usuario'> & {
    id: number;
    quantia_gasta: number;
    quantia_gasta_categorias?: CategoriasLimites[];
    ativo: boolean;
}