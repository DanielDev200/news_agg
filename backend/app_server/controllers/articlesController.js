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
          article.category = 'local';
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
      const clickedQuery = `
        SELECT article_id 
        FROM user_article_clicks 
        WHERE user_id = ? AND created_at >= NOW() - INTERVAL 30 DAY
      `;
      const [clickedArticles] = await pool.execute(clickedQuery, [userId]);
      const clickedArticleIds = clickedArticles.map((row) => row.article_id);
  
      const swappedQuery = `
        SELECT article_id 
        FROM user_article_swap 
        WHERE user_id = ?
      `;
      const [swappedArticles] = await pool.execute(swappedQuery, [userId]);
      const swappedArticleIds = swappedArticles.map((row) => row.article_id);
  
      const excludedArticleIds = new Set([...clickedArticleIds, ...swappedArticleIds]);
  
      return articles.filter((article) => !excludedArticleIds.has(article.id));
    } catch (error) {
      console.error('Error filtering clicked and swapped articles:', error);
      return articles;
    }
  },
  applyFilters: async (articles, userId) => {
    let filteredArticles = articles;

    if (userId) {
      filteredArticles = await getArticlesFunctions.filterClickedArticles(filteredArticles, userId);
    }

    const topFiveArticles = getArticlesFunctions.getTopFiveArticles(filteredArticles);

    return topFiveArticles;
  },
  getTopFiveArticles: (articles) => {
  
    if (articles.length < 5) {
      return articles;
    }
  
    const sourceMap = new Map();
    for (const article of articles) {
      if (!sourceMap.has(article.source)) {
        sourceMap.set(article.source, []);
      }
      sourceMap.get(article.source).push(article);
    }
  
    const uniqueSources = Array.from(sourceMap.keys());
    const totalUniqueSources = uniqueSources.length;
  
    if (totalUniqueSources >= 5) {
      return uniqueSources.slice(0, 5).map(source => sourceMap.get(source)[0]);
    }
  
    const result = [];
    let remainingSlots = 5;
    let index = 0;
  
    while (remainingSlots > 0) {
      const source = uniqueSources[index % totalUniqueSources];
      if (sourceMap.get(source).length > 0) {
        result.push(sourceMap.get(source).shift());
        remainingSlots--;
      }
      index++;
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
  getUnservedArticle: async (city, state, userId, category, sources) => {
    let unservedQuery;
    let queryParams = [];

    console.log(sources);
  
    if (category === 'local') {
      unservedQuery = `
        select * from articles
        where city_identifier = ? and state_identifier = ?
        and sourced between curdate() - interval 14 day and curdate()
        and id not in (
          select article_id from user_article_served where user_id = ?
        )
        order by sourced desc
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
      `;
      
      queryParams = [userId];
    }  else {
      throw new Error(`Unsupported category: ${category}`);
    }
  
    try {
      const [unservedArticles] = await pool.execute(unservedQuery, queryParams);
  
      if (unservedArticles.length === 0) {
        return null;
      }
  
      const sourceCount = sources.reduce((count, source) => {
        count[source] = (count[source] || 0) + 1;
        return count;
      }, {});
  
      let selectedArticle = null;
      let leastUsedSource = null;
      let minSourceCount = Infinity;
  
      for (const article of unservedArticles) {
        const source = article.source;
        const currentCount = sourceCount[source] || 0;
  
        if (currentCount < minSourceCount) {
          minSourceCount = currentCount;
          leastUsedSource = source;
          selectedArticle = article;
        }
      }
  
      if (selectedArticle) {
        // console.log(`Selected article from source '${selectedArticle.source}' to balance representation.`);
      } else {
        selectedArticle = unservedArticles[0];
      }
  
      return selectedArticle;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Error fetching unserved articles');
    }
  },
  logArticleServed: async (userId, articleId) => {
    const insertQuery = `INSERT INTO user_article_served (user_id, article_id) VALUES (?, ?)`;
    await pool.execute(insertQuery, [userId, articleId]);
  },
  logArticleSwapped: async (userId, articleId) => {
    const insertQuery = `INSERT INTO user_article_swap (user_id, article_id) VALUES (?, ?)`;
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
  const { city, state, user_id: userId, category, articleId, sources } = req.query;

  const missingParams = swappedArticleFunctions.validateSwappedArticleInput(city, state, userId);
  if (missingParams.length > 0) {
    return res.status(400).json({
      error: `Missing parameter(s): ${missingParams.join(', ')}. Please provide all required parameters.`,
    });
  }

  try {
    const unservedArticle = await swappedArticleFunctions.getUnservedArticle(city, state, userId, category, sources);
    
    if (unservedArticle) {
      unservedArticle.category = category;
      await swappedArticleFunctions.logArticleServed(userId, unservedArticle.id);
      await swappedArticleFunctions.logArticleSwapped(userId, articleId);
      return res.status(200).json({ article: unservedArticle, message: null });
    }
  
    const servedArticle = await swappedArticleFunctions.getServedArticle(userId, category, city, state, sources);

    if (servedArticle) {
      servedArticle.category = category;
      await swappedArticleFunctions.logArticleServed(userId, servedArticle.id);
      await swappedArticleFunctions.logArticleSwapped(userId, articleId);
      return res.status(200).json({ article: servedArticle, message: 'No unserved articles available. Showing previously served articles.' });
    } 

    return res.status(200).json({
      message: 'No articles available for the specified parameters.',
    });
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
