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
        if (!payload) return res.status(401).json({ message: 'Token de acesso inválido' });
        const isExpired = payload.exp < (Date.now() / 1000)
        if (isExpired) return res.status(401).json({ message: 'Token de acesso expirado' });
        req.user = payload
        next()
    } catch (error: any) {
        res.status(500).json({ error: 'Token inválido', message: error.message })
    }
}

