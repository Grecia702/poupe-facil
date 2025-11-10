export interface UserData {
    id: number,
    name: string,
    email: string,
    password: string,
    googleId?: string,
    picturePath?: string
}

export interface GooglePayload {
    name: string;
    email: string;
    sub: string;
}

export interface GoogleUserData {
    name: string;
    email: string;
    googleId: string;
    picturePath?: string | undefined;
};

export interface JWTData {
    userId: number,
    refreshToken: string,
    userAgent: string,
    ipAddress: string,
    expiresAt?: Date
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}