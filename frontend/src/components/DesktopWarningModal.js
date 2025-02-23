import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export function DesktopWarningModal(){
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isDesktop = window.innerWidth > 820;
    if (isDesktop) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="desktop-warning-title"
    >
      <DialogTitle id="desktop-warning-title">Mobile Experience Recommended</DialogTitle>
      <DialogContent>
        <Typography>
          (almost) All The News is designed for mobile devices. The desktop version isn't ready yet.
          For the best experience, please access this site on your phone or tablet.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleClose}>
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
