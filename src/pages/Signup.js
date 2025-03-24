import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../src/firebase/firebase";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState(""); // Full name
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Password
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm Password
  const [error, setError] = useState(""); // Show error if any
  const navigate = useNavigate();

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Passwords match check
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      console.log("Signup successful!");
      navigate("/saved"); // Redirect after signup
    } catch (error) {
      setError(error.message || "Error creating account.");
      console.error("Signup error:", error.message);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%", boxShadow: 3, borderRadius: 4 }}>
        <CardContent>
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Create an Account
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Join CashFlow today and take control of your finances!
            </Typography>
          </Box>

          {/* Show error if any */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Signup Form */}
          <Box component="form" onSubmit={handleSignup} noValidate>
            {/* Full Name */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />

            {/* Email */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />

            {/* Password */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />

            {/* Confirm Password */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
            />

            {/* Signup Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: "8px",
              }}
            >
              Sign Up
            </Button>
          </Box>

          {/* Login Link */}
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Already have an account?{" "}
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/")}
            >
              Login
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Signup;
