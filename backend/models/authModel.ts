import pool from '../db.ts'
import type { UserData, JWTData, GoogleUserData } from '@/types/auth.js';

const createUser = async (name: string, email: string, password: string): Promise<{ id: string }> => {
    const query = `
    INSERT INTO usuario 
    (nome, email, senha) 
    VALUES ($1, $2, $3) 
    RETURNING id
    `;
    const { rows } = await pool.query(query, [name, email, password]);
    return rows[0]
}

const createGoogleUser = async (name: string, email: string, googleId: string, picturePath: string): Promise<{ id: string } | null> => {
    const query = `
    INSERT INTO usuario 
    (nome, email, googleid, picture_path, accounttype) 
    VALUES ($1, $2, $3, $4, 'gmail') 
    RETURNING id
    `;
    const { rows, rowCount } = await pool.query(query, [name, email, googleId, picturePath]);
    if (rowCount === 0) return null
    return rows[0]
}

const getUser = async (email: string): Promise<UserData | null> => {
    const query = `
    SELECT 
        id, 
        nome as name, 
        email, 
        senha as password
    FROM usuario 
    WHERE email = $1
    `
    const { rows, rowCount } = await pool.query(query, [email]);
    if (rowCount === 0) return null
    return rows[0]
}

const getGoogleUser = async (email: string, googleId: string): Promise<UserData | null> => {
    const query = `
    SELECT *
    FROM usuario 
    WHERE email = $1 
    AND googleId = $2
    `;
    const { rows, rowCount } = await pool.query(query, [email, googleId]);
    if (rowCount === 0) return null
    return rows[0]
}

const createRefreshToken = async (data: JWTData): Promise<void> => {
    const { userId, refreshToken, userAgent, ipAddress, expiresAt } = data
    const query = `
    INSERT INTO refresh_tokens 
    (usuario_id, token, user_agent, ip_address, expires_at) 
    VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [userId, refreshToken, userAgent, ipAddress, expiresAt]);
}

const getToken = async (token: string, userId: number): Promise<JWTData | null> => {
    const query = `
    SELECT token FROM refresh_tokens 
    WHERE token = $1
    AND usuario_id = $2
    `;
    const { rows, rowCount } = await pool.query(query, [token, userId])
    if (rowCount === 0) return null
    return rows[0]
}

const deleteToken = async (token: string, userId: number): Promise<void> => {
    const query = `
    DELETE FROM refresh_tokens
    WHERE token = $1
    AND usuario_id = $2
    `;
    await pool.query(query, [token, userId])
}

const accountExists = async (email: string): Promise<boolean> => {
    const query = `
    SELECT EXISTS (
        SELECT 1 FROM usuario WHERE email = $1
    )
    `;
    const exists = await pool.query(query, [email]);
    const { rows } = exists
    return rows[0].exists
}


export { createUser, createGoogleUser, getUser, getGoogleUser, createRefreshToken, getToken, deleteToken, accountExists };