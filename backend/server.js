const express = require('express');
const path = require('path');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const accountRoutes = require('./routes/accountRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const logger = require('./utils/loggerConfig')
const app = express();
const cookieParser = require('cookie-parser');

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

const options = {
    key: fs.readFileSync('./certificados/key.pem'),  // Caminho para a chave privada
    cert: fs.readFileSync('./certificados/cert.pem'),  // Caminho para o certificado
    rejectUnauthorized: false
};

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    next();
});
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/profile/account", accountRoutes)
app.use("/api/profile/transaction", transactionRoutes)


app.get('/teste', (req, res) => {
    res.status(200).json({ message: 'Servidor HTTPS está funcionando!' });
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = 443;
const HOST = '0.0.0.0';


https.createServer(options, app).listen(PORT, HOST, () => {
    console.log(`Servidor HTTPS rodando em https://${HOST}:${PORT}`);
}).on('error', (err) => {
    console.error('Erro ao iniciar o servidor HTTPS:', err);
});

// app.listen(PORT, HOST, () => {
//     console.log(`Servidor rodando em http://${HOST}:${PORT}`);
// });

logger.info(`Servidor aberto em http://${HOST}:${PORT}`);


