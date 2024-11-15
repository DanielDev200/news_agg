const pool = require('../db/config');

const saveUserLocation = async (req, res) => {
    const { user_id, city, state } = req.body;

    if (!user_id || !city || !state) {
        return res.status(400).json({ error: 'Please provide user_id, city, and state parameters.' });
    }

    try {
        const query = `
            INSERT INTO user_location (user_id, city, state, created_at)
            VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE city = VALUES(city), state = VALUES(state), created_at = NOW()
        `;

        await pool.execute(query, [user_id, city, state]);

        res.status(200).json({ message: 'User location saved successfully' });
    } catch (error) {
        console.error('Error saving user location:', error);
        res.status(500).json({ error: 'An error occurred while saving user location.' });
    }
};

const getUserLocation = async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'Please provide a user_id parameter.' });
    }

    try {
        const query = `SELECT * FROM user_location WHERE user_id = ?`;
        const [rows] = await pool.execute(query, [user_id]);

        if (rows.length === 0) {
            return res.json({});
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user location:', error);
        res.status(500).json({ error: 'An error occurred while fetching user location.' });
    }
};

module.exports = { saveUserLocation, getUserLocation };
