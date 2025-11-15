import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PathlabRegistration.css';

const PathlabRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'pathlab') {
      navigate('/');
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const registrationData = {
        ...currentUser,
        ...formData,
        registrationComplete: true
      };
      localStorage.setItem('currentUser', JSON.stringify(registrationData));
      localStorage.setItem('pathlabData', JSON.stringify(formData));
      
      alert('Pathlab registration completed successfully!');
      navigate('/pathlab-dashboard');
    }
  };

  const handleSkip = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const minimalData = {
      labName: formData.labName || 'Pathlab',
      businessType: formData.businessType || 'Not specified',
      city: formData.city || 'Not specified',
      primaryMobile: formData.primaryMobile || currentUser.phone || '',
      primaryEmail: formData.primaryEmail || currentUser.email || '',
      registrationComplete: false,
      skipped: true
    };
    
    localStorage.setItem('pathlabData', JSON.stringify(minimalData));
    alert('Registration skipped. You can complete your profile later from the dashboard.');
    navigate('/pathlab-dashboard');
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
              <button type="submit" className="pathlab-btn-primary">
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PathlabRegistration;
