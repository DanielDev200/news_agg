import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { fetchUserLocation } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authAttempted, setAuthAttempted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

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
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authAttempted, userLocation, getUserLocation, setIsAuthenticated, setUserLocation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
