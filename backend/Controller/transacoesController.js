const transactionModel = require("../models/transactionModel");
const moment = require('moment');


const AddTransaction = async (req, res) => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const { id_contabancaria, categoria, valor, natureza } = req.body
    const { userId } = req.user.decoded

    const tipo = "Despesa"
    try {
        if (!categoria || !valor || !natureza || !id_contabancaria) {
            return res.status(400).json({ message: 'Campos Obrigatórios vazios' })
        }
        const validAccount = await transactionModel.checkValidAccount(id_contabancaria, userId)
        if (!validAccount) {
            return res.status(400).json({ message: 'Conta invalida' })
        }
        if (tipo === "Despesa") {
            const despesa = valor * -1;
            transactionModel.CreateTransaction(id_contabancaria, categoria, tipo, valor, timestamp, natureza);
            console.log('Despesa Cadastrada pelo usuario, ', userId)
            return res.status(200).json({ message: 'Despesa Cadastrada' })
        }
        else if (tipo === "Receita") {
            transactionModel.CreateTransaction(id_contabancaria, categoria, tipo, valor, timestamp, natureza);
            console.log('Receita Cadastrada pelo usuario, ', userId)
            return res.status(200).json({ message: 'Receita Cadastrada' })
        }
    }
    catch (err) {
        console.error("Erro ao adicionar a transação: ", err)
        return res.status(500).json({ message: 'Erro ao conectar com o banco de dados', error: err.message })
    }
}

const ReadTransaction = async (req, res) => {
    try {
        const { id } = req.params
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
        const { userId } = req.user.decoded
        const transacoes = await transactionModel.ListTransactions(userId);
        res.json(transacoes.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao conectar com o banco de dados', error: error.message })
    }
};
module.exports = { AddTransaction, ReadTransaction, RemoveTransaction, ListarTransactions, UpdateTransaction };