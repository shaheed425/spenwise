import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ PREFILL FROM LOCAL STORAGE
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setForm((prev) => ({
          ...prev,
          firstname: storedUser.firstname || "",
          lastname: storedUser.lastname || "",
          email: storedUser.email || ""
        }));
      }
    } catch {}
  }, []);

  // ✅ FETCH FROM BACKEND
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile");

      setForm({
        firstname: res.data.firstname || "",
        lastname: res.data.lastname || "",
        email: res.data.email || "",
        password: ""
      });

      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email
    };

    if (form.password.trim()) payload.password = form.password;

    try {
      await api.put("/api/profile", payload);
      setMessage("Profile updated successfully");
      fetchProfile();
    } catch {
      setMessage("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("This will permanently delete your account. Continue?"))
      return;

    try {
      await api.delete("/api/profile");
      localStorage.clear();
      navigate("/login");
    } catch {
      alert("Failed to delete account");
    }
  };

  /* ✅ LOADING STATE (NO LAYOUT HERE) */
  if (loading) {
    return <div className="text-white">Loading profile...</div>;
  }

  /* ✅ PAGE CONTENT ONLY */
  return (
    <div className="flex flex-col min-h-[calc(93.3vh-4rem)] p-5">
      <div className="flex-grow">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
          My Profile
        </h2>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-lg w-full mx-auto">
          {message && (
            <p className="mb-4 text-green-400 text-sm">{message}</p>
          )}

          <form onSubmit={handleSubmit}>
            <label className="text-gray-400 text-sm">First Name</label>
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="w-full mb-4 px-3 py-2 bg-[#111] border border-gray-700 text-white rounded"
            />

            <label className="text-gray-400 text-sm">Last Name</label>
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="w-full mb-4 px-3 py-2 bg-[#111] border border-gray-700 text-white rounded"
            />

            <label className="text-gray-400 text-sm">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-4 px-3 py-2 bg-[#111] border border-gray-700 text-white rounded"
            />

            <label className="text-gray-400 text-sm">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave empty to keep password"
              className="w-full mb-6 px-3 py-2 bg-[#111] border border-gray-700 text-white rounded"
            />

            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold">
                Update Profile
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
