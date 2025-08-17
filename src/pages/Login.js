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
  Divider,
  CircularProgress,
} from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, GoogleAuthProvider } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");
      // Navigation will be handled by useEffect
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    try {
      await signInWithPopup(auth, GoogleAuthProvider);
      console.log("Google sign-in successful!");
      // Navigation will be handled by useEffect
    } catch (error) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", error.message);
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
              disabled={loading}
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
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: "8px",
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
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
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Sign in with Google"}
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
              disabled={loading}
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
