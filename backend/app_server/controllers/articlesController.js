const pool = require('../db/config');
const { format } = require('date-fns-tz');

const getArticlesFunctions = {
  validateParams: (city, state) => {
    const missingParams = [];

    if (!city) missingParams.push('city');

    if (!state) missingParams.push('state');

    return missingParams;
  },
  logArticlesServed: async (filteredArticles, userId) => {
    const logPromises = Object.values(filteredArticles).flatMap((articles) =>
      articles.map((article) =>
        pool.execute(`INSERT INTO user_article_served (user_id, article_id) VALUES (?, ?)`, [
          userId,
          article.id,
        ])
      )
    );
    await Promise.all(logPromises);
  },
  handleError: (res, error) => {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ error: 'An error occurred while fetching articles.' });
  },
  filterArticlesByUser: async (categorizedArticles, userId) => {
    const filteredCityArticles = await getArticlesFunctions.applyFilters(categorizedArticles.city, userId);
    const filteredNationalArticles = await getArticlesFunctions.applyFilters(categorizedArticles.national, userId);
  
    return {
      city: filteredCityArticles,
      national: filteredNationalArticles,
    };
  },
  categorizeArticles: (articles) => {
    return articles.reduce(
      (categories, article) => {
        if (article.city_identifier && article.state_identifier) {
          article.category = 'city';
          categories.city.push(article);
        } else if (article.national_identifier) {
          article.category = 'national';
          categories.national.push(article);
        }
        return categories;
      },
      { city: [], county: [], state: [], national: [] }
    );
  },
  fetchArticles: async () => {
    const query = `select * from articles where sourced between curdate() - interval 14 day and curdate() order by sourced desc`;
    const [articles] = await pool.execute(query);
    return articles;
  },
  filterClickedArticles: async (articles, userId) => {
    if (!userId) {
      return articles;
    }

    try {
        const query = `select article_id from user_article_clicks where user_id = ? and created_at >= now() - interval 30 day`;
        const [clickedArticles] = await pool.execute(query, [userId]);
        const clickedArticleIds = clickedArticles.map((row) => row.article_id);

        return articles.filter((article) => !clickedArticleIds.includes(article.id));
    } catch (error) {
        console.error('Error filtering clicked articles:', error);
        return articles;
    }
  },
  applyFilters: async (articles, userId) => {
    let filteredArticles = articles;

    if (userId) {
      filteredArticles = await getArticlesFunctions.filterClickedArticles(filteredArticles, userId);
    }

    const topThreeArticles = getArticlesFunctions.getTopThreeArticles(filteredArticles);

    return topThreeArticles;
  },
  getTopThreeArticles: (articles) => {
    if (articles.length < 3) {
      return articles.slice(0, 3);
    }
  
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
      const remainingArticles = articles.filter(
        article => !sourcesSet.has(article.source)
      );
      result.push(...remainingArticles.slice(0, 3 - result.length));
    }
  
    return result;
  }
}

const getArticles = async (req, res) => {
  const { city, state, user_id: userId } = req.query;

  const missingParams = getArticlesFunctions.validateParams(city, state);

  if (missingParams.length > 0) {
    return res.status(400).json({error: `Missing parameter(s): ${missingParams.join(', ')}. Please provide all required parameters.`});
  }

  try {
    const articles = await getArticlesFunctions.fetchArticles();

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

    const categorizedArticles = getArticlesFunctions.categorizeArticles(articles);
    const filteredArticles = await getArticlesFunctions.filterArticlesByUser(categorizedArticles, userId);

    if (userId) {
      await getArticlesFunctions.logArticlesServed(filteredArticles, userId);
    }

    return res.json({ articles: filteredArticles });
  } catch (error) {
    return getArticlesFunctions.handleError(res, error);
  }
};

const swappedArticleFunctions = {
  validateSwappedArticleInput: (city, state, userId) => {
    const missingParams = [];

    if (!city || !state || !userId) {
      if (!city) missingParams.push('city');
      if (!state) missingParams.push('state');
      if (!userId) missingParams.push('userId');
    }

    return missingParams;
  },
  getUnservedArticle: async (city, state, userId, category) => {
    let unservedQuery;
    let queryParams = [];
  
    if (category === 'city') {
      unservedQuery = `
        select * from articles
        where city_identifier = ? and state_identifier = ?
        and id not in (
          select article_id from user_article_served where user_id = ?
        )
        order by sourced desc
        limit 1
      `;
        
      queryParams = [city, state, userId];
    } else if (category === 'national') {
      unservedQuery = `
        select * from articles
        where national_identifier = 'USA'
        and sourced between curdate() - interval 14 day and curdate()
        and id not in (
          select article_id from user_article_served where user_id = ?
        )
        order by sourced desc
        limit 1
      `;
      
      queryParams = [userId];
    }  else {
      throw new Error(`Unsupported category: ${category}`);
    }
  
    const [[unservedArticle]] = await pool.execute(unservedQuery, queryParams);
    
    return unservedArticle;
  },
  logArticleServed: async (userId, articleId) => {
    const insertQuery = `INSERT INTO user_article_served (user_id, article_id) VALUES (?, ?)`;
    await pool.execute(insertQuery, [userId, articleId]);
  },
  getServedArticle: async (userId, category, city = null, state = null) => {
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
  
    const [[servedArticle]] = await pool.execute(servedQuery, queryParams);
  
    return servedArticle;
  }
}

const getSwappedArticle = async (req, res) => {
  const { city, state, user_id: userId, category } = req.query;
  const missingParams = swappedArticleFunctions.validateSwappedArticleInput(city, state, userId);

  if (missingParams.length > 0) {
    return res.status(400).json({
      error: `Missing parameter(s): ${missingParams.join(', ')}. Please provide all required parameters.`,
    });
  }

  try {
    const unservedArticle = await swappedArticleFunctions.getUnservedArticle(city, state, userId, category);
    
    if (unservedArticle) {
      unservedArticle.category = category;
      await swappedArticleFunctions.logArticleServed(userId, unservedArticle.id);
      return res.status(200).json({ article: unservedArticle, message: null });
    }
  
    const servedArticle = await swappedArticleFunctions.getServedArticle(userId, category, city, state);

    if (servedArticles.length > 0) {
      servedArticle.category = category;

      await swappedArticleFunctions.logArticleServed(userId, servedArticle.id);
      return res.status(200).json({ article: servedArticle, message: 'No unserved articles available. Showing previously served articles.' });
    } 

    if (servedArticles.length === 0) {
      return res.status(200).json({
        message: 'No articles available for the specified parameters.',
      });
    }
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
