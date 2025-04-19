const transactionModel = require("../models/transactionModel");
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
        return res.status(500).json({ message: 'Erro ao conectar com o banco de dados', error: error.message })
    }
}

const ReadTransaction = async (req, res) => {
    const { id } = req.params
    try {
        const Transactions = await transactionModel.ReadTransaction(id)
        const Transaction = Transactions.total > 0 ? Transactions.firstResult : null
        if (Transaction) {
            return res.status(200).json(Transaction);
        }
        else {
            return res.status(404).json({ message: "Transação não encontrada" })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao conectar com o banco de dados', error: error.message })
        // throw new Error('Erro ao se conectar ao banco de dados');
    }
}

const RemoveTransaction = async (req, res) => {
    const { id } = req.params
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
    catch (error) {
        res.status(500).json({ message: 'Erro ao conectar com o banco de dados', error: error.message })
    }
}
const UpdateTransaction = async (req, res) => {
    const { id } = req.params;
    const campos = req.body;
    try {
        if (Object.keys(campos).length === 0 || !id) {
            return res.status(400).json({ erro: 'Nenhum campo fornecido' });
        }

        transactionModel.UpdateTransaction(id, campos);
        return res.status(200).json({ message: 'Transação atualizada com sucesso' })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao conectar com o banco de dados', error: error.message })
    }
}
const ListarTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const transacoes = await transactionModel.ListTransactions(userId);
        res.json(transacoes.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao conectar com o banco de dados', error: error.message })
    }
};
module.exports = { AddTransaction, ReadTransaction, RemoveTransaction, ListarTransactions, UpdateTransaction };