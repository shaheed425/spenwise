import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../img/logo.png";
import { motion } from "framer-motion";
import { registerUser, verifyOtp } from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState("register"); // register | otp

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "",
  });

  const showToast = (message, type = "info", duration = 4000) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "" });
    }, duration);
  };

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    const payload = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password,
      usertype: "user",
    };

    try {
      await registerUser(payload);
      showToast("OTP sent to your email", "success");
      setStep("otp");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Registration failed",
        "error"
      );
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      await verifyOtp({
        email: data.email,
        otp: data.otp,
      });

      showToast("Email verified successfully", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      showToast(
        error.response?.data?.message || "Invalid or expired OTP",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6">

      {/* Toast */}
      {toast.visible && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg z-50 text-white ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
        className="w-full max-w-md sm:max-w-lg bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl border border-gray-800"
      >
        <div className="p-6 sm:p-8">

          {/* Logo */}
          <a
            href="/"
            className="flex items-center justify-center gap-2 text-yellow-400 font-bold text-lg w-full mb-6"
          >
            <img src={Logo} className="w-10 h-10" />
            <span>SpendWise</span>
          </a>

          <h2 className="text-lg sm:text-xl font-semibold text-center">
            Create Your SpendWise Account
          </h2>

          <p className="text-gray-400 text-sm text-center mt-1 mb-6">
            Start tracking your expenses today.
          </p>

          {/* REGISTER FORM */}
          {step === "register" && (
            <form onSubmit={handleRegister} className="space-y-4 text-left">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300 font-medium">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={data.firstName}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-300 font-medium">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={data.lastName}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300 font-medium">
                  Email
                </label>
                <input
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300 font-medium">
                  Password
                </label>
                <input
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300 font-medium">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2.5 rounded-lg transition active:scale-95"
              >
                Create Account
              </button>
            </form>
          )}

          {/* OTP FORM (SAME UI STYLE) */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">

              <div>
                <label className="block text-sm mb-1 text-gray-300 font-medium">
                  Enter OTP
                </label>
                <input
                  name="otp"
                  value={data.otp}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-2 text-center tracking-widest rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2.5 rounded-lg transition active:scale-95"
              >
                Verify OTP
              </button>
            </form>
          )}

          <p className="text-sm text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <span
              className="text-yellow-400 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>

        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-b-2xl" />
      </motion.div>
    </div>
  );
}
