import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { handleLogin, handleEmailLogin, handleEmailSignup, handleLogout } from '../utils/functions';
import MenuButton from './MenuButton';

export function Topbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <MenuButton />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" align="center" component="div">
            News Aggregator
          </Typography>
        </Box>
        {isAuthenticated ? (
          <Button color="inherit" onClick={() => handleLogout(setIsAuthenticated)}>Logout</Button>
        ) : (
          <>
            <Button color="inherit" onClick={handleEmailSignup}>Sign Up</Button>
            <Button color="inherit" onClick={handleEmailLogin}>Sign In</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
