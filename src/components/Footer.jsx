import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 px-6 py-4 text-sm text-gray-400 mt-auto bg-black">
      {/* Top row */}
      <div className="flex justify-between items-center">
        {/* Left */}
        <span>
          © 2025 <span className="text-white">SpendWise</span>. All rights reserved.
        </span>

        {/* Right */}
        <div className="flex gap-6">
          <button
            type="button"
            className="hover:text-white transition bg-transparent"
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </button>

          <button
            type="button"
            className="hover:text-white transition bg-transparent"
            onClick={(e) => e.preventDefault()}
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
