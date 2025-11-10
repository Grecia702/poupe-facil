import type { Request, Response, NextFunction } from "express";
import * as TransactionService from "../services/transactionService.ts"
import { transactionCreateSchema, transactionQuerySchema, transactionsCreateSchema, querySchema, dateParamsSchema } from '../schemas/transaction.schema.ts'
import type { UpdateTransactionData } from "../types/transaction.js";


const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const dados = req.body
        const transactionDTO = transactionCreateSchema.parse({ ...dados })
        await TransactionService.CreateTransactionService(transactionDTO, userId);
        res.status(200).json({ message: 'Transação criada com sucesso' });
    } catch (error) {
        next(error)
    }
}

const createManyTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const { transactions } = req.body
        const dataToValidate = Array.isArray(transactions)
            ? transactions.map(t => ({ ...t, id_usuario: userId }))
            : { ...transactions, id_usuario: userId };

        const transactionsDTO = transactionsCreateSchema.parse(dataToValidate);
        await TransactionService.CreateManyTransactionService(transactionsDTO);
        return res.status(200).json({ message: 'Transações criada com sucesso' });
    } catch (error) {
        next(error)
    }
}

const readTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const { userId } = req.user
        const transacoes = await TransactionService.getTransactionByID(userId, id);
        res.status(200).json(transacoes);
    }
    catch (error) {
        next(error)
    }
}

const removeTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params)
        const { userId } = req.user
        await TransactionService.RemoveTransactionService(userId, id)
        return res.status(200).json({ message: 'Transação excluída com sucesso' });
    }
    catch (error) {
        next(error)
    }
}

const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const id = Number(req.params.id)
        const query: UpdateTransactionData = req.body
        await TransactionService.UpdateTransactionService(userId, id, query)
        res.status(200).json({ message: 'Transação atualizada com sucesso' })
    } catch (error) {
        next(error)
    }
}

const listTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const query = querySchema.parse(req.query);
        const transacoes = await TransactionService.ListTransactionsService(userId, query);
        res.status(200).json(transacoes);
    } catch (error) {
        next(error)
    }
};

const groupTransactionsByType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const transacoes = await TransactionService.GroupTransactionByTypeService(userId);
        res.status(200).json(transacoes);
    } catch (error) {
        next(error)
    }
};

const groupCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user;
        const query = req.query
        const transacoes = await TransactionService.GroupCategoriesService(userId, query);
        res.status(200).json(transacoes);
    } catch (error) {
        next(error)
    }
};

const transactionSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user;
        const query = dateParamsSchema.parse(req.query)
        const transacoes = await TransactionService.transactionSummaryService(userId, query);
        res.status(200).json(transacoes);
    } catch (error) {
        next(error)
    }
};

export {
    createTransaction,
    createManyTransaction,
    readTransaction,
    removeTransaction,
    listTransactions,
    updateTransaction,
    groupTransactionsByType,
    groupCategories,
    transactionSummary
};