import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { getExpenses, getIncome } from "../api/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function Dashboard() {
  const navigate = useNavigate();

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  const [categoryLabels, setCategoryLabels] = useState([]);
  const [categoryValues, setCategoryValues] = useState([]);

  const [monthsLabels, setMonthsLabels] = useState([]);
  const [incomeMonthly, setIncomeMonthly] = useState([]);
  const [expenseMonthly, setExpenseMonthly] = useState([]);

  const [recentTransactions, setRecentTransactions] = useState([]);

  /* 🔐 TOKEN CHECK */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* ===== FETCH ALL DASHBOARD DATA ===== */
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const expenses = await getExpenses();
        const incomes = await getIncome(userId);

        /* ===== TOTALS ===== */
        const expenseSum = expenses.reduce(
          (sum, e) => sum + Number(e.amount || 0),
          0
        );
        const incomeSum = incomes.reduce(
          (sum, i) => sum + Number(i.amount || 0),
          0
        );

        setTotalExpense(expenseSum);
        setTotalIncome(incomeSum);
        setBalance(incomeSum - expenseSum);

        /* ===== CATEGORY WISE ===== */
        const categoryMap = {};
        expenses.forEach((e) => {
          const cat = e.category || "Other";
          categoryMap[cat] =
            (categoryMap[cat] || 0) + Number(e.amount || 0);
        });

        setCategoryLabels(Object.keys(categoryMap));
        setCategoryValues(Object.values(categoryMap));

        /* ===== MONTHLY ===== */
        const getMonthKey = (d) => {
          const dt = new Date(d);
          return `${dt.getFullYear()}-${String(
            dt.getMonth() + 1
          ).padStart(2, "0")}`;
        };

        const now = new Date();
        const months = [];

        for (let i = 5; i >= 0; i--) {
          const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            key: getMonthKey(dt),
            label: dt.toLocaleString("en-US", { month: "short" }),
          });
        }

        const incomeByMonth = {};
        const expenseByMonth = {};

        incomes.forEach((i) => {
          const key = getMonthKey(i.date || i.createdAt);
          incomeByMonth[key] =
            (incomeByMonth[key] || 0) + Number(i.amount || 0);
        });

        expenses.forEach((e) => {
          const key = getMonthKey(e.date || e.createdAt);
          expenseByMonth[key] =
            (expenseByMonth[key] || 0) + Number(e.amount || 0);
        });

        setMonthsLabels(months.map((m) => m.label));
        setIncomeMonthly(months.map((m) => incomeByMonth[m.key] || 0));
        setExpenseMonthly(months.map((m) => expenseByMonth[m.key] || 0));

        /* ===== RECENT TRANSACTIONS ===== */
        const expenseTx = expenses.map((e) => ({
          id: e._id,
          type: "expense",
          title: e.title,
          category: e.category,
          amount: Number(e.amount),
          date: e.date || e.createdAt,
        }));

        const incomeTx = incomes.map((i) => ({
          id: i._id,
          type: "income",
          title: i.source,
          category: "Income",
          amount: Number(i.amount),
          date: i.date || i.createdAt,
        }));

        const merged = [...expenseTx, ...incomeTx]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7);

        setRecentTransactions(merged);
      } catch (err) {
        console.error("Dashboard error ❌", err);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="space-y-8 p-5">
      <h1 className="text-2xl font-semibold">User Dashboard</h1>

      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Summary title="Total Expenses" value={totalExpense} />
        <Summary title="Total Income" value={totalIncome} />
        <Summary title="Remaining Balance" value={balance} />

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/addex")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl"
          >
            Add Expense
          </button>
          <button
            onClick={() => navigate("/addinc")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl"
          >
            Add Income
          </button>
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Category-wise Spending">
          <div className="h-[260px] flex items-center justify-center">
            <Doughnut
              data={{
                labels: categoryLabels,
                datasets: [
                  {
                    data: categoryValues,
                    backgroundColor: [
                      "#fbbf24",
                      "#60a5fa",
                      "#34d399",
                      "#f87171",
                      "#a78bfa",
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                cutout: "70%",
                radius: "85%",
                plugins: {
                  legend: {
                    position: "top",
                    labels: { color: "#cbd5f5" },
                  },
                },
              }}
            />
          </div>
        </Card>

        <Card title="Monthly Financial Overview">
          <div className="h-[260px]">
            <Bar
              data={{
                labels: monthsLabels,
                datasets: [
                  {
                    label: "Expenses",
                    data: expenseMonthly,
                    backgroundColor: "#fbbf24",
                  },
                  {
                    label: "Income",
                    data: incomeMonthly,
                    backgroundColor: "#3b82f6",
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: "#cbd5f5" } },
                },
              }}
            />
          </div>
        </Card>
      </div>

      {/* ===== RECENT TRANSACTIONS ===== */}
      <Card title="Recent Transactions">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2 text-left">Date</th>
              <th className="text-left">Category</th>
              <th className="text-left">Description</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((t) => (
              <tr key={t.id} className="border-b border-gray-800">
                <td className="py-3">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td>{t.category}</td>
                <td>{t.title}</td>
                <td
                  className={`text-right ${
                    t.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ===== UI COMPONENTS ===== */

const Summary = ({ title, value }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
    <p className="text-gray-400 text-sm">{title}</p>
    <h2 className="text-2xl font-bold">₹{value.toFixed(2)}</h2>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
);
