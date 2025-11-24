import { z } from 'zod'
import { transactionCreateSchema, transactionQuerySchema, querySchema, dateParamsSchema } from './transaction.schema.ts'

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

export interface PaginationMeta {
    page: number,
    limit: number,
    orderBy: string,
    orderDirection: 'ASC' | 'DESC'
    filters?: QueryFilters
}

export type PaginationQueryParams = z.infer<typeof querySchema>
export type CreateTransactionData = z.infer<typeof transactionCreateSchema>
export type TransactionArray = CreateTransactionData[]
export type QueryTransactionData = z.infer<typeof transactionQuerySchema>
export type UpdateTransactionData = Partial<CreateTransactionData>
export type DateParams = z.infer<typeof dateParamsSchema>

