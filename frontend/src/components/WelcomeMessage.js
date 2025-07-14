import React from 'react';
import { Typography, Grid as Grid2, Box } from '@mui/material';

const WelcomeMessage = () => (
  <Grid2 item xs={12}>
    <Box sx={{ textAlign: 'left', margin: '20px 20px' }}>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        Getting local news is hard.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        Big sites ignore it. Newsletters get buried. Social media is a mess.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        Get headlines straight from <strong>local publications</strong> instead with Almost All The News.
      </Typography>
    </Box>
  </Grid2>
);

export default WelcomeMessage;
