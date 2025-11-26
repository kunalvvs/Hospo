import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import './DoctorRegistration.css';

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Doctor registration form data
  const [doctorData, setDoctorData] = useState({
    // Profile Section
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    profilePhoto: '',
    languages: [],
    bio: '',
    
    // Medical Credentials Section
    registrationNumber: '',
    registrationCouncil: '',
    registrationYear: '',
    qualifications: [],
    specializations: [],
    experience: '',
    awards: '',
    
    // Clinic Details Section
    clinicName: '',
    clinicAddress: '',
    city: '',
    state: '',
    pincode: '',
    clinicPhone: '',
    clinicEmail: '',
    workingDays: [],
    consultationTiming: { start: '', end: '' },
    consultationFee: '',
    followUpFee: '',
    onlineConsultation: false,
    onlineConsultationFee: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    const doctorDataString = localStorage.getItem('doctorData');
    
    if (!userString) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userString);
      
      if (userData.role !== 'doctor') {
        alert('Access denied. This page is only for doctors.');
        navigate('/');
        return;
      }
      
      setCurrentUser(userData);
      
      // Check if doctor has already registered
      if (doctorDataString) {
        const existingData = JSON.parse(doctorDataString);
        setDoctorData(existingData);
        setIsEditMode(true);
      } else {
        // Pre-fill name and phone from user data
        setDoctorData(prev => ({
          ...prev,
          fullName: userData.name || '',
          clinicPhone: userData.phone || ''
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setDoctorData({ ...doctorData, [name]: checked });
    } else {
      setDoctorData({ ...doctorData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setDoctorData({ ...doctorData, [field]: array });
  };

  const handleWorkingDayToggle = (day) => {
    const updatedDays = doctorData.workingDays.includes(day)
      ? doctorData.workingDays.filter(d => d !== day)
      : [...doctorData.workingDays, day];
    setDoctorData({ ...doctorData, workingDays: updatedDays });
  };

  const handleTimingChange = (field, value) => {
    setDoctorData({
      ...doctorData,
      consultationTiming: { ...doctorData.consultationTiming, [field]: value }
    });
  };

  const validateSection = (section) => {
    const newErrors = {};

    if (section === 'profile') {
      if (!doctorData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!doctorData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(doctorData.email)) newErrors.email = 'Invalid email format';
      if (!doctorData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!doctorData.gender) newErrors.gender = 'Gender is required';
    }

    if (section === 'credentials') {
      if (!doctorData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
      if (!doctorData.registrationCouncil.trim()) newErrors.registrationCouncil = 'Registration council is required';
      if (!doctorData.registrationYear) newErrors.registrationYear = 'Registration year is required';
      if (doctorData.qualifications.length === 0) newErrors.qualifications = 'At least one qualification is required';
      if (doctorData.specializations.length === 0) newErrors.specializations = 'At least one specialization is required';
      if (!doctorData.experience) newErrors.experience = 'Years of experience is required';
    }

    if (section === 'clinic') {
      if (!doctorData.clinicName.trim()) newErrors.clinicName = 'Clinic name is required';
      if (!doctorData.clinicAddress.trim()) newErrors.clinicAddress = 'Clinic address is required';
      if (!doctorData.city.trim()) newErrors.city = 'City is required';
      if (!doctorData.state.trim()) newErrors.state = 'State is required';
      if (!doctorData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      if (!doctorData.clinicPhone.trim()) newErrors.clinicPhone = 'Clinic phone is required';
      if (doctorData.workingDays.length === 0) newErrors.workingDays = 'Select at least one working day';
      if (!doctorData.consultationFee) newErrors.consultationFee = 'Consultation fee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeSection === 'profile' && validateSection('profile')) {
      setActiveSection('credentials');
    } else if (activeSection === 'credentials' && validateSection('credentials')) {
      setActiveSection('clinic');
    }
  };

  const handlePrevious = () => {
    if (activeSection === 'credentials') {
      setActiveSection('profile');
    } else if (activeSection === 'clinic') {
      setActiveSection('credentials');
    }
  };

  const handleSkip = () => {
    // Save current data even if incomplete
    localStorage.setItem('doctorData', JSON.stringify(doctorData));
    navigate('/doctor-dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateSection('clinic')) {
      try {
        // Map form fields to backend schema
        const profileData = {
          // Profile fields (map from form to backend schema)
          bio: doctorData.bio,
          languages: doctorData.languages,
          experience: parseInt(doctorData.experience) || 0,
          
          // Credentials
          registrationNumber: doctorData.registrationNumber,
          registrationCouncil: doctorData.registrationCouncil,
          degrees: doctorData.qualifications.map(q => ({ name: q })),
          
          // Clinic Details
          clinicName: doctorData.clinicName,
          clinicStreet: doctorData.clinicAddress,
          clinicCity: doctorData.city,
          clinicState: doctorData.state,
          clinicPincode: doctorData.pincode,
          clinicMobile: doctorData.clinicPhone,
          consultationFee: parseFloat(doctorData.consultationFee) || 0,
          
          // Online Consultation
          onlineConsultation: doctorData.onlineConsultation,
          onlineConsultationFee: parseFloat(doctorData.onlineConsultationFee) || 0
        };
        
        // Save complete doctor data to backend
        await doctorAPI.updateProfile(profileData);
        
        setShowSuccessMessage(true);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/doctor-dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error saving doctor data:', error);
        alert(error.response?.data?.message || 'Failed to save registration data. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="doctor-registration-container">
      {/* Header */}
      <div className="registration-header">
        <div className="header-left">
          <img src="/images/cosco.png" alt="Logo" className="logo" />
          <h1>Doctor Registration</h1>
        </div>
        <div className="header-right">
          <span className="user-info">👋 Welcome, {currentUser?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-steps">
          <div className={`progress-step ${activeSection === 'profile' ? 'active' : ''} ${activeSection !== 'profile' ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Profile</div>
          </div>
          <div className={`progress-line ${activeSection !== 'profile' ? 'completed' : ''}`}></div>
          <div className={`progress-step ${activeSection === 'credentials' ? 'active' : ''} ${activeSection === 'clinic' ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Medical Credentials</div>
          </div>
          <div className={`progress-line ${activeSection === 'clinic' ? 'completed' : ''}`}></div>
          <div className={`progress-step ${activeSection === 'clinic' ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Clinic Details</div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="registration-content">
        <form onSubmit={handleSubmit}>
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="form-section">
              <h2>👤 Profile Information</h2>
              <p className="section-description">Tell us about yourself</p>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={doctorData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={doctorData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Date of Birth <span className="required">*</span></label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={doctorData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  />
                  {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                </div>

                <div className="form-group">
                  <label>Gender <span className="required">*</span></label>
                  <select
                    name="gender"
                    value={doctorData.gender}
                    onChange={handleInputChange}
                    className={errors.gender ? 'error' : ''}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Languages Spoken</label>
                  <input
                    type="text"
                    name="languages"
                    value={doctorData.languages.join(', ')}
                    onChange={(e) => handleArrayInput('languages', e.target.value)}
                    placeholder="e.g., English, Hindi, Tamil (comma separated)"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Bio / About</label>
                  <textarea
                    name="bio"
                    value={doctorData.bio}
                    onChange={handleInputChange}
                    placeholder="Brief introduction about yourself..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleSkip} className="btn-skip">
                  Skip for Now
                </button>
                <button type="button" onClick={handleNext} className="btn-next">
                  Next: Medical Credentials →
                </button>
              </div>
            </div>
          )}

          {/* Medical Credentials Section */}
          {activeSection === 'credentials' && (
            <div className="form-section">
              <h2>🩺 Medical Credentials</h2>
              <p className="section-description">Your professional qualifications</p>

              <div className="form-grid">
                <div className="form-group">
                  <label>Registration Number <span className="required">*</span></label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={doctorData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., MCI12345"
                    className={errors.registrationNumber ? 'error' : ''}
                  />
                  {errors.registrationNumber && <span className="error-text">{errors.registrationNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Registration Council <span className="required">*</span></label>
                  <input
                    type="text"
                    name="registrationCouncil"
                    value={doctorData.registrationCouncil}
                    onChange={handleInputChange}
                    placeholder="e.g., Medical Council of India"
                    className={errors.registrationCouncil ? 'error' : ''}
                  />
                  {errors.registrationCouncil && <span className="error-text">{errors.registrationCouncil}</span>}
                </div>

                <div className="form-group">
                  <label>Registration Year <span className="required">*</span></label>
                  <input
                    type="number"
                    name="registrationYear"
                    value={doctorData.registrationYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2010"
                    min="1950"
                    max={new Date().getFullYear()}
                    className={errors.registrationYear ? 'error' : ''}
                  />
                  {errors.registrationYear && <span className="error-text">{errors.registrationYear}</span>}
                </div>

                <div className="form-group">
                  <label>Years of Experience <span className="required">*</span></label>
                  <input
                    type="number"
                    name="experience"
                    value={doctorData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 10"
                    min="0"
                    max="60"
                    className={errors.experience ? 'error' : ''}
                  />
                  {errors.experience && <span className="error-text">{errors.experience}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Qualifications <span className="required">*</span></label>
                  <input
                    type="text"
                    name="qualifications"
                    value={doctorData.qualifications.join(', ')}
                    onChange={(e) => handleArrayInput('qualifications', e.target.value)}
                    placeholder="e.g., MBBS, MD (comma separated)"
                    className={errors.qualifications ? 'error' : ''}
                  />
                  {errors.qualifications && <span className="error-text">{errors.qualifications}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Specializations <span className="required">*</span></label>
                  <input
                    type="text"
                    name="specializations"
                    value={doctorData.specializations.join(', ')}
                    onChange={(e) => handleArrayInput('specializations', e.target.value)}
                    placeholder="e.g., Cardiology, Internal Medicine (comma separated)"
                    className={errors.specializations ? 'error' : ''}
                  />
                  {errors.specializations && <span className="error-text">{errors.specializations}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Awards & Recognition</label>
                  <textarea
                    name="awards"
                    value={doctorData.awards}
                    onChange={handleInputChange}
                    placeholder="Any awards, recognitions, or achievements..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handlePrevious} className="btn-prev">
                  ← Previous
                </button>
                <button type="button" onClick={handleSkip} className="btn-skip">
                  Skip for Now
                </button>
                <button type="button" onClick={handleNext} className="btn-next">
                  Next: Clinic Details →
                </button>
              </div>
            </div>
          )}

          {/* Clinic Details Section */}
          {activeSection === 'clinic' && (
            <div className="form-section">
              <h2>🏥 Clinic Details</h2>
              <p className="section-description">Your practice information</p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Clinic Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="clinicName"
                    value={doctorData.clinicName}
                    onChange={handleInputChange}
                    placeholder="Enter clinic name"
                    className={errors.clinicName ? 'error' : ''}
                  />
                  {errors.clinicName && <span className="error-text">{errors.clinicName}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Clinic Address <span className="required">*</span></label>
                  <textarea
                    name="clinicAddress"
                    value={doctorData.clinicAddress}
                    onChange={handleInputChange}
                    placeholder="Street address, building name, etc."
                    rows="2"
                    className={errors.clinicAddress ? 'error' : ''}
                  />
                  {errors.clinicAddress && <span className="error-text">{errors.clinicAddress}</span>}
                </div>

                <div className="form-group">
                  <label>City <span className="required">*</span></label>
                  <input
                    type="text"
                    name="city"
                    value={doctorData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>State <span className="required">*</span></label>
                  <input
                    type="text"
                    name="state"
                    value={doctorData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label>Pincode <span className="required">*</span></label>
                  <input
                    type="text"
                    name="pincode"
                    value={doctorData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>

                <div className="form-group">
                  <label>Clinic Phone <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="clinicPhone"
                    value={doctorData.clinicPhone}
                    onChange={handleInputChange}
                    placeholder="10-digit phone number"
                    maxLength="10"
                    className={errors.clinicPhone ? 'error' : ''}
                  />
                  {errors.clinicPhone && <span className="error-text">{errors.clinicPhone}</span>}
                </div>

                <div className="form-group">
                  <label>Clinic Email</label>
                  <input
                    type="email"
                    name="clinicEmail"
                    value={doctorData.clinicEmail}
                    onChange={handleInputChange}
                    placeholder="clinic@example.com"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Working Days <span className="required">*</span></label>
                  <div className="days-selector">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        className={`day-btn ${doctorData.workingDays.includes(day) ? 'selected' : ''}`}
                        onClick={() => handleWorkingDayToggle(day)}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                  {errors.workingDays && <span className="error-text">{errors.workingDays}</span>}
                </div>

                <div className="form-group">
                  <label>Consultation Start Time</label>
                  <input
                    type="time"
                    value={doctorData.consultationTiming.start}
                    onChange={(e) => handleTimingChange('start', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Consultation End Time</label>
                  <input
                    type="time"
                    value={doctorData.consultationTiming.end}
                    onChange={(e) => handleTimingChange('end', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Consultation Fee (₹) <span className="required">*</span></label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={doctorData.consultationFee}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                    min="0"
                    className={errors.consultationFee ? 'error' : ''}
                  />
                  {errors.consultationFee && <span className="error-text">{errors.consultationFee}</span>}
                </div>

                <div className="form-group">
                  <label>Follow-up Fee (₹)</label>
                  <input
                    type="number"
                    name="followUpFee"
                    value={doctorData.followUpFee}
                    onChange={handleInputChange}
                    placeholder="e.g., 300"
                    min="0"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="onlineConsultation"
                      checked={doctorData.onlineConsultation}
                      onChange={handleInputChange}
                    />
                    <span>Offer Online Consultation</span>
                  </label>
                </div>

                {doctorData.onlineConsultation && (
                  <div className="form-group">
                    <label>Online Consultation Fee (₹)</label>
                    <input
                      type="number"
                      name="onlineConsultationFee"
                      value={doctorData.onlineConsultationFee}
                      onChange={handleInputChange}
                      placeholder="e.g., 400"
                      min="0"
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handlePrevious} className="btn-prev">
                  ← Previous
                </button>
                <button type="button" onClick={handleSkip} className="btn-skip">
                  Skip for Now
                </button>
                <button type="submit" className="btn-submit">
                  Complete Registration ✓
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-overlay">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Registration Successful!</h2>
            <p>Redirecting to your dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRegistration;
