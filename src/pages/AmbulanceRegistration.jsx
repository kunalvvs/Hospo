import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AmbulanceRegistration.css';

const AmbulanceRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Account Details
    serviceName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    businessType: '',
    serviceArea: '',
    
    // Step 2: Driver Details
    driverName: '',
    driverDOB: '',
    driverAge: '',
    driverGender: '',
    driverMobile: '',
    driverAlternateMobile: '',
    driverPermanentAddress: '',
    driverCurrentAddress: '',
    driverPhoto: null,
    driverLanguages: [],
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    
    // Step 3: Driver KYC Documents
    governmentIdType: '',
    governmentIdFile: null,
    drivingLicenceNumber: '',
    drivingLicenceIssue: '',
    drivingLicenceExpiry: '',
    drivingLicenceFile: null,
    panCard: '',
    panCardFile: null,
    policeVerification: null,
    medicalCertificate: null,
    driverPassportPhoto: null,
    backgroundCheck: null
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ambulance') {
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

  const handleLanguageChange = (language) => {
    const languages = formData.driverLanguages.includes(language)
      ? formData.driverLanguages.filter(lang => lang !== language)
      : [...formData.driverLanguages, language];
    setFormData({ ...formData, driverLanguages: languages });
  };

  const validateStep1 = () => {
    if (!formData.serviceName || !formData.contactPerson || !formData.mobile || 
        !formData.email || !formData.businessType || !formData.serviceArea) {
      alert('Please fill all required fields in Step 1');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.driverName || !formData.driverDOB || !formData.driverGender || 
        !formData.driverMobile || !formData.driverPermanentAddress) {
      alert('Please fill all required fields in Step 2');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.governmentIdType || !formData.drivingLicenceNumber || 
        !formData.drivingLicenceIssue || !formData.drivingLicenceExpiry) {
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
      localStorage.setItem('ambulanceData', JSON.stringify(formData));
      
      alert('Registration completed successfully!');
      navigate('/ambulance-dashboard');
    }
  };

  const handleSkip = () => {
    // Store minimal data and skip to dashboard
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const minimalData = {
      serviceName: formData.serviceName || 'Ambulance Service',
      contactPerson: formData.contactPerson || currentUser.name || 'User',
      mobile: formData.mobile || currentUser.mobile || '',
      email: formData.email || currentUser.email || '',
      businessType: formData.businessType || 'Not specified',
      serviceArea: formData.serviceArea || 'Not specified',
      registrationComplete: false,
      skipped: true
    };
    
    localStorage.setItem('ambulanceData', JSON.stringify(minimalData));
    
    alert('Registration skipped. You can complete your profile later from the dashboard.');
    navigate('/ambulance-dashboard');
  };

  return (
    <div className="ambulance-registration">
      <div className="registration-container">
        <div className="registration-header">
          <h1>🚑 Ambulance Service Registration</h1>
          <p>Complete your profile to start receiving bookings</p>
          <button type="button" className="skip-registration-btn" onClick={handleSkip}>
            Skip Registration →
          </button>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Account Details</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Driver Details</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">KYC Documents</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Step 1: Account Details */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Account / Basic Sign-in Details</h2>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Service / Store Name *</label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    placeholder="e.g., RapidCare Ambulance Services"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Primary Contact Person *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Owner/Manager name"
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
                    placeholder="Primary contact number"
                    required
                  />
                  <small>OTP verified contact</small>
                </div>

                <div className="form-group full-width">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="For notifications and invoices"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="pvt-ltd">Private Limited</option>
                    <option value="ngo">NGO</option>
                    <option value="hospital-owned">Hospital-owned</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Service Area / City *</label>
                  <input
                    type="text"
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleInputChange}
                    placeholder="City where ambulance operates"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Driver Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Driver Personal Details</h2>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Driver Full Name *</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    placeholder="As per government ID"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="driverDOB"
                    value={formData.driverDOB}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="driverAge"
                    value={formData.driverAge}
                    onChange={handleInputChange}
                    placeholder="Age in years"
                  />
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    name="driverGender"
                    value={formData.driverGender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Driver Mobile Number *</label>
                  <input
                    type="tel"
                    name="driverMobile"
                    value={formData.driverMobile}
                    onChange={handleInputChange}
                    placeholder="Primary contact for dispatch"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Alternate Phone</label>
                  <input
                    type="tel"
                    name="driverAlternateMobile"
                    value={formData.driverAlternateMobile}
                    onChange={handleInputChange}
                    placeholder="Relative / Backup number"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Permanent Address *</label>
                  <textarea
                    name="driverPermanentAddress"
                    value={formData.driverPermanentAddress}
                    onChange={handleInputChange}
                    placeholder="Complete permanent address"
                    rows="2"
                    required
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Current Address</label>
                  <textarea
                    name="driverCurrentAddress"
                    value={formData.driverCurrentAddress}
                    onChange={handleInputChange}
                    placeholder="If different from permanent address"
                    rows="2"
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Driver Photo</label>
                  <input
                    type="file"
                    name="driverPhoto"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  <small>Professional/Passport size photo</small>
                </div>

                <div className="form-group full-width">
                  <label>Languages Spoken</label>
                  <div className="checkbox-group">
                    {['Hindi', 'English', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati'].map(lang => (
                      <label key={lang} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.driverLanguages.includes(lang)}
                          onChange={() => handleLanguageChange(lang)}
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Emergency contact person"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Contact Relation</label>
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleInputChange}
                    placeholder="Relation with driver"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: KYC Documents */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Driver Identity & KYC Documents</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Government Photo ID Type *</label>
                  <select
                    name="governmentIdType"
                    value={formData.governmentIdType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select ID type</option>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="passport">Passport</option>
                    <option value="driving-licence">Driving Licence</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Upload Government ID *</label>
                  <input
                    type="file"
                    name="governmentIdFile"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="form-group">
                  <label>Driving Licence Number *</label>
                  <input
                    type="text"
                    name="drivingLicenceNumber"
                    value={formData.drivingLicenceNumber}
                    onChange={handleInputChange}
                    placeholder="Licence number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Licence Issue Date *</label>
                  <input
                    type="date"
                    name="drivingLicenceIssue"
                    value={formData.drivingLicenceIssue}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Licence Expiry Date *</label>
                  <input
                    type="date"
                    name="drivingLicenceExpiry"
                    value={formData.drivingLicenceExpiry}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Upload Driving Licence</label>
                  <input
                    type="file"
                    name="drivingLicenceFile"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="form-group">
                  <label>PAN Card Number</label>
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleInputChange}
                    placeholder="PAN number (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Upload PAN Card</label>
                  <input
                    type="file"
                    name="panCardFile"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Police Verification Certificate</label>
                  <input
                    type="file"
                    name="policeVerification"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <small>Character certificate (scanned copy)</small>
                </div>

                <div className="form-group full-width">
                  <label>Medical Fitness Certificate</label>
                  <input
                    type="file"
                    name="medicalCertificate"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <small>Basic health check certificate</small>
                </div>

                <div className="form-group">
                  <label>Passport Size Photograph</label>
                  <input
                    type="file"
                    name="driverPassportPhoto"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </div>

                <div className="form-group">
                  <label>Background Check Certificate</label>
                  <input
                    type="file"
                    name="backgroundCheck"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <small>Optional</small>
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
            {currentStep < 3 ? (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmbulanceRegistration;
