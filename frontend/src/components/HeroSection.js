import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { states } from '../utils/stateUtils';
import { capitalizeWords } from '../utils/functions';
import SearchIcon from '@mui/icons-material/Search';
import { fetchArticles, saveUserLocation } from '../api/api';
import { useAuth } from '../context/AuthContext';

export function HeroSection({ setArticles }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const { user, isAuthenticated, userLocation } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userLocation && userLocation.city && userLocation.state) {
      const formattedLocation = `${userLocation.city}, ${userLocation.state.toUpperCase()}`;
      setInputValue(formattedLocation);
      handleSearch(formattedLocation);
    }
  }, [isAuthenticated, userLocation]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError('');
  };

  const validateInput = (inputValue) => {
    const cityStateRegex = /^([\w\s]+),\s*([\w\s]+)$/;
    const match = cityStateRegex.exec(inputValue.trim().toLowerCase());
    
    if (!match) {
      return { error: 'Please enter a valid city and state (e.g., "Long Beach, CA" or "Long Beach, California").' };
    }
    
    return {
      city: match[1].trim(),
      stateInput: match[2].trim()
    };
  };

  const getStateAbbreviation = (state) => state.length === 2 ? state.toUpperCase() : states[state.toLowerCase()] || null;

  const handleSearch = async (overrideInputValue) => {
    const searchValue = overrideInputValue || inputValue;
    const { city, stateInput, error: inputError } = validateInput(searchValue);

    if (inputError) {
      setError(inputError);
      return;
    }
  
    const state = getStateAbbreviation(stateInput);
  
    if (!state) {
      setError('Please enter a valid state name or abbreviation.');
      return;
    }
  
    const { articles, error: fetchError } = await fetchArticles(city, state);
  
    if (fetchError) {
      setError(fetchError);
      return;
    }
    
    setArticles(articles);

    if (isAuthenticated) {
      if (!userLocation || (!userLocation.city && !userLocation.state)) {
        await saveUserLocation(user.id, capitalizeWords(city), state);
      }
    }
  };

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
        <Button variant="contained" color="success" onClick={() => handleSearch()}>
          <SearchIcon />
        </Button>
      </Box>
    </Box>
  );
}
