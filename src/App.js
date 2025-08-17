// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardV2 from "./pages/DashboardV2";
import DashboardMonthly from "./pages/DashboardMonthly";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardAnalysis from "./pages/DashboardAnalysis";
import DashboardSaved from "./pages/DashboardSaved";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navigation from "./components/navbar";
import ProtectedRoute from "./ProtectedRoute";
import { ThemeContextProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <CssBaseline />
        <BrowserRouter>
          <Navigation />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardV2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <DashboardAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monthly"
              element={
                <ProtectedRoute>
                  <DashboardMonthly />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <DashboardSaved />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;
