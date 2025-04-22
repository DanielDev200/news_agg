import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { fetchUserLocation, fetchSources } from '../api/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [authAttempted, setAuthAttempted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sources, setSources] = useState([]);
  const [cityName, setCityName] = useState('');

  const getAnonId = () => {
    let anonId = localStorage.getItem('anon_id');
    if (!anonId) {
      anonId = crypto.randomUUID();
      localStorage.setItem('anon_id', anonId);
    }
    return anonId;
  };

  const getUserLocation = async (userId, currentUserLocation = null) => {
    try {
      if (currentUserLocation) {
        return;
      }
      
      const result = await fetchUserLocation(userId);
  
      if (result.location) {
        setUserLocation(result.location);

        return result.location;
      } else {
        setUserLocation({ city: '', state: '' });

        return { city: '', state: '' };
      }
    } catch (error) {
      console.error('Error fetching user location:', error);
    }
  };

  const hydrateSources = async () => {
    try {
      const fetchedSources = await fetchSources();
      setSources(fetchedSources);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  useEffect(() => {
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userIdToUse = session ? session.user.id : getAnonId();

      if (session) {
        setUser(session.user);
      }

      setIsAuthenticated(true);
      setAuthAttempted(true);
        
      await getUserLocation(userIdToUse, userLocation);
      await hydrateSources();
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userIdToUse = session ? session.user.id : getAnonId();

      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }

      setIsAuthenticated(true);
      setAuthAttempted(true);
        
      await getUserLocation(userIdToUse, userLocation);
      await hydrateSources();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      authAttempted,
      userLocation,
      cityName,
      sources,
      getUserLocation,
      setIsAuthenticated,
      setUserLocation,
      setCityName,
      getAnonId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
