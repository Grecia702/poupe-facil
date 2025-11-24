import { z } from 'zod'

export const accountBankSchema = z.object({
    nome_conta: z.string(),
    data_criacao: z.coerce.date(),
    saldo: z.number(),
    icone: z.string(),
    desc_conta: z.string().optional(),
    tipo_conta: z.string(),
})