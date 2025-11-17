import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChemistRegistration.css';

const ChemistRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Identity
    pharmacyName: '',
    businessType: '',
    tagline: '',
    
    // Step 2: Address & Location
    shopNumber: '',
    building: '',
    locality: '',
    city: '',
    pin: '',
    landmark: '',
    latitude: '',
    longitude: '',
    branches: '',
    
    // Step 3: Contact Details
    primaryPhone: '',
    mobile: '',
    whatsappNumber: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: ''
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'chemist') {
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
    if (!formData.pharmacyName || !formData.businessType) {
      alert('Please fill all required fields in Step 1');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.locality || !formData.city || !formData.pin) {
      alert('Please fill all required fields in Step 2');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.primaryPhone || !formData.mobile || !formData.email) {
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
      // Store registration data
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const registrationData = {
        ...currentUser,
        ...formData,
        registrationComplete: true
      };
      localStorage.setItem('currentUser', JSON.stringify(registrationData));
      localStorage.setItem('chemistData', JSON.stringify(formData));
      
      alert('Registration completed successfully!');
      navigate('/chemist-dashboard');
    }
  };

  const handleSkip = () => {
    // Store minimal data and skip to dashboard
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const minimalData = {
      pharmacyName: formData.pharmacyName || 'Pharmacy',
      businessType: formData.businessType || 'Not specified',
      tagline: formData.tagline || '',
      locality: formData.locality || 'Not specified',
      city: formData.city || 'Not specified',
      pin: formData.pin || '000000',
      primaryPhone: formData.primaryPhone || currentUser.phone || '',
      mobile: formData.mobile || currentUser.phone || '',
      email: formData.email || currentUser.email || '',
      registrationComplete: false,
      skipped: true
    };
    
    localStorage.setItem('chemistData', JSON.stringify(minimalData));
    
    alert('Registration skipped. You can complete your profile later from the dashboard.');
    navigate('/chemist-dashboard');
  };

  return (
    <div className="chemist-registration">
      <div className="registration-container">
        <div className="registration-header">
          <h1>💊 Chemist/Pharmacy Registration</h1>
          <p>Complete your profile to start receiving orders</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Basic Identity</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Address & Location</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Contact Details</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Step 1: Basic Identity */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Basic Identity</h2>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Pharmacy/Chemist Name *</label>
                  <input
                    type="text"
                    name="pharmacyName"
                    value={formData.pharmacyName}
                    onChange={handleInputChange}
                    placeholder="Legal trading name (e.g., MedPlus Pharmacy)"
                    required
                  />
                  <small>Official name as per license</small>
                </div>

                <div className="form-group full-width">
                  <label>Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="retail-pharmacy">Retail Pharmacy</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="online-pharmacy">Online Pharmacy</option>
                    <option value="franchise">Franchise</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Tagline / Short Description</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="e.g., Your Trusted Neighborhood Pharmacy (1-2 lines)"
                  />
                  <small>Brief description of your pharmacy</small>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address & Location */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Address & Location</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Shop Number</label>
                  <input
                    type="text"
                    name="shopNumber"
                    value={formData.shopNumber}
                    onChange={handleInputChange}
                    placeholder="Shop/Unit number"
                  />
                </div>

                <div className="form-group">
                  <label>Building Name</label>
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    placeholder="Building/Complex name"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Locality *</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder="Area/Locality name"
                    required
                  />
                </div>

                <div className="form-group">
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

                <div className="form-group">
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN code"
                    maxLength="6"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby landmark for easy location"
                  />
                </div>

                <div className="form-group">
                  <label>Latitude (Optional)</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 28.6139"
                  />
                  <small>For map location</small>
                </div>

                <div className="form-group">
                  <label>Longitude (Optional)</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 77.2090"
                  />
                  <small>For map location</small>
                </div>

                <div className="form-group full-width">
                  <label>Multiple Branches</label>
                  <textarea
                    name="branches"
                    value={formData.branches}
                    onChange={handleInputChange}
                    placeholder="If you have multiple branches, list them here (Branch name - Address)"
                    rows="3"
                  ></textarea>
                  <small>One branch per line</small>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Contact Details</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Primary Phone Number *</label>
                  <input
                    type="tel"
                    name="primaryPhone"
                    value={formData.primaryPhone}
                    onChange={handleInputChange}
                    placeholder="Shop landline/primary number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Owner/Manager mobile"
                    required
                  />
                  <small>OTP verified contact</small>
                </div>

                <div className="form-group">
                  <label>WhatsApp Number</label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="WhatsApp contact (if different)"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Official Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email for orders and notifications"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Website / Online Order URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourpharmacy.com"
                  />
                  <small>If you have an online ordering system</small>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '16px', marginTop: '20px', marginBottom: '10px' }}>Social Media Links (Optional)</h3>
                </div>

                <div className="form-group">
                  <label>Facebook</label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook page URL"
                  />
                </div>

                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram profile URL"
                  />
                </div>

                <div className="form-group">
                  <label>Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="Twitter profile URL"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={handlePrevious}>
                ← Previous
              </button>
            )}
            <button type="button" className="btn-skip" onClick={handleSkip}>
              Skip for Now
            </button>
            <div style={{ flex: 1 }}></div>
            {currentStep < 3 ? (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Complete Registration & Continue to Dashboard
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChemistRegistration;
