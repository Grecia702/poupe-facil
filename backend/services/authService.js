const authModel = require("../models/authModel");
const bcrypt = require('bcrypt')
const { format } = require('date-fns');
const { generateAccessToken, generateRefreshToken } = require('../Utils/tokenUtils');
const { z } = require("zod");
const { OAuth2Client } = require('google-auth-library');
const saltRounds = 12;
const logger = require('../Utils/loggerConfig');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authQuerySchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email().nonempty(),
    password: z.string().nonempty().min(8)
});


const signupService = async (query) => {
    const { name, email, password } = authQuerySchema.parse(query);
    const accountExists = await authModel.accountExists(email)
    console.log(accountExists)
    if (accountExists) {
        throw new Error("Já existe uma conta com este e-mail")
    }
    const hashPassword = bcrypt.hash(password, saltRounds)
    await authModel.createUser(name, email, hashPassword)
}

const loginService = async (query, agent, userIp) => {
    const { email, password } = query;
    const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss");
    const { result, exists } = await authModel.getUser(email);
    if (!exists) {
        throw new Error('E-mail e/ou senha incorretos!')
    }
    const validPassword = await bcrypt.compare(password, result.senha)
    if (validPassword) {
        const { nome, email, id } = result
        console.log("login feito pelo usuario ", email, "durante as", timestamp, "horas")
        const payload = {
            userId: id,
            name: nome,
            email: email,
            iat: Math.floor(Date.now() / 1000)
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await authModel.createRefreshToken(id, refreshToken, agent, userIp, expiresAt);
        logger.info(`Login feito pelo usuário de ID ${id} as ${timestamp}. IP: ${userIp}, User Agent: ${agent}`)
        return { accessToken, refreshToken }
    }
    throw new Error('E-mail e/ou senha incorretos!')
}

const googleService = async (idToken, userAgent, userIp) => {
    const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss");
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const decode = ticket.getPayload();
    const getUser = await authModel.getGoogleUser(decode.email, decode.sub)
    if (getUser.exists) {
        const { id } = getUser.result
        const payload = {
            userId: id,
            sub: decode.sub,
            name: decode.name,
            email: decode.email,
            iat: decode.iat,
            aud: decode.aud
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await authModel.createRefreshToken(id, refreshToken, userAgent, userIp, expiresAt)
        logger.info(`Login de google pelo usuário de ID ${id}, email ${decode.email} as ${timestamp}. IP: ${userIp}, User Agent: ${userAgent}`)
        return { accessToken, refreshToken }
    }
}

const logoutService = async (token, userId, userAgent, ipAddress) => {
    const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss");
    const { exists } = await authModel.getToken(token, userId, userAgent, ipAddress)
    if (!exists) {
        throw new Error('Token não encontrado')
    }
    await authModel.deleteToken(token)
    logger.info(`Logout feito pelo usuário de ID ${userId} as ${timestamp}. IP: ${ipAddress}, User Agent: ${userAgent}`)
};

module.exports = { loginService, signupService, googleService, logoutService }