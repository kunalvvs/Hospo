import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Briefcase, Plus, Edit2, Trash2, Star } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const SavedAddressesPage = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const addresses = [
    {
      id: 1,
      type: 'home',
      name: 'Ashutosh Kumar',
      phone: '+91 9876543210',
      addressLine1: 'House No. 123, Sector 45',
      addressLine2: 'Near City Mall',
      landmark: 'Opposite Metro Station',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      name: 'Ashutosh Kumar',
      phone: '+91 9876543210',
      addressLine1: 'Tower B, 5th Floor, Cyber Hub',
      addressLine2: 'DLF Cyber City',
      landmark: 'Near Ambience Mall',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      isDefault: false
    },
    {
      id: 3,
      type: 'other',
      name: 'Priya Kumar (Mother)',
      phone: '+91 9876543211',
      addressLine1: 'Flat 402, Green Apartments',
      addressLine2: 'Sector 18',
      landmark: 'Near Park',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      isDefault: false
    }
  ];

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home':
        return { icon: Home, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'work':
        return { icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' };
      default:
        return { icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-100' };
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    console.log('Adding address:', formData);
    setShowAddModal(false);
    // Reset form
    setFormData({
      type: 'home',
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setFormData(address);
    setShowEditModal(true);
  };

  const handleUpdateAddress = (e) => {
    e.preventDefault();
    console.log('Updating address:', formData);
    setShowEditModal(false);
    setSelectedAddress(null);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      console.log('Deleting address:', id);
    }
  };

  const AddressCard = ({ address }) => {
    const { icon: IconComponent, color, bg } = getAddressIcon(address.type);

    return (
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 md:w-14 md:h-14 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={`w-6 h-6 md:w-7 md:h-7 ${color}`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base md:text-lg font-bold text-gray-800 capitalize">
                    {address.type}
                  </h3>
                  {address.isDefault && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3 fill-green-700" />
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-gray-600">{address.name}</p>
                <p className="text-sm md:text-base text-gray-600">{address.phone}</p>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4">
              <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                {address.addressLine1}<br />
                {address.addressLine2}<br />
                {address.landmark && `Landmark: ${address.landmark}`}<br />
                {address.city}, {address.state} - {address.pincode}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button
                onClick={() => handleEditAddress(address)}
                className="flex-1 bg-[#234f83] text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="flex-1 bg-red-100 text-red-600 py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-red-200 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
              {!address.isDefault && (
                <button className="sm:w-auto bg-green-100 text-green-600 py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-green-200 transition-colors">
                  Set Default
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddressForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Address Type */}
      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Address Type *</label>
        <div className="grid grid-cols-3 gap-3">
          {['home', 'work', 'other'].map((type) => (
            <label
              key={type}
              className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                formData.type === type
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={type}
                checked={formData.type === type}
                onChange={handleInputChange}
                className="sr-only"
              />
              <span className="text-sm md:text-base font-medium text-gray-800 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Name & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Address Lines */}
      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Address Line 1 *</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleInputChange}
          placeholder="House/Flat No., Building Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Address Line 2 *</label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleInputChange}
          placeholder="Street, Area, Sector"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Landmark</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleInputChange}
          placeholder="Near famous location"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* City, State, Pincode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            pattern="[0-9]{6}"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Default Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleInputChange}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label className="ml-2 text-sm md:text-base text-gray-700">Set as default address</label>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={() => {
            isEdit ? setShowEditModal(false) : setShowAddModal(false);
            setSelectedAddress(null);
          }}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium text-sm md:text-base hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-[#234f83] text-white py-3 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors"
        >
          {isEdit ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#234f83] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-orange-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium text-sm md:text-base">Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Saved Addresses</h1>
              <p className="text-sm md:text-base text-orange-100 mt-2">Manage your delivery addresses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        {/* Add New Address Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-white border-2 border-dashed border-blue-300 text-blue-600 py-4 md:py-5 px-4 rounded-2xl font-medium text-sm md:text-base hover:bg-blue-50 hover:border-blue-400 transition-colors mb-6 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Address
        </button>

        {/* Address List */}
        <div>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <MapPin className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">No Saved Addresses</h3>
              <p className="text-sm md:text-base text-gray-600">Add your addresses for faster checkout</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-start justify-center">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="sticky top-0 bg-[#234f83] text-white p-6 md:p-8 rounded-t-2xl z-10">
                <h2 className="text-xl md:text-2xl font-bold">Add New Address</h2>
              </div>
              <div className="p-6 md:p-8">
                <AddressForm onSubmit={handleAddAddress} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-start justify-center">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="sticky top-0 bg-[#234f83] text-white p-6 md:p-8 rounded-t-2xl z-10">
                <h2 className="text-xl md:text-2xl font-bold">Edit Address</h2>
              </div>
              <div className="p-6 md:p-8">
                <AddressForm onSubmit={handleUpdateAddress} isEdit={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default SavedAddressesPage;
