import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPhoneCall } from 'react-icons/fi';

const NavBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/customerLookup', label: 'Track' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About' }
  ];

  return (
    <nav className="bg-[#0c1c33] py-4 px-6 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
          FixDaddy <span className="text-pink-400 text-xl">🛠️</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-white text-lg">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hover:text-indigo-400 transition ${
                location.pathname === item.path ? 'font-semibold text-white' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Phone */}
        <a
          href="tel:+94770366169"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium"
        >
          <FiPhoneCall className="text-lg" />
          077 036 6169
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
