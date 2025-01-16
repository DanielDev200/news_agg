import React from 'react';
import { Card, CardContent, Typography, IconButton, Grid as Grid2 } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // Swap icon

const ArticleTile = ({ article, onSwap, onClick }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 0,
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
        position: 'relative',
        width: '100%'
      }}
      onClick={onClick}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onSwap();
        }}
        // variant='outlined'
        size='small'
        sx={{
          position: 'absolute',
          right: '16px',
          bottom: '8px',
          alignSelf: 'start',
          color: 'white',
          backgroundColor: 'grey',
          '&:hover': {
            color: 'white',
            backgroundColor: 'grey'
          }
        }}
      >
        <SwapHorizIcon />
      </IconButton>
      <Grid2 item xs={1}/> 
       <Grid2 item xs={10} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CardContent sx={{ flex: 1, padding: '16px 28px 0px 0px', paddingBottom: '16px !important'}}>
          <Typography variant="body2" color="textSecondary">
          <span style={{ color: article.category === 'local' ? 'blue' : article.category === 'national' ? 'purple' : 'inherit' }}>
            {`${article.category} `}
            </span>
            | {new URL(article.source).hostname}
            
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 1, fontSize: '18px' }}>
            {article.title}
          </Typography>
        </CardContent>
      </Grid2>
    </Card>
  );
};

export default ArticleTile;
