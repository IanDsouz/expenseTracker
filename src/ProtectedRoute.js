// src/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  console.log('user', user);

  if (!user) {
    // return <Navigate to="/" replace />;
  }

  return children;
}
export default ProtectedRoute;
