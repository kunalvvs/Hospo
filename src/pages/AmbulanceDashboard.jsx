import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AmbulanceDashboard.css';

const AmbulanceDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [ambulanceData, setAmbulanceData] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock bookings data
  const [bookings] = useState([
    { id: 1, patient: 'Rajesh Kumar', pickup: 'MG Road', destination: 'Apollo Hospital', status: 'ongoing', date: '2025-11-13', time: '10:30 AM' },
    { id: 2, patient: 'Priya Sharma', pickup: 'Jubilee Hills', destination: 'Care Hospital', status: 'pending', date: '2025-11-13', time: '02:15 PM' },
    { id: 3, patient: 'Amit Patel', pickup: 'Banjara Hills', destination: 'Continental Hospital', status: 'completed', date: '2025-11-12', time: '08:45 AM' },
  ]);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    const ambulanceDataString = localStorage.getItem('ambulanceData');
    
    if (!userString) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userString);
      
      if (userData.role !== 'ambulance') {
        alert('Access denied. This page is only for ambulance services.');
        navigate('/');
        return;
      }

      if (ambulanceDataString) {
        setAmbulanceData(JSON.parse(ambulanceDataString));
      } else {
        // Redirect to registration if data not found
        navigate('/ambulance-registration');
        return;
      }
      
      setCurrentUser(userData);
      setLoading(false);

      // Check if there's a state with activeSection
      if (location.state?.activeSection) {
        setActiveSection(location.state.activeSection);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('ambulanceData');
    navigate('/');
  };

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'account', icon: '👤', label: 'Account Details' },
    { id: 'driver', icon: '🚗', label: 'Driver Details' },
    { id: 'kyc', icon: '🆔', label: 'KYC Documents' },
    { id: 'qualifications', icon: '🎓', label: 'Qualifications' },
    { id: 'vehicle', icon: '🚑', label: 'Vehicle Details' },
    { id: 'documents', icon: '📄', label: 'Vehicle Documents' },
    { id: 'equipment', icon: '⚕️', label: 'Equipment' },
    { id: 'pricing', icon: '💰', label: 'Pricing & Payment' },
    { id: 'operations', icon: '📍', label: 'Operations' },
    { id: 'bank', icon: '🏦', label: 'Bank Details' }
  ];

  const handleBottomNavClick = (section) => {
    if (section === 'wallet') {
      navigate('/ambulance-wallet');
    } else {
      setActiveSection(section);
      setIsMobileMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f7fa'
      }}>
        Loading...
      </div>
    );
  }

  if (!currentUser || !ambulanceData) return null;

  return (
    <div className="ambulance-dashboard">
      {/* Mobile Menu Toggle */}
      <button 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'hidden' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            {/* <h2>🚑 Hospo</h2> */}
              <img src="public\images\cosco.png" alt="logo" />
            <p>Ambulance Portal</p>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>AMBULANCE SERVICE</h3>
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>

          <button className="nav-item logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>Ambulance Dashboard</p>
          <p className="version">v1.0.0</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div>
            <h1>Ambulance Dashboard</h1>
            <p>Welcome, {ambulanceData.serviceName}</p>
          </div>
          <div className="user-info">
            <button 
              className="wallet-icon-btn"
              onClick={() => navigate('/ambulance-wallet')}
              title="My Wallet"
            >
            Wallet 💳
            </button>
            {/* <span className="user-badge">Ambulance Service</span> */}
            <span className="user-phone">📱 {ambulanceData.mobile}</span>
          </div>
        </header>

        <div className="content-body">
          {/* Home Section */}
          {activeSection === 'home' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🏠 Dashboard Overview</h2>
                <p>Manage your bookings and service requests</p>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Total Bookings</h3>
                    <p className="stat-number">{bookings.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>Ongoing</h3>
                    <p className="stat-number">{bookings.filter(b => b.status === 'ongoing').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🕐</div>
                  <div className="stat-info">
                    <h3>Pending</h3>
                    <p className="stat-number">{bookings.filter(b => b.status === 'pending').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Completed</h3>
                    <p className="stat-number">{bookings.filter(b => b.status === 'completed').length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="recent-bookings">
                <h3>Recent Bookings</h3>
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-header">
                        <h4>{booking.patient}</h4>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="booking-details">
                        <p>📍 <strong>Pickup:</strong> {booking.pickup}</p>
                        <p>🏥 <strong>Destination:</strong> {booking.destination}</p>
                        <p>📅 {booking.date} • ⏰ {booking.time}</p>
                      </div>
                      <div className="booking-actions">
                        <button className="btn-secondary">View Details</button>
                        {booking.status === 'pending' && (
                          <button className="btn-primary">Accept</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Account Details Section (Read-only) */}
          {activeSection === 'account' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>👤 Account Details</h2>
                <p>Basic sign-in and business information</p>
              </div>

              <div className="info-display">
                <div className="info-row">
                  <label>Service Name:</label>
                  <span>{ambulanceData.serviceName}</span>
                </div>
                <div className="info-row">
                  <label>Primary Contact Person:</label>
                  <span>{ambulanceData.contactPerson}</span>
                </div>
                <div className="info-row">
                  <label>Mobile Number:</label>
                  <span>{ambulanceData.mobile}</span>
                </div>
                <div className="info-row">
                  <label>Email Address:</label>
                  <span>{ambulanceData.email}</span>
                </div>
                <div className="info-row">
                  <label>Business Type:</label>
                  <span>{ambulanceData.businessType}</span>
                </div>
                <div className="info-row">
                  <label>Service Area:</label>
                  <span>{ambulanceData.serviceArea}</span>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary">Edit Details</button>
              </div>
            </section>
          )}

          {/* Driver Details Section (Read-only) */}
          {activeSection === 'driver' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🚗 Driver Personal Details</h2>
                <p>Driver information and contact details</p>
              </div>

              <div className="info-display">
                <div className="info-row">
                  <label>Driver Full Name:</label>
                  <span>{ambulanceData.driverName}</span>
                </div>
                <div className="info-row">
                  <label>Date of Birth:</label>
                  <span>{ambulanceData.driverDOB}</span>
                </div>
                <div className="info-row">
                  <label>Age:</label>
                  <span>{ambulanceData.driverAge || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Gender:</label>
                  <span>{ambulanceData.driverGender}</span>
                </div>
                <div className="info-row">
                  <label>Mobile Number:</label>
                  <span>{ambulanceData.driverMobile}</span>
                </div>
                <div className="info-row">
                  <label>Alternate Phone:</label>
                  <span>{ambulanceData.driverAlternateMobile || 'N/A'}</span>
                </div>
                <div className="info-row full-width">
                  <label>Permanent Address:</label>
                  <span>{ambulanceData.driverPermanentAddress}</span>
                </div>
                <div className="info-row full-width">
                  <label>Current Address:</label>
                  <span>{ambulanceData.driverCurrentAddress || 'Same as permanent'}</span>
                </div>
                <div className="info-row">
                  <label>Languages Spoken:</label>
                  <span>{ambulanceData.driverLanguages?.join(', ') || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Emergency Contact:</label>
                  <span>
                    {ambulanceData.emergencyContactName} ({ambulanceData.emergencyContactRelation}) - {ambulanceData.emergencyContactPhone}
                  </span>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary">Edit Details</button>
              </div>
            </section>
          )}

          {/* KYC Documents Section (Read-only) */}
          {activeSection === 'kyc' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🆔 KYC Documents</h2>
                <p>Identity verification and legal documents</p>
              </div>

              <div className="info-display">
                <div className="info-row">
                  <label>Government ID Type:</label>
                  <span>{ambulanceData.governmentIdType}</span>
                </div>
                <div className="info-row">
                  <label>Driving Licence Number:</label>
                  <span>{ambulanceData.drivingLicenceNumber}</span>
                </div>
                <div className="info-row">
                  <label>Licence Issue Date:</label>
                  <span>{ambulanceData.drivingLicenceIssue}</span>
                </div>
                <div className="info-row">
                  <label>Licence Expiry Date:</label>
                  <span>{ambulanceData.drivingLicenceExpiry}</span>
                </div>
                <div className="info-row">
                  <label>PAN Card Number:</label>
                  <span>{ambulanceData.panCard || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <label>Documents Status:</label>
                  <span className="status-badge pending">Under Verification</span>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary">View Documents</button>
                <button className="btn-primary">Upload New Document</button>
              </div>
            </section>
          )}

          {/* Continue with remaining sections... */}
          {/* For brevity, I'll create a template for the remaining sections */}
          
          {/* Driver Qualifications Section */}
          {activeSection === 'qualifications' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🎓 Driver Qualifications & Training</h2>
                <p>Professional certifications and training records</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Years of Driving Experience *</label>
                  <input type="number" placeholder="Total years of driving experience" />
                  <small>Total driving experience in years</small>
                </div>

                <div className="form-group">
                  <label>Ambulance/Emergency Vehicle Experience</label>
                  <select>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Emergency Vehicle Experience (Years)</label>
                  <input type="number" placeholder="Years of ambulance driving" />
                  <small>If applicable</small>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '15px' }}>First Aid & Medical Certifications</h3>
                </div>

                <div className="form-group">
                  <label>First-aid / BLS / CPR Certification</label>
                  <select>
                    <option value="">Select certification</option>
                    <option value="first-aid">First Aid</option>
                    <option value="bls">Basic Life Support (BLS)</option>
                    <option value="cpr">CPR Certified</option>
                    <option value="multiple">Multiple Certifications</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Certification Course Name</label>
                  <input type="text" placeholder="e.g., BLS Provider Course" />
                </div>

                <div className="form-group">
                  <label>Issuing Organization</label>
                  <input type="text" placeholder="e.g., American Heart Association" />
                </div>

                <div className="form-group">
                  <label>Certificate Expiry Date</label>
                  <input type="date" />
                </div>

                <div className="form-group full-width">
                  <label>Upload Certification Certificate</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Upload scanned copy of certificate</small>
                </div>

                <div className="form-group full-width">
                  <label>Paramedic / EMT / Nursing Training</label>
                  <select>
                    <option value="">Select training level</option>
                    <option value="none">None</option>
                    <option value="basic-emt">Basic EMT</option>
                    <option value="advanced-emt">Advanced EMT</option>
                    <option value="paramedic">Paramedic</option>
                    <option value="nursing">Nursing Background</option>
                  </select>
                  <small>If driver doubles as medical assistant</small>
                </div>

                <div className="form-group">
                  <label>Defensive Driving Certificate</label>
                  <select>
                    <option value="">Select</option>
                    <option value="yes">Yes, Certified</option>
                    <option value="no">Not Available</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Upload Defensive Driving Certificate</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>

                <div className="form-group full-width">
                  <label>Language / Communication Skills</label>
                  <textarea 
                    rows="3" 
                    placeholder="Describe language proficiency and communication skills for patient handling..."
                  ></textarea>
                  <small>Important for patient interaction and emergency communication</small>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Qualifications</button>
                <button className="btn-secondary">Add Another Certificate</button>
              </div>
            </section>
          )}

          {/* Vehicle Details Section */}
          {activeSection === 'vehicle' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🚑 Vehicle (Ambulance) Basic Details</h2>
                <p>Ambulance specifications and registration information</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Vehicle Type *</label>
                  <select required>
                    <option value="">Select vehicle type</option>
                    <option value="bls">Basic Life Support (BLS)</option>
                    <option value="als">Advanced Life Support (ALS)</option>
                    <option value="patient-transport">Patient Transport Van</option>
                    <option value="neonatal">Neonatal Ambulance</option>
                    <option value="hearse">Hearse</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Vehicle Registration Number (RC) *</label>
                  <input type="text" placeholder="e.g., DL-01-AB-1234" required />
                  <small>As per registration certificate</small>
                </div>

                <div className="form-group">
                  <label>Vehicle Make *</label>
                  <input type="text" placeholder="e.g., Maruti, Tata, Force" required />
                </div>

                <div className="form-group">
                  <label>Vehicle Model *</label>
                  <input type="text" placeholder="e.g., Eeco, Winger" required />
                </div>

                <div className="form-group">
                  <label>Manufacturing Year *</label>
                  <input type="number" placeholder="e.g., 2020" min="1990" max="2025" required />
                </div>

                <div className="form-group">
                  <label>Seating Capacity</label>
                  <input type="number" placeholder="Number of seats" />
                </div>

                <div className="form-group">
                  <label>Stretcher Capacity</label>
                  <input type="number" placeholder="Number of stretchers" />
                </div>

                <div className="form-group">
                  <label>Ownership Type *</label>
                  <select required>
                    <option value="">Select ownership</option>
                    <option value="owned">Owned</option>
                    <option value="leased">Leased</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Commercial Permit Number</label>
                  <input type="text" placeholder="Enter permit number (if required by state)" />
                  <small>State-specific requirement for commercial vehicles</small>
                </div>

                <div className="form-group full-width">
                  <label>Vehicle Color</label>
                  <input type="text" placeholder="e.g., White with Red Cross" />
                </div>

                <div className="form-group">
                  <label>Engine Number</label>
                  <input type="text" placeholder="Engine number" />
                </div>

                <div className="form-group">
                  <label>Chassis Number</label>
                  <input type="text" placeholder="Chassis number" />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Vehicle Details</button>
                <button className="btn-secondary">Add Another Vehicle</button>
              </div>
            </section>
          )}

          {/* Vehicle Documents Section */}
          {activeSection === 'documents' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📄 Vehicle Documents</h2>
                <p>Registration certificate, insurance, permits, and other legal documents</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Registration Certificate (RC) - Front *</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                  <small>Upload front side of RC</small>
                </div>

                <div className="form-group full-width">
                  <label>Registration Certificate (RC) - Back</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Upload back side of RC (if applicable)</small>
                </div>

                <div className="form-group">
                  <label>Insurance Policy Number *</label>
                  <input type="text" placeholder="Policy number" required />
                </div>

                <div className="form-group">
                  <label>Insurance Company *</label>
                  <input type="text" placeholder="Insurer name" required />
                </div>

                <div className="form-group">
                  <label>Insurance Expiry Date *</label>
                  <input type="date" required />
                </div>

                <div className="form-group">
                  <label>Upload Insurance Copy *</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                </div>

                <div className="form-group">
                  <label>PUC Certificate Number</label>
                  <input type="text" placeholder="Pollution certificate number" />
                </div>

                <div className="form-group">
                  <label>PUC Valid Until</label>
                  <input type="date" />
                </div>

                <div className="form-group full-width">
                  <label>Upload PUC Certificate</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Pollution Under Control certificate</small>
                </div>

                <div className="form-group full-width">
                  <label>Fitness Certificate</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Required for commercial vehicles in some states</small>
                </div>

                <div className="form-group full-width">
                  <label>Road Permit / Transport Permit</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>If applicable for your state/region</small>
                </div>

                <div className="form-group full-width">
                  <label>Ambulance Conversion Certificate</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>If vehicle was modified to ambulance specifications</small>
                </div>

                <div className="form-group full-width">
                  <label>Manufacturer Fitment Certificate</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>For factory-fitted ambulances</small>
                </div>

                <div className="form-group full-width">
                  <label>Invoice / Purchase Bill</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Proof of ownership if required</small>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Documents</button>
                <button className="btn-secondary">Submit for Verification</button>
              </div>
            </section>
          )}

          {/* Equipment Section */}
          {activeSection === 'equipment' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>⚕️ Ambulance Equipment & Medical Supplies</h2>
                <p>Medical equipment inventory, maintenance, and status tracking</p>
              </div>
              
              <div className="equipment-checklist">
                <h3>Essential Equipment Checklist</h3>
                
                {/* Stretcher */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <strong>Stretcher (Foldable / Hydraulic)</strong>
                    </label>
                  </div>
                  <div className="equipment-details">
                    <div className="form-group">
                      <label>Type</label>
                      <select>
                        <option value="">Select type</option>
                        <option value="foldable">Foldable</option>
                        <option value="hydraulic">Hydraulic</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input type="number" placeholder="Qty" />
                    </div>
                    <div className="form-group">
                      <label>Condition</label>
                      <select>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="needs-repair">Needs Repair</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Last Maintenance</label>
                      <input type="date" />
                    </div>
                  </div>
                </div>

                {/* Oxygen Cylinder */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <strong>Oxygen Cylinder(s) with Regulator(s)</strong>
                    </label>
                  </div>
                  <div className="equipment-details">
                    <div className="form-group">
                      <label>Quantity</label>
                      <input type="number" placeholder="Number of cylinders" />
                    </div>
                    <div className="form-group">
                      <label>Capacity (Each)</label>
                      <input type="text" placeholder="e.g., 10L, 40L" />
                    </div>
                    <div className="form-group">
                      <label>Last Refill Date</label>
                      <input type="date" />
                    </div>
                    <div className="form-group">
                      <label>Regulator Condition</label>
                      <select>
                        <option value="working">Working</option>
                        <option value="needs-check">Needs Check</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ambu Bag */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <strong>Ambu Bag / Resuscitator</strong>
                    </label>
                  </div>
                  <div className="equipment-details">
                    <div className="form-group">
                      <label>Adult Size</label>
                      <input type="number" placeholder="Quantity" />
                    </div>
                    <div className="form-group">
                      <label>Paediatric Size</label>
                      <input type="number" placeholder="Quantity" />
                    </div>
                    <div className="form-group">
                      <label>Condition</label>
                      <select>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="replace-soon">Replace Soon</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Suction Machine */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <strong>Suction Machine (Portable)</strong>
                    </label>
                  </div>
                  <div className="equipment-details">
                    <div className="form-group">
                      <label>Quantity</label>
                      <input type="number" placeholder="Qty" />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select>
                        <option value="working">Working</option>
                        <option value="not-available">Not Available</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Last Maintenance</label>
                      <input type="date" />
                    </div>
                  </div>
                </div>

                {/* Basic Monitoring Equipment */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <strong>Basic Monitoring Equipment</strong>
                  </div>
                  <div className="equipment-details equipment-grid">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      BP Apparatus
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Pulse Oximeter
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Glucometer
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Thermometer
                    </label>
                  </div>
                </div>

                {/* Immobilization Equipment */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <strong>Immobilization & Support</strong>
                  </div>
                  <div className="equipment-details equipment-grid">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Splints (Various Sizes)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Cervical Collar
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Immobilization Board
                    </label>
                  </div>
                </div>

                {/* Medical Supplies */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <strong>Medical Supplies & Consumables</strong>
                  </div>
                  <div className="equipment-details equipment-grid">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Wound Dressings
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      IV Sets
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Cannulas
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Syringes (Various Sizes)
                    </label>
                  </div>
                  <div className="form-group full-width">
                    <label>Expiry Date (Oldest Item)</label>
                    <input type="date" />
                  </div>
                </div>

                {/* Emergency Drugs Kit */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <strong>Emergency Drugs Kit</strong>
                    </label>
                  </div>
                  <div className="equipment-details">
                    <div className="form-group full-width">
                      <label>Drug List</label>
                      <textarea 
                        rows="3" 
                        placeholder="List emergency drugs available (if allowed as per regulations)"
                      ></textarea>
                      <small>Note: Controlled drugs rules apply</small>
                    </div>
                    <div className="form-group">
                      <label>Nearest Expiry Date</label>
                      <input type="date" />
                    </div>
                  </div>
                </div>

                {/* Safety Equipment */}
                <div className="equipment-item">
                  <div className="equipment-header">
                    <strong>Safety & Sanitation</strong>
                  </div>
                  <div className="equipment-details equipment-grid">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Fire Extinguisher
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      First-Aid Box
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Surgical Masks
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Gloves (Disposable)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Disinfectant
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Hand Sanitizer
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Equipment List</button>
                <button className="btn-secondary">Print Checklist</button>
              </div>
            </section>
          )}

          {/* Pricing & Payment Section */}
          {activeSection === 'pricing' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>💰 Pricing, Payment & Billing</h2>
                <p>Service charges, payment methods, and billing configuration</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Base Charges</h3>
                </div>

                <div className="form-group">
                  <label>Base Charge (First X km) *</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Base amount" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Base Distance Included (km) *</label>
                  <input type="number" placeholder="e.g., 5, 10" required />
                </div>

                <div className="form-group">
                  <label>Per Km Charge (Beyond Base) *</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Per km rate" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Night Charges (Additional) *</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Extra for night service" />
                  </div>
                  <small>9 PM to 6 AM surcharge</small>
                </div>

                <div className="form-group">
                  <label>Waiting Charges (Per Hour)</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Hourly waiting charge" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Oxygen Charges (If Extra)</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Additional oxygen charge" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Intercity Transfer Rates</label>
                  <textarea 
                    rows="2" 
                    placeholder="Special rates for intercity transfers (if applicable)"
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Payment Methods Accepted</h3>
                </div>

                <div className="form-group full-width">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Cash
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Credit/Debit Card (POS)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      UPI
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Mobile Wallet
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Corporate Billing
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Insurance Claim
                    </label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Payout Bank Details</h3>
                  <small>For receiving service payments</small>
                </div>

                <div className="form-group">
                  <label>Account Holder Name *</label>
                  <input type="text" placeholder="As per bank records" required />
                </div>

                <div className="form-group">
                  <label>Bank Account Number *</label>
                  <input type="text" placeholder="Account number" required />
                </div>

                <div className="form-group">
                  <label>IFSC Code *</label>
                  <input type="text" placeholder="Bank IFSC code" required />
                </div>

                <div className="form-group">
                  <label>Bank Name</label>
                  <input type="text" placeholder="Name of bank" />
                </div>

                <div className="form-group full-width">
                  <label>Upload Cancelled Cheque</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>For bank account verification</small>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Pricing & Payment</button>
                <button className="btn-secondary">Preview Rate Card</button>
              </div>
            </section>
          )}

          {/* Operations Section */}
          {activeSection === 'operations' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📍 Geo / Operational Settings</h2>
                <p>Service area, vehicle tracking, notifications, and communication templates</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Service Coverage</h3>
                </div>

          {/* Bank Details Section */}
          {activeSection === 'bank' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🏦 Bank Details</h2>
                <p>Payment account information for receiving payouts</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Primary Bank Account</h3>
                  <small>This account will be used for receiving payments from bookings</small>
                </div>

                <div className="form-group">
                  <label>Account Holder Name *</label>
                  <input type="text" placeholder="As per bank records" required />
                  <small>Should match with PAN/business name</small>
                </div>

                <div className="form-group">
                  <label>Account Type *</label>
                  <select required>
                    <option value="">Select account type</option>
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Bank Account Number *</label>
                  <input type="text" placeholder="Enter account number" required />
                </div>

                <div className="form-group full-width">
                  <label>Confirm Bank Account Number *</label>
                  <input type="text" placeholder="Re-enter account number" required />
                </div>

                <div className="form-group">
                  <label>IFSC Code *</label>
                  <input type="text" placeholder="e.g., SBIN0001234" required />
                  <small>11-character code</small>
                </div>

                <div className="form-group">
                  <label>Bank Name *</label>
                  <input type="text" placeholder="Name of your bank" required />
                </div>

                <div className="form-group">
                  <label>Branch Name *</label>
                  <input type="text" placeholder="Branch location" required />
                </div>

                <div className="form-group">
                  <label>Branch City *</label>
                  <input type="text" placeholder="City" required />
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Account Verification Documents</h3>
                </div>

                <div className="form-group full-width">
                  <label>Upload Cancelled Cheque *</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                  <small>Cancelled cheque leaf with account details visible</small>
                </div>

                <div className="form-group full-width">
                  <label>Bank Statement (Optional)</label>
                  <input type="file" accept=".pdf" />
                  <small>Last 3 months statement for faster verification</small>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>UPI Details (Alternative)</h3>
                  <small>Provide UPI ID for instant payouts</small>
                </div>

                <div className="form-group">
                  <label>UPI ID</label>
                  <input type="text" placeholder="yourname@bankname" />
                  <small>Format: username@bankname</small>
                </div>

                <div className="form-group">
                  <label>UPI Phone Number</label>
                  <input type="tel" placeholder="Mobile linked to UPI" />
                </div>

                <div className="form-group full-width">
                  <div className="info-box">
                    <h4>⚠️ Important Information</h4>
                    <ul>
                      <li>Bank account details will be verified before activation</li>
                      <li>Ensure the account holder name matches with your registered business name</li>
                      <li>Payouts are processed within 2-3 working days</li>
                      <li>All payment information is encrypted and secure</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Bank Details</button>
                <button className="btn-secondary">Verify Account</button>
              </div>
            </section>
          )}    <div className="form-group full-width">
                  <label>Additional Coverage Areas</label>
                  <textarea 
                    rows="2" 
                    placeholder="List other areas/localities covered..."
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Base Station / Garage Address *</label>
                  <textarea 
                    rows="2" 
                    placeholder="Complete address where vehicle is stationed"
                    required
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Vehicle Tracking</h3>
                </div>

                <div className="form-group">
                  <label>Live Tracking Available</label>
                  <select>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tracking Vendor Name</label>
                  <input type="text" placeholder="e.g., GPS Company Name" />
                </div>

                <div className="form-group full-width">
                  <label>API Key / Integration Details</label>
                  <input type="text" placeholder="API key or integration ID (if applicable)" />
                  <small>For GPS tracking integration</small>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Notifications & Communication</h3>
                </div>

                <div className="form-group full-width">
                  <label>Enable Auto SMS/Notifications</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Booking Confirmed
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Driver En Route
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Driver Arrived
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Transfer Completed
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Invoice/Payment Receipt
                    </label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Booking Confirmed Template</label>
                  <textarea 
                    rows="2" 
                    placeholder="Hi {name}, your ambulance is confirmed for {time}. Pickup: {location}"
                  ></textarea>
                  <small>Use {'{name}'}, {'{time}'}, {'{location}'} as placeholders</small>
                </div>

                <div className="form-group full-width">
                  <label>Driver En Route Template</label>
                  <textarea 
                    rows="2" 
                    placeholder="Driver {driver} is on the way in vehicle {vehicle}. ETA: {eta} mins"
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Driver Arrived Template</label>
                  <textarea 
                    rows="2" 
                    placeholder="Your ambulance has arrived. Driver: {driver}, Vehicle: {vehicle}"
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Transfer Completed Template</label>
                  <textarea 
                    rows="2" 
                    placeholder="Transfer completed successfully. Thank you for using our service."
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Dispatcher to Driver Messaging</label>
                  <select>
                    <option value="">Select system</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="app">Mobile App</option>
                    <option value="call">Phone Call</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Operational Settings</button>
                <button className="btn-secondary">Test Notifications</button>
              </div>
            </section>
          )}

          {activeSection === 'bank' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🏦 Bank Details</h2>
                <p>Payment account information for payouts</p>
              </div>
              <div className="form-grid">
                {/* Add bank details fields here */}
                <p className="info-placeholder">Add your bank account details</p>
              </div>
            </section>
          )}

          {/* Ride Section */}
          {activeSection === 'ride' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🚗 My Rides</h2>
                <p>View and manage all your ride bookings</p>
              </div>

              {/* Ride Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Total Rides</h3>
                    <p className="stat-number">{bookings.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>Ongoing</h3>
                    <p className="stat-number">{bookings.filter(b => b.status === 'ongoing').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🕐</div>
                  <div className="stat-info">
                    <h3>Pending</h3>
                    <p className="stat-number">{bookings.filter(b => b.status === 'pending').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Completed</h3>
                    <p className="stat-number">{bookings.filter(b => b.status === 'completed').length}</p>
                  </div>
                </div>
              </div>

              {/* All Rides */}
              <div className="recent-bookings" style={{ marginTop: '30px' }}>
                <h3>All Ride Bookings</h3>
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-header">
                        <h4>{booking.patient}</h4>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="booking-details">
                        <p>📍 <strong>Pickup:</strong> {booking.pickup}</p>
                        <p>🏥 <strong>Destination:</strong> {booking.destination}</p>
                        <p>📅 {booking.date} • ⏰ {booking.time}</p>
                      </div>
                      <div className="booking-actions">
                        <button className="btn-secondary">View Details</button>
                        {booking.status === 'ongoing' && (
                          <button className="btn-primary">Track Live</button>
                        )}
                        {booking.status === 'pending' && (
                          <button className="btn-primary">Accept</button>
                        )}
                        {booking.status === 'completed' && (
                          <button className="btn-secondary">View Invoice</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button 
          className={`bottom-nav-item ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('home')}
        >
          <span className="bottom-nav-icon">🏠</span>
          <span className="bottom-nav-label">Home</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeSection === 'ride' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('ride')}
        >
          <span className="bottom-nav-icon">🚗</span>
          <span className="bottom-nav-label">Ride</span>
        </button>
        <button 
          className="bottom-nav-item"
          onClick={() => handleBottomNavClick('wallet')}
        >
          <span className="bottom-nav-icon">💳</span>
          <span className="bottom-nav-label">Wallet</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeSection === 'account' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('account')}
        >
          <span className="bottom-nav-icon">👤</span>
          <span className="bottom-nav-label">Account</span>
        </button>
      </nav>
    </div>
  );
};

export default AmbulanceDashboard;
