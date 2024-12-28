import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Link } from "@mui/material";
import { handleEmailLogin } from "../utils/functions";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { useAuth } from '../context/AuthContext';

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsAuthenticated, getUserLocation } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }
  
    const { success, message, userId } = await handleEmailLogin(email, password);
  
    if (success) {
      setIsAuthenticated(true);
      await getUserLocation(userId);
      enqueueSnackbar("Logged in successfully, sending you to the news...", {
        variant: "success",
        autoHideDuration: 3000,
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        onClose: () => navigate("/")
      });
    } else {
      setErrorMessage(`Login failed: ${message}`);
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
          Sign in
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          using your account
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
            placeholder="Username, email, or mobile"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errorMessage}
            helperText={errorMessage}
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
            Get your news
          </Button>
          <Link
            href="/forgot-password"
            underline="hover"
            sx={{ display: "block", mt: 2, color: "#000", fontWeight: "bold" }}
          >
            Forgot username?
          </Link>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/signup")}
            sx={{
              mt: 2,
              borderColor: "#000",
              color: "#000",
              fontWeight: "bold",
              py: 1.5,
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            Create an account
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignInPage;
