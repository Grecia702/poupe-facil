const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes')
const app = express();
const cookieParser = require('cookie-parser')

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

app.use("/api/users", (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

app.use("/api/users", userRoutes)

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});


const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
