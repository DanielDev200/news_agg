import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function IFrame({ articleUrl, setDrawerOpen, articleOpensInIframe }) {
  // Extract the root domain from the URL
  const getRootDomain = (url) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace('www.', ''); // Remove 'www.' if present
    } catch (error) {
      console.error('Invalid URL:', url);
      return 'unknown source';
    }
  };

  const rootDomain = getRootDomain(articleUrl);

  return (
    <Box
      sx={{
        height: articleOpensInIframe ? '95vh' : '50vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          height: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'white',
          px: 2,
          borderBottom: '1px solid lightgray',
        }}
      >
        <IconButton
          variant="contained"
          fontSize="12px"
          aria-label="close"
          onClick={() => setDrawerOpen(false)}
        >
          <CloseIcon />
        </IconButton>
        <IconButton
          variant="contained"
          fontSize="12px"
          aria-label="open-in-new-tab"
          onClick={() => window.open(articleUrl, '_blank')}
        >
          <OpenInNewIcon />
        </IconButton>
      </Box>

      {articleOpensInIframe ? (
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <iframe
            src={articleUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Article"
          />
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>
            Articles from <strong>{rootDomain}</strong> cannot be viewed in the app.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.open(articleUrl, '_blank')}
          >
            Open Article in New Tab
          </Button>
        </Box>
      )}
    </Box>
  );
}
