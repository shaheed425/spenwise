import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AddExpense() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  // 🔹 custom category
  const [customCategory, setCustomCategory] = useState("");

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlecancel = () => {
    setFormData({
      title: "",
      amount: "",
      category: "",
      date: "",
      notes: "",
    });
    setCustomCategory("");
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        category:
          formData.category === "Other"
            ? customCategory
            : formData.category,
        date: formData.date,
        notes: formData.notes,
      };

      await api.post("/api/expenses", payload);

      handlecancel();
      navigate("/dash");
    } catch (error) {
      console.error("Add expense error ❌", error);
      alert("Failed to save expense");
    }
  };

  /* ================= PAGE CONTENT ONLY ================= */

  return (
    <div className="space-y-8 p-5">
      <h2 className="text-2xl font-semibold mb-8 text-left">
        Add New Expense
      </h2>

      <div className="max-w-xl mx-auto bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg">
        <h3 className="text-lg font-semibold mb-1 text-left">
          Expense Details
        </h3>
        <p className="text-sm text-gray-400 mb-6 text-left">
          Fill in the details for your new expense record.
        </p>

        <form className="space-y-5" onSubmit={handlesubmit}>
          <div>
            <label className="block text-sm mb-1">Expense Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handlechange}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handlechange}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handlechange}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2"
            >
              <option value="">Select a category</option>
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Other</option>
            </select>
          </div>

          {formData.category === "Other" && (
            <div>
              <label className="block text-sm mb-1">Custom Category</label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2"
                placeholder="Enter category name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handlechange}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2
             [&::-webkit-calendar-picker-indicator]:invert
             [&::-webkit-calendar-picker-indicator]:opacity-80"
            />

          </div>

          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              rows="3"
              name="notes"
              value={formData.notes}
              onChange={handlechange}
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
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
