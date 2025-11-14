import pkg from 'pg'
const { Pool } = pkg

const isDevelopment = process.env.NODE_ENV === 'development'

const pool: pkg.Pool = new Pool({
    connectionString: isDevelopment ? process.env.DATABASE_URL : process.env.DATABASE_URL_REMOTE,
    ssl: isDevelopment ? undefined : { rejectUnauthorized: false },
});


export default pool;