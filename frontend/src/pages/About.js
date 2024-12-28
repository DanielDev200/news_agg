import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";

export function About() {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          News aggregators are broken. They give too much news and not enough at the same time.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          They give too much because their infinite scroll goes on forever. Not enough because there's no local news.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          Almost All The News is a low-key aggregator that has two goals:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Elevate local news" />
          </ListItem>
          <ListItem>
            <ListItemText primary='Provide just enough other news from varied sources to be "enough" for the day' />
          </ListItem>
        </List>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          We all get news from lots of places. There is no delusion that this will be anyone's sole source.
        </Typography>
        <Typography variant="body1" component="p" sx={{ marginBottom: 2 }}>
          But if local news is easier to acsess, then more will be consumed. And, hopefully, that will help local newsrooms grow.
        </Typography>
      </Box>
    </Container>
  );
}

export default About;
