import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HospitalRegistration.css';

const HospitalRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Identity
    hospitalName: '',
    practiceType: '',
    tagline: '',
    logo: null,
    
    // Step 2: Address & Location
    streetAddress: '',
    locality: '',
    city: '',
    pincode: '',
    landmark: '',
    latitude: '',
    longitude: '',
    branches: [],
    
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
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'hospital') {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep3()) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const registrationData = {
        ...currentUser,
        ...formData,
        registrationComplete: true
      };
      localStorage.setItem('currentUser', JSON.stringify(registrationData));
      localStorage.setItem('hospitalData', JSON.stringify(formData));
      
      alert('Hospital registration completed successfully!');
      navigate('/hospital-dashboard');
    }
  };

  const handleSkip = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const minimalData = {
      hospitalName: formData.hospitalName || 'Hospital',
      practiceType: formData.practiceType || 'Not specified',
      city: formData.city || 'Not specified',
      mainPhone: formData.mainPhone || currentUser.mobile || '',
      email: formData.email || currentUser.email || '',
      registrationComplete: false,
      skipped: true
    };
    
    localStorage.setItem('hospitalData', JSON.stringify(minimalData));
    alert('Registration skipped. You can complete your profile later from the dashboard.');
    navigate('/hospital-dashboard');
  };

  return (
    <div className="hospital-registration">
      <div className="hosp-reg-container">
        <div className="hosp-reg-header">
          <h1>🏥 Hospital Registration</h1>
          <p>Complete your hospital profile to connect with patients</p>
          {/* <button type="button" className="hosp-skip-btn" onClick={handleSkip}>
            Skip Registration →
          </button> */}
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
              <button type="button" className="hosp-btn-secondary" onClick={handlePrevious}>
                ← Previous
              </button>
            )}
            <button type="button" className="hosp-btn-skip" onClick={handleSkip}>
              Skip for Now
            </button>
            {currentStep < 3 ? (
              <button type="button" className="hosp-btn-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button type="submit" className="hosp-btn-primary">
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalRegistration;
