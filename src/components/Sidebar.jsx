import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Wallet,
  FileText,
  BarChart2,
  LogOut,
  TrendingUp,
  X,
} from "lucide-react";
import { setauthtoken } from "../api/api";

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      active
        ? "bg-yellow-400 text-gray-900"
        : "text-gray-400 hover:bg-gray-800"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ LISTEN TO NAVBAR TOGGLE
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("open-sidebar", open);
    return () => window.removeEventListener("open-sidebar", open);
  }, []);

  // ❌ REMOVED AUTH CHECK (THIS WAS CAUSING RELOAD)
  // Auth is already handled in ProtectedRoute

  const handleLogout = () => {
    setauthtoken(null);
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* 🌫 Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
        />
      )}

      {/* 📌 Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-black border-r border-gray-800 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:flex flex-col
        `}
      >
        {/* ❌ Close (mobile) */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <X className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={location.pathname === "/dash"}
            onClick={() => handleNav("/dash")}
          />

          <SidebarItem
            icon={<PlusCircle size={18} />}
            label="Add Expense"
            active={location.pathname === "/addex"}
            onClick={() => handleNav("/addex")}
          />

          <SidebarItem
            icon={<Wallet size={18} />}
            label="Add Income"
            active={location.pathname === "/addinc"}
            onClick={() => handleNav("/addinc")}
          />

          <SidebarItem
            icon={<TrendingUp size={18} />}
            label="Income History"
            active={location.pathname === "/inchis"}
            onClick={() => handleNav("/inchis")}
          />

          <SidebarItem
            icon={<FileText size={18} />}
            label="Expense History"
            active={location.pathname === "/exphis"}
            onClick={() => handleNav("/exphis")}
          />

          <SidebarItem
            icon={<BarChart2 size={18} />}
            label="Reports"
            active={location.pathname === "/rep"}
            onClick={() => handleNav("/rep")}
          />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 text-sm hover:text-red-500"
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
