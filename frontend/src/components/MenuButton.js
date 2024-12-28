import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

export function MenuButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (event) => {
    const { textContent } = event.target;
    navigate(`/${textContent.replace(/\s+/g, '').toLowerCase()}`);
    handleMenuClose();
  };

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
        <MenuIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleOptionClick}>About</MenuItem>
        <MenuItem onClick={handleOptionClick}>Add Your City</MenuItem>
      </Menu>
    </>
  );
}

export default MenuButton;
