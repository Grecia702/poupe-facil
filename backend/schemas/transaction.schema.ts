import { boolean, z } from 'zod'

export const transactionCreateSchema = z.object({
    id_usuario: z.number().int().optional(),
    id_contabancaria: z.number().int(),
    nome_transacao: z.string().min(1),
    valor: z.number().positive(),
    categoria: z.enum(['Alimentação', 'Transporte', 'Internet', 'Carro', 'Saúde', 'Educação', 'Contas', 'Compras', 'Outros']),
    data_transacao: z.date(),
    tipo: z.enum(['Despesa', 'Receita']),
    natureza: z.enum(['Fixa', 'Variavel']),
    recorrente: z.boolean().optional(),
    frequencia_recorrencia: z.enum([
        'Diario', 'Semanal', 'Quinzenal', 'Mensal',
        'Bimestral', 'Trimestral', 'Semestral',
        'Quadrimestral', 'Anual'
    ]).optional().nullable(),
    proxima_ocorrencia: z.date().optional().nullable(),
    budget_id: z.number().int().optional()
})

export const transactionQuerySchema = z.object({
    id_contabancaria: z.number().int().optional(),
    tipo: z.enum(['despesa', 'receita']).optional(),
    categoria: z.string().optional(),
    valor_maior_que: z.number().optional(),
    valor_menor_que: z.number().optional(),
    orderBy: z.enum(['valor', 'data_transacao', 'tipo', 'natureza', 'transaction_id']).default('transaction_id'),
    orderDirection: z.enum(['ASC', 'DESC']).default('DESC'),
    limit: z.number().int().min(1).max(100).default(10),
    page: z.number().int().min(0).default(1),
    period: z.enum(['week', 'month', 'day', 'year']).default('week')
});

export const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    offset: z.number().positive().default(10).optional(),
    orderBy: z.string().default('data_transacao'),
    orderDirection: z.enum(['ASC', 'DESC']).default('DESC'),
    valor: z.number().positive().optional(),
    categoria: z.enum(['Alimentação', 'Transporte', 'Internet', 'Carro', 'Saúde', 'Educação', 'Contas', 'Compras', 'Outros']).optional(),
    data_transacao: z.date().optional(),
    recorrente: z.boolean().optional(),
    frequencia_recorrencia: z.enum([
        'Diario', 'Semanal', 'Quinzenal', 'Mensal',
        'Bimestral', 'Trimestral', 'Semestral',
        'Quadrimestral', 'Anual'
    ]).optional().nullable(),
    proxima_ocorrencia: z.date().optional().nullable(),
    tipo: z.enum(['Despesa', 'Receita']).optional(),
    natureza: z.enum(['Fixa', 'Variavel']).optional(),
    valor_maior_que: z.coerce.number().optional(),
    valor_menor_que: z.coerce.number().optional(),
})

export const dateParamsSchema = z.object({
    first_day: z.coerce.date(),
    last_day: z.coerce.date(),
    period: z.string()
});

export const transactionsCreateSchema = z.union([
    transactionCreateSchema,
    z.array(transactionCreateSchema).nonempty()
]);