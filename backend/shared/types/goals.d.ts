import type { CreateGoalInput } from "../../features/goals/goals"

export type Goal = CreateGoalInput & {
    id: number,
    saldo_meta: number
}

type GoalsTotal = {
    total_ocorrencias: number,
    total_economizado: number,
    total_metas: number,
}

export type GoalsOverview = {
    metas: Goal[]
    totals: GoalsTotal
}