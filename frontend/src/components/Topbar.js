import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { handleLogin, handleEmailLogin, handleEmailSignup, handleLogout } from '../utils/functions';
import MenuButton from './MenuButton';

export function Topbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, []);

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <MenuButton />
        {authChecked && (
          <>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" align="center" component="div" className="fade-in">
                News Aggregator
              </Typography>
            </Box>
            {isAuthenticated ? (
              <Button className="fade-in" color="inherit" onClick={() => handleLogout(setIsAuthenticated)}>
                Logout
              </Button>
            ) : (
              <>
                <Button className="fade-in" color="inherit" onClick={handleEmailSignup}>
                  Sign Up
                </Button>
                <Button className="fade-in" color="inherit" onClick={handleEmailLogin}>
                  Sign In
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
