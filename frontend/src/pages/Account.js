import React from "react";
import { Container, Typography, Box } from "@mui/material";

export function Account() {
  return (
    <Container sx={{marginTop: 8}}>
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Account
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          Email and password management is still in development.
        </Typography>
      </Box>
    </Container>
  );
}

export default Account;
