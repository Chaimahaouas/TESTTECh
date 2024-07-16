import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Common/navbar/navbar';
import SideBar from '../../Common/Sidebar/SideBar';
import authSer from '../../Services/AuthService';
const UserDash = () => {
    const handleLogout = () => {
      authSer.logout();
      window.location.href = '/'; 
    };
    return (
      <div className="flex flex-col h-screen">
    <Navbar handleLogout={handleLogout} />
    <div className="flex flex-grow">
      <SideBar className="flex-shrink-0 w-64" /> 
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  </div>
  
    );
  };
  
  export default UserDash;