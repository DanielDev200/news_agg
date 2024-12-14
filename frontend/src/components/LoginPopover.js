import React, { useState } from 'react';
import {Popover, Box, TextField, Button, CircularProgress, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { handleEmailLogin } from '../utils/functions';
import { useAuth } from '../context/AuthContext';

const LoginPopover = ({ anchorEl, onClose }) => {
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const open = Boolean(anchorEl);

  const handleLoginAction = async () => {
    setLoading(true);
    setErrorMessage('');

    const result = await handleEmailLogin(email, password, setIsAuthenticated);

    setLoading(false);

    if (result.success) {
      setAuthSuccess(true);
    } else {
      setErrorMessage(result.message || 'Authentication failed. Please try again.');
    }
  };

  const handlePopoverClose = () => {
    setEmail('');
    setPassword('');
    setLoading(false);
    setAuthSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box
        sx={{
          p: 2,
          width: 300,
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : authSuccess ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <CheckCircleIcon sx={{ color: 'green', fontSize: 50, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Login Successful
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePopoverClose}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Sign In
            </Typography>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errorMessage}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLoginAction}
            >
              Sign In
            </Button>
          </>
        )}
      </Box>
    </Popover>
  );
};

export default LoginPopover;
