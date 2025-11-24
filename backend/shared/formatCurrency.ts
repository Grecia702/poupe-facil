function stringToCents(value: string) {
    const num = parseFloat(value)
    return Math.round(num * 100)
}

function centsToBRL(cents: number) {
    return cents / 100
}

export function formatCurrency(value: string): number {
    const valueCents = stringToCents(value)
    const valueBrl = centsToBRL(valueCents)
    return valueBrl
}