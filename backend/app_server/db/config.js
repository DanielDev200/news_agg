console.log('Looking for .env file at:', require('path').resolve(__dirname, '../.env'));
require('dotenv').config({ 
  path: require('path').resolve(__dirname, '../.env'),
  override: true
});
console.log('Loaded ENV Variables:', process.env);

const mysql = require('mysql2/promise');

// Create the connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log('DB Config:', {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Export the pool directly
module.exports = pool;
