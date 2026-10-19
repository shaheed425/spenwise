import React, { useEffect, useState } from "react";
import api from "../api/api";
import { deleteIncomeAPI, updateIncomeAPI } from "../api/api";
import { Delete, Edit } from "lucide-react";

export default function IncomeHistory() {
  const userId = localStorage.getItem("userId");
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIncome, setEditingIncome] = useState(null);

  // ================= FETCH INCOME =================
  useEffect(() => {
    const fetchIncome = async () => {
      try {
        if (!userId) return;

        const res = await api.get(`/api/income/getbyid/${userId}`);
        setIncomeList(res.data);
      } catch (error) {
        console.error("Fetch income history error ❌", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, [userId]);

  // ================= DELETE INCOME =================
  const deleteIncome = async (id) => {
    try {
      await deleteIncomeAPI(id);
      setIncomeList(incomeList.filter((inc) => inc._id !== id));
    } catch (err) {
      console.error("Error deleting income ❌", err);
      alert("Failed to delete income");
    }
  };

  // ================= SAVE EDIT INCOME =================
  const saveEdit = async () => {
    try {
      const { _id, source, amount, date } = editingIncome;
      await updateIncomeAPI(_id, { source, amount, date });
      const updated = incomeList.map((inc) =>
        inc._id === editingIncome._id ? editingIncome : inc
      );
      setIncomeList(updated);
      setEditingIncome(null);
    } catch (err) {
      console.error("Error updating income ❌", err);
      alert("Failed to update income");
    }
  };

  /* ================= PAGE CONTENT ONLY ================= */

  return (
    <div className="space-y-8 p-5">
      <h2 className="text-2xl font-semibold">Income History</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading income...</p>
        ) : incomeList.length === 0 ? (
          <p className="text-gray-400 text-sm">No income records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left">Source</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {incomeList.map((inc) => (
                  <tr
                    key={inc._id}
                    className="hover:bg-gray-800/40 transition"
                  >
                    <td className="py-3">
                      {new Date(inc.date).toLocaleDateString()}
                    </td>
                    <td>{inc.source}</td>
                    <td className="text-right text-green-400">
                      +₹{inc.amount}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingIncome(inc)}
                          className="text-blue-400"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteIncome(inc._id)}
                          className="text-red-500"
                        >
                          <Delete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingIncome && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Income</h3>

            <input
              value={editingIncome.source}
              onChange={(e) =>
                setEditingIncome({ ...editingIncome, source: e.target.value })
              }
              placeholder="Source"
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded text-white"
            />

            <input
              type="number"
              value={editingIncome.amount}
              onChange={(e) =>
                setEditingIncome({
                  ...editingIncome,
                  amount: Number(e.target.value),
                })
              }
              placeholder="Amount"
              className="w-full mb-3 px-4 py-2 bg-gray-800 rounded text-white"
            />

            <input
              type="date"
              value={editingIncome.date?.split("T")[0]}
              onChange={(e) =>
                setEditingIncome({
                  ...editingIncome,
                  date: e.target.value,
                })
              }
              className="w-full mb-4 px-4 py-2 bg-gray-800 rounded text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingIncome(null)}
                className="px-4 py-2 border rounded text-white"
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
