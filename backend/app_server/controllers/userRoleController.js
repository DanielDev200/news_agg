const pool = require('../db/config');

const getUserRole = async (req, res) => {
  const { userId } = req.params; 
  
  try {
    const query = 'SELECT role FROM user_role WHERE user_id = ?';
    const [rows] = await pool.execute(query, [userId]);

    if (rows.length === 0) {
      return res.json({ role: '' });
    }

    return res.json({ role: rows[0].role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'An error occurred while fetching user role.' });
  }
};

module.exports = { getUserRole };
