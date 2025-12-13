import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Video, X, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const appointments = {
    upcoming: [
      {
        id: 1,
        doctorName: 'Dr. Priya Sharma',
        specialty: 'Cardiologist',
        date: 'Mon, 24 Jun 2025',
        time: '10:30 AM',
        type: 'Video Consultation',
        hospital: 'Apollo Hospital, Delhi',
        status: 'confirmed',
        fee: 800
      },
      {
        id: 2,
        doctorName: 'Dr. Rajesh Kumar',
        specialty: 'Orthopedic',
        date: 'Wed, 26 Jun 2025',
        time: '02:00 PM',
        type: 'In-Person',
        hospital: 'Max Hospital, Delhi',
        status: 'confirmed',
        fee: 900
      },
      {
        id: 3,
        doctorName: 'Dr. Amit Verma',
        specialty: 'Dermatologist',
        date: 'Fri, 28 Jun 2025',
        time: '11:00 AM',
        type: 'Video Consultation',
        hospital: 'Fortis Hospital, Delhi',
        status: 'confirmed',
        fee: 700
      }
    ],
    completed: [
      {
        id: 4,
        doctorName: 'Dr. Sneha Patel',
        specialty: 'General Physician',
        date: 'Mon, 10 Jun 2025',
        time: '03:30 PM',
        type: 'In-Person',
        hospital: 'AIIMS, Delhi',
        status: 'completed',
        fee: 600
      },
      {
        id: 5,
        doctorName: 'Dr. Anil Gupta',
        specialty: 'Pediatrician',
        date: 'Thu, 6 Jun 2025',
        time: '09:00 AM',
        type: 'Video Consultation',
        hospital: 'BLK Hospital, Delhi',
        status: 'completed',
        fee: 750
      }
    ],
    cancelled: [
      {
        id: 6,
        doctorName: 'Dr. Meera Singh',
        specialty: 'ENT Specialist',
        date: 'Tue, 4 Jun 2025',
        time: '04:00 PM',
        type: 'In-Person',
        hospital: 'Medanta Hospital, Gurugram',
        status: 'cancelled',
        fee: 850
      }
    ]
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    // API call to cancel appointment
    console.log('Cancelling appointment:', selectedAppointment.id);
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-3 md:mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">
                {appointment.doctorName}
              </h3>
              <p className="text-sm md:text-base text-gray-600">{appointment.specialty}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
              appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
              appointment.status === 'completed' ? 'bg-blue-100 text-blue-500' :
              'bg-red-100 text-red-700'
            }`}>
              {appointment.status === 'confirmed' ? 'Confirmed' :
               appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm md:text-base text-gray-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              <span>{appointment.date}</span>
              <Clock className="w-4 h-4 ml-4 mr-2 text-blue-600" />
              <span>{appointment.time}</span>
            </div>

            <div className="flex items-center text-sm md:text-base text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              <span>{appointment.hospital}</span>
            </div>

            <div className="flex items-center text-sm md:text-base text-gray-700">
              {appointment.type === 'Video Consultation' ? (
                <Video className="w-4 h-4 mr-2 text-purple-600" />
              ) : (
                <User className="w-4 h-4 mr-2 text-green-600" />
              )}
              <span>{appointment.type}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col gap-2 md:min-w-[180px]">
          <div className="text-right mb-2">
            <span className="text-lg md:text-xl font-bold text-blue-600">₹{appointment.fee}</span>
          </div>

          {appointment.status === 'confirmed' && (
            <>
              <button className="w-full bg-[#234f83] text-white py-2 md:py-2.5 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors">
                Reschedule
              </button>
              <button
                onClick={() => handleCancelAppointment(appointment)}
                className="w-full bg-red-100 text-red-600 py-2 md:py-2.5 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-red-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {appointment.status === 'completed' && (
            <>
              <button className="w-full bg-green-600 text-white py-2 md:py-2.5 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition-colors">
                Download Report
              </button>
              <button className="w-full bg-blue-100 text-blue-600 py-2 md:py-2.5 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-200 transition-colors">
                Book Again
              </button>
            </>
          )}

          {appointment.status === 'cancelled' && (
            <button className="w-full bg-gray-200 text-gray-600 py-2 md:py-2.5 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-gray-300 transition-colors">
              Book New
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#234f83] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-blue-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium text-sm md:text-base">Back</span>
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">My Appointments</h1>
          <p className="text-sm md:text-base text-blue-100 mt-2">Manage your healthcare appointments</p>
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
              Upcoming ({appointments.upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'completed'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed ({appointments.completed.length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'cancelled'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Cancelled ({appointments.cancelled.length})
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div>
          {appointments[activeTab].length > 0 ? (
            appointments[activeTab].map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Calendar className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">No Appointments</h3>
              <p className="text-sm md:text-base text-gray-600 mb-6">You don't have any {activeTab} appointments</p>
              <button
                onClick={() => navigate('/doctors')}
                className="bg-[#234f83] text-white py-3 px-6 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">Cancel Appointment</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm md:text-base text-gray-600 mb-6">
              Are you sure you want to cancel your appointment with{' '}
              <strong>{selectedAppointment?.doctorName}</strong> on{' '}
              <strong>{selectedAppointment?.date}</strong>?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium text-sm md:text-base hover:bg-gray-300 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancellation}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium text-sm md:text-base hover:bg-red-700 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MyAppointmentsPage;
