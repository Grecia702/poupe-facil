import type { NextFunction, Request, Response } from "express"
import * as AccountService from "./accountService.ts"
import type { ContaCreate, ContaUpdate } from './AccountBank.ts'
import { HttpError } from "@core/utils/errorTypes.ts"

const CreateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const accountData: ContaCreate = req.body;
        await AccountService.CreateAccountService(userId, accountData);
        return res.sendStatus(204);
    }
    catch (error) {
        next(error)
    }
}

const UpdateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const accountId = Number(req.params.id);
        const updateFields = req.body
        if (!accountId) throw new HttpError("ID da conta não fornecido", 400);
        await AccountService.UpdateAccountService(userId, accountId, updateFields)
        return res.status(200).json({ message: 'Conta atualizada com sucesso' })
    }
    catch (error) {
        next(error)
    }
}

const RemoveAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const accountId = Number(req.params.id);
        if (!accountId) throw new HttpError("ID da conta não fornecido", 400);
        await AccountService.RemoveAccountService(userId, accountId)
        return res.status(204).json({ message: 'Conta excluída com sucesso' })
    }
    catch (error) {
        next(error)
    }
}

const ListAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const date_params = req.query.last_date
        const last_date = typeof date_params === 'string' ? new Date(date_params) : new Date();
        const accounts = await AccountService.ListAccountService(userId, last_date);
        return res.status(200).json(accounts)
    }
    catch (error) {
        next(error)
    }
}

const FindAccountByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const accountId = Number(req.params.id)
        if (!accountId) throw new HttpError("ID da conta não fornecido", 400);
        const account = await AccountService.ListAccountByIDService(userId, accountId);
        return res.status(200).json(account)
    }
    catch (error) {
        next(error)
    }
}

const sumAccountController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user
        const date_params = req.query.last_date
        const last_date = typeof date_params === 'string' ? new Date(date_params) : new Date();
        const account = await AccountService.sumAccountService(userId, last_date);
        return res.status(200).json(account)
    }
    catch (error) {
        next(error)
    }
}

export { CreateAccount, UpdateAccount, RemoveAccount, ListAccount, FindAccountByID, sumAccountController };