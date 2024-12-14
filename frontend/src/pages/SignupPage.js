import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Link, Alert } from "@mui/material";
import { handleEmailSignup, handleEmailLogin } from "../utils/functions";

export function SignupPage(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      setErrorMessage("Name is required.");
      return;
    }

    const signupResponse = await handleEmailSignup(email, password, setIsAuthenticated);

    if (signupResponse.success) {
      setErrorMessage("");

      const loginResponse = await handleEmailLogin(email, password, setIsAuthenticated);

      if (loginResponse.success) {
        setSuccessMessage("Signed up and logged in successfully.");
      } else {
        setErrorMessage(`Signup successful, but login failed: ${loginResponse.message}`);
      }
    } else {
      setErrorMessage(signupResponse.message);
      setSuccessMessage("");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fa",
        textAlign: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create your free account
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          onSubmit={handleSubmit}
        >
          <TextField
            id="name"
            label="Name"
            placeholder="Wade Wilson"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="email"
            label="Email"
            placeholder="wade.wilson@hotmail.com"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            placeholder="6 characters or more"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#007bff",
              "&:hover": { bgcolor: "#0056b3" },
              py: 1.2,
            }}
          >
            Create your free account
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? Login on the {" "} 
          <Link href="/" sx={{ color: "#007bff", textDecoration: "none" }}>
            home page.
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};
