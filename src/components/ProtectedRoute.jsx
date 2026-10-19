import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ Not authenticated
  if (!token) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → allow route
  return children;
};

export default ProtectedRoute;
