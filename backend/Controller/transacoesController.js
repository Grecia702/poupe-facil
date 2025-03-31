const transactionModel = require("../Model/transactionModel");
const moment = require('moment');
const jwt = require('jsonwebtoken');

const AddTransaction = async (req, res) => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const { categoria, tipo, valor } = req.body
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    console.log()
    try {
        if (tipo === "Despesa") {
            const despesa = valor * -1;
            transactionModel.CreateTransaction(userId, categoria, tipo, despesa, timestamp);
            return res.status(200).json({ message: 'Despesa Cadastrada' })
        }
        else if (tipo === "Receita") {
            transactionModel.CreateTransaction(userId, categoria, tipo, valor, timestamp);
            return res.status(200).json({ message: 'Receita Cadastrada' })
        }
    }
    catch (err) {
        console.error("Erro ao adicionar a transação: ", err)
        return res.status(500).json({ message: 'Erro ao adicionar transação' })
    }
}

const RemoveTransaction = async (req, res) => {
    const { id } = req.body
    try {
        const Transactions = await transactionModel.ReadTransaction(id)
        const Transaction = Transactions.total > 0 ? Transactions.firstResult : null

        if (Transaction) {
            await transactionModel.DeleteTransaction(id)
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

const ListarTransactions = async (req, res) => {
    const userId = req.usuarioId
    try {
        const transacoes = await transactionModel.ListTransactions(userId);
        res.json(transacoes.rows)
    }
    catch (err) {
        return res.status(500).json({ message: 'not found' })
    }
}
module.exports = { AddTransaction, RemoveTransaction, ListarTransactions };