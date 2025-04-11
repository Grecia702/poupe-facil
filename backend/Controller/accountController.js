const accountModel = require("../models/accountModel");
const moment = require('moment');
const jwt = require('jsonwebtoken');

const AddAccount = async (req, res) => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const { categoria, tipo, valor } = req.body
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    try {
        if (tipo === "Despesa") {
            const despesa = valor * -1;
            accountModel.CreateAccount(userId, categoria, tipo, despesa, timestamp);
            return res.status(200).json({ message: 'Despesa Cadastrada' })
        }
        else if (tipo === "Receita") {
            accountModel.CreateAccount(userId, categoria, tipo, valor, timestamp);
            return res.status(200).json({ message: 'Receita Cadastrada' })
        }
    }
    catch (err) {
        console.error("Erro ao adicionar a transação: ", err)
        return res.status(500).json({ message: 'Erro ao adicionar transação' })
    }
}

const RemoveAccount = async (req, res) => {
    const { id } = req.body
    try {
        const Transactions = await accountModel.ReadAccount(id)
        const Transaction = Transactions.total > 0 ? Transactions.firstResult : null

        if (Transaction) {
            await accountModel.DeleteAccount(id)
            console.log("Transacao Exclúida: ", id)
            return res.status(200).json({ message: 'Transação excluída com sucesso' })
        }
        if (!Transaction) {
            console.log("Transacao não encontrada: ", id)
            return res.status(404).json({ message: 'Transação não encontrada' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Não foi possivel excluir a transação' })
    }
}

const ListAccount = async (req, res) => {
    const userId = req.usuarioId
    try {
        const account = await accountModel.ListAccount(userId);
        res.json(account.rows)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'not found' })
    }
}
module.exports = { AddAccount, RemoveAccount, ListAccount };