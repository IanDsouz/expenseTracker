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
  Divider,
} from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, GoogleAuthProvider } from "../../src/firebase/firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", error.message);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, GoogleAuthProvider);
      console.log("Google sign-in successful!");
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", error.message);
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
              CashFlow Login
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sign in to manage your finances
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Email/Password Login */}
          <Box component="form" onSubmit={handleLogin} noValidate>
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: "8px",
              }}
            >
              Login
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>OR</Divider>

          {/* Google Login Button */}
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleGoogleLogin}
            sx={{
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Sign in with Google
          </Button>

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Don't have an account?{" "}
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
