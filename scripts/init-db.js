const { initDatabase } = require('../lib/db.ts')

async function initDB() {
  try {
    console.log('Initializing database...')
    await initDatabase()
    console.log('Database initialized successfully!')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

initDB()