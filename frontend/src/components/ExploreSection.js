import React from 'react';
import { Container, Box, Typography, Grid2, Card, CardContent, CardMedia } from '@mui/material';

export function ExploreSection({ articles }) {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Local news plus the rest
        </Typography>
        <Grid2 container spacing={4} sx={{ mt: 2 }}>
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <Grid2 item key={index} xs={12} sm={6} md={3} lg={3} xl={3}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={article.img || 'https://via.placeholder.com/300'}
                    alt="News Thumbnail"
                  />
                  <CardContent>
                    <Typography variant="h6">{article.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {article.description || 'Some short description for the news article.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))
          ) : (
            // Show dummy content if no articles have been fetched
            [1, 2, 3, 4].map((item, index) => (
              <Grid2 item key={index} xs={12} sm={6} md={3} lg={3} xl={3}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://via.placeholder.com/300"
                    alt="News Thumbnail"
                  />
                  <CardContent>
                    <Typography variant="h6">Dummy Title {item}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Some short description for the news article.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))
          )}
        </Grid2>
      </Box>
    </Container>
  );
}
