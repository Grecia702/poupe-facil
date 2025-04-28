const accountModel = require("../models/accountModel");
const moment = require('moment');

const CreateAccount = async (req, res) => {
    const timestamp = moment().format('YYYY-MM-DD');
    try {
        const { nome_conta, saldo, desc_conta } = req.body
        const { userId } = req.user.decoded
        const Contas = await accountModel.ReadAccount(nome_conta, 'nome_conta')
        const ContaExiste = Contas.total > 0

        if (!nome_conta) {
            return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
        }

        if (ContaExiste) {
            return res.status(400).json({ message: 'Já existe uma conta com este nome' })
        }

        if (!saldo && saldo !== 0) {
            throw new Error("O campo 'saldo' é obrigatório.");
        }

        accountModel.CreateAccount(userId, nome_conta, timestamp, saldo, desc_conta);
        return res.status(200).json({ message: 'Conta Cadastrada' })
    }
    catch (err) {
        console.error("Erro ao adicionar a conta: ", err)
        return res.status(500).json({ message: 'Erro ao adicionar conta' })
    }
}

const RemoveAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params;
        const account = await accountModel.ListAccount(id, userId)
        const ContaExiste = account.total > 0

        if (ContaExiste) {
            await accountModel.DeleteAccount(id)
            console.log("Conta Exclúida: ", id)
            return res.status(200).json({ message: 'Conta excluída com sucesso' })
        }
        else {
            return res.status(404).json({ message: 'Conta não encontrada' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Não foi possivel excluir a conta' })
    }
}

const ListAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const account = await accountModel.ListAllAccounts(userId);
        return res.json(account.rows)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'not found' })
    }
}

const FindAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params
        const account = await accountModel.FindAccountByID(id, userId);
        const contaEncontrada = account.total > 0 ? account.firstResult : null
        if (contaEncontrada) {
            return res.status(200).json(account.rows)
        }
        else {
            return res.status(404).json({ message: 'Conta não encontrada' })
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Erro na requisição', error: err.message })
    }
}

const ListTransactionsByAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params
        const account = await accountModel.ListTransactionsByAccount(id, userId);
        const contaEncontrada = account.total > 0 ? account.firstResult : null
        if (contaEncontrada) {
            return res.status(200).json(account.rows)
        }
        else {
            return res.status(404).json({ message: 'Conta não encontrada' })
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Erro na requisição', error: err.message })
    }
}
module.exports = { CreateAccount, RemoveAccount, ListAccount, FindAccount, ListTransactionsByAccount };