import type { limite_categorias, quantia_gasta_categorias } from "../../features/financialReports/financialreport.d.ts";

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