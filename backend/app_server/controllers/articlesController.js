const pool = require('../db/config');
const { format } = require('date-fns-tz');

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
      error: `Missing parameter(s): ${missingParams.join(', ')}. Please provide all required parameters.`,
    });
  }

  try {
    const query = `
      SELECT * 
      FROM articles 
      WHERE sourced BETWEEN CURDATE() - INTERVAL 1 DAY AND CURDATE()
    `;
    const [articles] = await pool.execute(query);

    if (articles.length === 0) {
      return res.json({
        message: 'No articles found within the specified timeframe.',
        articles: {
          city: [],
          county: [],
          state: [],
          national: [],
        },
      });
    }

    const categorizedArticles = {
      city: [],
      county: [],
      state: [],
      national: [],
    };

    for (const article of articles) {
      if (article.city_identifier && article.state_identifier) {
        article.category = 'city';
        categorizedArticles.city.push(article);
      } else if (article.national_identifier) {
        article.category = 'national';
        categorizedArticles.national.push(article);
      }
    }

    const filteredCityArticles = await applyFilters(categorizedArticles.city, userId);
    const filteredNationalArticles = await applyFilters(categorizedArticles.national, userId);

    const filteredArticles = {
      city: filteredCityArticles,
      national: filteredNationalArticles
    };

    if (userId) {
      for (const category of Object.keys(filteredArticles)) {
        for (const article of filteredArticles[category]) {
          const insertQuery = `INSERT INTO user_article_served (user_id, article_id) VALUES (?, ?)`;
          await pool.execute(insertQuery, [userId, article.id]);
        }
      }
    }

    res.json({ articles: filteredArticles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'An error occurred while fetching articles.' });
  }
};


const validateSwappedArticleInput = (city, state, userId, res) => {
  if (!city || !state || !userId) {
    const missingParams = [];
    if (!city) missingParams.push('city');
    if (!state) missingParams.push('state');
    if (!userId) missingParams.push('userId');

    return res.status(400).json({
      error: `Missing parameter(s): ${missingParams.join(', ')}. Please provide all required parameters.`,
    });
  }
}

const getUnservedArticles = async (city, state, userId, category) => {
  let unservedQuery;
  let queryParams = [];

  if (category === 'city') {
    unservedQuery = `
      SELECT * FROM articles
      WHERE city_identifier = ? AND state_identifier = ?
      AND id NOT IN (
        SELECT article_id FROM user_article_served WHERE user_id = ?
      )
      LIMIT 1
    `;
      
    queryParams = [city, state, userId];
  } else if (category === 'national') {
    unservedQuery = `
      SELECT * FROM articles
      WHERE national_identifier = 'USA'
      AND id NOT IN (
        SELECT article_id FROM user_article_served WHERE user_id = ?
      )
      LIMIT 1
    `;
    
    queryParams = [userId];
  }  else {
    throw new Error(`Unsupported category: ${category}`);
  }

  const [unservedArticles] = await pool.execute(unservedQuery, queryParams);

  return unservedArticles;
}

const getServedArticles = async (userId, category, city = null, state = null) => {
  let servedQuery;
  let queryParams = [userId];

  if (category === 'city') {
    servedQuery = `
      SELECT * FROM articles
      WHERE id = (
        SELECT article_id
        FROM (
          SELECT article_id, COUNT(*) AS times_served
          FROM user_article_served
          WHERE user_id = ?
          AND article_id IN (
            SELECT id FROM articles 
            WHERE sourced >= NOW() - INTERVAL 1 WEEK
            AND city_identifier = ?
            AND state_identifier = ?
          )
          GROUP BY article_id
          ORDER BY times_served ASC
          LIMIT 1
        ) AS subquery
      )
    `;

    queryParams = [userId, city, state];
  } else if (category === 'national') {
    servedQuery = `
      SELECT * FROM articles
      WHERE id = (
        SELECT article_id
        FROM (
          SELECT article_id, COUNT(*) AS times_served
          FROM user_article_served
          WHERE user_id = ?
          AND article_id IN (
            SELECT id FROM articles 
            WHERE sourced >= NOW() - INTERVAL 1 WEEK
            AND national_identifier = 'USA'
          )
          GROUP BY article_id
          ORDER BY times_served ASC
          LIMIT 1
        ) AS subquery
      )
    `;

    queryParams = [userId];
  } else {
    throw new Error(`Unsupported category: ${category}`);
  }

  const [servedArticles] = await pool.execute(servedQuery, queryParams);

  return servedArticles;
};

const insertUserArticleServed = async (userId, articleId) => {
  const insertQuery = `INSERT INTO user_article_served (user_id, article_id) VALUES (?, ?)`;
  await pool.execute(insertQuery, [userId, articleId]);
}

const getSwappedArticle = async (req, res) => {
  const { city, state, user_id: userId, category } = req.query;
  validateSwappedArticleInput(city, state, userId, res);

  try {
    const unservedArticles = await getUnservedArticles(city, state, userId, category);
    
    if (unservedArticles.length > 0) {
      unservedArticles[0].category = category;

      await insertUserArticleServed(userId, unservedArticles[0].id);
      res.status(200).json({ article: unservedArticles[0], message: null });
      return
    } 
  
    const servedArticles = await getServedArticles(userId, category, city, state);

    if (servedArticles.length > 0) {
      servedArticles[0].category = category;

      await insertUserArticleServed(userId, servedArticles[0].id);
      res.status(200).json({ article: servedArticles[0], message: 'No unserved articles available. Showing previously served articles.' });
      return
    } 

    if (servedArticles.length === 0) {
      return res.status(200).json({
        message: 'No articles available for the specified parameters.',
      });
    }

    res.status(200).json({ article, message });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the article.',
    });
  }
};

// TO DO: this only creates national articles right now, not yet sure how to handle full city/regional/national logic
const createArticle = async (req, res) => {
  const {
    source,
    scraped,
    api,
    title,
    url,
    img,
    category,
    days_found,
    city_identifier,
    county_identifier,
    state_identifier,
    national_identifier,
    special_identifier,
  } = req.body;

  try {
    const sourced = format(new Date(), 'yyyy-MM-dd HH:mm:ss', {
      timeZone: 'America/Los_Angeles',
    });
  
    const query = `
      INSERT INTO articles (
        source, scraped, api, title, url, img, category, sourced, days_found,
        city_identifier, county_identifier, state_identifier, national_identifier, special_identifier
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      source,
      scraped,
      api,
      title,
      url,
      img,
      category,
      sourced,
      days_found,
      '',
      '',
      '',
      'USA',
      '',
    ];

    await pool.execute(query, values);
    res.status(201).json({ message: 'Article created successfully' });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'An error occurred while creating the article.' });
  }
};

module.exports = { getArticles, getSwappedArticle, createArticle };
