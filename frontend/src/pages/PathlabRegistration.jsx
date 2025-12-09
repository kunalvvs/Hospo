import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathlabAPI } from '../services/api';
import './PathlabRegistration.css';

const PathlabRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Account/Business Details
    labName: '',
    businessType: '',
    authorizedPerson: '',
    primaryEmail: '',
    primaryMobile: '',
    
    // Step 2: Location & Contact
    doorNo: '',
    street: '',
    locality: '',
    landmark: '',
    city: '',
    pincode: '',
    phoneNumber: '',
    landline: '',
    workingHours: '',
    sampleCollectionHours: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'pathlab') {
      navigate('/login');
      return;
    }
    
    // Pre-fill email and phone from registration
    setFormData(prev => ({
      ...prev,
      primaryEmail: user.email || '',
      primaryMobile: user.phone || ''
    }));
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep1 = () => {
    if (!formData.labName || !formData.businessType || !formData.authorizedPerson || 
        !formData.primaryEmail || !formData.primaryMobile) {
      alert('Please fill all required fields in Step 1');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.doorNo || !formData.street || !formData.city || !formData.pincode) {
      alert('Please fill all required fields in Step 2');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Prepare data for backend - mapping all registration form fields to backend model
      const profileData = {
        // Identity fields
        name: formData.labName,
        labName: formData.labName,
        businessType: formData.businessType,
        authorizedPerson: formData.authorizedPerson,
        directorName: formData.authorizedPerson,
        
        // Contact fields
        primaryEmail: formData.primaryEmail,
        primaryMobile: formData.primaryMobile,
        alternatePhone: formData.phoneNumber,
        phoneNumber: formData.phoneNumber,
        landline: formData.landline,
        
        // Address fields (both flat and nested for compatibility)
        doorNo: formData.doorNo,
        street: formData.street,
        locality: formData.locality,
        landmark: formData.landmark,
        city: formData.city,
        pincode: formData.pincode,
        address: {
          street: `${formData.doorNo}, ${formData.street}`,
          landmark: formData.locality || formData.landmark,
          city: formData.city,
          state: formData.city, // Can be updated later
          pincode: formData.pincode
        },
        
        // Working hours
        workingHours: formData.workingHours,
        sampleCollectionHours: formData.sampleCollectionHours,
        
        // Status
        registrationComplete: true
      };

      // Update pathlab profile via API
      const response = await pathlabAPI.updateProfile(profileData);

      if (response.success) {
        // Update localStorage
        const updatedUser = {
          ...currentUser,
          registrationComplete: true
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        
        alert('Pathlab registration completed successfully!');
        navigate('/pathlab-dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Prepare minimal data for skip
      const minimalData = {
        name: formData.labName || 'My Pathlab',
        registrationComplete: false
      };

      // Update pathlab profile via API
      const response = await pathlabAPI.updateProfile(minimalData);

      if (response.success) {
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        alert('Registration skipped. You can complete your profile later from the dashboard.');
        navigate('/pathlab-dashboard');
      }
    } catch (error) {
      console.error('Skip error:', error);
      // If API fails, fallback to local storage
      const minimalData = {
        labName: formData.labName || 'Pathlab',
        businessType: formData.businessType || 'Not specified',
        city: formData.city || 'Not specified',
        primaryMobile: formData.primaryMobile,
        primaryEmail: formData.primaryEmail,
        registrationComplete: false,
        skipped: true
      };
      localStorage.setItem('pathlabData', JSON.stringify(minimalData));
      alert('Registration skipped. You can complete your profile later from the dashboard.');
      navigate('/pathlab-dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pathlab-registration">
      <div className="pathlab-reg-container">
        <div className="pathlab-reg-header">
          <h1>🔬 Pathlab Registration</h1>
          <p>Complete your pathlab profile to connect with patients</p>
          {/*<button type="button" className="pathlab-skip-btn" onClick={handleSkip}>
            Skip Registration →
          </button>*/}
        </div>

        {/* Progress Steps */}
        <div className="pathlab-progress-steps">
          <div className={`pathlab-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="pathlab-step-number">1</div>
            <div className="pathlab-step-label">Account / Business</div>
          </div>
          <div className="pathlab-step-line"></div>
          <div className={`pathlab-step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="pathlab-step-number">2</div>
            <div className="pathlab-step-label">Location & Contact</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pathlab-reg-form">
          {/* Step 1: Account/Business Details */}
          {currentStep === 1 && (
            <div className="pathlab-form-step">
              <h2>Account / Business Details</h2>
              
              <div className="pathlab-form-grid">
                <div className="pathlab-form-group full-width">
                  <label>Lab / Company Name *</label>
                  <input
                    type="text"
                    name="labName"
                    value={formData.labName}
                    onChange={handleInputChange}
                    placeholder="Enter lab name (will be shown on public listing)"
                    required
                  />
                  <small>This will be displayed on public listing</small>
                </div>

                <div className="pathlab-form-group">
                  <label>Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="pvt-ltd">Private Limited (Pvt Ltd)</option>
                    <option value="llp">Limited Liability Partnership (LLP)</option>
                  </select>
                </div>

                <div className="pathlab-form-group">
                  <label>Authorized Person / Contact Person *</label>
                  <input
                    type="text"
                    name="authorizedPerson"
                    value={formData.authorizedPerson}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Suresh Kumar"
                    required
                  />
                </div>

                <div className="pathlab-form-group full-width">
                  <label>Primary Email *</label>
                  <input
                    type="email"
                    name="primaryEmail"
                    value={formData.primaryEmail}
                    onChange={handleInputChange}
                    placeholder="For login and notifications"
                    required
                  />
                  <small>Used for login and notifications</small>
                </div>

                <div className="pathlab-form-group">
                  <label>Primary Mobile Number *</label>
                  <input
                    type="tel"
                    name="primaryMobile"
                    value={formData.primaryMobile}
                    onChange={handleInputChange}
                    placeholder="For OTP verification"
                    required
                    maxLength="10"
                  />
                  <small>For OTP verification</small>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Contact */}
          {currentStep === 2 && (
            <div className="pathlab-form-step">
              <h2>Location & Contact Details</h2>
              <p className="pathlab-step-desc">For listing and sample collection services</p>
              
              <div className="pathlab-form-grid">
                <h3 className="pathlab-section-title">Full Address</h3>

                <div className="pathlab-form-group">
                  <label>Door No. / Building No. *</label>
                  <input
                    type="text"
                    name="doorNo"
                    value={formData.doorNo}
                    onChange={handleInputChange}
                    placeholder="Building/house number"
                    required
                  />
                </div>

                <div className="pathlab-form-group">
                  <label>Street Name *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Street or road name"
                    required
                  />
                </div>

                <div className="pathlab-form-group">
                  <label>Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder="Area or locality"
                  />
                </div>

                <div className="pathlab-form-group">
                  <label>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby landmark"
                  />
                </div>

                <div className="pathlab-form-group">
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

                <div className="pathlab-form-group">
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN code"
                    required
                    maxLength="6"
                  />
                </div>

                <h3 className="pathlab-section-title">Contact Information</h3>

                <div className="pathlab-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="For bookings and urgent calls"
                  />
                  <small>For bookings and urgent calls</small>
                </div>

                <div className="pathlab-form-group">
                  <label>Landline (Optional)</label>
                  <input
                    type="tel"
                    name="landline"
                    value={formData.landline}
                    onChange={handleInputChange}
                    placeholder="Landline number with STD code"
                  />
                </div>

                <h3 className="pathlab-section-title">Working Hours</h3>

                <div className="pathlab-form-group">
                  <label>Working Hours</label>
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Sat: 8:00 AM - 6:00 PM"
                  />
                  <small>Days and timings</small>
                </div>

                <div className="pathlab-form-group">
                  <label>Sample Collection Hours</label>
                  <input
                    type="text"
                    name="sampleCollectionHours"
                    value={formData.sampleCollectionHours}
                    onChange={handleInputChange}
                    placeholder="Morning/Evening shifts"
                  />
                  <small>Morning/Evening shifts timing</small>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pathlab-form-nav">
            {currentStep > 1 && (
              <button type="button" className="pathlab-btn-secondary" onClick={handlePrevious}>
                ← Previous
              </button>
            )}
            <button type="button" className="pathlab-btn-skip" onClick={handleSkip}>
              Skip for Now
            </button>
            {currentStep < 2 ? (
              <button type="button" className="pathlab-btn-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button type="submit" className="pathlab-btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PathlabRegistration;
