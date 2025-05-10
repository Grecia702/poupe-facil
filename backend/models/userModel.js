require('dotenv').config();
const pool = require('../db.js')


const updateUser = async (id, email) => {
    await pool.query("UPDATE usuario SET email = $1  WHERE id = $2", [email, id])
}

const deleteUser = async (id) => {
    await pool.query("DELETE FROM usuario WHERE id = $1", [id])
}

module.exports = { updateUser, deleteUser };