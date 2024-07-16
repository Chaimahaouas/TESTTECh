import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUserCog, FaTags, FaLayerGroup, FaBook, FaRegBookmark } from 'react-icons/fa';
//import AuthSer from '../Services/AuthService'; // Assuming your AuthService is correctly imported
import AuthSer from '../../Services/AuthService';
const SideBar = () => {
  const user = AuthSer.getCurrentUser(); // Fetch current user from localStorage

  return (
    <div className="w-64 h-screen bg-white text-gray-800 flex flex-col shadow-lg">
      <div className="px-5 py-4">
       
      </div>
      <ul className="flex-grow">
     
        
        {user && user.role === 'admin' && (
          <>
            <li className="my-2">
              <Link to="/admin/user-management" className="flex items-center px-4 py-2 hover:bg-blue-100 space-x-2">
                <FaUserCog />
                <span>User Management</span>
              </Link>
            </li>
            <li className="my-2">
              <Link to="/admin/pages" className="flex items-center px-4 py-2 hover:bg-blue-100 space-x-2">
                <FaTags />
                <span>Pages Management</span>
              </Link>
            </li>
            <li className="my-2">
              <Link to="/admin/form" className="flex items-center px-4 py-2 hover:bg-blue-100 space-x-2">
                <FaLayerGroup />
                <span>Form Management</span>
              </Link>
            </li>
            <li className="my-2">
              <Link to="/admin/formpage" className="flex items-center px-4 py-2 hover:bg-blue-100 space-x-2">
                <FaLayerGroup />
                <span>Asseign FormToPages</span>
              </Link>
            </li>
           
          </>
        )}

        {user && user.role === 'user' && (
          <>
            <li className="my-2">
              <Link to="/my-forms" className="flex items-center px-4 py-2 hover:bg-blue-100 space-x-2">
                <FaRegBookmark />
                <span>My Form Submissions</span>
              </Link>
            </li>
            <li className="my-2">
              <Link to="/submit-form" className="flex items-center px-4 py-2 hover:bg-blue-100 space-x-2">
                <FaRegBookmark />
                <span>Submit a Form</span>
              </Link>
            </li>
            <li className="my-2">
              <Link to="/user/PageList" className="flex items-center px-4 py-2 hover:bg-blue-100 space-x-2">
                <FaTags />
                <span>Page List</span>
              </Link>
            </li>
          </>
        )}

      
      </ul>
      <div className="px-5 py-4">
       
      </div>
    </div>
  );
};

export default SideBar;
