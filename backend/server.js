require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const userRoutes = require(path.join(__dirname, 'routes', 'userRoutes'));
const accountRoutes = require(path.join(__dirname, 'routes', 'accountRoutes'));
const authRoutes = require(path.join(__dirname, 'routes', 'authRoutes'));
const transactionRoutes = require(path.join(__dirname, 'routes', 'transactionRoutes'));
const budgetRoutes = require(path.join(__dirname, 'routes', 'budgetRoutes'));
const goalsRoutes = require(path.join(__dirname, 'routes', 'goalsRoutes'));
const gptRoutes = require(path.join(__dirname, 'routes', 'gptRoutes'));
const ocrRoutes = require(path.join(__dirname, 'routes', 'OCRRoutes'));
const financialReportRoutes = require(path.join(__dirname, 'routes', 'financial-report-routes'));
const logger = require(path.join(__dirname, 'utils', 'loggerConfig'));
const requestTimeLogger = require(path.join(__dirname, 'utils', 'requestTime'));
const { iniciarCron } = require(path.join(__dirname, 'utils', 'cronTasks'));
const { RateLimiterMemory } = require('rate-limiter-flexible');

iniciarCron();

const rateLimiter = new RateLimiterMemory({
    points: 20,
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



app.use((req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => {
            res.status(429).send('Too many requests.');
        });
});

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Keep-Alive', 'timeout=5, max=50');
    next();
});

app.use("/api/auth", (req, res, next) => {
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

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});

logger.info(`Servidor aberto em http://${HOST}:${PORT}`);