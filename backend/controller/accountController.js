const accountModel = require("../models/accountModel");
const { CreateAccountService,
    ListAccountService,
    ListAccountByIDService,
    RemoveAccountService,
    UpdateAccountService,
    sumAccountService
} = require("../services/accountService")


const CreateAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const dados = req.body
        await CreateAccountService(dados, userId);
        return res.sendStatus(204);
    }
    catch (error) {
        console.error('Erro na criação da conta:', error.message);
        if (error.message.includes('Campos obrigatórios faltando')) {
            return res.status(400).json({
                message: 'Campos obrigatórios em branco',
                campos_faltando: error.message.split(': ')[1]
            });
        }
        if (error.message === 'Já existe uma conta com este nome') {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === 'O campo saldo deve ser um número') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
    }
}

const UpdateAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params;
        const query = req.body
        const params = req.query
        await UpdateAccountService(userId, id, query, params)
        return res.status(200).json({ message: 'Conta atualizada com sucesso' })
    }
    catch (error) {
        if (error.message === 'Conta não encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro ao fazer a requisição: ', error: error.message })
    }
}



const RemoveAccount = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params;
        const account = await RemoveAccountService(userId, id)
        if (account) {
            return res.status(204).json({ message: 'Conta excluída com sucesso' })
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
        const { first_date, last_date } = req.body
        const accounts = await ListAccountService(userId, first_date, last_date);
        return res.status(200).json(accounts)
    }
    catch (err) {
        if (err.message === 'Nenhuma conta encontrada') {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Erro interno no servidor', error: err.message });
    }
}

const FindAccountByID = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params
        const account = await ListAccountByIDService(id, userId);
        return res.status(200).json(account)
    }
    catch (err) {
        if (err.message === 'Conta não encontrada') {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Erro interno no servidor', error: err.message });
    }
}

const sumAccountController = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { last_date } = req.query
        const account = await sumAccountService(userId, last_date);
        return res.status(200).json(account)
    }
    catch (err) {
        if (err.message === 'Conta não encontrada') {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Erro interno no servidor', error: err.message });
    }
}

module.exports = { CreateAccount, UpdateAccount, RemoveAccount, ListAccount, FindAccountByID, sumAccountController };