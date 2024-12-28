import React from 'react';
import { Typography, Grid as Grid2, Box } from '@mui/material';

const WelcomeMessageAuthed = () => (
  <Grid2 item xs={12}>
    <Box sx={{ textAlign: 'left', margin: '20px 10px' }}>
      <Typography variant="p" component="p" sx={{textAlign: 'left', fontSize: '20px'}}>
        You've created your account but haven't selected a city.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        Select a city above to start getting almost all the news.
      </Typography>
    </Box>
  </Grid2>
);

export default WelcomeMessageAuthed;
