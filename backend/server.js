const express = require('express');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes')
const app = express();
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/users", userRoutes)

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
