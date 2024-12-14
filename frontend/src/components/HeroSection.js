import React, { useState, useEffect } from 'react';
import { Box, Typography} from '@mui/material';
import { fetchArticles, saveUserLocation } from '../api/api';
import { useAuth } from '../context/AuthContext';
import {HeroSectionInput} from './HeroSectionInput';

export function HeroSection({ setArticles, setArticleFetchMade }) {
  const [initialFetchMade, setInitialFetchMade] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const { user, isAuthenticated, userLocation, setUserLocation } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userLocation && userLocation.city && userLocation.state && !initialFetchMade) {
      setInputValue(`${userLocation.city}, ${userLocation.state}`);
      handleSearch(userLocation.city, userLocation.state);
      setInitialFetchMade(true);
      setInputDisabled(true);
    }
  }, [isAuthenticated, userLocation]);

  const handleSearch = async (city, state) => {
    setError('');
  
    const userId = user?.id || null;
  
    const articlesFetched = await fetchAndSetArticles(city, state, userId);
  
    if (!articlesFetched) return; 
  
    await saveLocationIfNecessary(isAuthenticated, userLocation, userId, city, state);
  };

  const fetchAndSetArticles = async (city, state, userId) => {
    try {
      const { articles, error: fetchError } = await fetchArticles(city, state, userId);
  
      if (fetchError) {
        setError(fetchError);
        return false;
      }
  
      setArticles([...articles.city, ...articles.national]);
      setArticleFetchMade(true);
      return true;
    } catch (err) {
      setError('An unexpected error occurred while fetching articles.');
      return false;
    }
  };
  
  const saveLocationIfNecessary = async (isAuthenticated, userLocation, userId, city, state) => {
    if (!isAuthenticated) {
      return;
    }

    if (!userLocation || (!userLocation.city && !userLocation.state)) {
      if (userId) {
        await saveUserLocation(userId, city, state);
      }
    }
  };

  const handleInputChange = ({ target: { value } }) => {
    setInputValue(value);
    setError('');

    setDropdownOpen(value ? true : false);
  };

  const handleDropdownClick = () => setDropdownOpen(!dropdownOpen);

  const handleClearLocation = () => {
    setInputValue('');
    setInputDisabled(false);
  };

  const handleOptionClick = ({label, city, state}) => {
    if (label === "Get your city's local news") {
      handleNoMatchClick();
      return;
    }

    setInputValue(label);
    handleSearch(city, state);
    setDropdownOpen(false);
    setInputDisabled(true);
  };

  const handleNoMatchClick = () => {
    alert('Redirecting to city request form...');
    setInputValue('');
    setDropdownOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1531177071018-4e8c8d2a8d1c)',
        backgroundSize: 'cover',
        backgroundColor: 'grey',
        color: 'white',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Just Enough News
      </Typography>
      <Typography variant="h6" gutterBottom>
        Get a better balance of news
      </Typography>
      <HeroSectionInput
        handleOptionClick={handleOptionClick}
        inputValue={inputValue}
        dropdownOpen={dropdownOpen}
        inputDisabled={inputDisabled}
        handleInputChange={handleInputChange}
        handleDropdownClick={handleDropdownClick}
        error={error}
        handleClearLocation={handleClearLocation}
      />
    </Box>
  );
}
