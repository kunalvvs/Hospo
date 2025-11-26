import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call backend API
      const response = await authAPI.login({
        email: email,
        password: password
      });

      console.log('Login successful:', response);

      // Store user data
      localStorage.setItem('currentUser', JSON.stringify(response.doctor));
      
      // Navigate based on role
      if (response.doctor.role === 'doctor') {
        alert(`Welcome Dr. ${response.doctor.name}!`);
        navigate('/doctor-dashboard');
      } else if (response.doctor.role === 'ambulance') {
        alert(`Welcome Ambulance Service!`);
        navigate('/ambulance-dashboard');
      } else if (response.doctor.role === 'chemist') {
        alert(`Welcome Chemist!`);
        navigate('/chemist-dashboard');
      } else if (response.doctor.role === 'hospital') {
        alert(`Welcome Hospital!`);
        navigate('/hospital-dashboard');
      } else if (response.doctor.role === 'pathlab') {
        alert(`Welcome Pathlab!`);
        navigate('/pathlab-dashboard');
      } else {
        alert(`Welcome Patient!`);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
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
              <img src="/images/cosco.png" alt="logo" />

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
            <p className="demo-badge">🔐 Secure Login - Backend API</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="input-group">
              <div className="input-icon">
                <span>📧</span>
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
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
