const express = require('express');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes')
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/users", userRoutes)

const PORT = 3000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
