import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.usertype !== "admin") {
    return <Navigate to="/dash" replace />;
  }

  return children;
};

export default AdminRoute;
