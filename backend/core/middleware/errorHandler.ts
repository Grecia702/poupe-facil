import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errorTypes.ts";
import logger from "../utils/loggerConfig.ts";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            message: err.message,
            ...(err.details && { details: err.details })
        })
    }
    logger.error(err.message)
    console.log(err.message)
    return res.status(500).json({ message: 'Erro inesperado no servidor', error: err.message })
}
