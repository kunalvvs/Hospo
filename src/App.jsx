import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import AmbulanceRegistration from './pages/AmbulanceRegistration';
import AmbulanceDashboard from './pages/AmbulanceDashboard';
import AmbulanceWallet from './pages/AmbulanceWallet';
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
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/ambulance-registration" element={<AmbulanceRegistration />} />
          <Route path="/ambulance-dashboard" element={<AmbulanceDashboard />} />
          <Route path="/ambulance-wallet" element={<AmbulanceWallet />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
