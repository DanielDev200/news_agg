import axios from './axiosConfig';

export const fetchArticles = async (city, state) => {
  try {
    const response = await axios.get(`/articles?city=${city}&state=${state}`);
    if (response.status === 200) {
      return { articles: response.data.articles.slice(0, 10) };
    }
    return { error: 'No articles found for the specified city and state.' };
  } catch (err) {
    console.error('Error fetching articles:', err);
    return { error: 'Error fetching articles. Please try again.' };
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

