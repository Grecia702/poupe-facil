import { z } from 'zod';

export const budgetQuerySchema = z.object({
    data_inicio: z.string()
        .transform(str => new Date(str))
        .refine(date => !isNaN(date.getTime()), {
            message: "data_inicio deve ser uma data válida",
        }),

    data_termino: z.string()
        .transform(str => new Date(str))
        .refine(date => !isNaN(date.getTime()), {
            message: "data_termino deve ser uma data válida",
        })
        .optional(),
    quantia_limite: z.number().min(0.01, { message: "quantia_limite deve ser maior que zero" }),
    desc_budget: z.string().optional(),
    ativo: z.boolean().optional().default(true),
    limite: z.number().positive().int(),
    limites_categorias: z.array(z.object({
        category: z.string(),
        value: z.number().min(0.01)
    })).optional(),
});