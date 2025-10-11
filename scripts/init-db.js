const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function initDB() {
  try {
    console.log('Initializing database...')

    // Create users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `)
    console.log('✓ Users table created')

    // Create sessions table for session management
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ User sessions table created')

    console.log('Database initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

initDB()