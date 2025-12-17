import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import SignupPage from './pages/SignupPage';
import SignupPageNew from './pages/SignupPageNew';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DoctorsPage from './pages/DoctorsPage';
import ChemistPage from './pages/ChemistPage';
import HospitalPage from './pages/HospitalPage';
import PathlabPage from './pages/PathlabPage';
import AmbulancePage from './pages/AmbulancePage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import MedicineDetailsPage from './pages/MedicineDetailsPage';
import BookHospitalPage from './pages/BookHospitalPage';
import AmbuDetailsPage from './pages/AmbuDetailsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import BookLabPage from './pages/BookLabPage';
import BookTestPage from './pages/BookTestPage';
import AmbuBookingPage from './pages/AmbuBookingPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminForms from './pages/admin/AdminForms';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFormsRole from './pages/admin/AdminFormsRole';
import AgentLayout from './pages/agent/AgentLayout';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentFormsRole from './pages/agent/AgentFormsRole';
import BasicLifeSupportPage from './pages/ambulance/BasicLifeSupportPage';
import AdvancedLifeSupportPage from './pages/ambulance/AdvancedLifeSupportPage';
import LongDistanceTransferPage from './pages/ambulance/LongDistanceTransferPage';
import ElderlyCareTransportPage from './pages/ambulance/ElderlyCareTransportPage';
import NeonatalTransportPage from './pages/ambulance/NeonatalTransportPage';
import AirportTransferPage from './pages/ambulance/AirportTransferPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import MyReportsPage from './pages/MyReportsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import SavedAddressesPage from './pages/SavedAddressesPage';
import SettingsPage from './pages/SettingsPage';
import VideoConsultPage from './pages/VideoConsultPage';
import {
  AdminPage,
  AgentPage,
} from './pages/PlaceholderPages';
import socketService from './services/socket';
import { getUserData } from './services/api';
import LoginPageOld from './pages/LoginPageOld';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    return !splashShown;
  });

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  // Connect Socket.io when user is authenticated
  useEffect(() => {
    const user = getUserData();
    if (user && user.id) {
      // Connect socket for real-time notifications
      socketService.connect(user.id, 'patient');

      // Listen for appointment status updates
      socketService.onAppointmentStatusUpdated((data) => {
        console.log('🔔 Appointment status updated:', data);
        // You can show a toast notification here
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPageNew />} />
      <Route path="/signup-old" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/myadmin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="dashboard/:formsRole" element={<AdminFormsRole />} />
        <Route path="forms" element={<AdminForms />} />
        <Route path="user" element={<AdminUsers />} />
      </Route>
      
      {/* Agent Routes */}
      <Route path="/agent" element={<AgentPage />} />
      <Route path="/agent/dashboard" element={<AgentLayout />}>
        <Route index element={<AgentDashboard />} />
        <Route path=":formsRole" element={<AgentFormsRole />} />
      </Route>
      
      {/* Doctor Routes */}
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/doctors/:id" element={<DoctorProfilePage />} />
      <Route path="/book-appointment/:id" element={<BookAppointmentPage />} />
      
      {/* My Appointments Route */}
      <Route path="/my-appointments" element={<MyAppointmentsPage />} />
      
      {/* Video Consultation Route */}
      <Route path="/video-consult/:appointmentId" element={<VideoConsultPage />} />
      
      {/* Chemist Routes */}
      <Route path="/chemist" element={<ChemistPage />} />
      <Route path="/chemist/medicine" element={<MedicineDetailsPage />} />
      
      {/* Hospital Routes */}
      <Route path="/hospital" element={<HospitalPage />} />
      <Route path="/hospital/bookhospital" element={<BookHospitalPage />} />
      
      {/* Pathlab Routes */}
      <Route path="/pathlab" element={<PathlabPage />} />
      <Route path="/pathlab/bookLab" element={<BookLabPage />} />
      <Route path="/pathlab/booktest" element={<BookTestPage />} />
      
      {/* Ambulance Routes */}
      <Route path="/ambulance" element={<AmbulancePage />} />
      <Route path="/ambulance/AmbuDetails" element={<AmbuDetailsPage />} />
      <Route path="/ambulance/AmbuDetails/AmbuBooking" element={<AmbuBookingPage />} />
      <Route path="/ambulance/basic-life-support" element={<BasicLifeSupportPage />} />
      <Route path="/ambulance/advanced-life-support" element={<AdvancedLifeSupportPage />} />
      <Route path="/ambulance/long-distance-transfer" element={<LongDistanceTransferPage />} />
      <Route path="/ambulance/elderly-care-transport" element={<ElderlyCareTransportPage />} />
      <Route path="/ambulance/neonatal-transport" element={<NeonatalTransportPage />} />
      <Route path="/ambulance/airport-transfer" element={<AirportTransferPage />} />
      
      {/* User Profile Routes */}
      <Route path="/appointments" element={<MyAppointmentsPage />} />
      <Route path="/orders" element={<MyOrdersPage />} />
      <Route path="/reports" element={<MyReportsPage />} />
      <Route path="/bookings" element={<MyBookingsPage />} />
      <Route path="/addresses" element={<SavedAddressesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/privacy" element={<SettingsPage />} />
    </Routes>
    </>
  );
}

export default App;
