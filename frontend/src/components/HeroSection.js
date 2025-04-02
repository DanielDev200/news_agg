import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { fetchArticles, saveUserLocation } from '../api/api';
import { HeroSectionAuthedContent }  from './HeroSectionAuthedContent';
import { useAppContext } from '../context/AppContext';
import { emailRegexTest } from '../utils/functions';
import { useNavigate } from 'react-router-dom';

export function HeroSection({ setArticles, setArticleFetchMade, articles }) {
  const [initialFetchMade, setInitialFetchMade] = useState(false);
  const [cityName, setCityName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { user, isAuthenticated, userLocation, authAttempted } = useAppContext();
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

  if (!authAttempted) {
    return '';
  } else if (!isAuthenticated || isAuthenticated && userLocation == null) {
    return (
      <HeroSectionAuthedContent
        handleOptionClick={handleOptionClick}
        cityName={cityName}
        dropdownOpen={dropdownOpen}
        inputDisabled={inputDisabled}
        handleCityNameChange={handleCityNameChange}
        handleCityDropdownClick={handleCityDropdownClick}
        error={error}
        handleClearLocation={handleClearLocation}
        handleEmailChange={handleEmailChange}
        emailError={emailError}
        handleModalChange={handleModalChange}
        handleEmailSubmit={handleEmailSubmit}
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        email={email}
        articles={articles}
      />
    )
  } else if (isAuthenticated && userLocation) {
    return (
        <Box
          sx={{
            backgroundColor: 'grey',
            color: 'white',
            textAlign: 'center',
            position: 'fixed',
            width: '100%',
            bottom: 0,
            margin: 'none'
          }}
        >
          <Typography variant="p" component="p" sx={{ textAlign: 'center'}}>
            showing articles for
            <Button 
              sx={{
                fontWeight: 'bold', 
                padding: 0, 
                minWidth: 'auto',
                textTransform: 'none',
                color: 'white',
                textDecoration: 'underline',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                marginLeft: '4px',
              }} 
              onClick={() => console.log("City and State clicked")}
            >
              {userLocation.city}, {userLocation.state}
            </Button>
          </Typography>
      </Box>
    )
  } else {
    console.log('--- else ---');
    return '';
  }
}
