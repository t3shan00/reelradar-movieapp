import pkg from 'pg'
import dotenv from 'dotenv'

const enviornment = process.env.NODE_ENV
dotenv.config()

const { Pool } = pkg;

// PostgreSQL pool configuration
const openDb = () => {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    })
    return pool
}

  
  const pool  = openDb()

  export {pool}