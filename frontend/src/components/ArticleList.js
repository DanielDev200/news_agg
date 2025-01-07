import React from 'react';
import { Grid as Grid2 } from '@mui/material';
import ArticleCard from './ArticleCard';

const ArticleList = ({ articles, onArticleClick, onArticleSwap }) => (
  <Grid2 container spacing={4} sx={{ mt: 2, justifyContent: 'center', alignItems: 'center' }}>
    {articles.map((article, index) => (
      <Grid2 item key={article.id || index} xs={12} className="fade-in">
        <ArticleCard
          article={article}
          onClick={() => onArticleClick(article)}
          onSwap={() => onArticleSwap(index)}
        />
      </Grid2>
    ))}
  </Grid2>
);

export default ArticleList;
