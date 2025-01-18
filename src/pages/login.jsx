// Import the React and Axios packages
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Grid } from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
// Define the Login component.
function Login () {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Create the submit method.
  const submit = async (e) => {
    e.preventDefault();

    // Create the user object with username and password
    const user = {
      username: username,
      password: password,
    };

    try {
      // Create the POST request
      // const response = await axios.post(
      //   'http://localhost:8000/token/',
      //   user,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     withCredentials: true,
      //   }
      // );

      // console.log('response', response);

      // // Initialize the access & refresh token in local storage
      // localStorage.clear();
      // localStorage.setItem('access_token', response.data.access);
      // localStorage.setItem('refresh_token', response.data.refresh);
      // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      // Redirect to the home page after successful login
      window.location.href = '/';
    } catch (error) {
      // Handle error (e.g., show an error message to the user)
      console.error("Login failed", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={submit}>
          <div className="Auth-form-content">
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <AccountCircle fontSize="small" />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <Lock fontSize="small" />
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="btn"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};


export default Login;