import React, { useEffect, useState } from "react";
import { getExpenses, deleteExpenseAPI, updateExpenseAPI } from "../api/api";
import { Delete, Edit } from "lucide-react";

export default function ExpenseHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [editingTx, setEditingTx] = useState(null);

  const [categories, setCategories] = useState([]);

  // 🔹 custom category for edit modal
  const [editCustomCategory, setEditCustomCategory] = useState("");

  const [filters, setFilters] = useState({
    category: "All",
    startDate: "",
    endDate: "",
    search: "",
  });

  // =================================================
  // 🔹 FETCH EXPENSES
  // =================================================
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();

        const formatted = data.map((exp) => ({
          id: exp._id,
          title: exp.title,
          category: exp.category,
          amount: Number(exp.amount),
          date: new Date(exp.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }),
          rawDate: exp.date,
          notes: exp.notes,
        }));

        setTransactions(formatted);
        setFilteredTransactions(formatted);

        const uniqueCategories = [
          "All",
          ...new Set(formatted.map((exp) => exp.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching expenses ❌", err);
      }
    };

    fetchExpenses();
  }, []);

  // =================================================
  // 🔹 FILTERS
  // =================================================
  const applyFilters = () => {
    let data = [...transactions];

    if (filters.category !== "All") {
      data = data.filter((tx) => tx.category === filters.category);
    }

    if (filters.startDate) {
      data = data.filter(
        (tx) => new Date(tx.rawDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      data = data.filter(
        (tx) => new Date(tx.rawDate) <= new Date(filters.endDate)
      );
    }

    if (filters.search) {
      data = data.filter((tx) =>
        tx.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTransactions(data);
  };

  const resetFilters = () => {
    setFilters({
      category: "All",
      startDate: "",
      endDate: "",
      search: "",
    });
    setFilteredTransactions(transactions);
  };

  // =================================================
  // 🔹 DELETE
  // =================================================
  const deleteExpense = async (id) => {
    try {
      await deleteExpenseAPI(id);
      const updated = transactions.filter((tx) => tx.id !== id);
      setTransactions(updated);
      setFilteredTransactions(updated);
    } catch (err) {
      console.error("Error deleting expense ❌", err);
      alert("Failed to delete expense");
    }
  };

  // =================================================
  // 🔹 SAVE EDIT
  // =================================================
  const saveEdit = async () => {
    try {
      const finalCategory =
        editingTx.category === "Other"
          ? editCustomCategory
          : editingTx.category;

      await updateExpenseAPI(editingTx.id, {
        ...editingTx,
        category: finalCategory,
      });

      const updated = transactions.map((tx) =>
        tx.id === editingTx.id
          ? { ...editingTx, category: finalCategory }
          : tx
      );

      setTransactions(updated);
      setFilteredTransactions(updated);
      setEditingTx(null);
      setEditCustomCategory("");
    } catch (err) {
      console.error("Error updating expense ❌", err);
      alert("Failed to update expense");
    }
  };

  /* ================= PAGE CONTENT ONLY ================= */

  return (
    <div className="space-y-8 p-5">
      <h2 className="text-2xl font-semibold">Expense History</h2>

      {/* ================= FILTERS ================= */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />

          <input
            type="text"
            placeholder="Search title..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={resetFilters}
            className="border border-yellow-400 text-yellow-400 px-5 py-2 rounded-lg"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-5 px-6 py-4 text-gray-400 text-sm border-b border-gray-800">
          <span>Date</span>
          <span>Title</span>
          <span>Category</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Actions</span>
        </div>

        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="grid grid-cols-1 md:grid-cols-5 px-6 py-4 border-b border-gray-800 items-center"
          >
            <span>{tx.date}</span>
            <span className="font-medium">{tx.title}</span>
            <span className="text-yellow-400">{tx.category}</span>
            <span className="text-right text-red-500">
              ₹{tx.amount.toFixed(2)}
            </span>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setEditingTx(tx);
                  setEditCustomCategory("");
                }}
                className="text-blue-400"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => deleteExpense(tx.id)}
                className="text-red-500"
              >
                <Delete size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Expense</h3>

            <input
              value={editingTx.title}
              onChange={(e) =>
                setEditingTx({ ...editingTx, title: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded"
            />

            <input
              type="number"
              value={editingTx.amount}
              onChange={(e) =>
                setEditingTx({
                  ...editingTx,
                  amount: Number(e.target.value),
                })
              }
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded"
            />

            <select
              value={editingTx.category}
              onChange={(e) =>
                setEditingTx({ ...editingTx, category: e.target.value })
              }
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded"
            >
              {categories
                .filter((cat) => cat !== "All")
                .map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              <option>Other</option>
            </select>

            {editingTx.category === "Other" && (
              <input
                type="text"
                value={editCustomCategory}
                onChange={(e) => setEditCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="w-full mb-4 px-4 py-2 bg-gray-800 rounded"
                required
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingTx(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
