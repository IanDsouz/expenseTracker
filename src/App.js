import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import DashboardV2 from './pages/DashboardV2';
import DashboardMonthly from './pages/DashboardMonthly';
import DashboardAnalysis from './pages/DashboardAnalysis';
import Navigation from './components/navbar';
import Login from './pages/login';
import { Logout } from './pages/logout';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Customize the primary color
    },
    secondary: {
      main: '#f50057', // Customize the secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Customize the default font family
  },
  // Add more theme customization options as needed
});

function App() {
  // Use local state to track authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Use useEffect to check the authentication status when the component mounts
  useEffect(() => {
    // Check the authentication status here (e.g., by looking at stored tokens)
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userIsLoggedIn = accessToken && refreshToken;

    setIsLoggedIn(userIsLoggedIn);
  }, []);

  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      {isLoggedIn && <Navigation />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<DashboardV2 />} />
        <Route path="/monthly" element={<DashboardMonthly />} />
        <Route path="/analysis" element={<DashboardAnalysis />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
