import React from 'react';
import { Grid as Grid2 } from '@mui/material';
import ArticleTile from './ArticleTile';

const ArticleList = ({ articles, onArticleClick, onArticleSwap }) => (
  <Grid2 container spacing={0}>
    {articles.map((article, index) => (
      <Grid2
        item
        key={article.id || index}
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ArticleTile
          article={article}
          onClick={() => onArticleClick(article)}
          onSwap={() => onArticleSwap(index)}
        />
      </Grid2>
    ))}
  </Grid2>
);

export default ArticleList;
