import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../img/logo.png";
import { motion } from "framer-motion";
import { loginUser, setauthtoken } from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      alert("Email and password are required");
      return;
    }

    try {
      const response = await loginUser(data);

      console.log("Login success:", response);

      const { token, user } = response;

      // ✅ Save token
      setauthtoken(token);

      // ✅ Store userId (existing logic)
      localStorage.setItem("userId", user.id);

      // ✅ ADDITION (required for AdminRoute)
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect based on role
      if (user.usertype === "admin") {
        navigate("/ad");
      } else {
        navigate("/dash");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
        className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-800"
      >
        <div className="p-8">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center justify-center gap-2 text-yellow-400 font-bold text-lg w-full mb-6"
          >
            <img src={Logo} alt="SpendWise Logo" className="w-10 h-10" />
            <span>SpendWise</span>
          </a>

          <h2 className="text-2xl font-semibold text-center">Log in</h2>
          <p className="text-gray-400 text-center text-sm mt-1">
            Good to have you back!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-gray-300 font-semibold text-left">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="your@gmail.com"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1 text-gray-300 font-semibold text-left">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
            >
              Log In
            </button>
          </form>

          {/* Links */}
          <div className="text-center space-y-3 mt-6">
            <button
              className="text-yellow-400 hover:underline text-sm"
              onClick={() => navigate("/forgot")}
            >
              Forgot password?
            </button>
            <p className="text-sm text-gray-400">
              Don’t have an account?{" "}
              <span
                className="text-yellow-400 hover:underline cursor-pointer"
                onClick={() => navigate("/reg")}
              >
                Register
              </span>
            </p>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-b-2xl" />
      </motion.div>
    </div>
  );
}
