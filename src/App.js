import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import DashboardV2 from './pages/DashboardV2';
import DashboardMonthly from './pages/DashboardMonthly';
import DashboardAnalysis from './pages/DashboardAnalysis';
import Navigation from './components/navbar';
import { ThemeContextProvider } from '../src/ThemeContext'
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <BrowserRouter>
        {<Navigation />}
        <Routes>
        <Route path="/dashboard" element={<DashboardV2 />} />
        <Route path="/analysis" element={<DashboardAnalysis />} />
        <Route path="/monthly" element={<DashboardMonthly />} />
          {/* <Route path="/" element={<Dashboard />} /> */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          
          <Route path="/monthly" element={<DashboardMonthly />} />
          <Route path="/analysis" element={<DashboardAnalysis />} /> */}
        </Routes>
      </BrowserRouter>
      </ThemeContextProvider>
  );
}

export default App;
