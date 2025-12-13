import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ShoppingCart, FileText, BookOpen, MapPin, Settings, Lock, LogOut, ChevronRight, User, Bell } from 'lucide-react';

const UserSidebar = ({ user, onClose }) => {
  const navigate = useNavigate();
  
  const handleNavigation = (href) => {
    console.log('Navigating to:', href);
    setTimeout(() => {
      navigate(href);
      setTimeout(() => {
        onClose();
      }, 100);
    }, 0);
  };
  
  const menuItems = [
    {
      section: 'My Account',
      items: [
        { icon: Calendar, label: 'My Appointments', href: '/appointments' },
        { icon: ShoppingCart, label: 'My Orders', href: '/orders' },
        { icon: FileText, label: 'My Reports', href: '/reports' },
        { icon: BookOpen, label: 'My Bookings', href: '/bookings' },
        { icon: MapPin, label: 'Saved Addresses', href: '/addresses' },
      ]
    },
    {
      section: 'App Settings',
      items: [
        { icon: Settings, label: 'Settings', href: '/settings' },
        { icon: Lock, label: 'Privacy & Security', href: '/privacy' },
      ]
    }
  ]

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-[80vw] bg-dblue text-white overflow-y-auto lg:relative lg:w-full z-10">
        {/* User Profile Section */}
        <div className="relative p-6 pb-8">
          <div className="absolute top-4 right-4">
            {/* <button className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button> */}
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border-gray-200">
              <User className="w-8 h-8 text-dblue" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-1">
            Hi, {user?.name || 'Ashutosh'}! 👋
          </h2>
          <p className="text-blue-100 text-sm">
            {user?.email || 'user@gmail.com'}
          </p>
        </div>

        {/* Menu Sections */}
        <div className="bg-white min-h-screen pt-6">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h3 className="px-6 text-gray-400 text-sm font-medium mb-4">
                {section.section}
              </h3>
              
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => handleNavigation(item.href)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition-colors border-b border-gray-200 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5 text-dblue" />
                      <span className="text-black font-normal">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <div className="px-6 pb-8">
            <button 
              onClick={() => handleNavigation('/')}
              className="flex items-center justify-between w-full px-6 py-4 bg-gray-200 hover:bg-gray-100 rounded-lg transition-colors border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <LogOut className="w-5 h-5 text-dblue" />
                <div className="text-left">
                  <div className="text-black font-normal">Logout</div>
                  {/* <div className="text-gray-400 text-sm">Sign out of your account</div> */}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;