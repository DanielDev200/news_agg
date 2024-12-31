import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";

export function AddYourCity() {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Your City
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          You caught me. This functionality <b>isn't ready yet</b>.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
            For now this app really only works for Long Beach, CA.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          <b>When it's ready</b>, you will be able to request your city and then I will add news sources from or around that city.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          Then you you can get the right balance of news, too.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          If you're interested, create an account and I'll send an email when the functionality is ready.
        </Typography>
      </Box>
    </Container>
  );
}

export default AddYourCity;
