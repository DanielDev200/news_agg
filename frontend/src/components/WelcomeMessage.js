import React from 'react';
import { Typography, Grid as Grid2, Box } from '@mui/material';

const WelcomeMessage = () => (
  <Grid2 item xs={12}>
    <Box sx={{ textAlign: 'left', margin: '20px 20px' }}>
      <Typography variant="p" component="p" sx={{textAlign: 'left'}}>
        (almost) All The News prioritizes <strong>local publications</strong> and lets you focus on a few articles at a time.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        So you can get caught up, not sucked in.
      </Typography>
    </Box>
  </Grid2>
);

export default WelcomeMessage;
