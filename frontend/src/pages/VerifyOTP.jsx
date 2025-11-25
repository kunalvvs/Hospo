import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyOTP.css';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('pendingRegistration');
    if (!data) {
      navigate('/');
      return;
    }
    setRegistrationData(JSON.parse(data));

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
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

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    // Simulate OTP verification (in real app, call API)
    // For demo, accept "123456" as valid OTP
    if (otpValue === '123456') {
      // Store user data
      const userData = {
        name: registrationData.name,
        phone: registrationData.phone,
        role: registrationData.role,
        isRegistered: true
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.removeItem('pendingRegistration');
      
      // Redirect based on role
      if (registrationData.role === 'doctor') {
        // First time registration - always go to registration page
        navigate('/doctor-registration');
      } else if (registrationData.role === 'ambulance') {
        navigate('/ambulance-registration');
      } else if (registrationData.role === 'chemist') {
        navigate('/chemist-registration');
      } else if (registrationData.role === 'hospital') {
        navigate('/hospital-registration');
      } else if (registrationData.role === 'pathlab') {
        navigate('/pathlab-registration');
      } else {
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
      }
    } else {
      setError('Invalid OTP. Please try again. (Use 123456 for demo)');
    }
  };

  const handleResendOTP = () => {
    if (!canResend) return;
    
    // Simulate resending OTP
    console.log('Resending OTP to:', registrationData?.phone);
    alert('OTP sent successfully!');
    
    setCanResend(false);
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!registrationData) return null;

  const roleDisplay = getRoleDisplay(registrationData.role);

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-content">
        {/* Logo Section */}
        <div className="verify-logo-section">
          <div className="logo">
             <img src="/images/cosco.png" alt="logo" />

          </div>
          <p className="verify-tagline">Healthcare at your fingertips</p>
        </div>

        {/* Role Badge */}
        <div className="role-badge">
          <span className="role-badge-icon">{roleDisplay.icon}</span>
          <span className="role-badge-text">Verify as {roleDisplay.name}</span>
        </div>

        {/* OTP Verification Card */}
        <div className="verify-card">
          <div className="verify-header">
            <div className="verify-icon">📱</div>
            <h2>Verify OTP</h2>
            <p>We've sent a 6-digit code to</p>
            <p className="phone-number">+91 {registrationData.phone}</p>
          </div>

          <form onSubmit={handleVerifyOTP}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={error ? 'error' : ''}
                />
              ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="verify-btn">
              Verify & Complete Registration
            </button>
          </form>

          <div className="resend-section">
            {canResend ? (
              <button onClick={handleResendOTP} className="resend-btn">
                Resend OTP
              </button>
            ) : (
              <p className="timer-text">
                Resend OTP in <span>{resendTimer}s</span>
              </p>
            )}
          </div>

          <div className="demo-hint">
            <p>💡 Demo: Use OTP <strong>123456</strong></p>
          </div>
        </div>

        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/register')}>
          ← Back to Registration
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
