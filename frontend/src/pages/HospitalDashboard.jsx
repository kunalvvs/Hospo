import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HospitalDashboard.css';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Mock appointments data
  const [appointments] = useState([
    { id: 1, patient: 'Rajesh Kumar', doctor: 'Dr. Sharma', department: 'Cardiology', date: '2025-11-14', time: '10:00 AM', status: 'confirmed' },
    { id: 2, patient: 'Priya Singh', doctor: 'Dr. Mehta', department: 'Orthopaedics', date: '2025-11-14', time: '02:30 PM', status: 'pending' },
    { id: 3, patient: 'Amit Patel', doctor: 'Dr. Verma', department: 'General Medicine', date: '2025-11-15', time: '11:00 AM', status: 'confirmed' },
  ]);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    const hospitalDataString = localStorage.getItem('hospitalData');
    
    if (!userString) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userString);
      
      if (userData.role !== 'hospital') {
        alert('Access denied. This page is only for hospitals.');
        navigate('/');
        return;
      }

      if (hospitalDataString) {
        setHospitalData(JSON.parse(hospitalDataString));
      } else {
        navigate('/hospital-registration');
        return;
      }
      
      setCurrentUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('hospitalData');
    navigate('/');
  };

  const handleBottomNavClick = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const handleEditIdentity = () => {
    setEditFormData({ ...hospitalData });
    setIsEditingIdentity(true);
  };

  const handleEditAddress = () => {
    setEditFormData({ ...hospitalData });
    setIsEditingAddress(true);
  };

  const handleEditContact = () => {
    setEditFormData({ ...hospitalData });
    setIsEditingContact(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveIdentity = () => {
    const updatedData = { ...hospitalData, ...editFormData };
    setHospitalData(updatedData);
    localStorage.setItem('hospitalData', JSON.stringify(updatedData));
    setIsEditingIdentity(false);
    alert('Hospital identity updated successfully!');
  };

  const handleSaveAddress = () => {
    const updatedData = { ...hospitalData, ...editFormData };
    setHospitalData(updatedData);
    localStorage.setItem('hospitalData', JSON.stringify(updatedData));
    setIsEditingAddress(false);
    alert('Address details updated successfully!');
  };

  const handleSaveContact = () => {
    const updatedData = { ...hospitalData, ...editFormData };
    setHospitalData(updatedData);
    localStorage.setItem('hospitalData', JSON.stringify(updatedData));
    setIsEditingContact(false);
    alert('Contact details updated successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditingIdentity(false);
    setIsEditingAddress(false);
    setIsEditingContact(false);
    setEditFormData({});
  };

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Dashboard Home' },
    { id: 'identity', icon: '🏥', label: 'Hospital Identity' },
    { id: 'address', icon: '📍', label: 'Address & Location' },
    { id: 'contact', icon: '📞', label: 'Contact & Hours' },
    { id: 'services', icon: '⚕️', label: 'Services & Facilities' },
    { id: 'specialities', icon: '🩺', label: 'Specialities' },
    { id: 'doctors', icon: '👨‍⚕️', label: 'Doctor Profiles' },
    { id: 'appointments', icon: '📅', label: 'Appointment Settings' },
    { id: 'billing', icon: '💰', label: 'Billing & Bank' },
    { id: 'documents', icon: '📄', label: 'Documents & Verification' },
    { id: 'media', icon: '📸', label: 'Images & Media' }
  ];

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

  if (!currentUser || !hospitalData) return null;

  return (
    <div className="hospital-dashboard">
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
            <img src="/images/cosco.png" alt="logo" />

            <p>Hospital Portal</p>
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
            <h3>HOSPITAL MANAGEMENT</h3>
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
          <p>Hospital Dashboard</p>
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
            <h1>Hospital Dashboard</h1>
            <p>Welcome, {hospitalData.hospitalName}</p>
          </div>
          <div className="user-info">
            <span className="user-badge">🏥 Hospital</span>
            <span className="user-phone">📱 {hospitalData.mainPhone}</span>
          </div>
        </header>

        <div className="content-body">
          {/* Home Section */}
          {activeSection === 'home' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>🏠 Dashboard Overview</h2>
                <p>Manage your hospital operations and patient appointments</p>
              </div>

              {/* Stats Cards */}
              <div className="hosp-stats-grid">
                <div className="hosp-stat-card">
                  <div className="hosp-stat-icon">📊</div>
                  <div className="hosp-stat-info">
                    <h3>Today's Appointments</h3>
                    <p className="hosp-stat-number">{appointments.filter(a => a.date === '2025-11-14').length}</p>
                  </div>
                </div>
                <div className="hosp-stat-card">
                  <div className="hosp-stat-icon">⏳</div>
                  <div className="hosp-stat-info">
                    <h3>Pending</h3>
                    <p className="hosp-stat-number">{appointments.filter(a => a.status === 'pending').length}</p>
                  </div>
                </div>
                <div className="hosp-stat-card">
                  <div className="hosp-stat-icon">✅</div>
                  <div className="hosp-stat-info">
                    <h3>Confirmed</h3>
                    <p className="hosp-stat-number">{appointments.filter(a => a.status === 'confirmed').length}</p>
                  </div>
                </div>
                <div className="hosp-stat-card">
                  <div className="hosp-stat-icon">👨‍⚕️</div>
                  <div className="hosp-stat-info">
                    <h3>Active Doctors</h3>
                    <p className="hosp-stat-number">12</p>
                  </div>
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="hosp-recent-appointments">
                <h3>Recent Appointments</h3>
                <div className="hosp-appointments-list">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="hosp-appointment-card">
                      <div className="hosp-appointment-header">
                        <h4>{appointment.patient}</h4>
                        <span className={`status-badge ${appointment.status}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <div className="hosp-appointment-details">
                        <p>👨‍⚕️ <strong>Doctor:</strong> {appointment.doctor}</p>
                        <p>🏥 <strong>Department:</strong> {appointment.department}</p>
                        <p>📅 {appointment.date} • ⏰ {appointment.time}</p>
                      </div>
                      <div className="hosp-appointment-actions">
                        <button className="hosp-dash-btn-secondary">View Details</button>
                        {appointment.status === 'pending' && (
                          <button className="hosp-dash-btn-primary">Confirm</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Hospital Identity Section */}
          {activeSection === 'identity' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>🏥 Hospital Identity</h2>
                <p>Basic practice and hospital information</p>
              </div>

              {!isEditingIdentity ? (
                <>
                  <div className="hosp-info-display">
                    <div className="hosp-info-row">
                      <label>Hospital Name:</label>
                      <span>{hospitalData.hospitalName}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Practice Type:</label>
                      <span>{hospitalData.practiceType}</span>
                    </div>
                    <div className="hosp-info-row full-width">
                      <label>Tagline:</label>
                      <span>{hospitalData.tagline || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleEditIdentity}>Edit Identity</button>
                    <button className="hosp-dash-btn-primary">Upload Logo</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="hosp-dash-form-grid">
                    <div className="hosp-dash-form-group full-width">
                      <label>Hospital Name *</label>
                      <input
                        type="text"
                        name="hospitalName"
                        value={editFormData.hospitalName || ''}
                        onChange={handleInputChange}
                        placeholder="Enter hospital name"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Practice Type *</label>
                      <select
                        name="practiceType"
                        value={editFormData.practiceType || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select type</option>
                        <option value="hospital">Hospital</option>
                        <option value="multi-speciality">Multi-speciality Hospital</option>
                        <option value="clinic">Clinic</option>
                        <option value="diagnostic-centre">Diagnostic Centre</option>
                        <option value="nursing-home">Nursing Home</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group full-width">
                      <label>Tagline</label>
                      <input
                        type="text"
                        name="tagline"
                        value={editFormData.tagline || ''}
                        onChange={handleInputChange}
                        placeholder="Short description or tagline"
                      />
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    <button className="hosp-dash-btn-primary" onClick={handleSaveIdentity}>Save Changes</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Address & Location Section */}
          {activeSection === 'address' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>📍 Address & Location</h2>
                <p>Hospital location and branch details</p>
              </div>

              {!isEditingAddress ? (
                <>
                  <div className="hosp-info-display">
                    <div className="hosp-info-row full-width">
                      <label>Street Address:</label>
                      <span>{hospitalData.streetAddress || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Locality:</label>
                      <span>{hospitalData.locality || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>City:</label>
                      <span>{hospitalData.city}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>PIN Code:</label>
                      <span>{hospitalData.pincode || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Landmark:</label>
                      <span>{hospitalData.landmark || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Coordinates:</label>
                      <span>
                        {hospitalData.latitude && hospitalData.longitude 
                          ? `${hospitalData.latitude}, ${hospitalData.longitude}` 
                          : 'Not provided'}
                      </span>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleEditAddress}>Edit Address</button>
                    <button className="hosp-dash-btn-primary">View on Map</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="hosp-dash-form-grid">
                    <div className="hosp-dash-form-group full-width">
                      <label>Street Address *</label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={editFormData.streetAddress || ''}
                        onChange={handleInputChange}
                        placeholder="Building number, street name"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Locality *</label>
                      <input
                        type="text"
                        name="locality"
                        value={editFormData.locality || ''}
                        onChange={handleInputChange}
                        placeholder="Area or locality"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city || ''}
                        onChange={handleInputChange}
                        placeholder="City name"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={editFormData.pincode || ''}
                        onChange={handleInputChange}
                        placeholder="6-digit PIN code"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Landmark</label>
                      <input
                        type="text"
                        name="landmark"
                        value={editFormData.landmark || ''}
                        onChange={handleInputChange}
                        placeholder="Nearby landmark"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Latitude</label>
                      <input
                        type="text"
                        name="latitude"
                        value={editFormData.latitude || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 28.6139"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Longitude</label>
                      <input
                        type="text"
                        name="longitude"
                        value={editFormData.longitude || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 77.2090"
                      />
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    <button className="hosp-dash-btn-primary" onClick={handleSaveAddress}>Save Changes</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Contact & Hours Section */}
          {activeSection === 'contact' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>📞 Contact Details & Working Hours</h2>
                <p>Communication channels and operational hours</p>
              </div>

              {!isEditingContact ? (
                <>
                  <div className="hosp-info-display">
                    <h3 className="hosp-info-section-title">Contact Information</h3>
                    <div className="hosp-info-row">
                      <label>Main Phone:</label>
                      <span>{hospitalData.mainPhone}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Alternate Phone:</label>
                      <span>{hospitalData.alternatePhone || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Email:</label>
                      <span>{hospitalData.email}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Website:</label>
                      <span>{hospitalData.website || 'Not provided'}</span>
                    </div>

                    <h3 className="hosp-info-section-title">Working Hours</h3>
                    <div className="hosp-info-row">
                      <label>OPD Hours:</label>
                      <span>{hospitalData.opdHours || 'Not specified'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Emergency Hours:</label>
                      <span>{hospitalData.emergencyHours || '24×7'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Weekday Hours:</label>
                      <span>{hospitalData.mondayHours || 'Not specified'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Saturday Hours:</label>
                      <span>{hospitalData.saturdayHours || 'Not specified'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Sunday Hours:</label>
                      <span>{hospitalData.sundayHours || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleEditContact}>Edit Contact Details</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="hosp-dash-form-grid">
                    <h3 className="hosp-dash-section-title">Contact Information</h3>
                    <div className="hosp-dash-form-group">
                      <label>Main Phone *</label>
                      <input
                        type="tel"
                        name="mainPhone"
                        value={editFormData.mainPhone || ''}
                        onChange={handleInputChange}
                        placeholder="Reception/Helpline number"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Alternate Phone</label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={editFormData.alternatePhone || ''}
                        onChange={handleInputChange}
                        placeholder="Secondary contact"
                      />
                    </div>
                    <div className="hosp-dash-form-group full-width">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleInputChange}
                        placeholder="Official email address"
                      />
                    </div>
                    <div className="hosp-dash-form-group full-width">
                      <label>Website</label>
                      <input
                        type="url"
                        name="website"
                        value={editFormData.website || ''}
                        onChange={handleInputChange}
                        placeholder="https://www.yourhospital.com"
                      />
                    </div>

                    <h3 className="hosp-dash-section-title">Working Hours</h3>
                    <div className="hosp-dash-form-group">
                      <label>OPD Hours</label>
                      <input
                        type="text"
                        name="opdHours"
                        value={editFormData.opdHours || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 9:00 AM - 5:00 PM"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Emergency Hours</label>
                      <input
                        type="text"
                        name="emergencyHours"
                        value={editFormData.emergencyHours || ''}
                        onChange={handleInputChange}
                        placeholder="24×7"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Weekday Hours</label>
                      <input
                        type="text"
                        name="mondayHours"
                        value={editFormData.mondayHours || ''}
                        onChange={handleInputChange}
                        placeholder="Monday-Friday hours"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Saturday Hours</label>
                      <input
                        type="text"
                        name="saturdayHours"
                        value={editFormData.saturdayHours || ''}
                        onChange={handleInputChange}
                        placeholder="Saturday hours"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Sunday Hours</label>
                      <input
                        type="text"
                        name="sundayHours"
                        value={editFormData.sundayHours || ''}
                        onChange={handleInputChange}
                        placeholder="Sunday hours"
                      />
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    <button className="hosp-dash-btn-primary" onClick={handleSaveContact}>Save Changes</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Services & Facilities Section */}
          {activeSection === 'services' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>⚕️ Services & Facilities Offered</h2>
                <p>Manage medical services and hospital facilities</p>
              </div>

              <div className="hosp-services-grid">
                <div className="hosp-service-category">
                  <h3>🏥 Medical Services</h3>
                  <div className="hosp-checkbox-group">
                    <label className="hosp-checkbox-label"><input type="checkbox" /> OPD (Outpatient)</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> IPD (Inpatient)</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Emergency Services</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Surgeries</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Lab Tests</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Radiology & Imaging</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Physiotherapy</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Pharmacy</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Teleconsultation</label>
                  </div>
                </div>

                <div className="hosp-service-category">
                  <h3>🏗️ Facilities</h3>
                  <div className="hosp-checkbox-group">
                    <label className="hosp-checkbox-label"><input type="checkbox" /> ICU</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Operation Theatre (OT)</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> NICU</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Dialysis</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Ambulance</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Parking</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Wheelchair Access</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Blood Bank</label>
                    <label className="hosp-checkbox-label"><input type="checkbox" /> Cafeteria</label>
                  </div>
                </div>

                <div className="hosp-service-category full-width">
                  <h3>💼 Insurance & Corporate</h3>
                  <div className="hosp-dash-form-group">
                    <label>Insurance Empanelment</label>
                    <select>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>List of Insurers</label>
                    <textarea rows="3" placeholder="List insurance companies you're empanelled with..."></textarea>
                  </div>
                </div>
              </div>

              <div className="hosp-form-actions">
                <button className="hosp-dash-btn-primary">Save Services & Facilities</button>
              </div>
            </section>
          )}

          {/* Specialities Section */}
          {activeSection === 'specialities' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>🩺 Specialities & Departments</h2>
                <p>Medical specialities and department information</p>
              </div>

              <div className="hosp-specialities-container">
                <div className="hosp-add-speciality-form">
                  <h3>Add New Speciality</h3>
                  <div className="hosp-dash-form-grid">
                    <div className="hosp-dash-form-group">
                      <label>Speciality Name *</label>
                      <select>
                        <option value="">Select speciality</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="orthopaedics">Orthopaedics</option>
                        <option value="neurology">Neurology</option>
                        <option value="pediatrics">Pediatrics</option>
                        <option value="gynecology">Gynecology</option>
                        <option value="dermatology">Dermatology</option>
                        <option value="ent">ENT</option>
                        <option value="ophthalmology">Ophthalmology</option>
                        <option value="general-medicine">General Medicine</option>
                        <option value="general-surgery">General Surgery</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Sub-speciality</label>
                      <input type="text" placeholder="e.g., Interventional Cardiology" />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Number of Beds</label>
                      <input type="number" placeholder="Department bed capacity" />
                    </div>
                    <div className="hosp-dash-form-group">
                      <button className="hosp-dash-btn-primary">Add Speciality</button>
                    </div>
                  </div>
                </div>

                <div className="hosp-specialities-list">
                  <h3>Current Specialities</h3>
                  <p className="hosp-info-placeholder">No specialities added yet. Add your first speciality above.</p>
                </div>
              </div>
            </section>
          )}

          {/* Doctor Profiles Section */}
          {activeSection === 'doctors' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>👨‍⚕️ Doctor / Consultant Profiles</h2>
                <p>Manage visiting doctors and consultants</p>
              </div>

              <div className="hosp-doctor-form">
                <h3>Add New Doctor</h3>
                <div className="hosp-dash-form-grid">
                  <div className="hosp-dash-form-group">
                    <label>Doctor Name *</label>
                    <input type="text" placeholder="Dr. Full Name" />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Qualification *</label>
                    <input type="text" placeholder="e.g., MBBS, MD" />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Medical Registration Number *</label>
                    <input type="text" placeholder="Medical council registration" />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Speciality *</label>
                    <select>
                      <option value="">Select speciality</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="orthopaedics">Orthopaedics</option>
                      <option value="general-medicine">General Medicine</option>
                    </select>
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Years of Experience</label>
                    <input type="number" placeholder="Total experience" />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Languages Spoken</label>
                    <input type="text" placeholder="e.g., English, Hindi, Tamil" />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>OPD Days</label>
                    <input type="text" placeholder="e.g., Mon, Wed, Fri" />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>OPD Timings</label>
                    <input type="text" placeholder="e.g., 10:00 AM - 2:00 PM" />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Consultation Fee (In-person)</label>
                    <input type="number" placeholder="Fee in ₹" />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Online Consultation Fee</label>
                    <input type="number" placeholder="Fee in ₹" />
                  </div>
                  <div className="hosp-dash-form-group full-width">
                    <label>Doctor Photo</label>
                    <input type="file" accept="image/*" />
                  </div>
                </div>
                <div className="hosp-form-actions">
                  <button className="hosp-dash-btn-primary">Add Doctor Profile</button>
                </div>
              </div>
            </section>
          )}

          {/* Appointment Settings Section */}
          {activeSection === 'appointments' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>📅 Appointment Settings & Workflow</h2>
                <p>Configure appointment booking and management</p>
              </div>

              <div className="hosp-dash-form-grid">
                <div className="hosp-dash-form-group">
                  <label>Accept Online Booking?</label>
                  <select>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="hosp-dash-form-group">
                  <label>Booking Type</label>
                  <select>
                    <option value="appointment">Appointment Slots</option>
                    <option value="walk-in">Walk-in Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="hosp-dash-form-group">
                  <label>Slot Duration (minutes)</label>
                  <input type="number" placeholder="e.g., 15, 30" />
                </div>
                <div className="hosp-dash-form-group">
                  <label>Advance Booking (days)</label>
                  <input type="number" placeholder="e.g., 7, 14, 30" />
                </div>
                <div className="hosp-dash-form-group">
                  <label>Cancellation Policy</label>
                  <select>
                    <option value="free">Free Cancellation</option>
                    <option value="24hrs">24 Hours Notice</option>
                    <option value="no-refund">No Refund</option>
                  </select>
                </div>
                <div className="hosp-dash-form-group">
                  <label>Prepayment Required?</label>
                  <select>
                    <option value="no">No</option>
                    <option value="partial">Partial</option>
                    <option value="full">Full Payment</option>
                  </select>
                </div>
                <div className="hosp-dash-form-group full-width">
                  <label>Special Instructions for Patients</label>
                  <textarea rows="3" placeholder="Any special instructions or guidelines..."></textarea>
                </div>
              </div>

              <div className="hosp-form-actions">
                <button className="hosp-dash-btn-primary">Save Appointment Settings</button>
              </div>
            </section>
          )}

          {/* Billing & Bank Section */}
          {activeSection === 'billing' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>💰 Billing & Bank Details</h2>
                <p>Payment and banking information</p>
              </div>

              <div className="hosp-dash-form-grid">
                <h3 className="hosp-dash-section-title">Billing Information</h3>
                <div className="hosp-dash-form-group">
                  <label>Official Billing Name *</label>
                  <input type="text" placeholder="As per registration" />
                </div>
                <div className="hosp-dash-form-group">
                  <label>GSTIN (if applicable)</label>
                  <input type="text" placeholder="GST Identification Number" />
                </div>

                <h3 className="hosp-dash-section-title">Bank Account Details</h3>
                <div className="hosp-dash-form-group">
                  <label>Account Holder Name *</label>
                  <input type="text" placeholder="As per bank records" />
                </div>
                <div className="hosp-dash-form-group">
                  <label>Account Type *</label>
                  <select>
                    <option value="">Select type</option>
                    <option value="current">Current Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
                <div className="hosp-dash-form-group full-width">
                  <label>Bank Account Number *</label>
                  <input type="text" placeholder="Account number" />
                </div>
                <div className="hosp-dash-form-group">
                  <label>IFSC Code *</label>
                  <input type="text" placeholder="Bank IFSC code" />
                </div>
                <div className="hosp-dash-form-group">
                  <label>Bank Name *</label>
                  <input type="text" placeholder="Name of bank" />
                </div>
                <div className="hosp-dash-form-group">
                  <label>Branch Name</label>
                  <input type="text" placeholder="Branch location" />
                </div>
                <div className="hosp-dash-form-group full-width">
                  <label>Upload Cancelled Cheque</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>

                <h3 className="hosp-dash-section-title">Insurance Billing</h3>
                <div className="hosp-dash-form-group full-width">
                  <label>Cashless Billing Rules</label>
                  <textarea rows="3" placeholder="Rules for insured patients and cashless claims..."></textarea>
                </div>
              </div>

              <div className="hosp-form-actions">
                <button className="hosp-dash-btn-primary">Save Billing & Bank Details</button>
              </div>
            </section>
          )}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>📄 Documents & Verification Uploads</h2>
                <p>Legal documents and certificates</p>
              </div>

              <div className="hosp-documents-grid">
                <div className="hosp-document-item">
                  <h4>🏥 Hospital Registration Certificate *</h4>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Required: Registration proof</small>
                </div>

                <div className="hosp-document-item">
                  <h4>📋 Municipal/Utility Documents</h4>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Optional: Additional proof</small>
                </div>

                <div className="hosp-document-item">
                  <h4>🆔 Owner Identity Proof *</h4>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Aadhaar/PAN/Passport</small>
                </div>

                <div className="hosp-document-item">
                  <h4>👨‍⚕️ Doctor Registration Certificates</h4>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                  <small>Medical council certificates</small>
                </div>

                <div className="hosp-document-item">
                  <h4>🎓 Doctor Degree Copies</h4>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                  <small>Educational qualifications</small>
                </div>

                <div className="hosp-document-item">
                  <h4>📜 Medical License Copies</h4>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                  <small>Practice licenses</small>
                </div>

                <div className="hosp-document-item">
                  <h4>💼 GST Certificate</h4>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>If applicable</small>
                </div>

                <div className="hosp-document-item">
                  <h4>🏪 Trade License</h4>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Municipal trade license</small>
                </div>
              </div>

              <div className="hosp-form-actions">
                <button className="hosp-dash-btn-primary">Save & Submit for Verification</button>
              </div>
            </section>
          )}

          {/* Images & Media Section */}
          {activeSection === 'media' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>📸 Images & Multimedia</h2>
                <p>Hospital photos and visual content</p>
              </div>

              <div className="hosp-media-upload-section">
                <div className="hosp-media-category">
                  <h3>🏢 Hospital Exterior Photos</h3>
                  <input type="file" accept="image/*" multiple />
                  <small>Building exterior, entrance, parking</small>
                </div>

                <div className="hosp-media-category">
                  <h3>🏥 Interior Photos</h3>
                  <input type="file" accept="image/*" multiple />
                  <small>Lobby, corridors, general ambiance</small>
                </div>

                <div className="hosp-media-category">
                  <h3>🩺 OPD & Waiting Area</h3>
                  <input type="file" accept="image/*" multiple />
                  <small>Consultation rooms, waiting areas</small>
                </div>

                <div className="hosp-media-category">
                  <h3>🔬 Labs & Diagnostic Areas</h3>
                  <input type="file" accept="image/*" multiple />
                  <small>Laboratory, radiology, testing areas</small>
                </div>

                <div className="hosp-media-category">
                  <h3>⚕️ Operation Theatre (OT)</h3>
                  <input type="file" accept="image/*" multiple />
                  <small>OT facilities (if permitted)</small>
                </div>

                <div className="hosp-media-category">
                  <h3>👥 Staff Photos</h3>
                  <input type="file" accept="image/*" multiple />
                  <small>Optional: Team photos</small>
                </div>

                <div className="hosp-media-category">
                  <h3>🎨 Logo & Banner Images</h3>
                  <input type="file" accept="image/*" multiple />
                  <small>Branding materials</small>
                </div>
              </div>

              <div className="hosp-form-actions">
                <button className="hosp-dash-btn-primary">Upload Media</button>
                <button className="hosp-dash-btn-secondary">Preview Gallery</button>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="hosp-mobile-bottom-nav">
        <button 
          className={`hosp-bottom-nav-item ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('home')}
        >
          <span className="hosp-bottom-nav-icon">🏠</span>
          <span className="hosp-bottom-nav-label">Home</span>
        </button>
        <button 
          className={`hosp-bottom-nav-item ${activeSection === 'doctors' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('doctors')}
        >
          <span className="hosp-bottom-nav-icon">👨‍⚕️</span>
          <span className="hosp-bottom-nav-label">Doctors</span>
        </button>
        <button 
          className={`hosp-bottom-nav-item ${activeSection === 'appointments' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('appointments')}
        >
          <span className="hosp-bottom-nav-icon">📅</span>
          <span className="hosp-bottom-nav-label">Appointments</span>
        </button>
        <button 
          className={`hosp-bottom-nav-item ${activeSection === 'identity' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('identity')}
        >
          <span className="hosp-bottom-nav-icon">🏥</span>
          <span className="hosp-bottom-nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default HospitalDashboard;
