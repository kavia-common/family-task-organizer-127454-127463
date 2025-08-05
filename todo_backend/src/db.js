//
// Database connection helper using environment variables for configuration.
//
const { Pool } = require('pg');

// PUBLIC_INTERFACE
function getDbPool() {
  /**
   * Returns a new pg Pool instance using configuration from environment variables.
   */
  return new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
  });
}

const db = getDbPool();

module.exports = db;
