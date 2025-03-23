import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardV2 from './pages/DashboardV2';
import DashboardMonthly from './pages/DashboardMonthly';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardAnalysis from './pages/DashboardAnalysis';
import DashboardSaved from './pages/DashboardSaved';
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
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/saved" element={<DashboardSaved />} />
        </Routes>
      </BrowserRouter>
      </ThemeContextProvider>
  );
}

export default App;
