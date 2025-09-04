// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center text-sm space-y-2">
      <div>
        {/* Removed Admin/Technician login links */}
        <span className="mx-3">© {new Date().getFullYear()} FixDaddyShop. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
