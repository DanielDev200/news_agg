import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { createArticle } from '../api/api';

export function AdminForm (){
  const [formData, setFormData] = useState({
    source: '',
    scraped: false,
    api: false,
    title: '',
    url: '',
    img: '',
    category: '',
    sourced: new Date().toISOString().split('T')[0],
    days_found: '',
    city_identifier: '',
    county_identifier: '',
    state_identifier: '',
    national_identifier: '',
    special_identifier: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        const response = await createArticle(formData);
        console.log('response: ', response);
        if (response.message === 'Article created successfully') {
            alert('article created');

            setFormData({
                source: '',
                scraped: false,
                api: false,
                title: '',
                url: '',
                img: '',
                category: '',
                sourced: '',
                days_found: '',
                city_identifier: '',
                county_identifier: '',
                state_identifier: '',
                national_identifier: '',
                special_identifier: '',
            });
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create Article
      </Typography>
      <Typography variant="p" gutterBottom>
        Articles saved here will be shown to users.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="URL"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Image URL"
          name="img"
          value={formData.img}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Sourced"
          name="sourced"
          type="date"
          value={formData.sourced}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
        <TextField
          fullWidth
          label="City Identifier"
          name="city_identifier"
          value={formData.city_identifier}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="County Identifier"
          name="county_identifier"
          value={formData.county_identifier}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="State Identifier"
          name="state_identifier"
          value={formData.state_identifier}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="National Identifier"
          name="national_identifier"
          value={formData.national_identifier}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Special Identifier"
          name="special_identifier"
          value={formData.special_identifier}
          onChange={handleChange}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Article
        </Button>
      </form>
    </Container>
  );
};
