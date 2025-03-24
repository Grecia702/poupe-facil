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
    const result = await client.query("SELECT * FROM usuario WHERE email = $1", [email]);
    return result.rows[0];
}

const CreateUser = async (nome, email, senha) => {
    await client.query("INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3)", [nome, email, senha]);
}

const ListUser = async (id) => {
    const result = await client.query("SELECT id, nome, email, senha FROM usuario WHERE id = $1", [id]);
    if (result.rows.length === 0) {
        console.log('Nenhum resultado encontrado')
    }
    return result.rows;
}

const UpdateUser = async (id, email) => {
    await client.query("UPDATE usuario SET email = $1  WHERE id = $2", [email, id])
}

const DeleteUser = async (id) => {
    await client.query("DELETE FROM usuario WHERE id = $1", [id])
}
module.exports = { FindUser, CreateUser, ListUser, UpdateUser, DeleteUser };