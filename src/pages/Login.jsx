import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get the selected role from localStorage
    const role = localStorage.getItem('userRole');
    if (!role) {
      // If no role selected, redirect back to role selection
      navigate('/');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // TEMPORARY LOGIN SYSTEM - Accept any credentials
    if (phone.length < 10) {
      setError('Please enter at least 10 digits for phone number');
      return;
    }

    if (!password) {
      setError('Please enter any password');
      return;
    }

    // Create temporary user data for demo
    const tempUser = {
      role: userRole,
      name: phone, // Using phone as name for demo
      phone: phone,
      password: password,
      isTemporary: true
    };

    // Store temporary user
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
    console.log('User logged in:', tempUser);
    console.log('Navigating to dashboard for role:', userRole);
    
    // Navigate to appropriate dashboard based on role
    if (userRole === 'doctor') {
      alert(`Welcome to Doctor Dashboard! (Temporary Login)`);
      // Use window.location for hard redirect to ensure clean navigation
      window.location.href = '/doctor-dashboard';
    } else if (userRole === 'ambulance') {
      alert(`Welcome Ambulance Service! Complete your registration.`);
      window.location.href = '/ambulance-registration';
    } else if (userRole === 'chemist') {
      alert(`Welcome Chemist! Dashboard coming soon.`);
      navigate('/');
    } else if (userRole === 'hospital') {
      alert(`Welcome Hospital! Dashboard coming soon.`);
      navigate('/');
    } else if (userRole === 'pathlab') {
      alert(`Welcome Pathlab! Dashboard coming soon.`);
      navigate('/');
    } else {
      alert(`Welcome Patient! Dashboard coming soon.`);
      navigate('/');
    }
  };

  const handleBackToRoleSelection = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'doctor': { name: 'Doctor', icon: '🩺' },
      'chemist': { name: 'Chemist', icon: '💊' },
      'user': { name: 'Patient', icon: '👤' },
      'hospital': { name: 'Hospital', icon: '🏥' },
      'pathlab': { name: 'Pathlab', icon: '🔬' },
      'ambulance': { name: 'Ambulance', icon: '🚑' }
    };
    return roleMap[role] || { name: role, icon: '👤' };
  };

  const roleDisplay = getRoleDisplay(userRole);

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Logo Section */}
        <div className="login-logo-section">
          <div className="logo">
              <img src="public\images\cosco.png" alt="logo" />
          </div>
          <p className="login-tagline">Healthcare at your fingertips</p>
        </div>

        {/* Role Badge */}
        <div className="role-badge">
          <span className="role-badge-icon">{roleDisplay.icon}</span>
          <span className="role-badge-text">Login as {roleDisplay.name}</span>
        </div>

        {/* Login Form */}
        <div className="login-card">
          <div className="login-header">
            <h2>Login with your credentials</h2>
            <p className="demo-badge">🎭 Demo Mode - Type anything to login</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="input-group">
              <div className="input-icon">
                <span>📱</span>
              </div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                  setError('');
                }}
                maxLength="10"
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <span>🔒</span>
              </div>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </div>

            <button type="submit" className="continue-btn">
              Login
            </button>
          </form>

          <div className="login-footer">
            <p>
              By continuing, you agree to our{' '}
              <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button className="back-button" onClick={handleBackToRoleSelection}>
          ← Change Role
        </button>

        {/* Register Link */}
        <div className="register-link">
          <p>
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
