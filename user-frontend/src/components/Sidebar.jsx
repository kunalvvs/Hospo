import React, { useState } from 'react';
import { FiHome, FiUsers, FiShoppingBag, FiSettings, FiLogOut, FiMenu, FiX, FiChevronDown, FiChevronUp, FiFileText, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { useLocation, Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <FiUsers className="w-5 h-5" />, 
      path: '/admin/myadmin/dashboard' 
    },
    { 
      name: 'Add Agents', 
      icon: <FiUsers className="w-5 h-5" />, 
      path: '/admin/myadmin/user' 
    },
    { 
      name: 'Forms', 
      icon: <FiFileText className="w-5 h-5" />, 
      path: '/admin/myadmin/forms' 
    },
    { 
      name: 'Logout', 
      icon: <FiLogOut className="w-5 h-5" />, 
      path: '/admin/' 
    },
  ];

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white shadow-lg text-blue-600 hover:bg-blue-50 focus:outline-none transition-all duration-200"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          fixed md:static inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-600 to-blue-700 shadow-2xl
          transform transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-4 border-b border-blue-500">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Hospo</h1>
              <p className="text-xs text-blue-200 mt-1">Admin Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-3">
              {menuItems.map((item, index) => (
                <li key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(index)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          pathname.startsWith(item.path) 
                            ? 'bg-white text-blue-600 shadow-lg' 
                            : 'text-white hover:bg-blue-500'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                        </div>
                        {openSubmenu === index ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      {openSubmenu === index && (
                        <ul className="mt-2 pl-12 space-y-1">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                to={subItem.path}
                                className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                  pathname === subItem.path
                                    ? 'bg-white text-blue-600 font-medium shadow-md'
                                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                        pathname === item.path
                          ? 'bg-white text-blue-600 shadow-lg'
                          : 'text-white hover:bg-blue-500 hover:shadow-md'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-blue-500">
            <div className="bg-blue-500 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-100">Admin Dashboard</p>
              <p className="text-xs text-white font-semibold mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
