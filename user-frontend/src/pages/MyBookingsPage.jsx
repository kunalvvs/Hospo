import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Phone, Ambulance, Building, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const bookings = {
    upcoming: [
      {
        id: 'BOOK001',
        type: 'Hospital Bed',
        icon: Building,
        iconColor: 'text-pink-600',
        iconBg: 'bg-pink-100',
        hospitalName: 'Apollo Hospital',
        location: 'Sector 26, Delhi',
        bookingDate: '25 Jun 2025',
        checkInTime: '10:00 AM',
        roomType: 'Private AC Room',
        bedNumber: 'B-204',
        patientName: 'Ashutosh Kumar',
        contactNumber: '+91 9876543210',
        amount: 5000,
        status: 'confirmed'
      },
      {
        id: 'BOOK002',
        type: 'Ambulance',
        icon: Ambulance,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100',
        serviceName: 'Advanced Life Support',
        pickupAddress: 'House No. 123, Sector 45, Delhi',
        destinationAddress: 'Max Hospital, Saket, Delhi',
        bookingDate: '24 Jun 2025',
        pickupTime: '02:30 PM',
        patientName: 'Ashutosh Kumar',
        contactNumber: '+91 9876543210',
        distance: '15 km',
        amount: 1500,
        status: 'confirmed'
      },
      {
        id: 'BOOK003',
        type: 'Lab Test',
        icon: Calendar,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        testName: 'Complete Blood Count (CBC)',
        labName: 'SRL Diagnostics',
        location: 'Sector 18, Delhi',
        bookingDate: '26 Jun 2025',
        appointmentTime: '09:00 AM',
        sampleCollection: 'Home Collection',
        patientName: 'Ashutosh Kumar',
        contactNumber: '+91 9876543210',
        amount: 599,
        status: 'confirmed'
      }
    ],
    completed: [
      {
        id: 'BOOK004',
        type: 'Hospital Bed',
        icon: Building,
        iconColor: 'text-pink-600',
        iconBg: 'bg-pink-100',
        hospitalName: 'Fortis Hospital',
        location: 'Sector 62, Delhi',
        bookingDate: '10 Jun 2025',
        checkInTime: '11:00 AM',
        checkOutDate: '12 Jun 2025',
        roomType: 'General Ward',
        bedNumber: 'A-105',
        patientName: 'Ashutosh Kumar',
        amount: 3000,
        status: 'completed'
      },
      {
        id: 'BOOK005',
        type: 'Ambulance',
        icon: Ambulance,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100',
        serviceName: 'Basic Life Support',
        pickupAddress: 'Home, Sector 45, Delhi',
        destinationAddress: 'Apollo Hospital, Delhi',
        bookingDate: '05 Jun 2025',
        pickupTime: '04:00 PM',
        patientName: 'Ashutosh Kumar',
        distance: '10 km',
        amount: 1000,
        status: 'completed'
      }
    ],
    cancelled: [
      {
        id: 'BOOK006',
        type: 'Lab Test',
        icon: Calendar,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        testName: 'Thyroid Profile',
        labName: 'PathLab',
        location: 'Sector 29, Delhi',
        bookingDate: '08 Jun 2025',
        appointmentTime: '10:30 AM',
        patientName: 'Ashutosh Kumar',
        amount: 450,
        status: 'cancelled',
        cancelReason: 'Schedule conflict'
      }
    ]
  };

  const BookingCard = ({ booking }) => {
    const IconComponent = booking.icon;

    return (
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Icon */}
          <div className={`w-16 h-16 md:w-20 md:h-20 ${booking.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={`w-8 h-8 md:w-10 md:h-10 ${booking.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">
                  {booking.type} - #{booking.id}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {booking.hospitalName || booking.serviceName || booking.testName}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium w-fit ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {booking.status === 'confirmed' ? 'Confirmed' :
                 booking.status === 'completed' ? 'Completed' : 'Cancelled'}
              </span>
            </div>

            {/* Details Grid */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm md:text-base text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                <span>{booking.bookingDate}</span>
                {(booking.checkInTime || booking.pickupTime || booking.appointmentTime) && (
                  <>
                    <Clock className="w-4 h-4 ml-4 mr-2 text-blue-600" />
                    <span>{booking.checkInTime || booking.pickupTime || booking.appointmentTime}</span>
                  </>
                )}
              </div>

              {booking.location && (
                <div className="flex items-center text-sm md:text-base text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span>{booking.location}</span>
                </div>
              )}

              {booking.pickupAddress && (
                <div className="flex items-start text-sm md:text-base text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Pickup: {booking.pickupAddress}</p>
                    <p className="font-medium mt-1">Drop: {booking.destinationAddress}</p>
                  </div>
                </div>
              )}

              {booking.roomType && (
                <div className="flex items-center text-sm md:text-base text-gray-700">
                  <Building className="w-4 h-4 mr-2 text-purple-600" />
                  <span>{booking.roomType} - {booking.bedNumber}</span>
                </div>
              )}

              {booking.distance && (
                <div className="flex items-center text-sm md:text-base text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                  <span>Distance: {booking.distance}</span>
                </div>
              )}

              {booking.sampleCollection && (
                <div className="flex items-center text-sm md:text-base text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span>{booking.sampleCollection}</span>
                </div>
              )}

              <div className="flex items-center text-sm md:text-base text-gray-700">
                <Users className="w-4 h-4 mr-2 text-indigo-600" />
                <span>Patient: {booking.patientName}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-3 border-t border-b mb-4">
              <span className="text-sm md:text-base font-medium text-gray-700">Total Amount</span>
              <span className="text-lg md:text-xl font-bold text-blue-600">₹{booking.amount}</span>
            </div>

            {/* Cancel Reason */}
            {booking.status === 'cancelled' && booking.cancelReason && (
              <div className="bg-red-50 rounded-xl p-3 mb-4">
                <p className="text-xs md:text-sm text-red-700">
                  <strong>Cancellation Reason:</strong> {booking.cancelReason}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              {booking.status === 'confirmed' && (
                <>
                  <button className="flex-1 bg-[#234f83] text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition-colors flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </button>
                  <button className="sm:w-auto bg-red-100 text-red-600 py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-red-200 transition-colors">
                    Cancel
                  </button>
                </>
              )}

              {booking.status === 'completed' && (
                <>
                  <button className="flex-1 bg-green-600 text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition-colors">
                    Download Invoice
                  </button>
                  <button className="flex-1 bg-blue-100 text-blue-600 py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-200 transition-colors">
                    Book Again
                  </button>
                </>
              )}

              {booking.status === 'cancelled' && (
                <button className="w-full bg-[#234f83] text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors">
                  Book Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#234f83] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-indigo-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium text-sm md:text-base">Back</span>
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">My Bookings</h1>
          <p className="text-sm md:text-base text-indigo-100 mt-2">Hospital beds, ambulance & lab test bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Upcoming ({bookings.upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'completed'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed ({bookings.completed.length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'cancelled'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Cancelled ({bookings.cancelled.length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div>
          {bookings[activeTab].length > 0 ? (
            bookings[activeTab].map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Calendar className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">No Bookings</h3>
              <p className="text-sm md:text-base text-gray-600 mb-6">You don't have any {activeTab} bookings</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-[#234f83] text-white py-3 px-6 rounded-lg font-medium text-sm md:text-base hover:bg-indigo-700 transition-colors"
              >
                Explore Services
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MyBookingsPage;
