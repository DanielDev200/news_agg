import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import { imageDictionary } from '../utils/dataUtils';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // Swap icon

const getArticleImage = (title) => {
  // if (!title) return 'https://via.placeholder.com/300';

  // const lowerTitle = title.toLowerCase();

  // for (const category in imageDictionary) {
  //   const { keywords, image } = imageDictionary[category];
  //   if (keywords.some((keyword) => lowerTitle.includes(keyword))) {
  //     return image;
  //   }
  // }

  return 'https://via.placeholder.com/300';
};

const getArticleCategory = (article) => {
  if (article.city_identifier && article.county_identifier && article.state_identifier && article.national_identifier) {
    return 'City';
  } else if (!article.city_identifier && article.county_identifier && article.state_identifier && article.national_identifier) {
    return 'County';
  } else if (!article.city_identifier && !article.county_identifier && article.state_identifier && article.national_identifier) {
    return 'State';
  } else if (!article.city_identifier && !article.county_identifier && !article.state_identifier && article.national_identifier) {
    return 'National';
  }
  return 'Uncategorized';
};

const ArticleCard = ({ article, onSwap, onClick }) => {
  const articleImage = getArticleImage(article.title);
  const articleCategory = getArticleCategory(article);

  return (
    <Card sx={{ position: 'relative', cursor: 'pointer' }}>
      <CardMedia
        component="img"
        height="140"
        image={articleImage}
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
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '16px',
        }}
      >
        <Typography variant="caption">{articleCategory}</Typography>
      </Box>
    </Card>
  );
};

export default ArticleCard;