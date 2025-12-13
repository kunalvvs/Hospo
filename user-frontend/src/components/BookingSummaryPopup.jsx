import React from 'react';

const BookingSummaryPopup = ({ 
  formData, 
  pricing, 
  onClose, 
  onEdit, 
  onConfirm, 
  color = 'blue',
  serviceName = 'Ambulance Service'
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className={`sticky top-0 bg-${color}-600 text-white p-4 rounded-t-2xl flex justify-between items-center`}>
          <h2 className="text-xl font-bold">Booking Summary</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Service Type */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Service Type</h3>
            <p className="text-sm font-medium text-gray-700">{serviceName}</p>
          </div>

          {/* Patient Details */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Patient Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.patientName}</span></p>
              <p><span className="text-gray-600">Age:</span> <span className="font-medium">{formData.patientAge} years</span></p>
              <p><span className="text-gray-600">Gender:</span> <span className="font-medium capitalize">{formData.patientGender}</span></p>
              <p><span className="text-gray-600">Contact:</span> <span className="font-medium">{formData.contactNumber}</span></p>
            </div>
          </div>

          {/* Location Details */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Location Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Pickup:</span> <span className="font-medium">{formData.pickupAddress}</span></p>
              <p><span className="text-gray-600">Destination:</span> <span className="font-medium">{formData.destinationAddress}</span></p>
              <p><span className="text-gray-600">Distance:</span> <span className="font-medium">{formData.distance} km</span></p>
            </div>
          </div>

          {/* Emergency Details */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Emergency Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Type:</span> <span className="font-medium capitalize">{formData.emergencyType.replace('-', ' ')}</span></p>
              <p><span className="text-gray-600">Condition:</span> <span className="font-medium">{formData.patientCondition}</span></p>
              <p><span className="text-gray-600">Emergency Contact:</span> <span className="font-medium">{formData.emergencyContact}</span></p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">₹{pricing.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance Cost ({formData.distance} km × ₹{pricing.distanceCost / parseFloat(formData.distance || 1)})</span>
                <span className="font-medium">₹{pricing.distanceCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emergency Fee</span>
                <span className="font-medium">₹{pricing.emergencyFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Night Charges</span>
                <span className="font-medium">₹{pricing.nightCharges}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className={`font-bold text-${color}-600 text-lg`}>₹{pricing.total}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
            <p className="text-sm"><span className="text-gray-600">Method:</span> <span className="font-medium capitalize">{formData.paymentMethod}</span></p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onEdit}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Edit Details
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 bg-${color}-600 text-white py-3 rounded-lg font-semibold hover:bg-${color}-700 transition-colors`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryPopup;
