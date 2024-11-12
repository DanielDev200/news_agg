import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { states } from '../utils/stateUtils';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../utils/axiosConfig';

export function HeroSection({ setArticles }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleSearch = async () => {
    // Regex to match both "City, StateAbbr" or "City, FullStateName"
    const cityStateRegex = /^([\w\s]+),\s*([\w\s]+)$/;
    const match = cityStateRegex.exec(inputValue.trim().toLowerCase());
  
    if (!match) {
      setError('Please enter a valid city and state (e.g., "Long Beach, CA" or "Long Beach, California").');
      return;
    }
  
    let city = match[1].trim();
    let stateInput = match[2].trim();
  
    // If the state is provided as full name, convert it to abbreviation
    let state = stateInput.length === 2 ? stateInput.toUpperCase() : states[stateInput.toLowerCase()];
  
    if (!state) {
      setError('Please enter a valid state name or abbreviation.');
      return;
    }

    console.log('city: ', city);
    console.log('state: ', state);
  
    try {
      const response = await axios.get(`/articles?city=${city}&state=${state}`);
      if (response.status === 200) {
        setArticles(response.data.articles.slice(0, 10));
      } else {
        setError('No articles found for the specified city and state.');
      }
    } catch (err) {
      setError('Error fetching articles. Please try again.');
      console.error('Error fetching articles:', err);
    }
  }

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
        Doom scroll if you want to
      </Typography>
      <Typography variant="h6" gutterBottom>
        Or you can leave that noise behind
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TextField
          variant="outlined"
          placeholder="search your city by name and state or zip code"
          value={inputValue}
          onChange={handleInputChange}
          error={!!error}
          helperText={error}
          sx={{ backgroundColor: 'white', width: '400px', mr: 2 }}
        />
        <Button variant="contained" color="success" onClick={handleSearch}>
          <SearchIcon />
        </Button>
      </Box>
    </Box>
  );
}
