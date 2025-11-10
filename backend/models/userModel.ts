import pool from '../db.ts'

export interface UserInfo {
    nome: string,
    email: string,
    picture_path: string
}

const get_user_by_id = async (userId: number): Promise<UserInfo | null> => {
    const query = `
    SELECT 
    nome, 
    email,
    picture_path
    FROM usuario 
    WHERE id = $1
    `;
    const { rows, rowCount } = await pool.query(query, [userId])
    if (rowCount === 0) return null
    return rows[0]
}

const change_profile_pic = async (imagePath: string, userId: number): Promise<void> => {
    const query = `
    UPDATE usuario
    SET picture_path = $1
    WHERE id = $2
    `;
    await pool.query(query, [imagePath, userId])
}

const updateUser = async (userId: number, email: string) => {
    await pool.query("UPDATE usuario SET email = $1  WHERE id = $2", [email, userId])
}

const deleteUser = async (userId: number): Promise<void> => {
    await pool.query("DELETE FROM usuario WHERE id = $1", [userId])
}

const getCreatedAt = async (userId: number): Promise<Date | null> => {
    const { rows, rowCount } = await pool.query("SELECT created_at FROM usuario WHERE id = $1", [userId])
    if (rowCount === 0) return null
    const date = new Date(rows[0].created_at)
    return date
}


export { get_user_by_id, updateUser, deleteUser, getCreatedAt, change_profile_pic };