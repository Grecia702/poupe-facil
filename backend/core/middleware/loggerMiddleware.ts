import type { Request, Response, NextFunction } from "express";
import logger from "../utils/loggerConfig.ts";

export const RequestLogger = (req: Request, res: Response, next: NextFunction) => {
    req.requestId = crypto.randomUUID();
    const startTime = Date.now();
    res.on('finish', () => {
        logger.info({
            requestId: req.requestId,
            method: req.method,
            route: req.originalUrl,
            userId: req.user?.userId || 'anonymous',
            statusCode: res.statusCode,
            duration: `${Date.now() - startTime}ms`
        });
    });
    next()
}