import { z } from 'zod';

export const goalsQuerySchema = z.object({
    desc_meta: z.string().optional(),
    valor_meta: z.number().int().positive(),
    status_meta: z.enum(['ativa', 'pausada', 'concluida', 'cancelada']).default('ativa'),
    data_inicio: z.coerce.date().default(() => new Date()),
    data_termino: z.coerce.date()
});

export const statusQuerySchema = z.object({
    status_meta: z.enum(['ativa', 'pausada', 'concluida', 'cancelada']).optional()
})