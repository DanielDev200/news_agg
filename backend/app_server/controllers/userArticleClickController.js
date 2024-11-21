const pool = require('../db/config');

const recordArticleClick = async (req, res) => {
    const { user_id, article_id } = req.body;

    if (!user_id || !article_id) {
        return res.status(400).json({ error: 'Please provide user_id and article_id.' });
    }

    try {
        const query = `
            INSERT INTO user_article_clicks (user_id, article_id, created_at)
            VALUES (?, ?, NOW())
        `;
        await pool.execute(query, [user_id, article_id]);

        res.status(200).json({ message: 'Article click recorded successfully' });
    } catch (error) {
        console.error('Error recording article click:', error);
        res.status(500).json({ error: 'An error occurred while recording the article click.' });
    }
};

module.exports = { recordArticleClick };
