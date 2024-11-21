const pool = require('../db/config');

const getTopThreeArticles = (articles) => {
    const result = [];
    const sourcesSet = new Set();
  
    for (const article of articles) {
      if (result.length >= 3) {
        break;
      }
  
      if (!sourcesSet.has(article.source)) {
        result.push(article);
        sourcesSet.add(article.source);
      }
    }
  
    if (result.length < 3) {
      const remainingArticles = articles.filter(article => !result.includes(article));

      result.push(...remainingArticles.slice(0, 3 - result.length));
    }
  
    return result;
};

const filterClickedArticles = async (articles, userId) => {
    if (!userId) {
        return articles;
    }

    try {
        const query = `SELECT article_id FROM user_article_clicks WHERE user_id = ?`;
        const [clickedArticles] = await pool.execute(query, [userId]);
        const clickedArticleIds = clickedArticles.map((row) => row.article_id);

        return articles.filter((article) => !clickedArticleIds.includes(article.id));
    } catch (error) {
        console.error('Error filtering clicked articles:', error);
        return articles;
    }
};

const applyFilters = async (articles, userId) => {
    let filteredArticles = articles;

    if (userId) {
      filteredArticles = await filterClickedArticles(filteredArticles, userId);
    }

    const topThreeArticles = getTopThreeArticles(filteredArticles);

    return topThreeArticles;
};

const getArticles = async (req, res) => {
  const { city, state, user_id: userId } = req.query;

  if (!city || !state) {
      const missingParams = [];
      if (!city) missingParams.push('city');
      if (!state) missingParams.push('state');

      return res.status(400).json({
          error: `Missing parameter(s): ${missingParams.join(', ')}. Please provide all required parameters.`
      });
  }

  try {
      const query = `SELECT * FROM articles WHERE city_identifier = ? AND state_identifier = ? AND first_scraped BETWEEN CURDATE() - INTERVAL 1 DAY AND CURDATE()`;
      const [articles] = await pool.execute(query, [city, state]);

      if (articles.length === 0) {
          return res.json({ 
              message: 'No articles found for the specified city and state.', 
              articles: [] 
          });
      }

      const filteredArticles = await applyFilters(articles, userId);

      if (userId) {
          for (const article of filteredArticles) {
              const insertQuery = `INSERT INTO user_article_served (user_id, article_id) VALUES (?, ?)`;
              await pool.execute(insertQuery, [userId, article.id]);
          }
      }

      res.json({ articles: filteredArticles });
  } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'An error occurred while fetching articles.' });
  }
};


const getUnservedArticle = async (req, res) => {
    const { city, state, user_id: userId } = req.query;
  
    if (!city || !state || !userId ) {
      const missingParams = [];
      if (!city) missingParams.push('city');
      if (!state) missingParams.push('state');
      if (!userId) missingParams.push('userId');
  
      return res.status(400).json({
        error: `Missing parameter(s): ${missingParams.join(', ')}. Please provide all required parameters.`,
      });
    }
  
    try {
      // Query articles for city and state, and exclude already served articles
      const query = `
        SELECT * FROM articles
        WHERE city_identifier = ? AND state_identifier = ?
        AND id NOT IN (
          SELECT article_id FROM user_article_served WHERE user_id = ?
        )
        LIMIT 1
      `;
      const [articles] = await pool.execute(query, [city, state, userId]);
  
      if (articles.length === 0) {
        return res.status(404).json({ message: 'No unserved article found for the specified parameters.' });
      }
  
      const article = articles[0];
  
      // Record that this article is served
      const insertQuery = `INSERT INTO user_article_served (user_id, article_id) VALUES (?, ?)`;
      await pool.execute(insertQuery, [userId, article.id]);
  
      res.json({ article });
    } catch (error) {
      console.error('Error fetching unserved article:', error);
      res.status(500).json({ error: 'An error occurred while fetching the unserved article.' });
    }
  };

module.exports = { getArticles, getUnservedArticle };
