const pool = require('../db/config');

const getArticles = async (req, res) => {
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
};

module.exports = { getArticles };
