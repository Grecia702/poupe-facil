import { goalsQuerySchema, statusQuerySchema } from "./goals.schema.ts";

export type CreateGoalInput = z.infer<typeof goalsQuerySchema>
export type UpdateGoalInput = Partial<CreateGoalInput>
export type StatusMeta = z.infer<typeof statusQuerySchema>
export type UpdateBalance = Partial<Omit<CreateGoalsData, 'data_inicio'>>