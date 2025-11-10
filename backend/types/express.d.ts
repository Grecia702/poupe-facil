import type { JwtPayload } from "./token.js"

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}
