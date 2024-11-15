import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

export function ArticleCard({ article, onClick }) {
  return (
    <Card onClick={onClick} sx={{ cursor: 'pointer' }}>
      <CardMedia
        component="img"
        height="140"
        image={article.img || 'https://via.placeholder.com/300'}
        alt="News Thumbnail"
      />
      <CardContent>
        <Typography variant="h6">{article.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {new URL(article.source).hostname}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ArticleCard;
