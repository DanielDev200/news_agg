import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { createArticle } from '../api/api';

export const AdminForm = () => {
  const [formData, setFormData] = useState({
    source: '',
    scraped: false,
    api: false,
    title: '',
    url: '',
    img: '',
    category: '',
    days_found: '',
    city_identifier: '',
    county_identifier: '',
    state_identifier: '',
    national_identifier: '',
    special_identifier: '',
  });

  const [errors, setErrors] = useState({
    source: '',
    url: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!isValidUrl(formData.source)) {
      newErrors.source = 'Source must be a valid URL.';
    }
    if (formData.source.includes('techcrunch')) {
      newErrors.source = newErrors.source
        ? `${newErrors.source} Cannot include "techcrunch".`
        : 'Source cannot include "techcrunch".';
    }
    if (formData.url.includes('techcrunch')) {
      newErrors.url = 'URL cannot include "techcrunch".';
    }
    if (!isValidUrl(formData.url)) {
      newErrors.url = newErrors.url
        ? `${newErrors.url} Must be a valid URL.`
        : 'URL must be a valid URL.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await createArticle(formData);

      if (response.message === 'Article created successfully') {
        alert('Article created');

        setFormData({
          source: '',
          scraped: false,
          api: false,
          title: '',
          url: '',
          img: '',
          category: '',
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
      <Typography variant="body1" gutterBottom>
        Articles saved here will be shown to users.
      </Typography>
      <Typography variant="body1" gutterBottom>
        This form only creates national articles. Still working out how to create the rest.
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
          error={!!errors.source}
          helperText={errors.source}
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
          error={!!errors.url}
          helperText={errors.url}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Article
        </Button>
      </form>
    </Container>
  );
}

export default AdminForm;