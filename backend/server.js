const express = require('express');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes')
const app = express();
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: [
        'http://localhost:8081',
        'http://localhost:8082',
        'http://192.168.100.211:8081',
        'http://192.168.100.211:8082'
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
    res.status(404).json({ error: "Rota não encontrada" });
});



const PORT = 3000;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
