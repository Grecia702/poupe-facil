export interface JwtPayload {
    userId: number;
    name: string;
    email: string;
    iat?: number;
}

export interface DecodedPayload extends JwtPayload {
    iat: number
    exp: number
    aud?: string
}