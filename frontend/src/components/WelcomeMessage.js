import React from 'react';
import { Typography, Grid as Grid2, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const WelcomeMessage = () => (
  <Grid2 item xs={12}>
    <Box sx={{ textAlign: 'left', margin: '20px 10px' }}>
      <Typography variant="body1" gutterBottom sx={{ marginBottom: '16px' }}>
        News can be overwhelming. It's hard to make sense of all the information available.
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ marginBottom: '16px' }}>
        News Aggregator helps by organizing news into 4 categories:
      </Typography>
      <List sx={{ mt: 2, marginBottom: '16px' }}>
        {['Local News', 'County News', 'State News', 'National News'].map((category, index) => (
          <ListItem sx={{ padding: '4px 0' }} key={index}>
            <ListItemIcon sx={{ minWidth: '20px' }}>
              <FiberManualRecordIcon sx={{ fontSize: '16px' }} />
            </ListItemIcon>
            <ListItemText primary={category} />
          </ListItem>
        ))}
      </List>
      <Typography variant="body1" gutterBottom sx={{ marginTop: '20px' }}>
        Enter the name of your city and the state to get started
      </Typography>
    </Box>
  </Grid2>
);

export default WelcomeMessage;
