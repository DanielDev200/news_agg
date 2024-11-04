import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function HeroSection() {
  return (
    <Box
      sx={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1531177071018-4e8c8d2a8d1c)',
        backgroundSize: 'cover',
        backgroundColor: 'grey',
        color: 'white',
        textAlign: 'center',
        padding: '80px 20px',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Scroll for news if you want to
      </Typography>
      <Typography variant="h6" gutterBottom>
        Or you can leave that noise behind
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TextField
          variant="outlined"
          placeholder="search your city by name and state or zip code"
          sx={{ backgroundColor: 'white', width: '400px', mr: 2 }}
        />
        <Button variant="contained" color="success">
          <SearchIcon />
        </Button>
      </Box>
    </Box>
  );
}
