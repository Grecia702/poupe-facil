import { transactionCreateSchema, transactionsCreateSchema, transactionQuerySchema, querySchema, dateParamsSchema } from '../../features/transactions/transaction.schema.ts'
import type { CreateTransactionData, Categorias } from '../../features/transactions/transaction.ts'

export type PaginatedTransactionDTO = z.infer<typeof querySchema>

export type Transaction = Omit<CreateTransactionData, 'budget_id' | 'frequencia_recorrencia'> & {
    id: number
}

export type PaginatedTransaction = {
    data: Transaction[];
    meta: {
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
    };
}

export interface GroupedByType {
    tipo: "Total" | "receita" | "despesa";
    natureza: "Total" | "Fixa" | "Variavel";
    ocorrencias: number;
    valor: number;
}

export interface GroupedCategories {
    categoria: Categorias,
    ocorrencias: number,
    total: number
};

export interface WeeklySummary {
    weeks: {
        week: string
        date_interval: string
        despesa: number
        receita: number
    }[];
    totals: {
        expenses: number,
        incomes: number,
        balance: number
    }
    vs_previous_period: {
        expense_variance: string
        income_variance: string
    }
}

export interface RegularSummary {
    date_interval: string
    name_interval: string
    tipo: "receita" | "despesa"
    ocorrencias: string
    valor: number
}

export type TransactionSummary = WeeklySummary | RegularSummary[]