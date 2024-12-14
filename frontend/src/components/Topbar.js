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
        {authChecked && (
          <>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                align="center"
                component="div"
                className="fade-in"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                News Aggregator
              </Typography>
            </Box>
            {isAuthenticated ? (
              <Button
                className="fade-in"
                color="inherit"
                onClick={async () => {
                  const result = await handleLogout(setIsAuthenticated);
                  if (result.success) {
                    console.log(result.message);
                  } else {
                    console.error(result.message);
                  }
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  className="fade-in"
                  color="inherit"
                  onClick={handleSignupAction}
                >
                  Sign Up
                </Button>
                <Button
                  className="fade-in"
                  color="inherit"
                  onClick={(event) => setAuthPopoverAnchor(event.currentTarget)}
                >
                  Sign In
                </Button>
              </>
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
