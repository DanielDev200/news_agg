const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Endpoint to fetch articles by city and state
app.get('/articles', async (req, res) => {

    const { city, state } = req.query;

    if (!city || !state) {
        return res.status(400).json({ error: 'Please provide both city and state parameters.' });
    }

    try {
        const query = `SELECT * FROM articles WHERE city_identifier = ? AND state_identifier = ?`;
        const [rows] = await pool.execute(query, [city, state]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No articles found for the specified city and state.' });
        }

        res.json({ articles: rows });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'An error occurred while fetching articles.' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
