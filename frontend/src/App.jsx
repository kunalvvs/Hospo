import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import DoctorRegistration from './pages/DoctorRegistration';
import DoctorDashboard from './pages/DoctorDashboard';
import AmbulanceRegistration from './pages/AmbulanceRegistration';
import AmbulanceDashboard from './pages/AmbulanceDashboard';
import AmbulanceWallet from './pages/AmbulanceWallet';
import ChemistRegistration from './pages/ChemistRegistration';
import ChemistDashboard from './pages/ChemistDashboard';
import HospitalRegistration from './pages/HospitalRegistration';
import HospitalDashboard from './pages/HospitalDashboard';
import PathlabRegistration from './pages/PathlabRegistration';
import PathlabDashboard from './pages/PathlabDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/ambulance-registration" element={<AmbulanceRegistration />} />
          <Route path="/ambulance-dashboard" element={<AmbulanceDashboard />} />
          <Route path="/ambulance-wallet" element={<AmbulanceWallet />} />
          <Route path="/chemist-registration" element={<ChemistRegistration />} />
          <Route path="/chemist-dashboard" element={<ChemistDashboard />} />
          <Route path="/hospital-registration" element={<HospitalRegistration />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/pathlab-registration" element={<PathlabRegistration />} />
          <Route path="/pathlab-dashboard" element={<PathlabDashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
