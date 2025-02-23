import React from "react";
import { Container, Typography, Box } from "@mui/material";

export function AddYourCity() {
  return (
    <Container sx={{marginTop: 8}}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Your City
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          This functionality isn't ready yet.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          When it is, users will be able to request their cities be included.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          <b>Interested?</b> Create an account and an email will be sent when the functionality is ready.
        </Typography>
      </Box>
    </Container>
  );
}

export default AddYourCity;
