import React, { useState, useEffect } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions} from '@mui/material';
import { fetchArticles, saveUserLocation } from '../api/api';
import { useAppContext } from '../context/AppContext';
import {HeroSectionInput} from './HeroSectionInput';
import { emailRegexTest } from '../utils/functions';
import { useNavigate } from 'react-router-dom';

export function HeroSection({ setArticles, setArticleFetchMade }) {
  const [initialFetchMade, setInitialFetchMade] = useState(false);
  const [cityName, setCityName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { user, isAuthenticated, userLocation } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userLocation && userLocation.city && userLocation.state && !initialFetchMade) {
      setCityName(`${userLocation.city}, ${userLocation.state}`);
      handleArticleSearch(userLocation.city, userLocation.state);
      setInitialFetchMade(true);
      setInputDisabled(true);
    }
  }, [isAuthenticated, userLocation]);

  const handleArticleSearch = async (city, state) => {
    setError('');
  
    const userId = user?.id || null;
  
    const articlesFetched = await fetchAndSetArticles(city, state, userId);
  
    if (!articlesFetched) return; 
  
    await saveUserLocationIfNecessary(isAuthenticated, userLocation, userId, city, state);
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
  
  const saveUserLocationIfNecessary = async (isAuthenticated, userLocation, userId, city, state) => {
    if (!isAuthenticated) {
      return;
    }

    if (!userLocation || (!userLocation.city && !userLocation.state)) {
      if (userId) {
        await saveUserLocation(userId, city, state);
      }
    }
  };

  const handleCityNameChange = ({ target: { value } }) => {
    setCityName(value);
    setError('');

    setDropdownOpen(value ? true : false);
  };

  const handleCityDropdownClick = () => setDropdownOpen(!dropdownOpen);

  const handleClearLocation = () => {
    setCityName('');
    setInputDisabled(false);
  };

  const handleOptionClick = ({label, city, state}) => {
    if (label === "Get your city's local news") {
      navigate("/addyourcity");
      return;
    }

    setCityName(label);
    handleArticleSearch(city, state);
    setDropdownOpen(false);
    setInputDisabled(true);

    if (!isAuthenticated) {
      localStorage.setItem("selectedCity", JSON.stringify({ city, state }));
    }
  };

  const handleNoMatchClick = () => setModalOpen(true);

  const handleModalClose = () => {
    setModalOpen(false);
    setEmail('');
    setDropdownOpen(false);
  };

  const handleModalChange = () => setModalOpen(!modalOpen);

  const handleEmailChange = ({ target: { value } }) => {
    setEmail(value);
    setEmailError('');
  }

  const handleEmailSubmit = () => {
    const emailIsValid = emailRegexTest(email);

    if (!emailIsValid) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    alert(`SUBMITTED`);
    handleModalClose();
  }

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
      <Typography variant="p" component="p" sx={{textAlign: 'left', marginTop: 2}}>
        Find your city and start getting pretty much all of the news:
      </Typography>
      <HeroSectionInput
        handleOptionClick={handleOptionClick}
        cityName={cityName}
        dropdownOpen={dropdownOpen}
        inputDisabled={inputDisabled}
        handleCityNameChange={handleCityNameChange}
        handleCityDropdownClick={handleCityDropdownClick}
        error={error}
        handleClearLocation={handleClearLocation}
      />
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Get your city's news</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Enter your city's name and we'll get this sorted out
          </Typography>
          <TextField
            label="Your Email Address"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
            sx={{ marginTop: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalChange} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEmailSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
