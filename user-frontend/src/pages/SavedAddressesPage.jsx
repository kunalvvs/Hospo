import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Briefcase, Plus, Edit2, Trash2, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { addressAPI } from '../services/api';

const SavedAddressesPage = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getAddresses();
      if (response.success) {
        setAddresses(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await addressAPI.addAddress(formData);
      if (response.success) {
        toast.success('Address added successfully');
        setShowAddModal(false);
        // Reset form
        setFormData({
          name: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false
        });
        // Refresh addresses
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setFormData({
      name: address.name || '',
      phone: address.phone || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      isDefault: address.isDefault || false
    });
    setShowEditModal(true);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await addressAPI.updateAddress(selectedAddress._id, formData);
      if (response.success) {
        toast.success('Address updated successfully');
        setShowEditModal(false);
        setSelectedAddress(null);
        // Refresh addresses
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await addressAPI.deleteAddress(addressId);
        if (response.success) {
          toast.success('Address deleted successfully');
          // Refresh addresses
          fetchAddresses();
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await addressAPI.setDefaultAddress(addressId);
      if (response.success) {
        toast.success('Default address updated');
        // Refresh addresses
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const AddressCard = ({ address }) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Icon */}
          <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Home className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base md:text-lg font-bold text-gray-800">
                    {address.name || 'Address'}
                  </h3>
                  {address.isDefault && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3 fill-green-700" />
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-gray-600">{address.phone}</p>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4">
              <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                {address.street}<br />
                {address.city}, {address.state}<br />
                Pincode: {address.pincode}
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
                onClick={() => handleDeleteAddress(address._id)}
                className="flex-1 bg-red-100 text-red-600 py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-red-200 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
              {!address.isDefault && (
                <button 
                  onClick={() => handleSetDefault(address._id)}
                  className="sm:w-auto bg-green-100 text-green-600 py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-green-200 transition-colors"
                >
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

      {/* Street Address */}
      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Street Address *</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          placeholder="House No., Building Name, Street, Area"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
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
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading addresses...</p>
            </div>
          ) : addresses.length > 0 ? (
            addresses.map((address) => (
              <AddressCard key={address._id} address={address} />
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
