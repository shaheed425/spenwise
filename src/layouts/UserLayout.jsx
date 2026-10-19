import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
