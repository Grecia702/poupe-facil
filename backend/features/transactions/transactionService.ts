
import * as transactionModel from "./transactionModel.ts";
import * as budgetModel from "../budgets/budgetModel.ts";
import { calcularProximaOcorrencia } from "../../core/utils/calcularOcorrencia.ts"
import { startOfMonth, subDays, subMonths, endOfMonth } from 'date-fns';
import { NotFoundError, UnprocessableEntityError } from '../../core/utils/errorTypes.ts'
import type {
    CreateTransactionData,
    DateParams,
    GetTransactionData,
    GroupedByType,
    GroupedCategories,
    PaginatedTransaction,
    PaginationQueryParams,
    TransactionList,
    TransactionSummary,
    UpdateTransactionData
} from "./transaction.js";


const getMonth = (date: Date) => ({
    start: startOfMonth(subMonths(date, 1)),
    end: endOfMonth(subMonths(date, 1))
})

const getTotals = (result: any[]) => {
    return result.reduce((acc, item) => {
        acc[item.tipo] = Math.abs(Number(item.valor));
        return acc;
    }, { despesa: 0, receita: 0 });
};

const getVariation = (current: any, previous: any) => {
    const calculatePercentage = (currentValue: number, previousValue: number): string => {
        if (previousValue === 0) {
            if (currentValue === 0) {
                return "0.00";
            }
            return "100.00";
        }
        const variation = ((currentValue - previousValue) / previousValue) * 100;
        return variation.toFixed(2);
    }

    return {
        despesa: calculatePercentage(current.despesa, previous.despesa),
        receita: calculatePercentage(current.receita, previous.receita)
    }
}

const groupByWeek = (data: any[]) => {
    const grouped = data.reduce((acc, item) => {
        const week = `S${item.name_interval}`;

        if (!acc[week]) {
            acc[week] = { despesa: 0, receita: 0, date_interval: item.date_interval };
        }
        acc[week][item.tipo] += item.valor;

        return acc;
    }, {});

    return Object.entries(grouped).map(([week, values]: [string, any]) => ({
        week,
        date_interval: values.date_interval,
        despesa: values.despesa,
        receita: values.receita,
    }));
};

const CreateTransactionService = async (dados: CreateTransactionData, id_usuario: number): Promise<void> => {
    if (dados.valor <= 0) throw new Error('Valor da transação tem que ser maior ou diferente de 0 ');

    if (dados.tipo === 'Despesa') {
        dados.valor = -Math.abs(dados.valor)
    }

    if (dados.natureza === 'Fixa') {
        dados.recorrente = true;

        if (!dados.frequencia_recorrencia) throw new Error('Transações fixas devem ter frequência definida');
        dados.proxima_ocorrencia = calcularProximaOcorrencia(dados.data_transacao, dados.frequencia_recorrencia);
    }
    else {
        dados.recorrente = false
        dados.frequencia_recorrencia = undefined
        dados.proxima_ocorrencia = undefined
    }

    const [contaValida, { result, exists }] = await Promise.all([
        transactionModel.checkValidAccount(dados.id_contabancaria, id_usuario),
        budgetModel.checkValidDate(dados.data_transacao, id_usuario)
    ]);

    if (!contaValida) throw new Error('Conta inválida');

    let budget_id = null;
    if (exists && dados.tipo === 'Despesa') {
        budget_id = result.id
    }

    const transactionDTO: CreateTransactionData = {
        id_contabancaria: dados.id_contabancaria,
        nome_transacao: dados.nome_transacao,
        categoria: dados.categoria,
        subcategoria: dados.subcategoria,
        data_transacao: dados.data_transacao,
        tipo: dados.tipo,
        valor: dados.valor,
        natureza: dados.natureza,
        recorrente: dados.recorrente,
        frequencia_recorrencia: dados.frequencia_recorrencia,
        proxima_ocorrencia: dados.proxima_ocorrencia,
        budget_id: budget_id
    }

    await transactionModel.CreateTransaction(transactionDTO);
};

const CreateManyTransactionService = async (transactions: CreateTransactionData[], userId: number): Promise<void> => {

    const transactionsArray = Array.isArray(transactions) ? transactions : [transactions];
    const updatedTransactions: CreateTransactionData[] = [];

    for (const transaction of transactionsArray) {
        if (transaction.tipo === 'Despesa') {
            transaction.valor = -Math.abs(transaction.valor);
        }
        const contaValida = await transactionModel.checkValidAccount(transaction.id_contabancaria, userId);
        if (!contaValida) throw new Error('Conta inválida');
        updatedTransactions.push(transaction);
    }
    const manyTransactions = await transactionModel.CreateManyTransactions(updatedTransactions);
    console.log(manyTransactions)
};

const getTransactionByID = async (id_usuario: number, id_transacao: number): Promise<GetTransactionData | null> => {
    const transacoes = await transactionModel.ReadTransaction(id_usuario, id_transacao);
    if (!transacoes) throw new NotFoundError('Nenhuma transação com essa ID foi encontrada');
    return transacoes;
};

const RemoveTransactionService = async (id_usuario: number, id_transacao: number): Promise<void> => {

    const transactions = await transactionModel.ReadTransaction(id_usuario, id_transacao);

    if (!transactions) throw new NotFoundError('Transação não encontrada');


    await transactionModel.DeleteTransaction(id_usuario, id_transacao)
}

const UpdateTransactionService = async (id_usuario: number, id_transacao: number, fields: UpdateTransactionData): Promise<void> => {

    const result = await transactionModel.ReadTransaction(id_usuario, id_transacao)

    if (!result) throw new NotFoundError('Transação não encontrada')

    if (fields.valor) {
        fields.valor = result.tipo === 'Despesa' && result.valor > 0 ? -Math.abs(Number(fields.valor)) : Math.abs(Number(fields.valor));
    }

    await transactionModel.UpdateTransaction(id_usuario, id_transacao, fields);
}

const ListTransactionsService = async (id_usuario: number, query: PaginationQueryParams): Promise<PaginatedTransaction | []> => {
    const { page, limit, orderBy, orderDirection, filters } = query;
    const offset = (page - 1) * limit;
    const queryParams = { orderBy, orderDirection, page, limit, offset, ...filters };
    const transacoes = await transactionModel.ListTransactions(id_usuario, queryParams)
    if (!transacoes) return []
    return transacoes
};

const GroupTransactionByTypeService = async (userId: number): Promise<GroupedByType[]> => {
    const transacoes = await transactionModel.GroupTransactionsByType(userId);
    if (!transacoes) return []
    return transacoes
};

const GroupCategoriesService = async (id_usuario: number, query: DateParams): Promise<GroupedCategories[] | null> => {
    const { first_day, last_day } = query
    if (!(first_day instanceof Date) || !(last_day instanceof Date)) {
        throw new UnprocessableEntityError("Datas inválidas");
    }


    const transacoes = await transactionModel.GroupTransactionsByCategories(id_usuario, first_day, last_day);
    if (!transacoes) return []
    return transacoes
};

const transactionSummaryService = async (userId: number, query: DateParams): Promise<TransactionSummary | null> => {
    const { period, first_day, last_day } = query;

    const transactions = await transactionModel.transactionSummary(first_day, last_day, period, userId)
    if (!transactions) throw new NotFoundError('Nenhuma transação encontrada');

    const data = transactions.map(row => ({
        ...row,
        valor: Math.abs(row.valor),
    }));

    const prevMonth = getMonth(first_day);

    const [actualMonth, lastMonth] = await Promise.all([
        transactionModel.transactionSummaryTotal(first_day, last_day, userId),
        transactionModel.transactionSummaryTotal(prevMonth.start, prevMonth.end, userId)
    ]);

    const current = getTotals(actualMonth.rows)
    const previous = getTotals(lastMonth.rows)
    const variation = getVariation(current, previous)

    if (period === 'week') {
        return {
            data: groupByWeek(data),
            total: current,
            percent: variation
        };
    }
    return data
};

export {
    CreateTransactionService,
    CreateManyTransactionService,
    ListTransactionsService,
    UpdateTransactionService,
    RemoveTransactionService,
    getTransactionByID,
    GroupTransactionByTypeService,
    GroupCategoriesService,
    transactionSummaryService
};