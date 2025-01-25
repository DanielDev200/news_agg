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
          Eventually you'll be able to change your passwrod and stuff like that from here.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          But I haven't built any of that boring stuff yet.
        </Typography>
      </Box>
    </Container>
  );
}

export default Account;
