import type { Request, Response, NextFunction } from "express";
import * as TransactionService from "./transactionService.ts"
import { transactionCreateSchema, transactionQuerySchema, transactionsCreateManySchema, querySchema, dateParamsSchema, periodParamsSchema } from './transaction.schema.ts'
import type { UpdateTransactionData } from "./transaction.ts";
import type { ApiSuccess } from "../../shared/types/ApiResponse.ts";
import type { Transaction, GroupedByType, GroupedCategories, WeeklySummary, TransactionSummary } from "../../shared/types/transaction.d.ts";

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
        const transactionsDTO = transactionsCreateManySchema.parse(transactions);
        await TransactionService.CreateManyTransactionService(transactionsDTO, userId);
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
        return res.status(200).json({
            success: true,
            data: transacoes
        } satisfies ApiSuccess<Transaction>);
    }
    catch (error) {
        next(error)
    }
}

const removeTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
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
        return res.status(200).json(
            {
                success: true,
                data: transacoes.data,
                meta: transacoes.meta
            } satisfies ApiSuccess<Transaction[]>);
    } catch (error) {
        next(error)
    }
};

const groupTransactionsByType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const transacoesPorTipo = await TransactionService.GroupTransactionByTypeService(userId);
        return res.status(200).json(
            {
                success: true,
                data: transacoesPorTipo
            } satisfies ApiSuccess<GroupedByType[]>);
    } catch (error) {
        next(error)
    }
};

const groupCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user;
        const query = dateParamsSchema.parse(req.query)
        const transacoesPorCategoria = await TransactionService.GroupCategoriesService(userId, query);
        return res.status(200).json({
            success: true,
            data: transacoesPorCategoria
        } satisfies ApiSuccess<GroupedCategories[]>);
    } catch (error) {
        next(error)
    }
};

const transactionSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user;
        const query = periodParamsSchema.parse(req.query)
        const transactionsSummary = await TransactionService.transactionSummaryService(userId, query);
        res.status(200).json(
            {
                success: true,
                data: transactionsSummary
            } satisfies ApiSuccess<TransactionSummary>);
    } catch (error) {
        next(error)
    }
};

const transactionWeeklyEvolution = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user;
        const query = dateParamsSchema.parse(req.query)
        const transactionsWeeklySummary = await TransactionService.WeeklyTransactionSummary(userId, query);
        res.status(200).json(
            {
                success: true,
                data: transactionsWeeklySummary
            } satisfies ApiSuccess<WeeklySummary>);
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
    transactionSummary,
    transactionWeeklyEvolution
};