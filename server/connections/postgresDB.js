const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
    max: 20,                          // Maximum 20 connections in pool
    min: 4,                           // Keep 4 idle connections ready
    idleTimeoutMillis: 30000,         // Close idle connections after 30s
    connectionTimeoutMillis: 5000     // Return error if connection cannot be acquired in 5s
});

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client for PostgreSQL DB:', err.message);
    }
    console.log('Successfully connected to PostgreSQL database');
    release();
});

// Handle idle client errors without crashing the Node.js process
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

module.exports = pool;