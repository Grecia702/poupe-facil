import { z } from 'zod'
import { transactionCreateSchema, transactionsCreateSchema, transactionQuerySchema, querySchema, dateParamsSchema } from './transaction.schema.ts'

export type Categorias = 'Alimentação' | 'Transporte' | 'Internet' | 'Carro' | 'Saúde' | 'Educação' | 'Contas' | 'Compras' | 'Outros'

export const SUBCATEGORIAS_MAP: Record<Categorias, string[]> = {
    Alimentação: ['Restaurantes', 'Supermercado', 'Lanches', 'Delivery', 'Padaria'],
    Transporte: ['Combustível', 'Transporte público', 'Taxi/Uber', 'Estacionamento', 'Pedágio'],
    Internet: ['Internet fibra', 'Internet móvel', 'Streaming', 'Jogos online'],
    Carro: ['Manutenção', 'IPVA', 'Seguro', 'Lavagem', 'Multas'],
    Saúde: ['Farmácia', 'Consultas', 'Exames', 'Plano de saúde', 'Academia'],
    Educação: ['Mensalidade', 'Livros', 'Cursos online', 'Material escolar', 'Idiomas'],
    Contas: ['Energia elétrica', 'Água', 'Gás', 'Condomínio', 'Telefone'],
    Compras: ['Roupas', 'Eletrônicos', 'Casa e decoração', 'Presentes', 'Cosméticos'],
    Outros: ['Lazer', 'Viagens', 'Pets', 'Doações', 'Diversos'],
}

export interface QueryFilters {
    tipo?: 'Despesa' | 'Receita',
    natureza?: 'Fixa' | 'Variavel',
    categoria?: Categorias,
    data_transacao?: Date,
    valor_maior_que?: number,
    valor_menor_que?: number,
}

export interface PaginationQueryParams {
    page: number,
    limit: number,
    orderBy: string,
    orderDirection: 'ASC' | 'DESC'
    filters?: QueryFilters
}

export interface TransacaoMensal {
    date_interval: string;
    tipo: 'receita' | 'despesa';
    valor: number;
    total: number
}

export interface TransacaoMensalResult {
    rows: TransacaoMensal[]
    total: number
}

export interface GroupedCategories {
    categoria: Categorias,
    ocorrencias: number,
    total: number
}

export interface GroupedByType {
    tipo: "Total" | "receita" | "despesa";
    natureza: "Total" | "Fixa" | "Variavel";
    ocorrencias: number;
    valor: number;
}

export interface WeeklySummary {
    data: {
        week: string
        date_interval: string
        despesa: number
        receita: number
    }[];
    total: {
        despesa: number,
        receita: number,
    }
    percent: {
        despesa: string
        receita: string
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

export type CreateTransactionData = z.infer<typeof transactionCreateSchema>

export type GetTransactionData = CreateTransactionData

export type TransactionList = z.infer<typeof transactionsCreateSchema>
export type TransactionArray = CreateTransactionData[]
export type QueryTransactionData = z.infer<typeof transactionQuerySchema>
export type UpdateTransactionData = Partial<CreateTransactionData>
export type PaginatedTransactionData = z.infer<typeof querySchema>
export type DateParams = z.infer<typeof dateParamsSchema>

export type PaginatedTransaction = PaginatedTransactionData<GetTransactionData>
