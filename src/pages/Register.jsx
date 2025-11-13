import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      navigate('/');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Store registration data temporarily
      const registrationData = {
        role: userRole,
        name: formData.name,
        phone: formData.phone,
        password: formData.password
      };
      localStorage.setItem('pendingRegistration', JSON.stringify(registrationData));
      
      // Navigate to OTP verification
      navigate('/verify-otp');
    }
  };

  const handleBackToRoleSelection = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const roleDisplay = getRoleDisplay(userRole);

  return (
    <div className="register-container">
      <div className="register-content">
        {/* Logo Section */}
        <div className="register-logo-section">
          <div className="logo">
           <img src="public\images\cosco.png" alt="logo" />
          </div>
          <p className="register-tagline">Healthcare at your fingertips</p>
        </div>

        {/* Role Badge */}
        <div className="role-badge">
          <span className="role-badge-icon">{roleDisplay.icon}</span>
          <span className="role-badge-text">Register as {roleDisplay.name}</span>
        </div>

        {/* Register Form */}
        <div className="register-card">
          <div className="register-header">
            <h2>Create your account</h2>
            <p>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleRegister}>
            {/* Name Input */}
            <div className="input-group">
              <div className="input-icon">
                <span>👤</span>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Phone Input */}
            <div className="input-group">
              <div className="input-icon">
                <span>📱</span>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Enter mobile number"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Password Input */}
            <div className="input-group">
              <div className="input-icon">
                <span>🔒</span>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Create password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {/* Confirm Password Input */}
            <div className="input-group">
              <div className="input-icon">
                <span>🔒</span>
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="register-btn">
              Register & Send OTP
            </button>
          </form>

          <div className="register-footer">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button className="back-button" onClick={handleBackToRoleSelection}>
          ← Change Role
        </button>

        {/* Login Link */}
        <div className="login-link">
          <p>
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleGoToLogin(); }}>Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
