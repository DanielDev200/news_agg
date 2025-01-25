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

const fetchUserArticlesByDate = async (req, res) => {
    const { userId, date } = req.query;

    if (!userId || !date) {
        return res.status(400).json({ error: 'Please provide both user ID and date.' });
    }

    try {
        const query = `
            SELECT article_id, created_at
            FROM user_article_clicks
            WHERE user_id = ? AND DATE(created_at) = ?
            ORDER BY created_at DESC;
        `;
        const [articles] = await pool.execute(query, [userId, date]);

        if (articles.length === 0) {
            return res.status(200).json({
                userId: userId,
                date: date,
                articles: []
            });
        }

        res.status(200).json({
            userId: userId,
            date: date,
            articles: articles.map(article => ({
                articleId: article.article_id,
                readTime: article.created_at
            }))
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'An error occurred while fetching the articles.' });
    }
};


module.exports = { recordArticleClick, fetchUserArticlesByDate };
