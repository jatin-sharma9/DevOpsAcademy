import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Construct pool configuration supporting both DATABASE_URL and individual parameters
const getPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    const isLocalhost = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' || (!isLocalhost && process.env.NODE_ENV === 'production')
        ? { rejectUnauthorized: false }
        : false,
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT || '5000', 10),
    };
  }

  const isSsl = process.env.DB_SSL === 'true';
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'devops_academy',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: isSsl ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT || '5000', 10),
  };
};

export const pool = new Pool(getPoolConfig());

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('PostgreSQL database pool client connected');
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Execute a SQL query with parameter bindings
 * 
 * @param {string} text - SQL query string
 * @param {Array} [params] - Parameter bindings
 * @returns {Promise<pg.QueryResult>}
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Gracefully drain and close the connection pool
 */
export const closePool = async () => {
  try {
    await pool.end();
    console.log('PostgreSQL connection pool drained and closed.');
  } catch (err) {
    console.error('Error closing database pool:', err.message);
  }
};

/**
 * Get current pool connection statistics
 */
export const getPoolStats = () => ({
  totalCount: pool.totalCount,
  idleCount: pool.idleCount,
  waitingCount: pool.waitingCount,
});

