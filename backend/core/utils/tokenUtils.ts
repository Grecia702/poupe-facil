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
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as DecodedPayload;
};

const verifyRefreshToken = (token: string): DecodedPayload => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, {
        ignoreExpiration: true
    }) as DecodedPayload;
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};