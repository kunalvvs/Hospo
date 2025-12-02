import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        // Call backend API
        const response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: userRole
        });

        console.log('Registration successful:', response);

        // Store token in localStorage
        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        // Store pending registration data for OTP verification
        const userData = response.user || response.doctor || response;
        localStorage.setItem('pendingRegistration', JSON.stringify({
          ...userData,
          token: response.token,
          role: userRole,
          email: formData.email,
          phone: formData.phone
        }));
        
        // Send OTP
        try {
          const otpResponse = await authAPI.sendOTP({
            email: formData.email,
            phone: formData.phone,
            type: 'email' // Can be 'email' or 'phone'
          });
          
          console.log('OTP sent:', otpResponse);
          // Only log OTP in console during development, never show in alerts
          if (process.env.NODE_ENV === 'development') {
            console.log('Development OTP:', otpResponse.otp);
          }
          
          // Navigate to OTP verification
          alert(`Registration successful! OTP sent to ${formData.email}`);
          navigate('/verify-otp');
        } catch (otpError) {
          console.error('OTP send error:', otpError);
          // If OTP fails, still allow user to proceed
          alert('Registration successful! However, OTP could not be sent. You can login directly.');
          localStorage.setItem('currentUser', JSON.stringify({
            ...userData,
            token: response.token,
            role: userRole
          }));
          
          if (userRole === 'doctor') {
            navigate('/doctor-registration');
          } else if (userRole === 'hospital') {
            navigate('/hospital-registration');
          } else if (userRole === 'ambulance') {
            navigate('/ambulance-registration');
          } else if (userRole === 'chemist') {
            navigate('/chemist-registration');
          } else if (userRole === 'pathlab') {
            navigate('/pathlab-registration');
          } else {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        setErrors({ submit: errorMessage });
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
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
           <img src="/images/cosco.png" alt="logo" />

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
                disabled={loading}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Email Input */}
            <div className="input-group">
              <div className="input-icon">
                <span>📧</span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled={loading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
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
                disabled={loading}
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
                disabled={loading}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            {errors.submit && <div className="error-message" style={{marginTop: '10px', padding: '10px', background: '#fee', color: '#c33', borderRadius: '5px', textAlign: 'center'}}>{errors.submit}</div>}

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
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
