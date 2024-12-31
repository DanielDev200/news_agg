import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";

export function About() {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Stats
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          For those who've - made it here, wow. You really care.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          I'm <a href="https://www.linkedin.com/in/dan-ser/">Daniel</a>. I'm building <b>(almost) All The News</b> because I want my own news aggregator and not one of my dev friends will build it for me. Some friends.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          I want my news aggregator to do two things:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="elevate local news" />
          </ListItem>
          <ListItem>
            <ListItemText primary="serve the right type of news so I don't have to read much more that day" />
          </ListItem>
        </List>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          Even when AATN is fully complete I will for sure still read other news sources. BUT...at least I will know I also consumed the important stuff.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          To get more on my approach to balanced news, see here -{`>`} <a href="/">AATN's approach to balance news</a>
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          If you have any questions please feel free to connect on LinkedIn and send them my way!
        </Typography>
      </Box>
    </Container>
  );
}

export default About;
