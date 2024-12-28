import React from 'react';
import { Typography, Grid as Grid2, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const WelcomeMessage = () => (
  <Grid2 item xs={12}>
    <Box sx={{ textAlign: 'left', margin: '20px 10px' }}>
      <Typography variant="p" component="p" sx={{textAlign: 'left', fontSize: '20px'}}>
        (almost) All The News is your sole source for news...almost.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        AATN puts local news into a feed alongside national stories, so you get the full picture.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        Just try finding real, actual local news on another aggregator. If you do, please share it with me.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        I couldn't find one so I built this instead.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        If you want more information, check out the about page.
      </Typography>
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        Otherwise, enter your city above (or request it if it's not there), and start getting almost all the news, today!
      </Typography>
    </Box>
  </Grid2>
);

export default WelcomeMessage;
