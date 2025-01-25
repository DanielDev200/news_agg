import React from "react";
import { Container, Typography, Box } from "@mui/material";

export function Stats() {
  return (
    <Container sx={{marginTop: 8}}>
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Stats
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          I'm not quite sure what to do with this yet.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          In time I'd like to highlight how many local news articles you've ready, your most read local sources, etc.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          If you're interested, create an account and I'll send an email when the functionality is ready.
        </Typography>
      </Box>
    </Container>
  );
}

export default Stats;
