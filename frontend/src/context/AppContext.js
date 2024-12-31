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

  const getUserLocation = async (userId, currentUserLocation = null) => {
    try {
      if (currentUserLocation) {
        return;
      }
      
      const result = await fetchUserLocation(userId);
  
      if (result.location) {
        setUserLocation(result.location);
      } else {
        setUserLocation({ city: '', state: '' });
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
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        setAuthAttempted(true);
        if (session.user?.id) {
          await getUserLocation(session.user.id, userLocation);
        }
      }

      await hydrateSources();
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        setAuthAttempted(true);
        if (session.user?.id) {
          await getUserLocation(session.user.id, !userLocation);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setAuthAttempted(true);
        setUserLocation(null);
      }

      await hydrateSources();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, isAuthenticated, authAttempted, userLocation, getUserLocation, setIsAuthenticated, setUserLocation, sources }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
