import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addincome } from "../api/api";

export default function AddIncome() {
  const navigate = useNavigate();
  const userid = localStorage.getItem("userId");

  const [form, setForm] = useState({
    source: "",
    amount: "",
    date: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userid) {
      alert("User not logged in. Please login again.");
      navigate("/");
      return;
    }

    try {
      const payload = {
        source: form.source,
        amount: Number(form.amount),
        date: form.date,
      };

      await addincome(payload, userid);
      navigate("/dash");
    } catch (error) {
      console.error("Add income error ❌", error);
      alert("Failed to save income");
    }
  };

  /* ================= PAGE CONTENT ONLY ================= */

  return (
    <div className="space-y-8 p-5">
      <h2 className="text-2xl font-semibold mb-2 text-left">
        Add New Income
      </h2>

      <div className="max-w-xl mx-auto bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg">
        <h3 className="text-lg font-semibold mb-1 text-left">
          Income Details
        </h3>

        <p className="text-sm text-gray-400 mb-6 text-left">
          Record your incoming funds to keep track of your finances.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1 text-left">Source</label>
            <input
              type="text"
              name="source"
              onChange={handleChange}
              placeholder="e.g., Monthly Salary, Freelance Payment"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-left">Amount</label>
            <input
              type="number"
              name="amount"
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-left">Date</label>
            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-left">Notes</label>
            <textarea
              name="notes"
              rows="3"
              onChange={handleChange}
              placeholder="Add any additional details about this income"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dash")}
              className="px-4 py-2 rounded-lg bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-400 text-black"
            >
              Save Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
