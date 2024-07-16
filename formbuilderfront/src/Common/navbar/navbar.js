import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { FaBook } from 'react-icons/fa';

const Navbar = ({ handleLogout }) => {
  return (
    <nav className="bg-white shadow-sm px-4 py-3 flex justify-between items-center text-gray-800">
      <div className="flex items-center space-x-3">
        <FaBook className="text-lg text-blue-500" />
        <Link to="/" className="text-xl font-semibold hover:text-blue-500">FormBuilder</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/edit-profile" className="flex items-center space-x-2 hover:text-blue-500">
          <FiUser className="text-lg" />
          <span>Edit Profile</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center space-x-2 hover:text-blue-500">
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
