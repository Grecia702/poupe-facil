import type { Categorias, GroupedCategories } from "../transactions/transaction";

export type NormalizedTransaction = {
    id_usuario?: number;
    id_contabancaria: number;
    nome_transacao: string;
    valor: number;
    categoria: Categorias;
    data_transacao: Date;
    tipo: 'Despesa' | 'Receita';
    natureza: 'Fixa' | 'Variavel';
    recorrente: boolean;
    frequencia_recorrencia: 'Mensal' | null;
    proxima_ocorrencia: Date | null;
    budget_id: number;
}

export type DateInterval = {
    start: Date
    end: Date
}

export type KvCategories = Record<Categorias, GroupedCategories>

export type TransactionArgs = {
    transactions: NormalizedTransactions
}

export type OverviewArgs = {
    period: 'string',
    firstInterval: DateInterval,
    secondInterval: DateInterval
}