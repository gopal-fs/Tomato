import React, { useState } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from '../assets/admin_assets/assets'
import { FaBars } from 'react-icons/fa6';
import { X } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onNavigate = (path) => {
    navigate(path);
    setIsSidebarOpen(false); 
  };

  return (
    <div className='admin-container'>
      <div className='admin-navbar'>
        <div>
          <img
            style={{ cursor: 'pointer' }}
            src={assets.logo}
            className='admin-logo'
            alt='admin-logo'
          />
        </div>
        <div className='admin-icons'>
          <img
            style={{ cursor: 'pointer' }}
            src={assets.profile_image}
            className='pro-img'
            alt='admin-profile'
          />
          {isSidebarOpen ? (
            <X onClick={() => setIsSidebarOpen(false)} className='menu-icon' size={23} />
          ) : (
            <FaBars onClick={() => setIsSidebarOpen(true)} className='menu-icon' size={23} />
          )}
        </div>
      </div>

      <div className='admin-main-container'>
        <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div onClick={() => onNavigate('add-product')} className='admin-list'>
            <img src={assets.add_icon} className='admin-icon' alt='add-icon'/>
            <p>Add Items</p>
          </div>
          <div onClick={() => onNavigate('products-list')} className='admin-list'>
            <img src={assets.order_icon} className='admin-icon' alt='add-icon'/>
            <p>List Items</p>
          </div>
          <div onClick={() => onNavigate('orders')} className='admin-list'>
            <img src={assets.order_icon} className='admin-icon' alt='add-icon'/>
            <p>Orders</p>
          </div>
        </div>

        <div className='admin-main-content'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout;
