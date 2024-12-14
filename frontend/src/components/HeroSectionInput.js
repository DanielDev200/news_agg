import React from 'react'
import { Box, TextField, MenuItem, FormControl, InputAdornment, Divider } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';

export function HeroSectionInput({
    handleOptionClick,
    inputValue,
    dropdownOpen,
    inputDisabled,
    handleInputChange,
    error,
    handleClearLocation,
    handleDropdownClick
}){
    const predefinedOptions = [
        { label: 'Long Beach, CA', city: 'Long Beach', state: 'CA' },
        { label: 'Monterey Park, CA', city: 'Monterey Park', state: 'CA' },
        { label: "Get your city's local news", city:'', state: '' }
    ];

    const getDropdownOptions = () => {
        if (inputValue.length >= 3) {
          const match = predefinedOptions.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
          );

          return match.length > 0 ? match : [{ label: "Get your city's local news" }];
        }
    
        if (dropdownOpen) {
          return predefinedOptions;
        }
    
        return [];
    };
    
    const options = getDropdownOptions();
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, gap: 2, width: '100%' }}>
          <FormControl sx={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <TextField
              disabled={inputDisabled}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter city name"
              variant="outlined"
              sx={{ backgroundColor: 'white', width: '100%' }}
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {inputDisabled ? (
                      <CloseIcon
                        sx={{ cursor: 'pointer' }}
                        onClick={handleClearLocation}
                      />
                    ) : (
                      <ArrowDropDownIcon
                        sx={{ cursor: 'pointer' }}
                        onClick={handleDropdownClick}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            {dropdownOpen && options.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  zIndex: 1,
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '4px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                {options.map((option, index) => (
                  <React.Fragment key={index}>
                    <MenuItem
                      onClick={() => handleOptionClick(option)}
                      sx={{
                        cursor: 'pointer',
                        color: option.label === "Get your city's local news" ? 'blue' : 'black',
                        textDecoration: option.label === "Get your city's local news" ? 'underline' : 'none',
                      }}
                    >
                      {option.label}
                    </MenuItem>
                    {index < options.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            )}
          </FormControl>
        </Box>
      );
}