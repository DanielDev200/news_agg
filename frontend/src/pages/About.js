import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";

export function About() {
  return (
    <Container sx={{marginTop: 8}}>
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          (almost) All The News serves up almost all of the news, daily.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          National and local sources side-by-side balances community information with important headlines.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          A simple five story that allows swapping in-place replaces an endless scroll feed that can be addicting and anxiety inducing.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
            AATN currently only works for Long Beach, CA.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          Being built by <a href="https://www.linkedin.com/in/dan-ser/">Daniel Serrano</a>.
        </Typography>
      </Box>
    </Container>
  );
}

export default About;
