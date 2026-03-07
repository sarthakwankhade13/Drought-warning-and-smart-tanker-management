import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { path: '/', icon: '📊', label: 'Dashboard', desc: 'Overview' },
    { path: '/upload', icon: '📤', label: 'Data Upload', desc: 'Add Records' },
    { path: '/heatmap', icon: '🗺️', label: 'Heatmap', desc: 'Regional View' },
    { path: '/allocation', icon: '🚰', label: 'Allocation', desc: 'Water Supply' },
    { path: '/routes', icon: '🚛', label: 'Routes', desc: 'Optimization' },
    { path: '/weather', icon: '🌤️', label: 'Live Weather', desc: 'Real-time Data' },
    { path: '/alerts', icon: '🔔', label: 'Alerts', desc: 'Notifications' },
  ];

  const localUserMenuItems = [
    { path: '/local', icon: '🏠', label: 'My Dashboard', desc: 'Home' },
    { path: '/local/village', icon: '🏘️', label: 'My Village', desc: 'Village Data' },
    { path: '/local/tankers', icon: '🚛', label: 'Track Tankers', desc: 'Deliveries' },
    { path: '/local/report', icon: '📝', label: 'Report Shortage', desc: 'Submit Report' },
    { path: '/local/submit-alert', icon: '📢', label: 'Submit Alert', desc: 'Report Issue' },
    { path: '/local/alerts', icon: '🔔', label: 'Alerts', desc: 'Notifications' },
  ];

  const menuItems = isAdmin ? adminMenuItems : localUserMenuItems;

  const roleColors = isAdmin
    ? { gradient: 'from-blue-500 to-purple-600', badge: 'bg-blue-100 text-blue-700' }
    : { gradient: 'from-green-500 to-teal-600', badge: 'bg-green-100 text-green-700' };

  return (
    <div className="sidebar-nav w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 bg-gradient-to-br ${roleColors.gradient} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-xl">💧</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">JalRakshak AI</h1>
            <p className="text-xs text-gray-500">जल रक्षक</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">Vidarbha Water Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/' || item.path === '/local'}
              className={({ isActive }) =>
                `nav-item flex items-center gap-3 ${isActive ? 'active' : 'text-gray-700'}`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75">{item.desc}</div>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-800">
            {user?.username || 'User'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors.badge}`}>
              {isAdmin ? 'Admin' : 'Local User'}
            </span>
          </div>
          {!isAdmin && user?.village && (
            <p className="text-xs text-gray-500 mt-1">
              📍 {user.village.name}, {user.village.district}
            </p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
