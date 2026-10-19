import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import AddExpense from "./pages/AddExpense";
import AddIncome from "./pages/AddIncome";
import ExpenseHistory from "./pages/ExpenseHistory";
import IncomeHistory from "./pages/IncomeHistory";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import UserLayout from "./layouts/UserLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 PUBLIC ROUTES (UNCHANGED) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reg" element={<Register />} />

        {/* 🔒 USER ROUTES WITH FIXED LAYOUT */}
        <Route
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/addex" element={<AddExpense />} />
          <Route path="/addinc" element={<AddIncome />} />
          <Route path="/exphis" element={<ExpenseHistory />} />
          <Route path="/inchis" element={<IncomeHistory />} />
          <Route path="/rep" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 🔐 ADMIN ROUTES (UNCHANGED) */}
        <Route
          path="/ad"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
