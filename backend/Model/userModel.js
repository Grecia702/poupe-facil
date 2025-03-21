require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

client.connect()

const FindUser = async (email) => {
    const res = await client.query("SELECT * FROM usuario WHERE email = $1", [email]);
    return res.rows[0];
}

const CreateUser = async (nome, email, senha) => {
    await client.query("INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3)", [nome, email, senha]);
}

module.exports = { FindUser, CreateUser };