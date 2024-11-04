import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

export function ExploreSection() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Local news plus the rest
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {[1, 2, 3, 4].map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
