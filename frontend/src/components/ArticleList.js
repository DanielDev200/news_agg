import React from 'react';
import { Grid as Grid2 } from '@mui/material';
import ArticleTile from './ArticleTile';

const ArticleList = ({ articles, setArticles, clickedArticleIds, onArticleClick, onArticleSwap }) => {

  const removeArticle = (articleId) => setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));

  return (
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
            clickedArticleIds={clickedArticleIds}
            onArticleClick={() => onArticleClick(article)}
            onArticleSwap={() => onArticleSwap(index)}
            onRemoveArticle={removeArticle}
          />
        </Grid2>
      ))}
    </Grid2>
  )
};

export default ArticleList;
