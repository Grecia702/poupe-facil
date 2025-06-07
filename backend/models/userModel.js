require('dotenv').config();
const pool = require('../db.js')


const get_user_by_id = async (id) => {
    const query = `
    SELECT 
    nome, 
    email,
    picture_path
    FROM usuario 
    WHERE id = $1
    `;
    const { rows, rowCount } = await pool.query(query, [id])
    return { exists: rowCount > 0, result: rows[0] }
}

const change_profile_pic = async (imagePath, userId) => {
    const query = `
    UPDATE usuario
    SET picture_path = $1
    WHERE id = $2
    `;
    await pool.query(query, [imagePath, userId])
}

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


module.exports = { get_user_by_id, updateUser, deleteUser, getCreatedAt, change_profile_pic };