import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { handleLogout } from '../utils/functions';
import MenuButton from './MenuButton';
import LoginPopover from './LoginPopover';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, user } = useAppContext();
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
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'ghostwhite',
        borderBottom: '1px solid #eee',
        transform: 'translateZ(0)'
      }}
    >
      <Toolbar
        sx={{
          maxWidth: { xs: '94%', sm: 560 },
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          paddingLeft: { xs: 0, sm: 'inherit' },
          paddingRight: { xs: 0, sm: 'inherit' },
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
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
            {user != null ? (
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
                  {/* <MenuItem onClick={() => { handleMenuClose(); navigate('/stats'); }}>
                    Stats
                  </MenuItem> */}
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
