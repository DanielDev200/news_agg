import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress color="success" />
    </Box>
  );
}

export default LoadingSpinner;
