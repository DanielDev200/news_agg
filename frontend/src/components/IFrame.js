import React from 'react';
import { Box, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function IFrame({articleUrl, setDrawerOpen}){
    return (
        <Box sx={{ height: '95vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <iframe
                src={articleUrl}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }}
                title="Article"
            />
            </Box>
            <Box
            sx={{
                height: '50px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white',
                borderTop: '1px solid #ccc',
                px: 2,
            }}
            >
            <Button
                onClick={() => setDrawerOpen(false)}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    textTransform: 'none',
                    fontSize: '16px',
                    color: '#000',
                }}
            >
                Close
            </Button>
            <Button
                onClick={() => window.open(articleUrl, '_blank')}
                endIcon={<OpenInNewIcon />}
                sx={{
                    textTransform: 'none',
                    fontSize: '16px',
                    color: '#000',
                }}
            >
                Open in New Tab
            </Button>
            </Box>
      </Box>
    )
}