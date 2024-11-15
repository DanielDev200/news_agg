// components/ExploreSection.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recordUserArticleClick } from '../api/api';
import { Container, Box, Typography, Grid as Grid2 } from '@mui/material';
import ArticleCard from './ArticleCard';
import DummyCard from './DummyCard';
import LoadingSpinner from './LoadingSpinner';

export function ExploreSection({ articles }) {
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (articles.length > 0 || !isAuthenticated) {
      setLoading(false);
    }
  }, [articles, isAuthenticated]);

  const handleArticleClick = async (article) => {
    if (isAuthenticated && user) {
      await recordUserArticleClick(user.id, article.id);
    }
    window.open(article.url, '_blank');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Local news plus the rest
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid2 container spacing={4} sx={{ mt: 2 }}>
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <Grid2 item key={index} xs={12} sm={6} md={3} lg={3} xl={3}>
                  <ArticleCard article={article} onClick={() => handleArticleClick(article)} />
                </Grid2>
              ))
            ) : (
              !isAuthenticated &&
              [1, 2, 3, 4].map((item, index) => (
                <Grid2 item key={index} xs={12} sm={6} md={3} lg={3} xl={3}>
                  <DummyCard title={`Dummy Title ${item}`} />
                </Grid2>
              ))
            )}
          </Grid2>
        )}
      </Box>
    </Container>
  );
}

export default ExploreSection;
