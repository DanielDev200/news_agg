import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

export function DummyCard({ title = 'Dummy Title', description = 'Some short description for the news article.' }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image="https://via.placeholder.com/300"
        alt="News Thumbnail"
      />
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DummyCard;
