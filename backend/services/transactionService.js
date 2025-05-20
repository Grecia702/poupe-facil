
const transactionModel = require("../models/transactionModel");
const budgetModel = require("../models/budgetModel");
const goalsModel = require("../models/goalsModel");
const { calcularProximaOcorrencia } = require("../Utils/calcularOcorrencia")
const { z } = require('zod');
const { startOfMonth, subDays } = require('date-fns');

const transactionQuerySchema = z.object({
    tipo: z.string().optional().nullable()
        .transform(val => val?.toLowerCase())
        .refine(val => !val || ['despesa', 'receita'].includes(val), {
            message: "tipo inválido"
        }),
    natureza: z.string().optional().nullable()
        .transform(val => val?.toLowerCase())
        .refine(val => !val || ['fixa', 'variavel'].includes(val), {
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
    const camposObrigatorios = ['id_contabancaria', 'categoria', 'tipo', 'valor', 'natureza', 'data_transacao'];
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

    if (!dados.data_transacao) {
        dados.data_transacao = new Date()
    }
    if (dados.tipo === 'Despesa' && dados.valor <= 0) {
        throw new Error('Valor da despesa tem que ser maior ou diferente de 0 ');
    }
    if (dados.tipo === 'Receita' && dados.valor <= 0) {
        throw new Error('Valor da receita  tem que ser maior ou diferente de 0 ');
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

    let goals_id = null;
    if (goals.exists) {
        goals_id = goals.result.id
    }

    await transactionModel.CreateTransaction(
        dados.id_contabancaria,
        dados.categoria,
        dados.tipo,
        dados.valor,
        dados.data_transacao,
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

    return transacoes.rows;
};

const RemoveTransactionService = async (userId, transactionId) => {
    const transactions = await transactionModel.ReadTransaction(userId, transactionId);

    if (!transactions.exists) {
        throw new Error('Transação não encontrada');
    }

    await transactionModel.DeleteTransaction(userId, transactionId)
}


const ListTransactionsService = async (userId, query) => {
    const { page, limit, all, ...rest } = transactionQuerySchema.parse(query);
    if (all) {
        const transactions = await transactionModel.listSumTransactions(userId)
        return transactions.rows
    }
    const offset = (page - 1) * limit;
    const queryParams = { ...rest, page, limit, offset };
    const [transacoes, total] = await Promise.all([
        transactionModel.ListTransactions(userId, queryParams),
        transactionModel.countTransactionsResult(userId, queryParams)
    ])
    if (total === 0) {
        throw new Error('Nenhuma transação encontrada');
    }
    // const data = transacoes.rows.map(row => {
    //     const valor = Math.abs(row.valor)
    //     return {
    //         ...row,
    //         valor: valor
    //     }
    // });
    return {
        data: transacoes.rows,
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
    const { all, period } = transactionQuerySchema.parse(query);
    const { first_day, last_day } = query
    if (all) {
        const transactions = await transactionModel.listSumTransactions(userId,)
        const data = transactions.rows.map(row => {
            const valor = Math.abs(row.total)
            return {
                ...row,
                total: valor
            }
        });
        return data
    }

    const transactions = await transactionModel.transactionSummary(first_day, last_day, period, userId)
    if (transactions.total === 0) {
        throw new Error('Nenhuma transação encontrada');
    }

    const data = transactions.rows.map(row => {
        const valor = Math.abs(row.valor)
        return {
            ...row,
            valor: valor
        }
    });

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