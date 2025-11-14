import { z } from 'zod';

export const goalsQuerySchema = z.object({
    desc_meta: z.string().optional(),
    valor_meta: z.number().int().positive(),
    status_meta: z.enum(['Ativa', 'Pausada', 'Concluída', 'Cancelada']).default('Ativa'),
    data_inicio: z.coerce.date().default(() => new Date()),
    data_termino: z.coerce.date()
});