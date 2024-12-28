import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { handleLogout } from '../utils/functions';
import MenuButton from './MenuButton';
import LoginPopover from './LoginPopover';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [authPopoverAnchor, setAuthPopoverAnchor] = useState(null);

  useEffect(() => {
    setAuthChecked(true);
  }, []);

  const handleSignupAction = () => {
    navigate('/signup');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <MenuButton />
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

        {authChecked && (
          <>
            {isAuthenticated ? (
              <Button
                className="fade-in"
                color="inherit"
                onClick={async () => await handleLogout(setIsAuthenticated)}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outlined"
                className="fade-in"
                color="inherit"
                onClick={handleSignupAction}
                sx={{
                  borderRadius: '10px',
                  padding: '2px 10px',
                  textTransform: 'none',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  fontSize: "12px"
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
