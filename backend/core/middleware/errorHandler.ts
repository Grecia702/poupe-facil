import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errorTypes.ts";
import logger from "../utils/loggerConfig.ts";
import type { ApiError } from "../../shared/types/ApiResponse.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        const response: ApiError = {
            success: false,
            message: err.message,
            ...(err.details && { details: String(err.details) }),
            ...(err.name && { error: err.name })
        }
        return res.status(err.statusCode).json(response)
    }
    logger.error(err.message)
    const response: ApiError = {
        success: false,
        message: 'Erro inesperado no servidor',
        error: err.message
    }
    return res.status(500).json(response)
}
