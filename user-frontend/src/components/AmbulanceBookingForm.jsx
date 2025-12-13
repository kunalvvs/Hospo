import React from 'react';

const AmbulanceBookingForm = ({ formData, handleInputChange, handleSubmit, color = 'blue' }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient Details */}
      <div className="border-b pb-4">
        <h3 className="font-semibold text-gray-700 mb-3">Patient Details</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input
                type="number"
                name="patientAge"
                value={formData.patientAge}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                name="patientGender"
                value={formData.patientGender}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
              required
            />
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="border-b pb-4">
        <h3 className="font-semibold text-gray-700 mb-3">Location Details</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address *</label>
            <textarea
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleInputChange}
              rows="2"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination Address *</label>
            <textarea
              name="destinationAddress"
              value={formData.destinationAddress}
              onChange={handleInputChange}
              rows="2"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approx. Distance (km) *</label>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleInputChange}
              placeholder="Enter distance in km"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
              required
            />
          </div>
        </div>
      </div>

      {/* Emergency Details */}
      <div className="border-b pb-4">
        <h3 className="font-semibold text-gray-700 mb-3">Emergency Details</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Type *</label>
            <select
              name="emergencyType"
              value={formData.emergencyType}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
              required
            >
              <option value="">Select emergency type</option>
              <option value="medical-emergency">Medical Emergency</option>
              <option value="accident">Accident</option>
              <option value="heart-attack">Heart Attack</option>
              <option value="stroke">Stroke</option>
              <option value="respiratory-problem">Respiratory Problem</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Condition *</label>
            <textarea
              name="patientCondition"
              value={formData.patientCondition}
              onChange={handleInputChange}
              rows="2"
              placeholder="Brief description of patient's condition"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Payment Method</h3>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
          required
        >
          <option value="">Select payment method</option>
          <option value="cash">Cash on Service</option>
          <option value="card">Credit/Debit Card</option>
          <option value="upi">UPI</option>
          <option value="insurance">Insurance</option>
        </select>
      </div>

      <button
        type="submit"
        className={`w-full bg-${color}-600 text-white py-3 rounded-lg font-semibold hover:bg-${color}-700 transition-colors`}
      >
        Proceed to Summary
      </button>
    </form>
  );
};

export default AmbulanceBookingForm;
