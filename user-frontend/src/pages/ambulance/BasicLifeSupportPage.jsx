import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, CheckCircle, AlertTriangle, Navigation, Users, DollarSign } from 'lucide-react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';

const BasicLifeSupportPage = () => {
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    contactNumber: '',
    pickupAddress: '',
    destinationAddress: '',
    emergencyType: '',
    patientCondition: '',
    emergencyContact: '',
    paymentMethod: '',
    distance: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowBookingForm(false);
    setShowSummary(true);
  };

  const calculatePricing = () => {
    const basePrice = 800;
    const distanceKm = parseFloat(formData.distance) || 0;
    const distanceCost = distanceKm * 10;
    const emergencyFee = 200;
    const nightCharges = 150;
    const total = basePrice + distanceCost + emergencyFee + nightCharges;
    
    return {
      basePrice,
      distanceCost,
      emergencyFee,
      nightCharges,
      total
    };
  };

  const confirmBooking = () => {
    console.log('Booking confirmed:', formData);
    alert('Ambulance booked successfully! We will contact you shortly.');
    setShowSummary(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      
      <div className="pb-24 md:pb-8">
        {/* Back Button */}
        <div className="bg-white px-4 md:px-6 lg:px-8 py-3 flex items-center shadow-sm">
          <div className="max-w-7xl mx-auto w-full">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm md:text-base">Basic Life Support</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-blue-200 rounded-3xl mx-auto flex items-center justify-center mb-4 md:mb-6">
                <Briefcase className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-blue-600" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-3">Basic Life Support</h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-4 md:mb-6">For non-critical patient transport</p>
              <div className="inline-block bg-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium">
                Response Time: 15-20 mins
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Service Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Service Type</p>
                <p className="text-sm md:text-base font-semibold text-gray-800">Basic Life Support</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <Navigation className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Coverage</p>
                <p className="text-sm md:text-base font-semibold text-gray-800">City-wide Service</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Medical Staff</p>
                <p className="text-sm md:text-base font-semibold text-gray-800">Paramedic Team</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Availability</p>
                <p className="text-sm md:text-base font-semibold text-gray-800">24/7 Service</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-4 md:mb-6">What's Included</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">Trained Paramedics</h3>
                <p className="text-xs md:text-sm text-gray-600">Certified medical staff for basic life support</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">Basic Medical Equipment</h3>
                <p className="text-xs md:text-sm text-gray-600">Essential first aid and basic life support equipment</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">Oxygen Support</h3>
                <p className="text-xs md:text-sm text-gray-600">Portable oxygen cylinders available during transport</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">GPS Tracking</h3>
                <p className="text-xs md:text-sm text-gray-600">Real-time ambulance location tracking for family</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">Patient Monitoring</h3>
                <p className="text-xs md:text-sm text-gray-600">Continuous vital signs monitoring during transport</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1">Clean & Sanitized</h3>
                <p className="text-xs md:text-sm text-gray-600">Regularly sanitized vehicles for patient safety</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Pricing</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">₹800</h3>
                  <p className="text-xs md:text-sm text-gray-600">Base Price</p>
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-sm md:text-base text-gray-600">Per Kilometer</span>
                  <span className="text-sm md:text-base font-semibold text-gray-800">₹10/km</span>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-sm md:text-base text-gray-600">Emergency Fee</span>
                  <span className="text-sm md:text-base font-semibold text-gray-800">₹200</span>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-sm md:text-base text-gray-600">Night Charges (10 PM - 6 AM)</span>
                  <span className="text-sm md:text-base font-semibold text-gray-800">₹150</span>
                </div>
              </div>

              <div className="mt-6 p-3 md:p-4 bg-blue-50 rounded-xl">
                <p className="text-xs md:text-sm text-blue-800">
                  <strong>Note:</strong> Final price may vary based on distance and time. Payment accepted via Cash, Card, UPI, or Insurance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Information */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-6 md:mt-8 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 md:p-8 text-white">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Emergency Contact</h3>
                <p className="text-sm md:text-base text-blue-50 mb-3 md:mb-4">For immediate ambulance service, call our 24/7 helpline</p>
                <a href="tel:102" className="inline-block bg-white text-blue-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-blue-50 transition-colors">
                  Call 102
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8 flex items-start justify-center">
              <div className="bg-white rounded-2xl max-w-2xl w-full">
                <div className="sticky top-0 bg-blue-600 text-white p-6 md:p-8 rounded-t-2xl flex items-center justify-between z-10">
                <h2 className="text-xl md:text-2xl font-bold">Book Ambulance Service</h2>
                <button onClick={() => setShowBookingForm(false)} className="text-white hover:text-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 md:p-6 lg:p-8 space-y-5 md:space-y-6 pb-8">
                {/* Patient Details */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Patient Details</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Patient Name *</label>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Age *</label>
                        <input
                          type="number"
                          name="patientAge"
                          value={formData.patientAge}
                          onChange={handleInputChange}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Gender *</label>
                        <select
                          name="patientGender"
                          value={formData.patientGender}
                          onChange={handleInputChange}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Contact Number *</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Location Details</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Pickup Address *</label>
                      <textarea
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Destination Address *</label>
                      <textarea
                        name="destinationAddress"
                        value={formData.destinationAddress}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Distance (in km) *</label>
                      <input
                        type="number"
                        step="0.1"
                        name="distance"
                        value={formData.distance}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Details */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Emergency Details</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Emergency Type *</label>
                      <select
                        name="emergencyType"
                        value={formData.emergencyType}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Emergency Type</option>
                        <option value="medical-emergency">Medical Emergency</option>
                        <option value="accident">Accident</option>
                        <option value="heart-attack">Heart Attack</option>
                        <option value="stroke">Stroke</option>
                        <option value="respiratory-problem">Respiratory Problem</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Patient Condition</label>
                      <textarea
                        name="patientCondition"
                        value={formData.patientCondition}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Describe the patient's condition briefly"
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Emergency Contact Number</label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="Alternative contact number"
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Payment Method</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {['cash', 'card', 'upi', 'insurance'].map((method) => (
                      <label
                        key={method}
                        className={`flex items-center justify-center p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === method
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                        />
                        <span className="text-sm md:text-base font-medium text-gray-800 capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Summary
                </button>
              </form>
            </div>
          </div>
          </div>
        )}

        {/* Booking Summary Popup */}
        {showSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-blue-600 text-white p-6 md:p-8 rounded-t-2xl">
                <h2 className="text-xl md:text-2xl font-bold">Booking Summary</h2>
              </div>
              
              <div className="p-6 md:p-8 space-y-5 md:space-y-6">
                {/* Patient Details */}
                <div className="border-b pb-4 md:pb-5">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Patient Details</h3>
                  <div className="space-y-2 text-sm md:text-base">
                    <p><span className="text-gray-600">Name:</span> <span className="font-medium ml-2">{formData.patientName}</span></p>
                    <p><span className="text-gray-600">Age:</span> <span className="font-medium ml-2">{formData.patientAge} years</span></p>
                    <p><span className="text-gray-600">Gender:</span> <span className="font-medium ml-2 capitalize">{formData.patientGender}</span></p>
                    <p><span className="text-gray-600">Contact:</span> <span className="font-medium ml-2">{formData.contactNumber}</span></p>
                  </div>
                </div>

                {/* Location Details */}
                <div className="border-b pb-4 md:pb-5">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Location Details</h3>
                  <div className="space-y-2 text-sm md:text-base">
                    <p><span className="text-gray-600">Pickup:</span> <span className="font-medium ml-2">{formData.pickupAddress}</span></p>
                    <p><span className="text-gray-600">Destination:</span> <span className="font-medium ml-2">{formData.destinationAddress}</span></p>
                    <p><span className="text-gray-600">Distance:</span> <span className="font-medium ml-2">{formData.distance} km</span></p>
                  </div>
                </div>

                {/* Emergency Details */}
                <div className="border-b pb-4 md:pb-5">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Emergency Details</h3>
                  <div className="space-y-2 text-sm md:text-base">
                    <p><span className="text-gray-600">Type:</span> <span className="font-medium ml-2 capitalize">{formData.emergencyType.replace('-', ' ')}</span></p>
                    <p><span className="text-gray-600">Condition:</span> <span className="font-medium ml-2">{formData.patientCondition || 'Not specified'}</span></p>
                    {formData.emergencyContact && (
                      <p><span className="text-gray-600">Emergency Contact:</span> <span className="font-medium ml-2">{formData.emergencyContact}</span></p>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-b pb-4 md:pb-5">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Price Breakdown</h3>
                  <div className="space-y-2 text-sm md:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-medium">₹{calculatePricing().basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance Cost ({formData.distance} km × ₹10)</span>
                      <span className="font-medium">₹{calculatePricing().distanceCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergency Fee</span>
                      <span className="font-medium">₹{calculatePricing().emergencyFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Night Charges</span>
                      <span className="font-medium">₹{calculatePricing().nightCharges}</span>
                    </div>
                    <div className="flex justify-between pt-2 md:pt-3 border-t mt-2 md:mt-3">
                      <span className="text-base md:text-lg font-semibold text-gray-800">Total Amount</span>
                      <span className="text-lg md:text-xl font-bold text-blue-600">₹{calculatePricing().total}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
                  <p className="text-sm md:text-base"><span className="text-gray-600">Selected:</span> <span className="font-medium ml-2 capitalize">{formData.paymentMethod}</span></p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowSummary(false);
                      setShowBookingForm(true);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-gray-300 transition-colors"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="flex-1 bg-blue-600 text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-blue-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Bottom Button - Mobile Only */}
        <div className="md:hidden  bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40">
          <button
            onClick={() => setShowBookingForm(true)}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Book Service Now
          </button>
        </div>

        {/* Desktop Button */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-6 mb-8 justify-center">
          <button
            onClick={() => setShowBookingForm(true)}
            className="max-w-3xl w-full bg-blue-600 text-white py-4 md:py-5 rounded-lg font-semibold text-lg md:text-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            Book Service Now
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BasicLifeSupportPage;
