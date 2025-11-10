import type { Categorias } from "./transaction.d.ts"

export type limite_categorias = {
    category: Categorias
    value: number
}

export type quantia_gasta_categorias = limite_categorias

export type FinancialReport = {
    id: number;
    periodo_inicio: Date;
    periodo_fim: Date;
    limite_total: number;
    limite_categorias?: limite_categorias[];
    quantia_gasta: number;
    quantia_gasta_categorias?: quantia_gasta_categorias[];
    status: 'DENTRO_DO_ORCAMENTO' | 'FORA_DO_ORCAMENTO';
    analise_textual: string;
    recomendacoes: string;
}

export type FinancialReportDB = Omit<FinancialReport, 'limite_total' | 'quantia_gasta'> & {
    limite_total: string;
    quantia_gasta: string;
}