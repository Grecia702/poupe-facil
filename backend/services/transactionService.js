
const transactionModel = require("../models/transactionModel");


const validarCamposObrigatorios = (dados) => {
    const camposObrigatorios = ['id_contabancaria', 'categoria', 'tipo', 'valor', 'natureza', 'data_transacao'];
    const camposFaltando = camposObrigatorios.filter(campo => !dados[campo]);

    if (camposFaltando.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(', ')}`);
    }
};


const validarFrequenciaRecorrencia = (frequencia) => {
    const frequenciasValidas = ['diario', 'semanal', 'quinzenal', 'mensal', 'bimestral', 'trimestral', 'semestral', 'quadrimestral', 'anual'];
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

    if (dados.tipo === 'Despesa') {
        dados.valor = -Math.abs(dados.valor);
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

    console.log(dados)

    await transactionModel.CreateTransaction(
        dados.id_contabancaria,
        dados.categoria,
        dados.tipo,
        dados.valor,
        dados.data_transacao,
        dados.natureza,
        dados.recorrente,
        dados.frequencia_recorrencia,
        dados.proxima_ocorrencia
    );
};

// No service
const getTransactionByID = async (userId, transactionId) => {
    try {
        const transacoes = await transactionModel.ReadTransaction(userId, transactionId);
        if (transacoes.rows.length === 0) {
            throw new Error('Nenhuma transação com essa ID foi encontrada');
        }

        return transacoes.rows;
    } catch (error) {
        throw error;
    }
};


const ListTransactionsService = async (userId) => {
    try {
        const transacoes = await transactionModel.ListTransactions(userId);
        return transacoes.rows;
    } catch (error) {
        throw new Error('Erro ao listar transações');
    }
};

module.exports = { CreateTransactionService, ListTransactionsService, getTransactionByID };
