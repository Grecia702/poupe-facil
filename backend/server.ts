import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import userRoutes from './routes/userRoutes.ts';
import accountRoutes from './routes/accountRoutes.ts';
import authRoutes from './routes/authRoutes.ts';
import transactionRoutes from './routes/transactionRoutes.ts';
import budgetRoutes from './routes/budgetRoutes.ts';
import goalsRoutes from './routes/goalsRoutes.ts';
import gptRoutes from './routes/gptRoutes.ts';
import ocrRoutes from './routes/OCRRoutes.ts';
import financialReportRoutes from './routes/financial-report-routes.ts';
import logger from './utils/loggerConfig.ts';
import requestTimeLogger from './utils/requestTime.ts';
import { iniciarCron } from './utils/cronTasks.ts';
import type { Request, Response, NextFunction } from 'express'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.ts';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/api/users/uploads', express.static(path.join(__dirname, 'uploads')))

iniciarCron();

const PORT = 3000;
const HOST = '0.0.0.0';

const rateLimiter = new RateLimiterMemory({
    points: 30,
    duration: 1,
    blockDuration: 10,
});
app.use(requestTimeLogger);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(cors({
    origin: [
        'http://localhost:8081',
        'http://localhost:8082',
        'http://192.168.100.211:8081',
        'http://192.168.100.211:8082',
        'http://127.0.0.1:8081',
        'http://127.0.0.1:8082'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use((req: Request, res: Response, next: NextFunction) => {
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => {
            res.status(429).send('Too many requests.');
        });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Keep-Alive', 'timeout=5, max=50');
    next();
});

app.use("/api/auth", (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    next()
});

app.use("/api/users", userRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/gpt", gptRoutes)
app.use("/api/profile/account", accountRoutes);
app.use("/api/profile/transaction", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/reports", financialReportRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use(errorHandler)

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});

logger.info(`Servidor aberto em http://${HOST}:${PORT}`);