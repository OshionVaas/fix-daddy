import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center text-sm space-y-2">
      <div>
        <Link to="/admin-login" className="hover:underline mx-3">🔐 Admin Login</Link>
        <Link to="/technician-login" className="hover:underline mx-3">🔧 Technician Login</Link>
      </div>
      <div>&copy; {new Date().getFullYear()} FixDaddyShop. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
