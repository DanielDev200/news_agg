import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Grid as Grid2 } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckIcon from '@mui/icons-material/Check';
import { useSwipeable } from 'react-swipeable';

const ArticleTile = ({ article
  ,clickedArticleIds
  , onArticleSwap
  , onArticleClick
  , onRemoveArticle
  , articleIndex
}) => {
  const [positionX, setPositionX] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const articleRead = clickedArticleIds.includes(article.id) || article.clicked;

  const buttonConfig = articleRead ? {
    icon: <CheckIcon/>,
    onClick: () => {},
    backgroundColor: 'success.main',
    hoverColor: 'white',
    hoverBackgroundCover: 'success.dark'
  } : {
    icon: <SwapHorizIcon />,
    onClick: () => {onArticleSwap()},
    backgroundColor: 'grey',
    hoverColor: 'white',
    hoverBackgroundCover: 'grey'
  }

  const handleSwipe = (eventData) => {
    if (articleRead && eventData.dir === 'Left') {
      setPositionX(eventData.deltaX);

      if (eventData.deltaX < -90) {
        setIsRemoving(true);
        setTimeout(() => {
          // onRemoveArticle(article.id);
          // onArticleSwap();
        }, 300);
      }
    }
  };

  const handleSwipeEnd = () => {
    if (articleRead) {
      if (positionX < -90) {
        setIsRemoving(true); 
        setTimeout(() => {
          // onRemoveArticle(article.id);
          onArticleSwap();
        }, 300);
      } else {
        setPositionX(0);
      }
    }
  };

  const swipeHandlers = useSwipeable({
    onSwiping: handleSwipe,
    onSwiped: handleSwipeEnd,
    trackMouse: true,
    preventDefaultTouchmoveEvent: true
  });

  return (
    <Card
      {...(articleRead ? swipeHandlers : {})}
      sx={{
        marginTop: articleIndex === 0 ? '50px' : '',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 0,
        backgroundColor: articleRead ? '#eee' : 'ghostwhite',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
        position: 'relative',
        width: '100%',
        transform: `translateX(${positionX}px)`,
        opacity: isRemoving ? 0 : 1,
        transition: positionX === 0 && !isRemoving 
          ? 'transform 0.3s ease-in-out' 
          : 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
      }}
      onClick={onArticleClick}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          buttonConfig.onClick();
        }}
        size='small'
        sx={{
          position: 'absolute',
          right: '28px',
          bottom: '8px',
          alignSelf: 'start',
          color: 'white',
          backgroundColor: buttonConfig.backgroundColor,
          '&:hover': {
            color: buttonConfig.hoverColor,
            backgroundColor: buttonConfig.hoverBackgroundCover
          }
        }}
      >
        {buttonConfig.icon}
      </IconButton>
      <Grid2 item xs={1}/> 
      <Grid2 item xs={10} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <CardContent sx={{ flex: 1, paddingBottom: '16px !important'}}>
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
