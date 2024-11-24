import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Drawer, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LoadingSpinner from './LoadingSpinner';
import ArticleList from './ArticleList';
import WelcomeMessage from './WelcomeMessage';
import { useAuth } from '../context/AuthContext';
import { recordUserArticleClick, fetchSwappedArticle } from '../api/api';
import PopupDialog from './PopupDialog';

export function ExploreSection({ articles, setArticles, articleFetchMade }) {
  const { user, isAuthenticated, authAttempted, userLocation } = useAuth();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', message: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [articleUrl, setArticleUrl] = useState('');
  const [servedContentMessageShown, setServedContentMessageShown] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userLocation) {
      setLoading(articleFetchMade === false);
    } else {
      setLoading(false);
    }
  }, [articleFetchMade, isAuthenticated, userLocation]);

  const handleArticleClick = async (article) => {
    if (isAuthenticated && user) {
      await recordUserArticleClick(user.id, article.id);
    }
    // Open the drawer and set the article URL
    setArticleUrl(article.url);
    setDrawerOpen(true);
  };

  const handleNotRegistered = () => {
    setPopupContent({
      title: 'Registration Required',
      message: 'You need to register or log in to swap articles.',
    });
    setPopupOpen(true);
    return;
  };

  const handleSetSwappedArticle = (newArticle, index) => {
    setArticles((prevArticles) => {
      const updatedArticles = [...prevArticles];
      updatedArticles[index] = newArticle;
      return updatedArticles;
    });
  };

  const handleArticleMessage = (message) => {
    setPopupContent({
      title: 'No More Articles',
      message,
    });
    setPopupOpen(true);
  };

  const handleArticleError = (fetchError) => {
    console.error('Error fetching unserved article:', fetchError);
    setPopupContent({
      title: 'Error',
      message: 'An error occurred while fetching a new article. Please try again.',
    });
    setPopupOpen(true);

    return;
  };

  const handleArticleSwap = async (index) => {
    if (!isAuthenticated) {
      handleNotRegistered();
      return;
    }

    try {
      const {
        article: newArticle,
        articleMessage,
        message,
        messageType,
        error: fetchError,
      } = await fetchSwappedArticle(
        userLocation.city,
        userLocation.state,
        user.id
      );

      if (fetchError) {
        handleArticleError(fetchError);
        return;
      }

      if (articleMessage && !servedContentMessageShown && messageType === 'servedContentShown') {
        handleArticleMessage(message);
        setServedContentMessageShown(true);
      }

      if (newArticle) {
        handleSetSwappedArticle(newArticle, index);
      } else {
        console.warn("Unexpected response: No error, no new article, and no 'articleMessage' flag.");
      }
    } catch (error) {
      handleArticleError(error);
    }
  };

  const renderContent = () => {
    if (!authAttempted) {
      return null;
    }

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
          {'No articles found for your selected city and state.'}
        </Typography>
      );
    }

    return null;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        {renderContent()}
      </Box>
      <PopupDialog
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupContent.title}
        message={popupContent.message}
      />
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          zIndex: 1300,
          '& .MuiPaper-root': {
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden'
          },
        }}
      >
        <Box sx={{ height: '95vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* iFrame Content */}
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <iframe
              src={articleUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="Article"
            />
          </Box>
          {/* Close and Open in New Tab Buttons */}
    <Box
      sx={{
        height: '50px', // Height for the button container
        display: 'flex',
        justifyContent: 'space-between', // Space between buttons
        alignItems: 'center',
        background: 'white', // Background for visual clarity
        borderTop: '1px solid #ccc', // Subtle border
        px: 2, // Padding for spacing
      }}
    >
      {/* Close Button */}
      <Button
        onClick={() => setDrawerOpen(false)}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          textTransform: 'none', // Prevent uppercase transformation
          fontSize: '16px', // Font size for the button text
          color: '#000', // Text color
        }}
      >
        Close
      </Button>

      {/* Open in New Tab Button */}
      <Button
        onClick={() => window.open(articleUrl, '_blank')}
        endIcon={<OpenInNewIcon />}
        sx={{
          textTransform: 'none', // Prevent uppercase transformation
          fontSize: '16px', // Font size for the button text
          color: '#000', // Text color
        }}
      >
        Open in New Tab
      </Button>
    </Box>
        </Box>
      </Drawer>
    </Container>
  );
}

export default ExploreSection;
