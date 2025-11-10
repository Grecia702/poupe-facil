import jwt from 'jsonwebtoken';
import type { JwtPayload, DecodedPayload } from '../types/token.js';

const generateAccessToken = (payload: JwtPayload): string | null => {
    if (!process.env.ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET não definido");
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
};

const generateRefreshToken = (payload: JwtPayload): string | null => {
    if (!process.env.REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET não definido");
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

const verifyAccessToken = (token: string): DecodedPayload => {
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as DecodedPayload;
        return payload
    } catch (err) {
        if (err instanceof Error) {

            if (err.name === 'TokenExpiredError') {
                throw new Error('Token expirado')
            }

            throw new Error('Token inválido')
        }
        throw new Error('Token inválido')
    }
};

const verifyRefreshToken = (token: string) => {
    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
        return payload
    } catch (err) {
        console.log(err)
        if (err instanceof Error) {
            return { valid: false, expired: err.name === 'TokenExpiredError', error: err.message };
        }
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};