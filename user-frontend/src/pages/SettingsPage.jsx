import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Bell, Lock, Eye, EyeOff, Shield, Smartphone, 
  Globe, Moon, LogOut, ChevronRight, Mail, Phone, Camera, Edit2,
  Trash2, Download, FileText, HelpCircle
} from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState({
    // Profile
    name: 'Ashutosh Kumar',
    email: 'user@gmail.com',
    phone: '+91 9876543210',
    dateOfBirth: '15/05/1990',
    gender: 'male',
    bloodGroup: 'O+',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    orderUpdates: true,
    promotions: false,
    
    // Privacy
    profileVisibility: 'private',
    dataSharing: false,
    biometricAuth: false,
    twoFactorAuth: false,
    
    // Preferences
    language: 'english',
    theme: 'light'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    console.log('Account deletion requested');
    setShowDeleteModal(false);
  };

  const ProfileSection = () => (
    <div className="space-y-4">
      {/* Profile Picture */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Picture</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-[#234f83] rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <button className="bg-[#234f83] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </button>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG. Max size 2MB</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
          <button className="text-[#234f83] hover:text-blue-700 flex items-center text-sm font-medium">
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <p className="text-base font-medium text-gray-800">{settings.name}</p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email Address</label>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-base font-medium text-gray-800">{settings.email}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-base font-medium text-gray-800">{settings.phone}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
              <p className="text-base font-medium text-gray-800">{settings.dateOfBirth}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gender</label>
              <p className="text-base font-medium text-gray-800 capitalize">{settings.gender}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Blood Group</label>
            <p className="text-base font-medium text-gray-800">{settings.bloodGroup}</p>
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Medical Information</h3>
        <button className="w-full bg-blue-50 text-[#234f83] py-3 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center">
          <FileText className="w-5 h-5 mr-2" />
          Update Medical History
        </button>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.emailNotifications ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">SMS Notifications</p>
              <p className="text-sm text-gray-600">Get SMS alerts</p>
            </div>
            <button
              onClick={() => handleToggle('smsNotifications')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.smsNotifications ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.smsNotifications ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">Push Notifications</p>
              <p className="text-sm text-gray-600">Mobile app notifications</p>
            </div>
            <button
              onClick={() => handleToggle('pushNotifications')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.pushNotifications ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">Appointment Reminders</p>
              <p className="text-sm text-gray-600">Get reminded before appointments</p>
            </div>
            <button
              onClick={() => handleToggle('appointmentReminders')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.appointmentReminders ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.appointmentReminders ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">Order Updates</p>
              <p className="text-sm text-gray-600">Track your orders</p>
            </div>
            <button
              onClick={() => handleToggle('orderUpdates')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.orderUpdates ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.orderUpdates ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-800">Promotions & Offers</p>
              <p className="text-sm text-gray-600">Special deals and discounts</p>
            </div>
            <button
              onClick={() => handleToggle('promotions')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.promotions ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.promotions ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-4">
      {/* Password */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Password & Authentication</h3>
        
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full bg-blue-50 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-between mb-4"
        >
          <div className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            <span>Change Password</span>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Extra security for your account</p>
            </div>
            <button
              onClick={() => handleToggle('twoFactorAuth')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.twoFactorAuth ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.twoFactorAuth ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-800">Biometric Authentication</p>
              <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
            </div>
            <button
              onClick={() => handleToggle('biometricAuth')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.biometricAuth ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.biometricAuth ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Privacy Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-800 mb-2">Profile Visibility</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <p className="font-medium text-gray-800">Data Sharing</p>
              <p className="text-sm text-gray-600">Share data for better experience</p>
            </div>
            <button
              onClick={() => handleToggle('dataSharing')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.dataSharing ? 'bg-[#234f83]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                settings.dataSharing ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Data Management</h3>
        
        <button className="w-full bg-green-50 text-green-600 py-3 px-4 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center mb-3">
          <Download className="w-5 h-5 mr-2" />
          Download My Data
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete Account
        </button>
      </div>
    </div>
  );

  const PreferencesSection = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">App Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-800 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी (Hindi)</option>
              <option value="bengali">বাংলা (Bengali)</option>
              <option value="tamil">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-800 mb-2">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                className={`p-4 border-2 rounded-lg transition-all ${
                  settings.theme === 'light'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg"></div>
                </div>
                <p className="text-sm font-medium text-gray-800 text-center">Light</p>
              </button>
              
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                className={`p-4 border-2 rounded-lg transition-all ${
                  settings.theme === 'dark'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-gray-800 border-2 border-gray-700 rounded-lg"></div>
                </div>
                <p className="text-sm font-medium text-gray-800 text-center">Dark</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Help & Support</h3>
        
        <div className="space-y-2">
          <button className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-medium text-gray-800">Help Center</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-medium text-gray-800">Terms & Conditions</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full text-left py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-medium text-gray-800">Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-white text-red-600 py-4 px-4 rounded-2xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center shadow-sm"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#234f83] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium text-sm md:text-base">Back</span>
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Settings & Privacy</h1>
          <p className="text-sm md:text-base text-gray-300 mt-2">Manage your account preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Menu */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-2 sticky top-6">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left py-3 px-4 rounded-xl transition-colors flex items-center ${
                  activeSection === 'profile'
                    ? 'bg-[#234f83] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                <span className="font-medium">Profile</span>
              </button>

              <button
                onClick={() => setActiveSection('notifications')}
                className={`w-full text-left py-3 px-4 rounded-xl transition-colors flex items-center ${
                  activeSection === 'notifications'
                    ? 'bg-[#234f83] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell className="w-5 h-5 mr-3" />
                <span className="font-medium">Notifications</span>
              </button>

              <button
                onClick={() => setActiveSection('security')}
                className={`w-full text-left py-3 px-4 rounded-xl transition-colors flex items-center ${
                  activeSection === 'security'
                    ? 'bg-[#234f83] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lock className="w-5 h-5 mr-3" />
                <span className="font-medium">Security & Privacy</span>
              </button>

              <button
                onClick={() => setActiveSection('preferences')}
                className={`w-full text-left py-3 px-4 rounded-xl transition-colors flex items-center ${
                  activeSection === 'preferences'
                    ? 'bg-[#234f83] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Globe className="w-5 h-5 mr-3" />
                <span className="font-medium">Preferences</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeSection === 'profile' && <ProfileSection />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'security' && <SecuritySection />}
            {activeSection === 'preferences' && <PreferencesSection />}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Change Password</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#234f83] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-3">Delete Account</h3>
            <p className="text-sm md:text-base text-gray-600 text-center mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
