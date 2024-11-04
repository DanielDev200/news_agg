import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { supabase } from '../supabaseClient';

export function Topbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error logging in:', error.message);
  };

  const handleEmailLogin = async () => {
    const email = prompt('Please enter your email:');
    const password = prompt('Please enter your password:');

    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) console.error('Error logging in with email:', error.message);
    }
  };

  const handleEmailSignup = async () => {
    const email = prompt('Please enter your email to sign up:');
    const password = prompt('Please enter your password:');

    if (email && password) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) console.error('Error signing up with email:', error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    else setIsAuthenticated(false);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
          <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
        </Menu>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" align="center" component="div">
            News Aggregator
          </Typography>
        </Box>
        {isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
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
