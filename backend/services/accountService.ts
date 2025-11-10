import * as AccountModel from "../models/accountModel.ts";
import type { DadosBancarios, ContaCreate, ContaUpdate, UserBalance } from '../types/AccountBank.ts'

const validarCamposObrigatorios = (dados: ContaCreate) => {
    const camposObrigatorios: (keyof ContaCreate)[] = ['nome_conta', 'saldo', 'tipo_conta', 'icone'];
    const camposFaltando = camposObrigatorios.filter(campo => !dados[campo]);

    if (camposFaltando.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(', ')}`);
    }
};

const CreateAccountService = async (userId: string, dados: ContaCreate): Promise<void> => {
    validarCamposObrigatorios(dados);
    if (typeof dados.saldo !== 'number') throw new Error('O campo saldo deve ser um número')
    const ContaValida = await AccountModel.AccountExists(dados.nome_conta, userId)
    if (ContaValida) throw new Error('Já existe uma conta com este nome')
    await AccountModel.CreateAccount(userId, dados);
}

const UpdateAccountService = async (userId: string, accountId: string, updateFields: ContaUpdate): Promise<void> => {
    const account = await AccountModel.FindAccountByID(accountId, userId);
    if (!account) throw new Error('Conta não encontrada');
    await AccountModel.UpdateAccount(accountId, userId, updateFields);
}

const setAsPrimaryService = async (userId: string, accountId: string): Promise<void> => {
    const account = await AccountModel.FindAccountByID(userId, accountId);
    if (!account) throw new Error('Conta não encontrada');
    await AccountModel.setAsPrimary(userId, accountId)
}

const RemoveAccountService = async (userId: string, accountId: string): Promise<void> => {
    const account = await AccountModel.FindAccountByID(userId, accountId)
    if (!account) throw new Error('Conta não encontrada');
    await AccountModel.DeleteAccount(userId, accountId)
}

const ListAccountService = async (userId: string, last_date: Date): Promise<DadosBancarios[] | []> => {
    const account = await AccountModel.ListAllAccounts(userId, last_date);
    if (!account) return []
    return account
}

const ListAccountByIDService = async (userId: string, accountId: string): Promise<DadosBancarios | null> => {
    const account = await AccountModel.FindAccountByID(userId, accountId);
    if (!account) throw new Error('Conta não encontrada');
    return account
};

const sumAccountService = async (userId: string, last_date: Date): Promise<UserBalance | {}> => {
    const account = await AccountModel.getSumAccounts(userId, last_date);
    if (!account) return {}
    const data = {
        saldo_total: parseFloat(account.saldo_total),
        despesa: Math.abs(parseFloat(account.despesa)),
        receita: parseFloat(account.receita),
        balanco_geral: parseFloat(account.balanco_geral)
    };
    return data;
};

export {
    CreateAccountService,
    ListAccountService,
    UpdateAccountService,
    RemoveAccountService,
    ListAccountByIDService,
    sumAccountService
};