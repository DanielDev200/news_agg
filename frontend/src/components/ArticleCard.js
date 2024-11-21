import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // Swap icon

const ArticleCard = ({ article, onSwap, onClick }) => {
  return (
    <Card sx={{ position: 'relative', cursor: 'pointer' }}>
      <CardMedia
        component="img"
        height="140"
        image={article.img || 'https://via.placeholder.com/300'}
        alt="News Thumbnail"
        onClick={onClick}
      />
      <CardContent>
        <Typography variant="h6">{article.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {new URL(article.source).hostname}
        </Typography>
      </CardContent>
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}
        onClick={onSwap}
      >
        <SwapHorizIcon />
      </IconButton>
    </Card>
  );
};

export default ArticleCard;