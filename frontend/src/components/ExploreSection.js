import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import LoadingSpinner from './LoadingSpinner';
import ArticleList from './ArticleList';
import WelcomeMessage from './WelcomeMessage';
import { useAuth } from '../context/AuthContext';
import { recordUserArticleClick, fetchUnservedArticle } from '../api/api';
import PopupDialog from './PopupDialog';

export function ExploreSection({ articles, setArticles, articleFetchMade }) {
  const { user, isAuthenticated, userLocation } = useAuth();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [noArticlesMessage, setNoArticlesMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && userLocation) {
      setLoading(articleFetchMade === false);
    } else {
      setLoading(false);
    }
  }, [articles, isAuthenticated, userLocation]);

  const handleArticleClick = async (article) => {
    if (isAuthenticated && user) {
      await recordUserArticleClick(user.id, article.id);
    }
    window.open(article.url, '_blank');
  };

  const handleArticleSwap = async (index) => {
    if (!isAuthenticated) {
      setPopupOpen(true);
      return;
    }

    try {
      const currentArticle = articles[index];
      const { article: newArticle, error: fetchError } = await fetchUnservedArticle(
        userLocation.city,
        userLocation.state,
        user.id
      );

      if (fetchError) {
        console.error('Error fetching unserved article:', fetchError);
        return;
      }

      if (newArticle) {
        setArticles((prevArticles) => {
          const updatedArticles = [...prevArticles];
          updatedArticles[index] = newArticle;
          return updatedArticles;
        });
      } else {
        console.log('No unserved article available to swap.');
      }
    } catch (error) {
      console.error('Error swapping article:', error);
    }
  };

  const renderContent = () => {
    if (!isAuthenticated && !articleFetchMade) {
      return <WelcomeMessage />;
    }

    if (loading) {
      return <LoadingSpinner />;
    }

    if (articleFetchMade && articles.length > 0) {
      return (
        <ArticleList
          articles={articles}
          onArticleClick={handleArticleClick}
          onArticleSwap={handleArticleSwap}
        />
      );
    }

    if (articleFetchMade && articles.length === 0) {
      return (
        <Typography variant="h6" sx={{ color: 'grey', textAlign: 'left', mt: 2 }}>
          {noArticlesMessage || 'No articles found for your selected city and state.'}
        </Typography>
      );
    }

    return null; // Fallback in case none of the conditions match
  };

  if (!isAuthenticated && !articleFetchMade) {
    return <WelcomeMessage/>
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        {renderContent()}
      </Box>
      <PopupDialog
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="Registration Required"
        message="You need to register or log in to swap articles."
      />
    </Container>
  );
}

export default ExploreSection;
