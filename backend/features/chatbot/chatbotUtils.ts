import { calcularProximaOcorrencia } from '../../core/utils/calcularOcorrencia.ts'
import { format } from 'date-fns'
import type { Transaction, GroupedCategories } from '../../shared/types/transaction.d.ts'
import type { BudgetData } from '../../shared/types/budget.d.ts'
import type { NormalizedTransaction, DateInterval } from './chatbot'

export function normalizeTransactions(transactions: Transaction[], accountId: number, budgetId: number): NormalizedTransaction[] {
    const norm = transactions.map(row => ({
        ...row,
        id_contabancaria: accountId,
        budget_id: budgetId,
        data_transacao: row.data_transacao ?? new Date(),
        recorrente: row.categoria === 'Contas',
        frequencia_recorrencia: (row.categoria === 'Contas' ? 'Mensal' : null) as 'Mensal' | null,
        proxima_ocorrencia: row.categoria === 'Contas' ? calcularProximaOcorrencia(new Date(), 'Mensal') : null
    }))
    return norm
}

export function formatTransactionMessage(transactions: Transaction[], budgetData: BudgetData): string {
    const message = transactions.map((row) => {
        const valor = formatCurrencyBRL(row.valor)
        const dataFormatada = format(new Date(row.data_transacao), 'dd/MM/yyyy');
        return `
    📌 ${row.categoria}
    Nome: ${row.nome_transacao}
    Valor: ${valor}
    Tipo: ${row.tipo}
    Natureza: ${row.natureza}
    Data: ${dataFormatada}
    `.trim();
    }).join('\n\n-------------------\n\n');
    let baseMessage = `${transactions.length > 1 ? 'Transações adicionadas' : 'Transação adicionada'}:\n\n${message}`;

    if (budgetData) {
        const remainingValue = formatRemainingBudget(transactions, budgetData)
        baseMessage += `\n\n💰 Valor restante no orçamento:\n       ${remainingValue}`;
    }

    return baseMessage
}

export function formatRemainingBudget(transactions: Transaction[], budgetData: BudgetData): string {
    const valorTransacoes = transactions.reduce(
        (acc, row) => acc + row.valor
        , 0);
    const limite = budgetData?.limite ?? 0;
    const quantia_gasta = budgetData?.quantia_gasta ?? 0;
    const valorRestante = limite - (quantia_gasta + valorTransacoes);
    const valorRestanteFormatado = formatCurrencyBRL(valorRestante)
    return valorRestanteFormatado
}

export function formatCurrencyBRL(amount: number): string {
    return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

export function formatComparisson(currentRows: GroupedCategories[], previousRows: any): string {
    const comparisonLines = currentRows.map(row => {
        const prev = previousRows[row.categoria];
        const prevTotal = prev ? Number(prev.total) : 0;
        const currentTotal = Number(row.total);

        let variationText = 'sem dados';

        if (prevTotal > 0) {
            const variation = ((currentTotal - prevTotal) / prevTotal) * 100;
            if (variation > 0) {
                variationText = `📈 Aumento de +${variation.toFixed(2)}%`;
            } else if (variation < 0) {
                variationText = `📉 Redução de ${variation.toFixed(2)}%`;
            } else {
                variationText = `sem variação`;
            }
        } else if (prevTotal === 0 && currentTotal > 0) {
            variationText = `Novo gasto registrado (+100.00%)`;
        }

        return `${row.categoria}: ${formatCurrencyBRL(currentTotal)} (${row.ocorrencias} ${row.ocorrencias > 1 ? 'transações' : 'transação'})\n${variationText}\n----------------\n`;
    });

    return comparisonLines.join('')
}

export function formatExpenseMessage(period: string, firstInterval: DateInterval, secondInterval: DateInterval, comparisonLines: string): string {

    const friendlyMessage = `Gastos de "${period}" (${formatMonth(firstInterval.start)}
        ${firstInterval.start !== firstInterval.end ? ` - ${formatMonth(firstInterval.end)}` : ''})
        VS. período anterior (${formatMonth(secondInterval.start)}
        ${secondInterval.start !== secondInterval.end ? ` - ${formatMonth(secondInterval.end)}` : ''}):\n
        \n${comparisonLines}`.trim();
    return friendlyMessage
}

export function formatMonth(date: Date): string {
    const message = `${format(new Date(date + 'T00:00:00'), 'dd/MM')}`
    return message
}