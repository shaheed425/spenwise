import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { requestPasswordReset, resetPassword } from "../api/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  /* ===== STEP 1 : SEND OTP ===== */
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) return alert("Enter email");

    try {
      setLoading(true);
      const res = await requestPasswordReset(email);
      if (res?.otp) {
        setOtp(res.otp);
        alert(res.message || `OTP: ${res.otp}`);
      } else {
        alert("OTP sent to your email");
      }
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===== STEP 2 : VERIFY OTP (UI only) ===== */
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (!otp) return alert("Enter OTP");

    setStep(3);
  };

  /* ===== STEP 3 : RESET PASSWORD ===== */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword)
      return alert("Fill all fields");

    if (password !== confirmPassword)
      return alert("Passwords do not match");

    try {
      setLoading(true);

      await resetPassword(otp, password);

      alert("Password reset successful");
      navigate("/login");
    } catch {
      alert("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit =
    step === 1
      ? handleSendOtp
      : step === 2
      ? handleVerifyOtp
      : handleResetPassword;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 rounded-xl w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-4">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Reset Password"}
          </h2>

          {step === 1 && (
            <>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-gray-800 border border-gray-700"
              />
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-sm mb-2">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-gray-800 border border-gray-700"
              />
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-sm mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-gray-800 border border-gray-700"
              />

              <label className="block text-sm mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded bg-gray-800 border border-gray-700"
              />
            </>
          )}

          <button
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-2 rounded font-semibold"
          >
            {loading
              ? "Processing..."
              : step === 1
              ? "Send OTP"
              : step === 2
              ? "Verify OTP"
              : "Reset Password"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
