import React from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions} from '@mui/material';
import { HeroSectionInput } from './HeroSectionInput';

export function HeroSectionAuthedContent({
    handleOptionClick
    , cityName
    , dropdownOpen
    , inputDisabled
    , handleCityNameChange
    , handleCityDropdownClick
    , error
    , handleClearLocation
    , handleEmailChange
    , emailError
    , handleModalChange
    , handleEmailSubmit
    , modalOpen
    , handleModalClose
    , email
}){
    return (
        <>
            <Box
                sx={{
                backgroundColor: 'grey',
                color: 'white',
                textAlign: 'center',
                padding: '80px 20px 40px 20px',
                }}
            >
                <Box
                sx={{
                    maxWidth: 560,
                    margin: '0 auto',
                    width: '100%'
                }}
                >
                    <Typography variant="p" component="p" sx={{textAlign: 'center', marginTop: 2,  textAlign: { xs: 'left', sm: 'center' }}}>
                        Find your city and start getting almost all of the news:
                    </Typography>
                    <HeroSectionInput
                        handleOptionClick={handleOptionClick}
                        cityName={cityName}
                        dropdownOpen={dropdownOpen}
                        inputDisabled={inputDisabled}
                        handleCityNameChange={handleCityNameChange}
                        handleCityDropdownClick={handleCityDropdownClick}
                        error={error}
                        handleClearLocation={handleClearLocation}
                    />
                </Box>
            </Box>
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Get your city's news</DialogTitle>
                <DialogContent>
                <Typography variant="body1" paragraph>
                    Enter your city's name and we'll get this sorted out
                </Typography>
                <TextField
                    label="Your Email Address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={handleEmailChange}
                    error={!!emailError}
                    helperText={emailError}
                    sx={{ marginTop: '16px' }}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleModalChange} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleEmailSubmit} color="primary" variant="contained">
                    Submit
                </Button>
                </DialogActions>
            </Dialog>
      </>
    )
}