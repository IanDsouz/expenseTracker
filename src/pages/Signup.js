import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Signup() {
  const [name, setName] = useState(""); // Full name
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Password
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm Password
  const [error, setError] = useState(""); // Show error if any
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    // Passwords match check
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
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
      // Navigation will be handled by useEffect
    } catch (error) {
      setError(error.message || "Error creating account.");
      console.error("Signup error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if already authenticated
  if (user) {
    return null;
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1300, // Higher than Material-UI default modals
      }}
    >
      <Card sx={{ 
        width: "100%", 
        boxShadow: 3, 
        borderRadius: 4,
        position: "relative",
        zIndex: 1301, // Ensure card is above container
      }}>
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />

            {/* Signup Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: "8px",
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
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
              onClick={() => navigate("/login")}
              disabled={loading}
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
