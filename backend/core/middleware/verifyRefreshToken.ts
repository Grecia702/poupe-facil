import { getToken, deleteToken } from "@features/auth/authModel.ts";
import { verifyRefreshToken } from '../utils/tokenUtils.ts';
import type { Request, Response, NextFunction } from 'express';

export const validateRefresh = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Refresh token não enviado' });
    const refreshToken = authHeader.split(' ')[1]!;
    const payload = verifyRefreshToken(refreshToken);
    (req as any).user = payload;
    const { userId } = (req as any).user;

    try {
        const token = await getToken(refreshToken, userId)
        if (!token) return res.status(401).json({ message: 'Refresh token não existe' });
        next();
    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'TokenExpiredError') {
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Refresh token não enviado' });
                const refreshToken = authHeader.split(' ')[1]!;
                await deleteToken(refreshToken, userId)
                return res.status(401).json({ message: 'Refresh token expirado' });
            }
        }
        console.log(err)
        return res.status(403).json({ message: 'Refresh token inválido' });
    }
};
