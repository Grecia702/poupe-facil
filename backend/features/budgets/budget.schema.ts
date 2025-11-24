import { z } from 'zod';

export const budgetQuerySchema = z.object({
    data_inicio: z.coerce.date(),
    data_termino: z.coerce.date().optional(),
    quantia_limite: z.number().min(0.01, { message: "quantia_limite deve ser maior que zero" }),
    desc_budget: z.string().optional(),
    ativo: z.boolean().optional().default(true),
    limite: z.number().positive().int(),
    limites_categorias: z.array(z.object({
        category: z.string(),
        value: z.number().min(0.01)
    })).optional(),
}).refine((data) => {
    if (!data.limites_categorias || data.limites_categorias.length === 0) {
        return true;
    }
    const somaLimites = data.limites_categorias.reduce((acc, item) => acc + item.value, 0);
    return somaLimites <= data.quantia_limite;
}, {
    message: "A soma dos limites das categorias não pode ultrapassar a quantia limite do orçamento",
    path: ["limites_categorias"],
});