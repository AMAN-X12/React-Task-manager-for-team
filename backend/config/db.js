const { Pool } = require('pg');
require('dotenv').config();

// If DATABASE_URL exists (Render), use it. Otherwise, use local settings.
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Render requires this!
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

pool.on('connect', () => {
  console.log(" database connection successful ");
});

pool.on('error', (err) => {
  console.log(" database error occured---", err.message);
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("database connection failed--", err.message);
  } else {
    console.log("connection successful");
  }
});

module.exports = pool;