import type { DecodedPayload } from "./token.js"

declare global {
    namespace Express {
        interface Request {
            user: DecodedPayload;
            requestId?: string
        }
    }
}
