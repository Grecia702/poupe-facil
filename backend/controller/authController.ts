import logger from '../utils/loggerConfig.ts'
import { generateAccessToken } from '../utils/tokenUtils.ts';
import { loginService, googleLoginService, signupService, logoutService } from '../services/authService.ts';
import { format } from 'date-fns';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from '../types/token.js';

// LOGIN

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userAgent = req.get('User-Agent') || 'Unknown'
        const userIp = req.ip || 'Unknown'
        const query = req.body
        const authToken = await loginService(query, userAgent, userIp)
        res.setHeader('access-token', `${authToken.accessToken}`)
        res.setHeader('refresh-token', `${authToken.refreshToken}`)
        res.status(200).json({ message: 'Login feito com sucesso' });
    }
    catch (error) {
        next(error)
    }
};

const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idToken } = req.body
        const userAgent = req.get('User-Agent') ?? 'Unknown'
        const userIp = req.ip ?? 'unknown'
        const authToken = await googleLoginService(idToken, userAgent, userIp)
        res.setHeader('access-token', `${authToken.accessToken}`)
        res.setHeader('refresh-token', `${authToken.refreshToken}`)
        res.status(200).json({ message: 'Login Google feito com sucesso' });
    } catch (error) {
        next(error)
    }
}

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, name, email } = req.user;
        const userAgent = req.get('User-Agent')
        const ipAddress = req.ip
        const payload: JwtPayload = {
            userId: userId,
            name: name,
            email: email,
            iat: Math.floor(Date.now() / 1000)
        };
        const newAccessToken = generateAccessToken(payload);
        const date = format(new Date(), 'dd/MM/yyyy HH:mm:ss');;
        console.log("Token renovado com sucesso às", date);
        logger.info(`Renovação de token feita pelo usuario ${userId} durante as ${date}. IP: ${ipAddress}, User-Agent: ${userAgent}`);
        res.setHeader('x-access-token', `Bearer ${newAccessToken}`)
        res.status(200).json({ message: 'Token renovado com sucesso' });
    } catch (error) {
        next(error)
    }
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.body;
        await signupService(query)
        return res.status(201).json({ message: 'Cadastro realizado com sucesso' })
    }
    catch (error) {
        next(error)
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token não enviado ou inválido' });
        }
        const refreshToken = authHeader.split(' ')[1];
        if (!refreshToken) return res.status(401).json({ message: 'Token não encontrado' });
        const { userId } = (req as any);
        const ipAddress = req.ip ?? 'unknown'
        const userAgent = req.get('User-Agent') ?? 'Unknown'
        await logoutService(refreshToken, userId, ipAddress, userAgent)
        return res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        next(error)
    }
};

export {
    login,
    googleLogin,
    logout,
    refresh,
    signup
};
