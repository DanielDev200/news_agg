import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { handleLogout } from '../utils/functions';
import MenuButton from './MenuButton';
import LoginPopover from './LoginPopover';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [authPopoverAnchor, setAuthPopoverAnchor] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    setAuthChecked(true);
  }, []);

  const handleSignInAction = () => {
    navigate('/signin');
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        {/* Left Hamburger Menu */}
        <MenuButton />

        {/* Centered Title */}
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography
            variant="h6"
            component="h1"
            className="fade-in"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            (almost) All The News
          </Typography>
        </Box>

        {/* Right Side Buttons */}
        {authChecked && (
          <>
            {isAuthenticated ? (
              <>
                <IconButton
                  className="fade-in"
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    borderRadius: '50%',
                    padding: '5px',
                  }}
                >
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/stats'); }}>
                    Stats
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/account'); }}>
                    Account
                  </MenuItem>
                  <MenuItem
                    onClick={async () => {
                      handleMenuClose();
                      await handleLogout(setIsAuthenticated);
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                className="fade-in"
                color="inherit"
                onClick={handleSignInAction}
                sx={{
                  borderRadius: '10px',
                  padding: '2px 10px',
                  textTransform: 'none',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  fontSize: '12px',
                }}
              >
                Sign In
              </Button>
            )}
          </>
        )}
      </Toolbar>
      <LoginPopover
        anchorEl={authPopoverAnchor}
        onClose={() => setAuthPopoverAnchor(null)}
      />
    </AppBar>
  );
}

export default Topbar;
