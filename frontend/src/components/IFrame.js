import React from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function IFrame({articleUrl, setDrawerOpen}){
    return (
        <Box sx={{ height: '95vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
             <Box
                sx={{
                    height: '50px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'white',
                    px: 2,
                    borderBottom: "1px solid lightgray"
                }}
                >
                <IconButton variant="contained" fontSize="12px" aria-label="close" onClick={() => setDrawerOpen(false)}>
                    <CloseIcon />
                </IconButton>
                <IconButton variant="contained" fontSize="12px" aria-label="close" onClick={() => window.open(articleUrl, '_blank')}>
                    <OpenInNewIcon />
                </IconButton>
            </Box>
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
      </Box>
    )
}