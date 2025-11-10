import pkg from 'pg'
const { Pool } = pkg
const pool: pkg.Pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: false },
});


export default pool;