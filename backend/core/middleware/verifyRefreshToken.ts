import { getToken, deleteToken } from "../../features/auth/authModel.ts";
import { verifyRefreshToken } from '../utils/tokenUtils.ts';
import type { Request, Response, NextFunction } from 'express';

export const validateRefresh = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Refresh token não enviado' });
    const refreshToken = authHeader.split(' ')[1]!;
    try {
        const payload = verifyRefreshToken(refreshToken);
        req.user = payload;
        const { userId, exp } = req.user;
        const token = await getToken(refreshToken, userId)
        if (!token) return res.status(401).json({ message: 'Refresh token não existe' });
        const now = Date.now() / 1000;
        const isExpired = exp < now;
        if (isExpired) {
            await deleteToken(refreshToken, userId)
            return res.status(401).json({ message: 'Refresh token expirado' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Refresh token inválido' });
    }
};
