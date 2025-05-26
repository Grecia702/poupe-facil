
const transactionModel = require("../models/transactionModel");
const budgetModel = require("../models/budgetModel");
const goalsModel = require("../models/goalsModel");
const { calcularProximaOcorrencia } = require("../Utils/calcularOcorrencia")
const { z } = require('zod');
const { startOfMonth, subDays, subMonths, endOfMonth } = require('date-fns');

const transactionQuerySchema = z.object({
    tipo: z.string().optional().nullable()
        .transform(val => val?.toLowerCase())
        .refine(val => !val || ['despesa', 'receita'].includes(val), {
            message: "tipo inválido"
        }),
    natureza: z.string().optional().nullable()
        .transform(val => val?.toLowerCase())
        .refine(val => !val || ['Fixa', 'Variavel'].includes(val), {
            message: "natureza inválida"
        }),
    orderBy: z.enum(['valor', 'data_transacao', 'tipo', 'natureza', 'transaction_id']).default('transaction_id'),
    orderDirection: z.enum(['ASC', 'DESC']).default('DESC'),
    limit: z.coerce.number().int().min(1).max(100).default(15),
    page: z.coerce.number().int().min(0).default(1),
    all: z.string().optional().transform((val) => val === "true").default("false").transform((val) => val === true),
    period: z.enum(['week', 'month', 'day', 'year']).default('week')
});



const validarCamposObrigatorios = (dados) => {
    const camposObrigatorios = ['id_contabancaria', 'categoria', 'tipo', 'valor', 'natureza'];
    const camposFaltando = camposObrigatorios.filter(campo => !dados[campo]);

    if (camposFaltando.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(', ')}`);
    }
};


const validarFrequenciaRecorrencia = (frequencia) => {
    const frequenciasValidas = ['Diario', 'Semanal', 'Quinzenal', 'Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Quadrimestral', 'Anual'];
    if (frequenciasValidas.indexOf(frequencia) === -1) {
        throw new Error('Frequência de recorrência inválida. As opções válidas são: diário, semanal, quinzenal, mensal, anual.');
    }
};


const CreateTransactionService = async (dados, userId) => {

    validarCamposObrigatorios(dados);
    if (dados.valor <= 0) {
        throw new Error('Valor da transação tem que ser maior ou diferente de 0 ');
    }
    if (dados.tipo === 'Despesa') {
        dados.valor *= -1
    }

    if (dados.natureza === 'Fixa') {
        dados.recorrente = true;

        if (!dados.frequencia_recorrencia) {
            throw new Error('Transações fixas devem ter frequência definida');
        }
        validarFrequenciaRecorrencia(dados.frequencia_recorrencia);

        dados.proxima_ocorrencia = calcularProximaOcorrencia(dados.data_transacao, dados.frequencia_recorrencia);
    }
    else {
        dados.recorrente = false
        dados.frequencia_recorrencia = null
        dados.proxima_ocorrencia = null
    }


    const contaValida = await transactionModel.checkValidAccount(dados.id_contabancaria, userId);

    if (!contaValida) throw new Error('Conta inválida');

    const { result, exists } = await budgetModel.checkValidDate(dados.data_transacao, userId)

    let budget_id = null;
    if (exists) {
        budget_id = result.id
    }

    const goals = await goalsModel.checkActiveGoal(userId)

    console.log(goals)

    let goals_id = null;
    if (goals.exists) {
        goals_id = goals.result.id
    }

    console.log(goals_id)

    await transactionModel.CreateTransaction(
        dados.id_contabancaria,
        dados.categoria,
        dados.tipo,
        dados.valor,
        dados.natureza,
        dados.recorrente,
        dados.frequencia_recorrencia,
        dados.proxima_ocorrencia,
        budget_id,
        goals_id
    );
};

const getTransactionByID = async (userId, transactionId) => {
    const transacoes = await transactionModel.ReadTransaction(userId, transactionId);
    if (transacoes.rows.length === 0) {
        throw new Error('Nenhuma transação com essa ID foi encontrada');
    }

    const data = {
        ...transacoes.result,
        valor: parseFloat(transacoes.result.valor)
    }

    return data;
};

const RemoveTransactionService = async (userId, transactionId) => {
    const transactions = await transactionModel.ReadTransaction(userId, transactionId);

    if (!transactions.exists) {
        throw new Error('Transação não encontrada');
    }

    await transactionModel.DeleteTransaction(userId, transactionId)
}


const ListTransactionsService = async (userId, query) => {
    const { page, limit, ...rest } = transactionQuerySchema.parse(query);
    const offset = (page - 1) * limit;
    const queryParams = { ...rest, page, limit, offset };
    const [transacoes, total] = await Promise.all([
        transactionModel.ListTransactions(userId, queryParams),
        transactionModel.countTransactionsResult(userId, queryParams)
    ])

    const transactionData = transacoes.rows.map((item) => ({
        ...item,
        valor: Math.abs(parseFloat((item.valor)))
    }))

    return {
        data: transactionData,
        meta: {
            total: total,
            page: page,
            limit: limit,
            hasNextPage: offset + limit < total,
        },
    };
};

const GroupTransactionService = async (userId) => {
    try {
        const transacoes = await transactionModel.GroupTransactionsByType(userId);
        if (transacoes.total === 0) {
            throw new Error('Nenhuma transação foi encontrada');
        }
        const data = transacoes.rows.map(row => ({
            tipo: row.tipo,
            natureza: row.natureza,
            ocorrencias: Number(row.ocorrencias),
            valor: Math.abs(parseFloat(row.valor))
        }));
        return data;
    } catch (error) {
        throw error;
    }

};

const GroupCategoriesService = async (userId, query) => {
    const { first_date, last_date } = query
    const transacoes = await transactionModel.GroupTransactionsByCategories(userId, first_date, last_date);
    const data = transacoes.rows.map(row => ({
        ...row,
        ocorrencias: parseInt(row.ocorrencias),
        total: Math.abs(row.total)
    }));
    return data;
};


const transactionSummaryService = async (userId, query) => {
    const { period, all } = transactionQuerySchema.parse(query);
    const { first_day, last_day } = query

    const transactions = await transactionModel.transactionSummary(first_day, last_day, period, userId)
    if (transactions.total === 0) {
        throw new Error('Nenhuma transação encontrada');
    }

    console.log(transactions)

    const data = transactions.rows.map(row => ({
        ...row,
        valor: Math.abs(row.valor),
    }));

    const [actualMonthTotal, lastMonthTotal] = await Promise.all([
        transactionModel.transactionSummaryTotal(first_day, last_day, userId),
        transactionModel.transactionSummaryTotal(
            startOfMonth(subMonths(first_day, 1)),
            endOfMonth(subMonths(first_day, 1)),
            userId
        )
    ]);

    const actualMonthResult = actualMonthTotal.result.reduce((acc, item) => {
        acc[item.tipo] = Number(item.valor);
        return acc;
    }, { despesa: 0, receita: 0 });

    const lastMonthResult = lastMonthTotal.result.reduce((acc, item) => {
        acc[item.tipo] = Number(item.valor);
        return acc;
    }, { despesa: 0, receita: 0 });


    console.log('total despesas atuais', actualMonthResult.despesa, 'total despesas antigas', lastMonthResult.despesa)
    // console.log(actualMonthResult.receita, lastMonthResult.receita)

    const variacao = {
        despesa: (((actualMonthResult.despesa - lastMonthResult.despesa) / lastMonthResult.despesa) * 100).toFixed(2),
        receita: (((actualMonthResult.receita - lastMonthResult.receita) / lastMonthResult.receita) * 100).toFixed(2)
    }

    console.log('total despesas atuais', actualMonthResult.despesa, 'total despesas antigas', lastMonthResult.despesa)
    console.log('total receitas atuais', actualMonthResult.receita, 'total receitas antigas', lastMonthResult.receita)

    console.log('porcentagem despesa', variacao.despesa)
    console.log('porcentagem receita', variacao.receita)

    if (period === 'week') {
        const groupedData = data.reduce((acc, item) => {
            const week = `S${item.name_interval}`;
            const tipo = item.tipo;
            const valor = item.valor;
            if (!acc[week]) {
                acc[week] = { despesa: 0, receita: 0, date_interval: item.date_interval };
            }
            acc[week][tipo] += valor;

            return acc;
        }, {});

        const chartData = Object.entries(groupedData).map(([week, values]) => ({
            week,
            date_interval: new Date(values.date_interval),
            despesa: values.despesa,
            receita: values.receita,
        }))
        return {
            data: chartData,
            total: actualMonthResult,
            percent: variacao
        }
    }
    return data
};



module.exports = {
    CreateTransactionService,
    ListTransactionsService,
    RemoveTransactionService,
    getTransactionByID,
    GroupTransactionService,
    GroupCategoriesService,
    transactionSummaryService
};