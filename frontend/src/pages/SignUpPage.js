import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Link } from "@mui/material";
import { handleEmailSignup } from "../utils/functions";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from '../context/AuthContext';
import { saveUserLocation } from '../api/api';

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsImportance, setNewsImportance] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { setUserLocation } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password || !confirmPassword || !newsImportance) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const { success, message, userId } = await handleEmailSignup(email, password);

    if (success) {
      setIsAuthenticated(true);
      enqueueSnackbar("Account created successfully, sending you to the news...", {
        variant: "success",
        autoHideDuration: 3000,
        preventDuplicate: true,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        onClose: async () => {
            const storedLocation = localStorage.getItem("selectedCity");
            console.log(storedLocation);
  
            if (storedLocation) {
                const { city, state } = JSON.parse(storedLocation);
                console.log(userId, city, state);
                await saveUserLocation(userId, city, state);
                localStorage.removeItem("selectedCity");
            } else {
                saveUserLocation({ city: '', state: '' });
            }

            navigate("/");
        }
      });
    } else {
      setErrorMessage(`Signup failed: ${message}`);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fff",
        textAlign: "center",
      }}
    >
      <Box sx={{ width: "100%", marginTop: "-64px" }}>
        <Typography variant="h4" fontWeight="bold" color="#000" gutterBottom>
          Almost All The News
        </Typography>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create Account
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <TextField
            id="email"
            placeholder="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            id="password"
            placeholder="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            id="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormLabel component="legend" sx={{ textAlign: "left", mb: 1 }}>
            Do you think local news is important?
          </FormLabel>
          <RadioGroup
            name="newsImportance"
            value={newsImportance}
            onChange={(e) => setNewsImportance(e.target.value)}
            sx={{ mb: 2}}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: "bold",
              py: 1.5,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Create Account
          </Button>
          <Link
            href="/signin"
            underline="hover"
            sx={{ display: "block", mt: 2, color: "#000", fontWeight: "bold" }}
          >
            Already have an account? Sign In
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUpPage;
