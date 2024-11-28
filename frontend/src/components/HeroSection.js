import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { states } from '../utils/dataUtils';
import { capitalizeWords } from '../utils/functions';
import SearchIcon from '@mui/icons-material/Search';
import { fetchArticles, saveUserLocation } from '../api/api';
import { useAuth } from '../context/AuthContext';

export function HeroSection({ setArticles, setArticleFetchMade }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [initialFetchMade, setInitialFetchMade] = useState(false);
  const { user, isAuthenticated, userLocation } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userLocation && userLocation.city && userLocation.state && !initialFetchMade) {
      const formattedLocation = `${userLocation.city}, ${userLocation.state.toUpperCase()}`;
      setInputValue(formattedLocation);
      handleSearch(formattedLocation);
      setInitialFetchMade(true);
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
  
    const userId = user?.id || null;
  
    const { articles, error: fetchError } = await fetchArticles(city, state, userId);
  
    if (fetchError) {
      setError(fetchError);
      return;
    }
  
    setArticles([...articles.city, ...articles.national]);
    setArticleFetchMade(true);
  
    if (isAuthenticated) {
      if (!userLocation || (!userLocation.city && !userLocation.state)) {
        if (userId) {
          await saveUserLocation(userId, capitalizeWords(city), state);
        }
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
        padding: '40px 10px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Just Enough News
      </Typography>
      <Typography variant="h6" gutterBottom>
        Get a better balance of news
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TextField
          variant="outlined"
          placeholder="enter city name, state to start"
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
