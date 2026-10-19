import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "../components/Navbar";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  BarElement
} from "chart.js";
import api, { getAdminDashboard } from "../api/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  BarElement
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  /* ================= ONLY ADDED STATE ================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= SAFE STATES ================= */
  const [stats, setStats] = useState({
    usersCount: 0,
    totalExpenseAmount: 0,
    totalIncomeAmount: 0,
    activeUsersCount: 0
  });

  const [chartData, setChartData] = useState({
    months: [],
    newSignups: [],
    activeUsers: [],
    cumulativeExpense: [],
    cumulativeIncome: []
  });

  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [userSearch, setUserSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || user?.usertype !== "admin") {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  /* ================= LISTEN TO NAVBAR TOGGLE ================= */
  useEffect(() => {
    const handleSidebarToggle = () => {
      setSidebarOpen((prev) => !prev);
    };

    window.addEventListener("open-sidebar", handleSidebarToggle);

    return () => {
      window.removeEventListener("open-sidebar", handleSidebarToggle);
    };
  }, []);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAdminDashboard();

      setStats({
        usersCount: data.usersCount,
        totalExpenseAmount: data.totalExpenseAmount,
        totalIncomeAmount: data.totalIncomeAmount,
        activeUsersCount: data.activeUsersCount
      });

      setChartData(data.chartData || {});
      setUsers(data.registeredUsers || []);
      setExpenses(data.recentExpenses || []);
    };

    fetchData();
  }, []);

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/api/admin/user/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  /* ================= SEARCH ================= */
  const filteredUsers = users.filter((u) =>
    `${u.firstname} ${u.lastname} ${u.email}`
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  const filteredExpenses = expenses.filter((e) =>
    `${e.userid?.firstname || ""} ${e.userid?.lastname || ""} ${e.category}`
      .toLowerCase()
      .includes(expenseSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Navbar />

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-black border-r border-gray-800 p-6
          flex flex-col z-40
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-800 text-white">
          Admin Dashboard
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center gap-2 text-red-400 text-sm mt-auto"
        >
          <LogOut size={18} /> Log out
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-0 md:ml-64 p-6 md:p-10 space-y-12">
        {/* ===== SUMMARY ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Stat label="Total Registered Users" value={stats.usersCount} />
          <Stat label="Total Expenses Tracked" value={`₹${stats.totalExpenseAmount}`} />
          <Stat label="Total Income Recorded" value={`₹${stats.totalIncomeAmount}`} />
          <Stat label="Active Users Today" value={stats.activeUsersCount} />
        </div>

        {/* ===== REGISTERED USERS ===== */}
        <Section>
          <h3 className="text-lg font-semibold">Registered Users</h3>

          <input
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Registered</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-right py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={u._id} className={i % 2 ? "bg-gray-800/40" : ""}>
                    <td className="py-4">{u.firstname} {u.lastname}</td>
                    <td>{u.email}</td>
                    <td>{u.createdAt.slice(0, 10)}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          u.isVerified
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {u.isVerified ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="border border-red-500 text-red-400 px-3 py-1 rounded-lg text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ===== RECENT EXPENSES ===== */}
        <Section>
          <h3 className="text-lg font-semibold">Recent Expense Activity</h3>

          <input
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-sm"
            placeholder="Search expenses..."
            value={expenseSearch}
            onChange={(e) => setExpenseSearch(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-3">User</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Category</th>
                  <th className="text-left py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e, i) => (
                  <tr key={e._id} className={i % 2 ? "bg-gray-800/40" : ""}>
                    <td className="py-4">
                      {e.userid
                        ? `${e.userid.firstname} ${e.userid.lastname}`
                        : "Deleted User"}
                    </td>
                    <td>₹{e.amount}</td>
                    <td>{e.category}</td>
                    <td>{e.createdAt.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ===== CHARTS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl p-6 h-80">
            <Bar
              data={{
                labels: chartData.months,
                datasets: [
                  { label: "Active Users", data: chartData.activeUsers, backgroundColor: "#facc15" },
                  { label: "New Signups", data: chartData.newSignups, backgroundColor: "#60a5fa" }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 h-80">
            <Line
              data={{
                labels: chartData.months,
                datasets: [
                  { label: "Expenses", data: chartData.cumulativeExpense, borderColor: "#ef4444" },
                  { label: "Income", data: chartData.cumulativeIncome, borderColor: "#facc15" }
                ]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Stat = ({ label, value }) => (
  <div className="bg-gray-900 rounded-2xl p-6">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

const Section = ({ children }) => (
  <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
    {children}
  </div>
);
