import { goalsQuerySchema } from "../schemas/goals.schema.ts";

export type CreateGoalsData = z.infer<typeof goalsQuerySchema>
export type UpdateGoalsData = Partial<CreateGoalsData>

export type QueryGoalsData = CreateGoalsData & {
    id: number,
    saldo_meta: number
}

export type GoalsTotal<T = string> = {
    total_ocorrencias: T,
    total_economizado: T,
    total_metas: T,
}

export type GoalsOverview = {
    metas: QueryGoalsData[]
    total: GoalsTotal<number>
}

export type UpdateBalance = Partial<Omit<CreateGoalsData, 'data_inicio'>>