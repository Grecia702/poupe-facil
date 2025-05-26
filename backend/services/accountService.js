const accountModel = require("../models/accountModel");
const userModel = require("../models/userModel");

const validarCamposObrigatorios = (dados) => {
    const camposObrigatorios = ['nome_conta', 'saldo', 'tipo_conta', 'icone'];
    const camposFaltando = camposObrigatorios.filter(campo => !dados[campo]);

    if (camposFaltando.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(', ')}`);
    }
};

const CreateAccountService = async (dados, userId) => {

    validarCamposObrigatorios(dados);
    if (typeof dados.saldo !== 'number') {
        throw new Error('O campo saldo deve ser um número')
    }

    const ContaValida = await accountModel.AccountExists(dados.nome_conta, userId)
    if (ContaValida) {
        throw new Error('Já existe uma conta com este nome')
    }
    await accountModel.CreateAccount(userId, dados.nome_conta, dados.data_criacao, dados.saldo, dados.tipo_conta, dados.icone, dados.desc_conta);
}

const UpdateAccountService = async (userId, account_id, queryParams) => {
    const account = await accountModel.FindAccountByID(account_id, userId);
    if (!account.exists) {
        throw new Error('Conta não encontrada');
    }
    await accountModel.UpdateAccount(userId, account_id, queryParams);
}

const RemoveAccountService = async (userId, id) => {
    const account = await accountModel.FindAccountByID(id, userId)
    const ContaExiste = account.total > 0

    if (ContaExiste) {
        await accountModel.DeleteAccount(id, userId)
        console.log("Conta Excluída: ", id)
        return true
    }
    else {
        throw new Error('Conta não encontrada')
    }
}

const ListAccountService = async (userId, first_date, last_date) => {
    const account = await accountModel.ListAllAccounts(userId, first_date, last_date);
    const data = account.rows.map(item => ({
        ...item,
        saldo: parseFloat(item.saldo)
    }));
    return data
}

const ListAccountByIDService = async (AccountId, userId) => {
    const account = await accountModel.FindAccountByID(AccountId, userId);
    if (!account.rows || account.rows.length === 0) {
        throw new Error('Conta não encontrada');
    }
    return account.rows;
};

const sumAccountService = async (userId, last_date) => {
    const { result } = await userModel.getCreatedAt(userId)
    const account = await accountModel.getSumAccounts(userId, result.created_at, last_date);

    const data = {
        saldo_total: parseFloat(account.result.saldo_total),
        despesa: Math.abs(parseFloat(account.result.despesa)),
        receita: parseFloat(account.result.receita),
        balanco_geral: parseFloat(account.result.balanco_geral)
    };
    return data;
};

module.exports = {
    CreateAccountService,
    ListAccountService,
    UpdateAccountService,
    RemoveAccountService,
    ListAccountByIDService,
    ListAccountByIDService,
    sumAccountService
};