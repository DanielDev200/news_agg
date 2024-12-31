const pool = require('../db/config');

const getSources = async (req, res) => {
  try {
    const query = `SELECT * FROM sources`;
    const [sources] = await pool.execute(query);
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
};

const createSource = async (req, res) => {
    try {
      const { source, loads_in_iframe, notes } = req.body;
      const query = `INSERT INTO sources (source, loads_in_iframe, notes) VALUES (?, ?, ?)`;

      await pool.execute(query, [source, loads_in_iframe, notes]);
      res.status(201).json({ message: 'Source created successfully.' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to create source' });
    }
  };

const updateSource = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const query = `UPDATE sources SET notes = ? WHERE id = ?`;
    await pool.execute(query, [notes, id]);
    res.json({ id, notes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update source' });
  }
};

module.exports = { getSources, createSource, updateSource };
