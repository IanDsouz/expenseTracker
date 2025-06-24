// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardV2 from "./pages/DashboardV2";
import DashboardMonthly from "./pages/DashboardMonthly";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardAnalysis from "./pages/DashboardAnalysis";
import DashboardSaved from "./pages/DashboardSaved";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Navigation from "./components/navbar";
import ProtectedRoute from "./ProtectedRoute";
import { ThemeContextProvider } from "./ThemeContext";
import { CssBaseline } from "@mui/material";


function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <BrowserRouter>
        {<Navigation />}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
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
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;
