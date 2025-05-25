require('dotenv').config();
const pool = require('../db.js')


const updateUser = async (id, email) => {
    await pool.query("UPDATE usuario SET email = $1  WHERE id = $2", [email, id])
}

const deleteUser = async (id) => {
    await pool.query("DELETE FROM usuario WHERE id = $1", [id])
}

const getCreatedAt = async (id) => {
    const { rows } = await pool.query("SELECT created_at FROM usuario WHERE id = $1", [id])
    return { result: rows[0] }
}


module.exports = { updateUser, deleteUser, getCreatedAt };