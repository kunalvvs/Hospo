import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalAPI } from '../services/api';
import './HospitalRegistration.css';

const HospitalRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Identity
    hospitalName: '',
    practiceType: '',
    tagline: '',
    logo: null,
    logoPreview: '',
    
    // Step 2: Address & Location
    streetAddress: '',
    locality: '',
    city: '',
    pincode: '',
    landmark: '',
    latitude: '',
    longitude: '',
    branches: '', // String for textarea input
    
    // Step 3: Contact Details
    mainPhone: '',
    alternatePhone: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    mondayHours: '',
    tuesdayHours: '',
    wednesdayHours: '',
    thursdayHours: '',
    fridayHours: '',
    saturdayHours: '',
    sundayHours: '',
    emergencyHours: '24×7',
    opdHours: '',
    holidayDates: ''
  });

  useEffect(() => {
    // Check if user is logged in and verified
    const currentUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (!currentUser || !token) {
      alert('Please login first to access this page');
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(currentUser);
      if (userData.role !== 'hospital') {
        alert('This page is only for hospitals');
        navigate('/');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ 
        ...formData, 
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file)
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      const response = await hospitalAPI.uploadFile(file);
      return response.fileUrl;
    } catch (error) {
      console.error('File upload error:', error);
      alert('Error uploading file. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validateStep1 = () => {
    if (!formData.hospitalName || !formData.practiceType) {
      alert('Please fill all required fields in Step 1');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.streetAddress || !formData.city || !formData.pincode) {
      alert('Please fill all required fields in Step 2');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.mainPhone || !formData.email) {
      alert('Please fill all required fields in Step 3');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate user session - CRITICAL
    const currentUserStr = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (!currentUserStr || !token) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return;
    }
    
    if (!validateStep3()) {
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload logo if exists
      let logoUrl = '';
      if (formData.logo) {
        console.log('Uploading logo...');
        logoUrl = await uploadFile(formData.logo);
        console.log('Logo uploaded:', logoUrl);
      }
      
      // Prepare data for backend
      const hospitalData = {
        hospitalName: formData.hospitalName,
        practiceType: formData.practiceType,
        tagline: formData.tagline,
        logo: logoUrl,
        streetAddress: formData.streetAddress,
        locality: formData.locality,
        city: formData.city,
        pincode: formData.pincode,
        landmark: formData.landmark,
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude
        },
        branches: Array.isArray(formData.branches) 
          ? formData.branches 
          : (formData.branches ? formData.branches.split('\n').filter(b => b.trim()) : []),
        mainPhone: formData.mainPhone,
        alternatePhone: formData.alternatePhone,
        contactEmail: formData.email,
        website: formData.website,
        socialMedia: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter
        },
        workingHours: {
          mondayHours: formData.mondayHours,
          tuesdayHours: formData.tuesdayHours,
          wednesdayHours: formData.wednesdayHours,
          thursdayHours: formData.thursdayHours,
          fridayHours: formData.fridayHours,
          saturdayHours: formData.saturdayHours,
          sundayHours: formData.sundayHours,
          opdHours: formData.opdHours,
          emergencyHours: formData.emergencyHours,
          holidayDates: formData.holidayDates
        },
        registrationComplete: true
      };
      
      console.log('Submitting hospital data:', hospitalData);
      
      // Save to backend
      const response = await hospitalAPI.updateProfile(hospitalData);
      
      console.log('Hospital registration completed:', response);
      
      // Update local storage
      const currentUser = JSON.parse(currentUserStr);
      const updatedUser = {
        ...currentUser,
        ...response.hospital,
        registrationComplete: true
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
      
      alert('Hospital registration completed successfully!');
      navigate('/hospital-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', error.response?.data);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || 'Error completing registration. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Validate session - CRITICAL
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      
      setUploading(true);
      
      const minimalData = {
        hospitalName: formData.hospitalName || 'Hospital',
        practiceType: formData.practiceType || 'hospital',
        city: formData.city || 'Not specified',
        mainPhone: formData.mainPhone || '',
        contactEmail: formData.email || '',
        registrationComplete: false
      };
      
      console.log('Saving minimal hospital data:', minimalData);
      const response = await hospitalAPI.updateProfile(minimalData);
      console.log('Skip response:', response);
      
      // Update localStorage with the response
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        registrationComplete: false
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      alert('Profile saved. You can complete your registration later from the dashboard.');
      navigate('/hospital-dashboard');
    } catch (error) {
      console.error('Skip error:', error);
      console.error('Error details:', error.response?.data);
      
      // Check if auth error
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || 'Could not save. Redirecting to dashboard...');
        // Still navigate to dashboard
        navigate('/hospital-dashboard');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="hospital-registration">
      <div className="hosp-reg-container">
        <div className="hosp-reg-header">
          <h1>🏥 Hospital Registration</h1>
          <p>Complete your hospital profile to connect with patients</p>
        </div>

        {/* Progress Steps */}
        <div className="hosp-progress-steps">
          <div className={`hosp-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="hosp-step-number">1</div>
            <div className="hosp-step-label">Basic Identity</div>
          </div>
          <div className="hosp-step-line"></div>
          <div className={`hosp-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="hosp-step-number">2</div>
            <div className="hosp-step-label">Address & Location</div>
          </div>
          <div className="hosp-step-line"></div>
          <div className={`hosp-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="hosp-step-number">3</div>
            <div className="hosp-step-label">Contact Details</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="hosp-reg-form">
          {/* Step 1: Basic Identity */}
          {currentStep === 1 && (
            <div className="hosp-form-step">
              <h2>Basic Practice/Hospital Identity</h2>
              
              <div className="hosp-form-grid">
                <div className="hosp-form-group full-width">
                  <label>Practice/Hospital Name *</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    placeholder="Enter exact legal name"
                    required
                  />
                  <small>As per registration certificate</small>
                </div>

                <div className="hosp-form-group">
                  <label>Practice Type *</label>
                  <select
                    name="practiceType"
                    value={formData.practiceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select practice type</option>
                    <option value="hospital">Hospital</option>
                    <option value="multi-speciality">Multi-speciality Hospital</option>
                    <option value="clinic">Clinic</option>
                    <option value="diagnostic-centre">Diagnostic Centre</option>
                    <option value="nursing-home">Nursing Home</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Short Tagline / Description</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="e.g., Your trusted healthcare partner since 1990"
                  />
                  <small>One-line description for patients</small>
                </div>

                <div className="form-group full-width">
                  <label>Practice Logo (Optional)</label>
                  <input
                    type="file"
                    name="logo"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <small>Recommended size: 300x300px, PNG or JPG</small>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address & Location */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Address & Location Details</h2>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Building number, street name"
                    required
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Locality *</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder="Area or locality"
                    required
                  />
                </div>

                <div className="hosp-form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City name"
                    required
                  />
                </div>

                <div className="hosp-form-group">
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN code"
                    required
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby landmark for easy location"
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Latitude (Optional)</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 28.6139"
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Longitude (Optional)</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 77.2090"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Additional Branch Addresses</label>
                  <textarea
                    name="branches"
                    value={formData.branches}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="If you have multiple branches, list them here (one per line)"
                  ></textarea>
                  <small>Optional: For multi-branch hospitals</small>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details & Working Hours */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Contact Details & Working Hours</h2>
              
              <div className="form-grid">
                <h3 className="hosp-section-title">Contact Information</h3>
                
                <div className="hosp-form-group">
                  <label>Main Phone Number *</label>
                  <input
                    type="tel"
                    name="mainPhone"
                    value={formData.mainPhone}
                    onChange={handleInputChange}
                    placeholder="Reception/Helpline number"
                    required
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Alternate Phone</label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    placeholder="Secondary contact number"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="For patients and official communication"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.yourhospital.com"
                  />
                </div>

                <h3 className="hosp-section-title">Social Media Links (Optional)</h3>

                <div className="hosp-form-group">
                  <label>Facebook</label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook page URL"
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Instagram</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram profile URL"
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="Twitter profile URL"
                  />
                </div>

                <h3 className="hosp-section-title">Working Hours</h3>

                <div className="hosp-form-group">
                  <label>OPD Hours</label>
                  <input
                    type="text"
                    name="opdHours"
                    value={formData.opdHours}
                    onChange={handleInputChange}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Emergency Hours</label>
                  <input
                    type="text"
                    name="emergencyHours"
                    value={formData.emergencyHours}
                    onChange={handleInputChange}
                    placeholder="24×7"
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Monday - Friday</label>
                  <input
                    type="text"
                    name="mondayHours"
                    value={formData.mondayHours}
                    onChange={handleInputChange}
                    placeholder="e.g., 8:00 AM - 8:00 PM"
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Saturday</label>
                  <input
                    type="text"
                    name="saturdayHours"
                    value={formData.saturdayHours}
                    onChange={handleInputChange}
                    placeholder="e.g., 9:00 AM - 2:00 PM"
                  />
                </div>

                <div className="hosp-form-group">
                  <label>Sunday</label>
                  <input
                    type="text"
                    name="sundayHours"
                    value={formData.sundayHours}
                    onChange={handleInputChange}
                    placeholder="e.g., Closed or 10:00 AM - 1:00 PM"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Holiday/Closed Dates</label>
                  <textarea
                    name="holidayDates"
                    value={formData.holidayDates}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="List special holidays or dates when closed"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="hosp-form-nav">
            {currentStep > 1 && (
              <button type="button" className="hosp-btn-secondary" onClick={handlePrevious} disabled={uploading}>
                ← Previous
              </button>
            )}
            <button type="button" className="hosp-btn-skip" onClick={handleSkip} disabled={uploading}>
              Skip for Now
            </button>
            {currentStep < 3 ? (
              <button type="button" className="hosp-btn-primary" onClick={handleNext} disabled={uploading}>
                Next →
              </button>
            ) : (
              <button type="submit" className="hosp-btn-primary" disabled={uploading}>
                {uploading ? 'Saving...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalRegistration;
