import { normalizeTransactions, formatTransactionMessage } from "./chatbotUtils.ts";
import { CreateManyTransactionService } from "../transactions/transactionService.ts";
import { BadGatewayError, UnprocessableEntityError } from "../../core/utils/errorTypes.ts";
import { GroupTransactionsByCategories } from "../transactions/transactionModel.ts";
import { formatComparisson, formatCurrencyBRL, formatExpenseMessage } from "./chatbotUtils.ts";
import type { ChatCompletionMessageFunctionToolCall } from "openai/resources/index";
import type { DadosBancarios } from "../../shared/types/bankAccount.js";
import type { Transaction, GroupedCategories } from '../../shared/types/transaction.d.ts'
import type { BudgetData } from '../../shared/types/budget.d.ts'
import type { KvCategories, OverviewArgs, TransactionArgs } from "./chatbot";

export const createManyTransactions = async (accountData: DadosBancarios, budgetData: BudgetData, args: TransactionArgs) => {
    const { transactions } = args;
    if (!args || !transactions) {
        throw new BadGatewayError('Erro ao comunicar com serviço de IA')
    }

    const normalized = normalizeTransactions(transactions, accountData.id, budgetData.id)
    const queryResult = await CreateManyTransactionService(normalized, accountData.id_usuario);
    const createdMessage = formatTransactionMessage(normalized, budgetData)
    return ({
        command: 'createManyTransactions',
        rawData: queryResult,
        message: createdMessage,
    });
}

export const transactionsOverview = async (args: OverviewArgs, userId: number) => {
    const { period, firstInterval, secondInterval } = args;
    if (!args || !period || !firstInterval || !secondInterval) {
        throw new BadGatewayError('Erro ao comunicar com serviço de IA no service')
    }
    const [currentRows, previousRows] = await Promise.all([
        GroupTransactionsByCategories(userId, firstInterval.start, firstInterval.end),
        GroupTransactionsByCategories(userId, secondInterval.start, secondInterval.end)
    ]);
    if (!currentRows || currentRows.length === 0) {
        throw new UnprocessableEntityError(`Nenhuma transação encontrada neste período.`)
    }
    const previousMap = (previousRows ?? []).reduce((acc, row) => {
        acc[row.categoria] = row;
        return acc;
    }, {} as KvCategories);

    const comparisonLines = formatComparisson(currentRows, previousMap)
    const analysisMessage = formatExpenseMessage(period, firstInterval, secondInterval, comparisonLines)
    const sortedCurrent = [...currentRows].sort((a, b) => Number(b.total) - Number(a.total));
    const maiorGasto = sortedCurrent[0] as GroupedCategories;
    const destaqueMessage = `Destaque do maior gasto:` +
        `- ${maiorGasto?.categoria}: ${formatCurrencyBRL(maiorGasto.total)} (${maiorGasto?.ocorrencias}x)`.trim();

    return ({
        command: 'transactionSummary',
        current_period: currentRows,
        previous_rows: previousRows,
        message: `${analysisMessage}\n\n${destaqueMessage}`,
    });
}

export const prompts = (memory: string) => {
    const today = new Date()
    return [
        {
            type: "function" as const,
            function: {
                name: "createManyTransactions",
                description: `Cria transações. Ex: 'Gastei 90 no mercado ontem'. Data atual: ${today}`,
                parameters: {
                    type: "object",
                    properties: {
                        transactions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    nome_transacao: { type: "string" },
                                    valor: { type: "number" },
                                    categoria: {
                                        type: "string",
                                        enum: ["Lazer", "Transporte", "Educação", "Alimentação", "Contas", "Compras", "Saúde", "Outros"]
                                    },
                                    tipo: { type: "string", enum: ["Despesa", "Receita"] },
                                    data_transacao: { type: "string" }
                                },
                                required: ["nome_transacao", "valor", "categoria", "tipo"]
                            }
                        }
                    },
                    required: ["transactions"]
                }
            }
        },
        {
            type: "function" as const,
            function: {
                name: "transactionSummary",
                description: `Resumo de gastos em período. Ex: 'quanto gastei semana passada'. Data atual: ${today}`,
                parameters: {
                    type: "object",
                    properties: {
                        period: { type: "string" },
                        firstInterval: {
                            type: "object",
                            properties: {
                                start: { type: "string" },
                                end: { type: "string" }
                            },
                        },
                        secondInterval: {
                            type: "object",
                            properties: {
                                start: { type: "string" },
                                end: { type: "string" }
                            },
                        }
                    },
                    required: ["firstInterval", "secondInterval"]
                }
            }
        },
    ]
}