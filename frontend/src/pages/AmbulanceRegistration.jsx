import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ambulanceAPI } from '../services/api';
import './AmbulanceRegistration.css';

const AmbulanceRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Account Details
    serviceName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    businessType: '',
    serviceArea: '',
    businessAddress: '',
    gstNumber: '',
    panNumber: ''
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ambulance') {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.serviceName || !formData.contactPerson || !formData.mobile || 
        !formData.email || !formData.businessType || !formData.serviceArea) {
      alert('Please fill all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare basic ambulance data
      const registrationData = {
        serviceName: formData.serviceName,
        contactPerson: formData.contactPerson,
        mobile: formData.mobile,
        phone: formData.mobile, // Sync with mobile
        email: formData.email,
        businessType: formData.businessType,
        serviceArea: formData.serviceArea,
        businessAddress: formData.businessAddress,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        registrationComplete: true
      };

      // Update profile with registration data
      const response = await ambulanceAPI.updateProfile(registrationData);
      
      if (response.success) {
        // Store updated user data
        localStorage.setItem('ambulanceData', JSON.stringify(response.ambulance));
        
        alert('Registration completed successfully! You can now add drivers, vehicles, and complete your profile from the dashboard.');
        navigate('/ambulance-dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Store minimal data
      const minimalData = {
        serviceName: formData.serviceName || 'Ambulance Service',
        contactPerson: formData.contactPerson || currentUser.name || 'User',
        mobile: formData.mobile || currentUser.phone || '',
        phone: formData.mobile || currentUser.phone || '',
        email: formData.email || currentUser.email || '',
        businessType: formData.businessType || 'proprietorship',
        serviceArea: formData.serviceArea || 'Not specified',
        registrationComplete: false
      };
      
      // Update profile with minimal data
      const response = await ambulanceAPI.updateProfile(minimalData);
      
      if (response.success) {
        localStorage.setItem('ambulanceData', JSON.stringify(response.ambulance));
        alert('Registration skipped. You can complete your profile later from the dashboard.');
        navigate('/ambulance-dashboard');
      }
    } catch (error) {
      console.error('Skip registration error:', error);
      alert(error.response?.data?.message || 'Failed to skip registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ambulance-registration">
      <div className="registration-container">
        <div className="registration-header">
          <h1>🚑 Ambulance Service Registration</h1>
          <p>Complete your basic profile to get started. You can add drivers, vehicles, and other details from the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-step">
            <h2>Basic Account Details</h2>
            
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
                  <option value="partnership">Partnership</option>
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

              <div className="form-group full-width">
                <label>Business Address</label>
                <textarea
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  placeholder="Complete business address (optional)"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="GST registration number (optional)"
                />
              </div>

              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  placeholder="PAN card number (optional)"
                />
              </div>
            </div>

            {/* <div className="info-box">
              <p><strong>Note:</strong> After registration, you can add:</p>
              <ul>
                <li>✅ Multiple driver profiles with KYC documents</li>
                <li>✅ Multiple vehicles with documents and equipment details</li>
                <li>✅ Pricing, operations, and payment information</li>
                <li>✅ Bank account details for settlements</li>
              </ul>
            </div> */}
          </div>

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button 
              type="button" 
              className="btn-skip" 
              onClick={handleSkip}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Skip for Now'}
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Completing Registration...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmbulanceRegistration;
