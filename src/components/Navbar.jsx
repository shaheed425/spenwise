import React from "react";
import { User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../img/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const openSidebar = () => {
    window.dispatchEvent(new Event("open-sidebar"));
  };

  const handleLogoClick = () => {
    const token = localStorage.getItem("token");
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }

    if (!token || !user) {
      localStorage.clear();
      navigate("/");
      return;
    }

    navigate(user.usertype === "admin" ? "/ad" : "/dash");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-800 px-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        {/* ✅ Toggle button */}
        <button
          onClick={openSidebar}
          className="lg:hidden text-yellow-400"
        >
          <Menu size={22} />
        </button>

        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 text-yellow-400 font-bold text-lg"
        >
          <img src={Logo} className="w-9 h-9" />
          <span>SpendWise</span>
        </button>
      </div>

      {/* ✅ PROFILE ICON (VISIBLE + CLICKABLE) */}
      <User
        size={22}
        className="cursor-pointer text-yellow-400 hover:text-yellow-300"
        onClick={() => navigate("/profile")}
      />
    </nav>
  );
};

export default Navbar;
