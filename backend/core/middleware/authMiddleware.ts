import express from 'express';
import cookieParser from 'cookie-parser';
import { verifyAccessToken } from '../utils/tokenUtils.ts'
import type { Request, Response, NextFunction } from 'express';

const app = express()
app.use(cookieParser());

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies?.accessToken
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido' })
        const payload = verifyAccessToken(token)
        req.user = payload
        next()
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado" })
        }
        return res.status(401).json({ message: "Token inválido" });
    }
}

