import axios from './axiosConfig';

export const fetchArticles = async (city, state, user_id) => {
  try {
    
    const response = await axios.get('/articles', {
      params: {
        city,
        state,
        user_id
      }
    });

    if (response.status === 200) {
      return { articles: response.data.articles };
    }
    return { error: 'No articles found for the specified city and state.' };
  } catch (err) {
    console.error('Error fetching articles:', err);
    return { error: 'Error fetching articles. Please try again.' };
  }
};

export const fetchSwappedArticle = async (city, state, user_id, category, articleId, sources) => {
  try {
    const response = await axios.get('/articles/swap', {
      params: {
        city,
        state,
        user_id,
        category,
        articleId,
        sources
      },
    });

    if (response.status === 200 && response.data.message) {
      return {
        articleMessage: true,
        message: response.data.message,
        messageType: 'servedContentShown',
        article: response.data.article
      };
    }

    if (response.status === 200 && response.data.article) {
      return { article: response.data.article };
    }

    return { error: 'Unexpected response from the server.' };
  } catch (err) {
    console.error('Error fetching swapped article:', err);
    return { error: 'Error fetching article. Please try again.' };
  }
};

export const saveUserLocation = async (userId, city, state) => {
  try {
    const response = await axios.post('/user-location', { user_id: userId, city, state });
    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to save user location' };
    }
  } catch (err) {
    console.error('Error saving user location:', err);
    return { success: false, error: 'An error occurred while saving user location' };
  }
};

export const fetchUserArticlesByDate = async (userId, date) => {
  try {
    const response = await axios.get('/user-article-click/by-user-and-date', {
        params: {
          userId,
          date
        }
    });
    
    if (response.status === 200 && response.data) {
      return { success: true, articles: response.data.articles };
    } else {
      return { success: false, error: 'No articles found for this date' };
    }
  } catch (err) {
    console.error('Error fetching articles by date:', err);
    return { success: false, error: 'An error occurred while fetching the articles' };
  }
};


export const fetchUserLocation = async (userId) => {
  try {
    const response = await axios.get(`/user-location?user_id=${userId}`);

    if (response.status === 200) {
      return { location: response.data };
    } else {
      return { error: 'User location not found' };
    }
  } catch (err) {
    console.error('Error fetching user location:', err);
    return { error: 'An error occurred while fetching user location' };
  }
};

export const recordUserArticleClick = async (userId, articleId) => {
  try {
    const response = await axios.post('/user-article-click', {
      user_id: userId,
      article_id: articleId,
    });

    return response.status === 200;
  } catch (error) {
    console.error('Error recording article click:', error);
    return false;
  }
};

export const fetchUserRole = async (userId) => {
  try {
    const response = await axios.get(`/user-role/${userId}`);

    return response.data;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

export const createArticle = async (formData) => {  
  try {
      const response = await axios.post('/articles', {
        source: formData.source || null,
        scraped: formData.scraped || false,
        api: formData.api || false,
        title: formData.title || null,
        url: formData.url || null,
        img: formData.img || null,
        category: formData.category || null,
        days_found: formData.days_found || null,
        city_identifier: formData.city_identifier || null,
        county_identifier: formData.county_identifier || null,
        state_identifier: formData.state_identifier || null,
        national_identifier: formData.national_identifier || null,
        special_identifier: formData.special_identifier || null,
      });
  
      if (response.status !== 201) {
        throw new Error('An error occurred while creating the article.');
      }
  
      return response.data;
  } catch (error) {
      console.error('Error:', error);
  }
};

export const fetchSources = async () => {
  try {
    const response = await axios.get('/sources');
    return response.data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
};


export const createSource = async (formData) => {  
  try {
      const response = await axios.post('/sources', {
        source: formData.source,
        loads_in_iframe: formData.loads_in_iframe,
        notes: formData.notes || ''
      });
  
      if (response.status !== 201) {
        throw new Error('An error occurred while creating the source.');
      }
  
      return response.data;
  } catch (error) {
      console.error('Error:', error);
  }
};

export const updateSourceNotes = async (id, notes) => {
  try {
    const response = await axios.put(`/sources/${id}`, { notes });

    if (response.status !== 200) {
      throw new Error('An error occurred while updating the notes.');
    }

    return response.data;
  } catch (error) {
    console.error('Error updating source notes:', error);
    throw error;
  }
};