import * as authModel from "./authModel.ts";
import { CreateAccount } from '../account/accountModel.ts'
import bcrypt from 'bcrypt'
import { format } from 'date-fns';
import { generateAccessToken, generateRefreshToken } from '../../core/utils/tokenUtils.ts';
import { z } from "zod";
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import logger from '../../core/utils/loggerConfig.ts';
import type { AuthTokens, GooglePayload, GoogleUserData, JWTData, UserData } from "./auth.js";
import { UnauthorizedError, HttpError } from "../../core/utils/errorTypes.ts";
import type { JwtPayload } from "../../core/types/token.js";
import type { DadosBancarios } from "../account/AccountBank.js";

const saltRounds = 12;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authQuerySchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email().nonempty(),
    password: z.string().nonempty().min(8)
});

const newDefaultAccount = (): Omit<DadosBancarios, 'id_usuario'> => (
    {
        saldo: 0,
        nome_conta: "Conta corrente",
        tipo_conta: "Conta corrente",
        icone: "account-balance",
        is_primary: true
    });

const verifyGoogleToken = async (idToken: string): Promise<TokenPayload> => {
    if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID não definido nas variáveis de ambiente");
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub || !payload?.name) throw new HttpError("Erro ao obter token", 400);
    return payload;
};

const handleGoogleLogin = async (user: any, payload: GooglePayload, userAgent: string, ipAddress: string): Promise<AuthTokens | null> => {
    const { id } = user;
    const { name, email, sub } = payload;
    const jwtPayload: JwtPayload = { userId: id, name, email };
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);
    if (!accessToken || !refreshToken) return null
    await authModel.createRefreshToken({
        userId: id,
        refreshToken,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    logger.info(`Login de Google - ID ${id}, email ${email}, IP ${ipAddress}, UA: ${userAgent}`);
    return { accessToken, refreshToken };
};

const handleNewGoogleUser = async (payload: any) => {
    const newUser = await authModel.createGoogleUser(payload.given_name, payload.email, payload.sub, payload.picture);
    if (!newUser) throw new UnauthorizedError("Login já existe");
    return newUser;
};

const signupService = async (query: UserData): Promise<void> => {
    const { name, email, password } = authQuerySchema.parse(query);
    const account = await authModel.accountExists(email)
    if (!account) throw new UnauthorizedError("Já existe uma conta com este e-mail");
    const hashPassword = await bcrypt.hash(password, saltRounds)
    const userAccount = await authModel.createUser(name, email, hashPassword)
    if (!userAccount) throw new UnauthorizedError("Essa conta já existe!");
    const { id } = userAccount
    await CreateAccount(id, newDefaultAccount());
}

const loginService = async (query: UserData, userAgent: string, ipAddress: string): Promise<AuthTokens> => {
    const user = await authModel.getUser(query.email);
    if (!user) throw new UnauthorizedError('E-mail e/ou senha incorretos!');
    const { password } = user
    const validPassword = await bcrypt.compare(query.password, password)
    if (!validPassword) throw new UnauthorizedError('E-mail e/ou senha incorretos!');
    const { name, email, id } = user
    const payload: JwtPayload = {
        userId: id,
        name: name,
        email: email,
        iat: Math.floor(Date.now() / 1000)
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    if (!accessToken || !refreshToken) throw new UnauthorizedError("Erro ao gerar token")

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const tokenData: JWTData = { userId: id, refreshToken, userAgent, ipAddress, expiresAt }
    await authModel.createRefreshToken(tokenData);


    const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss");
    console.log("login feito pelo usuario ", email, "durante as", timestamp, "horas")
    logger.info(`Login feito pelo usuário de ID ${id} as ${timestamp}. IP: ${ipAddress}, User Agent: ${userAgent}`)
    return { accessToken, refreshToken }
}

const googleLoginService = async (idToken: string, userAgent: string, ipAddress: string, retry = false): Promise<AuthTokens> => {
    const payload = await verifyGoogleToken(idToken)
    const user = await authModel.getGoogleUser(payload.email, payload.sub)
    if (user) {
        const authTokens = await handleGoogleLogin(user, payload, userAgent, ipAddress);
        if (!authTokens) throw new UnauthorizedError("Erro ao gerar token");
        return { refreshToken: authTokens.refreshToken, accessToken: authTokens.accessToken };
    }
    // Se não existir login, cria um a partir das info do payload, caso ainda não dê, lança um erro
    if (retry) throw new UnauthorizedError("Falha ao criar usuário Google.");
    const newUser = await handleNewGoogleUser(payload);
    await CreateAccount(newUser.id, newDefaultAccount());
    return googleLoginService(idToken, userAgent, ipAddress, true);
}

const logoutService = async (token: string, sub: number, ipAddress: string, userAgent: string): Promise<void> => {
    const verifyToken = await authModel.getToken(token, sub)
    if (!verifyToken) throw new UnauthorizedError('Token não encontrado')
    await authModel.deleteToken(token, sub)
    const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss");
    logger.info(`Logout feito pelo usuário de ID ${sub} as ${timestamp}. IP: ${ipAddress}, User Agent: ${userAgent}`)
};

export { loginService, signupService, googleLoginService, logoutService }