import * as AccountModel from "./accountModel.ts";
import type { BankCreateDTO, BankUpdateDTO } from './AccountBank.d.ts'
import type { DadosBancarios, UserBalance } from "../../shared/types/bankAccount.d.ts";

const CreateAccountService = async (userId: number, dados: BankCreateDTO): Promise<void> => {
    const ContaValida = await AccountModel.AccountExists(dados.nome_conta, userId)
    if (!ContaValida) throw new Error('Já existe uma conta com este nome')
    await AccountModel.CreateAccount(userId, dados);
}

const UpdateAccountService = async (userId: number, accountId: number, updateFields: BankUpdateDTO): Promise<void> => {
    const account = await AccountModel.FindAccountByID(accountId, userId);
    if (!account) throw new Error('Conta não encontrada');
    await AccountModel.UpdateAccount(accountId, userId, updateFields);
}

const setAsPrimaryService = async (userId: number, accountId: number): Promise<void> => {
    const account = await AccountModel.FindAccountByID(accountId, userId);
    if (!account) throw new Error('Conta não encontrada');
    await AccountModel.setAsPrimary(accountId, userId)
}

const RemoveAccountService = async (userId: number, accountId: number): Promise<void> => {
    const account = await AccountModel.FindAccountByID(accountId, userId);
    if (!account) throw new Error('Conta não encontrada');
    await AccountModel.DeleteAccount(accountId, userId)
}

const ListAccountService = async (userId: number, last_date: Date): Promise<DadosBancarios[] | []> => {
    const account = await AccountModel.ListAllAccounts(userId, last_date);
    if (!account) return []
    return account
}

const ListAccountByIDService = async (userId: number, accountId: number): Promise<DadosBancarios> => {
    const account = await AccountModel.FindAccountByID(accountId, userId);
    if (!account) throw new Error('Conta não encontrada');
    return account
};

const sumAccountService = async (userId: number, last_date: Date): Promise<UserBalance> => {
    const account = await AccountModel.getSumAccounts(userId, last_date);
    if (!account) {
        const data = {
            saldo_total: 0,
            despesa: 0,
            receita: 0,
            balanco_geral: 0
        };
        return data
    }

    return account;
};

export {
    CreateAccountService,
    ListAccountService,
    UpdateAccountService,
    RemoveAccountService,
    ListAccountByIDService,
    sumAccountService
};