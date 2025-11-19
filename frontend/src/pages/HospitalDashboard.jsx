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

  // Expense Modal States
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseModalMode, setExpenseModalMode] = useState('add');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [currentExpenseData, setCurrentExpenseData] = useState(null);

  // Mock expense data - Same as Admin Panel
  const [rooms, setRooms] = useState([
    { room_id: 'R001', room_type: 'General Ward', room_name: 'Ward A', floor: '1st Floor', charge_per_day: 1500, max_patients: 4, status: 'Active' },
    { room_id: 'R002', room_type: 'Private Room', room_name: 'Private 101', floor: '2nd Floor', charge_per_day: 3500, max_patients: 1, status: 'Active' },
    { room_id: 'R003', room_type: 'ICU', room_name: 'ICU Ward', floor: '3rd Floor', charge_per_day: 8000, max_patients: 6, status: 'Active' }
  ]);

  const [procedures, setProcedures] = useState([
    { procedure_id: 'P001', procedure_name: 'Appendectomy', procedure_type: 'Surgical', base_charge: 45000, ot_charges: 15000, anesthesia_charge: 8000, status: 'Active' },
    { procedure_id: 'P002', procedure_name: 'Cataract Surgery', procedure_type: 'Surgical', base_charge: 35000, ot_charges: 10000, anesthesia_charge: 5000, status: 'Active' }
  ]);

  const [doctorFees, setDoctorFees] = useState([
    { doctor_id: 'D001', name: 'Dr. Sharma', specialization: 'Cardiologist', visit_fee_opd: 800, visit_fee_ipd_per_visit: 1200, consultation_fee_emergency: 1500, status: 'Active' },
    { doctor_id: 'D002', name: 'Dr. Mehta', specialization: 'Orthopedic', visit_fee_opd: 700, visit_fee_ipd_per_visit: 1000, consultation_fee_emergency: 1300, status: 'Active' }
  ]);

  const [nursingCharges, setNursingCharges] = useState([
    { service_id: 'N001', service_name: 'Nursing Care (12 hrs)', charge_type: 'per_day', charge_amount: 1200, status: 'Active' },
    { service_id: 'N002', service_name: 'Nursing Care (24 hrs)', charge_type: 'per_day', charge_amount: 2000, status: 'Active' }
  ]);

  const [miscServices, setMiscServices] = useState([
    { service_id: 'M001', service: 'Ambulance Service', charge: 1500, status: 'Active' },
    { service_id: 'M002', service: 'Medical Certificate', charge: 200, status: 'Active' }
  ]);

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

  // Expense Modal Handlers
  const openExpenseModal = (category, mode, data = null) => {
    setExpenseCategory(category);
    setExpenseModalMode(mode);
    setCurrentExpenseData(data);
    setShowExpenseModal(true);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setExpenseCategory('');
    setExpenseModalMode('add');
    setCurrentExpenseData(null);
  };

  const handleExpenseSave = (category, data) => {
    // Mock save functionality - in real app, this would call API
    console.log(`Saving ${category} data:`, data);
    alert(`${category} data saved successfully!`);
    closeExpenseModal();
  };

  const handleExpenseDelete = (category, id) => {
    if (window.confirm(`Are you sure you want to delete this ${category} entry?`)) {
      console.log(`Deleting ${category} with ID:`, id);
      alert(`${category} entry deleted successfully!`);
    }
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
    { id: 'media', icon: '📸', label: 'Images & Media' },
    { id: 'kyc', icon: '📋', label: 'KYC/Legal Documents' },
    { id: 'operational', icon: '⚙️', label: 'Operational Details' },
    { id: 'commission', icon: '💵', label: 'Commission & Payout' },
    { id: 'majorExpenses', icon: '💸', label: 'Major Expenses' }
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

          {/* KYC/Legal Documents Section */}
          {activeSection === 'kyc' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>📋 KYC/Legal Documents</h2>
                <p>Manage regulatory and legal documentation</p>
              </div>

              <div className="hosp-info-grid">
                <div className="hosp-info-card">
                  <h3>📄 GST Registration</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">GST Number:</span>
                    <span className="hosp-field-value">{hospitalData.gstNumber || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Status:</span>
                    <span className={`hosp-status-badge ${hospitalData.kycStatus || 'pending'}`}>
                      {(hospitalData.kycStatus || 'Pending').charAt(0).toUpperCase() + (hospitalData.kycStatus || 'pending').slice(1)}
                    </span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Upload GST Certificate</button>
                </div>

                <div className="hosp-info-card">
                  <h3>🏛️ Hospital Registration</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Registration No:</span>
                    <span className="hosp-field-value">{hospitalData.registrationNumber || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Certificate:</span>
                    <span className="hosp-field-value">{hospitalData.registrationCertificate ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Upload Certificate</button>
                </div>

                <div className="hosp-info-card">
                  <h3>💳 PAN Card</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">PAN Number:</span>
                    <span className="hosp-field-value">{hospitalData.panNumber || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Document:</span>
                    <span className="hosp-field-value">{hospitalData.panCard ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Upload PAN Card</button>
                </div>

                <div className="hosp-info-card">
                  <h3>🆔 Aadhaar Card</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Aadhaar:</span>
                    <span className="hosp-field-value">{hospitalData.aadhaarNumber || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Document:</span>
                    <span className="hosp-field-value">{hospitalData.aadhaarCard ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Upload Aadhaar</button>
                </div>

                <div className="hosp-info-card">
                  <h3>🏦 Bank Account Verification</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Account No:</span>
                    <span className="hosp-field-value">{hospitalData.accountNumber || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">IFSC Code:</span>
                    <span className="hosp-field-value">{hospitalData.ifscCode || 'Not provided'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Upload Passbook/Cancelled Cheque</button>
                </div>

                <div className="hosp-info-card">
                  <h3>📜 Other Legal Documents</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Trade License:</span>
                    <span className="hosp-field-value">{hospitalData.tradeLicense ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Fire Safety:</span>
                    <span className="hosp-field-value">{hospitalData.fireSafety ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Upload Documents</button>
                </div>
              </div>
            </section>
          )}

          {/* Operational Details Section */}
          {activeSection === 'operational' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>⚙️ Operational Details</h2>
                <p>Hospital working hours, fees, and operational information</p>
              </div>

              <div className="hosp-info-grid">
                <div className="hosp-info-card">
                  <h3>🕒 Operating Hours</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">24x7 Status:</span>
                    <span className={`hosp-status-badge ${hospitalData.is24x7 ? 'approved' : 'pending'}`}>
                      {hospitalData.is24x7 ? '24x7 Open' : 'Limited Hours'}
                    </span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Opening Time:</span>
                    <span className="hosp-field-value">{hospitalData.openingTime || 'Not set'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Closing Time:</span>
                    <span className="hosp-field-value">{hospitalData.closingTime || 'Not set'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Edit Hours</button>
                </div>

                <div className="hosp-info-card">
                  <h3>💰 Fee Range</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Min Consultation:</span>
                    <span className="hosp-field-value">₹{hospitalData.minConsultFee || 0}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Max Consultation:</span>
                    <span className="hosp-field-value">₹{hospitalData.maxConsultFee || 0}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Emergency Fee:</span>
                    <span className="hosp-field-value">₹{hospitalData.emergencyFee || 0}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Update Fees</button>
                </div>

                <div className="hosp-info-card">
                  <h3>🏥 Available Services</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Total Services:</span>
                    <span className="hosp-field-value">{hospitalData.availableServices?.length || 0}</span>
                  </div>
                  <div style={{marginTop: '10px'}}>
                    {hospitalData.availableServices?.slice(0, 5).map((service, idx) => (
                      <div key={idx} style={{padding: '5px 0', fontSize: '14px'}}>✅ {service}</div>
                    ))}
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Manage Services</button>
                </div>

                <div className="hosp-info-card">
                  <h3>🔧 Facilities</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Total Facilities:</span>
                    <span className="hosp-field-value">{hospitalData.facilities?.length || 0}</span>
                  </div>
                  <div style={{marginTop: '10px'}}>
                    {hospitalData.facilities?.slice(0, 5).map((facility, idx) => (
                      <div key={idx} style={{padding: '5px 0', fontSize: '14px'}}>✅ {facility}</div>
                    ))}
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Manage Facilities</button>
                </div>

                <div className="hosp-info-card">
                  <h3>🛏️ Bed Capacity</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Total Beds:</span>
                    <span className="hosp-field-value">{hospitalData.totalBeds || 'Not specified'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">ICU Beds:</span>
                    <span className="hosp-field-value">{hospitalData.icuBeds || 'Not specified'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Ventilators:</span>
                    <span className="hosp-field-value">{hospitalData.ventilators || 'Not specified'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Update Capacity</button>
                </div>

                <div className="hosp-info-card">
                  <h3>🚑 Emergency Services</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Emergency Available:</span>
                    <span className={`hosp-status-badge ${hospitalData.emergencyAvailable ? 'approved' : 'rejected'}`}>
                      {hospitalData.emergencyAvailable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Ambulance:</span>
                    <span className={`hosp-status-badge ${hospitalData.ambulanceService ? 'approved' : 'rejected'}`}>
                      {hospitalData.ambulanceService ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Update Services</button>
                </div>
              </div>
            </section>
          )}

          {/* Commission & Payout Section */}
          {activeSection === 'commission' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>💵 Commission & Payout Details</h2>
                <p>View commission structure and settlement information</p>
              </div>

              <div className="hosp-info-grid">
                <div className="hosp-info-card">
                  <h3>💰 Commission Structure</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Commission Type:</span>
                    <span className={`hosp-status-badge ${hospitalData.commissionType === 'percentage' ? 'approved' : 'pending'}`}>
                      {hospitalData.commissionType?.charAt(0).toUpperCase() + hospitalData.commissionType?.slice(1) || 'Not Set'}
                    </span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Commission Value:</span>
                    <span className="hosp-field-value" style={{fontSize: '20px', fontWeight: 'bold', color: '#234f83'}}>
                      {hospitalData.commissionType === 'percentage' 
                        ? `${hospitalData.commissionValue}%` 
                        : `₹${hospitalData.commissionValue || 0}`}
                    </span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>View Details</button>
                </div>

                <div className="hosp-info-card">
                  <h3>📅 Settlement Cycle</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Settlement Frequency:</span>
                    <span className="hosp-field-value">{hospitalData.settlementCycle || 'Not Set'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Payment Mode:</span>
                    <span className="hosp-field-value">{hospitalData.paymentMode || 'Not Set'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Last Settlement:</span>
                    <span className="hosp-field-value">{hospitalData.lastSettlement || 'N/A'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>View History</button>
                </div>

                <div className="hosp-info-card">
                  <h3>💳 Payout Account</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Account Number:</span>
                    <span className="hosp-field-value">{hospitalData.accountNumber || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Bank Name:</span>
                    <span className="hosp-field-value">{hospitalData.bankName || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">IFSC Code:</span>
                    <span className="hosp-field-value">{hospitalData.ifscCode || 'Not provided'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>Update Account</button>
                </div>

                <div className="hosp-info-card">
                  <h3>📊 Commission Stats (This Month)</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Total Bookings:</span>
                    <span className="hosp-field-value">0</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Commission Earned:</span>
                    <span className="hosp-field-value" style={{color: '#10b981', fontWeight: 'bold'}}>₹0</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Pending Settlement:</span>
                    <span className="hosp-field-value" style={{color: '#f59e0b', fontWeight: 'bold'}}>₹0</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}}>View Report</button>
                </div>
              </div>

              <div style={{marginTop: '30px', padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                <h3 style={{marginTop: 0, marginBottom: '15px'}}>ℹ️ Commission Policy Information</h3>
                <p style={{fontSize: '14px', lineHeight: '1.6', marginBottom: '10px'}}>
                  • Commission is calculated based on confirmed bookings only<br/>
                  • Settlements are processed according to your selected cycle<br/>
                  • All payouts are made to the verified bank account<br/>
                  • GST/TDS will be deducted as per applicable regulations<br/>
                  • Contact admin for commission structure changes
                </p>
              </div>
            </section>
          )}

          {/* Major Expenses Section */}
          {activeSection === 'majorExpenses' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>💸 Major Expenses Management</h2>
                <p>Manage room charges, procedures, doctor fees, and other hospital expenses</p>
              </div>

              <div style={{marginBottom: '20px', padding: '15px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#92400e'}}>
                  ⚠️ This section is for internal expense management. Please add and maintain your hospital's pricing structure for various services.
                </p>
              </div>

              <div className="hosp-info-grid">
                <div className="hosp-info-card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>🛏️ Rooms & Boards</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{rooms.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Room types configured</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#667eea'}}
                    onClick={() => openExpenseModal('rooms', 'add')}
                  >
                    + Add Room Type
                  </button>
                </div>

                <div className="hosp-info-card" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>🏥 Medical Procedures</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{procedures.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Procedures listed</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#f5576c'}}
                    onClick={() => openExpenseModal('procedures', 'add')}
                  >
                    + Add Procedure
                  </button>
                </div>

                <div className="hosp-info-card" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>👨‍⚕️ Doctor Fees</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{doctorFees.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Doctor fee structures</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#00f2fe'}}
                    onClick={() => openExpenseModal('doctorFees', 'add')}
                  >
                    + Add Doctor Fee
                  </button>
                </div>

                <div className="hosp-info-card" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>👩‍⚕️ Nursing & Staff</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{nursingCharges.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Nursing charges</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#38f9d7'}}
                    onClick={() => openExpenseModal('nursing', 'add')}
                  >
                    + Add Service
                  </button>
                </div>

                <div className="hosp-info-card" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>🔧 Miscellaneous</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{miscServices.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Other services</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#fa709a'}}
                    onClick={() => openExpenseModal('miscellaneous', 'add')}
                  >
                    + Add Service
                  </button>
                </div>

                <div className="hosp-info-card" style={{background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>📊 Total Entries</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>
                    {rooms.length + procedures.length + doctorFees.length + nursingCharges.length + miscServices.length}
                  </div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Total expense entries</p>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '15px', background: '#fff', color: '#330867'}}>View All</button>
                </div>
              </div>

              {/* Detailed Tables */}
              <div style={{marginTop: '30px'}}>
                <h3 style={{color: '#234f83', marginBottom: '20px'}}>🛏️ Rooms & Boards</h3>
                <div style={{background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Room ID</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Room Type</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Room Name</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Floor</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Charge/Day</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Max Beds</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Status</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map(room => (
                        <tr key={room.room_id} style={{borderBottom: '1px solid #f3f4f6'}}>
                          <td style={{padding: '12px'}}>{room.room_id}</td>
                          <td style={{padding: '12px'}}>{room.room_type}</td>
                          <td style={{padding: '12px'}}>{room.room_name}</td>
                          <td style={{padding: '12px'}}>{room.floor}</td>
                          <td style={{padding: '12px', fontWeight: '600'}}>₹{room.charge_per_day}</td>
                          <td style={{padding: '12px'}}>{room.max_patients}</td>
                          <td style={{padding: '12px'}}>
                            <span className={`hosp-status-badge ${room.status.toLowerCase()}`}>{room.status}</span>
                          </td>
                          <td style={{padding: '12px'}}>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginRight: '8px'}}
                              onClick={() => openExpenseModal('rooms', 'edit', room)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'}}
                              onClick={() => handleExpenseDelete('rooms', room.room_id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{marginTop: '30px'}}>
                <h3 style={{color: '#234f83', marginBottom: '20px'}}>🏥 Medical Procedures</h3>
                <div style={{background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Procedure ID</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Procedure Name</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Type</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Base Charge</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>OT Charges</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Status</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procedures.map(proc => (
                        <tr key={proc.procedure_id} style={{borderBottom: '1px solid #f3f4f6'}}>
                          <td style={{padding: '12px'}}>{proc.procedure_id}</td>
                          <td style={{padding: '12px'}}>{proc.procedure_name}</td>
                          <td style={{padding: '12px'}}>{proc.procedure_type}</td>
                          <td style={{padding: '12px', fontWeight: '600'}}>₹{proc.base_charge}</td>
                          <td style={{padding: '12px', fontWeight: '600'}}>₹{proc.ot_charges}</td>
                          <td style={{padding: '12px'}}>
                            <span className={`hosp-status-badge ${proc.status.toLowerCase()}`}>{proc.status}</span>
                          </td>
                          <td style={{padding: '12px'}}>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginRight: '8px'}}
                              onClick={() => openExpenseModal('procedures', 'edit', proc)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'}}
                              onClick={() => handleExpenseDelete('procedures', proc.procedure_id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{marginTop: '30px'}}>
                <h3 style={{color: '#234f83', marginBottom: '20px'}}>👨‍⚕️ Doctor Fees</h3>
                <div style={{background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Doctor ID</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Name</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Specialization</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>OPD Fee</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>IPD Fee</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Status</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorFees.map(doc => (
                        <tr key={doc.doctor_id} style={{borderBottom: '1px solid #f3f4f6'}}>
                          <td style={{padding: '12px'}}>{doc.doctor_id}</td>
                          <td style={{padding: '12px'}}>{doc.name}</td>
                          <td style={{padding: '12px'}}>{doc.specialization}</td>
                          <td style={{padding: '12px', fontWeight: '600'}}>₹{doc.visit_fee_opd}</td>
                          <td style={{padding: '12px', fontWeight: '600'}}>₹{doc.visit_fee_ipd_per_visit}</td>
                          <td style={{padding: '12px'}}>
                            <span className={`hosp-status-badge ${doc.status.toLowerCase()}`}>{doc.status}</span>
                          </td>
                          <td style={{padding: '12px'}}>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginRight: '8px'}}
                              onClick={() => openExpenseModal('doctorFees', 'edit', doc)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'}}
                              onClick={() => handleExpenseDelete('doctorFees', doc.doctor_id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{marginTop: '30px', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                <h3 style={{marginTop: 0, marginBottom: '15px'}}>💡 Quick Actions</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                  <button className="hosp-dash-btn-primary" onClick={() => openExpenseModal('rooms', 'add')}>+ Add Room Type</button>
                  <button className="hosp-dash-btn-primary" onClick={() => openExpenseModal('procedures', 'add')}>+ Add Procedure</button>
                  <button className="hosp-dash-btn-primary" onClick={() => openExpenseModal('doctorFees', 'add')}>+ Add Doctor Fee</button>
                  <button className="hosp-dash-btn-secondary" onClick={() => alert('Import functionality coming soon')}>📥 Import from CSV</button>
                  <button className="hosp-dash-btn-secondary" onClick={() => alert('Export functionality coming soon')}>📤 Export Data</button>
                  <button className="hosp-dash-btn-secondary" onClick={() => alert('Report generation coming soon')}>📊 Generate Report</button>
                </div>
              </div>
            </section>
          )}

          {/* Expense Modal */}
          {showExpenseModal && (
            <div className="admin-modal-overlay" onClick={closeExpenseModal}>
              <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                <div className="admin-modal-header">
                  <h2>
                    {expenseModalMode === 'add' ? '➕ Add' : '✏️ Edit'} {' '}
                    {expenseCategory === 'rooms' && 'Room/Board'}
                    {expenseCategory === 'procedures' && 'Medical Procedure'}
                    {expenseCategory === 'doctorFees' && 'Doctor Fee'}
                    {expenseCategory === 'nursing' && 'Nursing/Staff Charge'}
                    {expenseCategory === 'miscellaneous' && 'Miscellaneous Service'}
                  </h2>
                  <button className="admin-close-btn" onClick={closeExpenseModal}>✕</button>
                </div>
                <div className="admin-modal-body">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    handleExpenseSave(expenseCategory, data);
                  }} className="admin-modal-form">
                    
                    {/* Rooms & Boards Form */}
                    {expenseCategory === 'rooms' && (
                      <>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Room Type *</label>
                            <select name="room_type" defaultValue={currentExpenseData?.room_type} required>
                              <option value="">Select Room Type</option>
                              <option value="General Ward">General Ward</option>
                              <option value="Semi Private">Semi Private</option>
                              <option value="Private">Private</option>
                              <option value="Deluxe">Deluxe</option>
                              <option value="ICU">ICU</option>
                              <option value="NICU">NICU</option>
                              <option value="PICU">PICU</option>
                              <option value="CCU">CCU</option>
                            </select>
                          </div>
                          <div className="admin-form-group">
                            <label>Room Name *</label>
                            <input type="text" name="room_name" defaultValue={currentExpenseData?.room_name} required placeholder="e.g., ICU Ward A" />
                          </div>
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Floor</label>
                            <input type="text" name="floor" defaultValue={currentExpenseData?.floor} placeholder="e.g., 3rd Floor" />
                          </div>
                          <div className="admin-form-group">
                            <label>Charge Per Day (₹) *</label>
                            <input type="number" name="charge_per_day" defaultValue={currentExpenseData?.charge_per_day} required placeholder="Enter charge" />
                          </div>
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Max Patients *</label>
                            <input type="number" name="max_patients" defaultValue={currentExpenseData?.max_patients} required placeholder="Number of beds" />
                          </div>
                          <div className="admin-form-group">
                            <label>Status</label>
                            <select name="status" defaultValue={currentExpenseData?.status || 'Active'}>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>Description</label>
                          <textarea name="description" defaultValue={currentExpenseData?.description} rows="3" placeholder="Room details and facilities"></textarea>
                        </div>
                      </>
                    )}

                    {/* Medical Procedures Form */}
                    {expenseCategory === 'procedures' && (
                      <>
                        <div className="admin-form-group">
                          <label>Procedure Name *</label>
                          <input type="text" name="procedure_name" defaultValue={currentExpenseData?.procedure_name} required placeholder="e.g., Appendectomy" />
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Procedure Type *</label>
                            <select name="procedure_type" defaultValue={currentExpenseData?.procedure_type} required>
                              <option value="">Select Type</option>
                              <option value="Surgical">Surgical</option>
                              <option value="Minor Surgery">Minor Surgery</option>
                              <option value="Major Surgery">Major Surgery</option>
                              <option value="Minor Procedure">Minor Procedure</option>
                              <option value="Major Procedure">Major Procedure</option>
                            </select>
                          </div>
                          <div className="admin-form-group">
                            <label>Base Charge (₹) *</label>
                            <input type="number" name="base_charge" defaultValue={currentExpenseData?.base_charge} required placeholder="Base cost" />
                          </div>
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>OT Charges (₹)</label>
                            <input type="number" name="ot_charges" defaultValue={currentExpenseData?.ot_charges} placeholder="Operation theatre charges" />
                          </div>
                          <div className="admin-form-group">
                            <label>Anesthesia Charge (₹)</label>
                            <input type="number" name="anesthesia_charge" defaultValue={currentExpenseData?.anesthesia_charge} placeholder="Anesthesia cost" />
                          </div>
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Default Doctor Fee (₹)</label>
                            <input type="number" name="doctor_fee_default" defaultValue={currentExpenseData?.doctor_fee_default} placeholder="Doctor fee" />
                          </div>
                          <div className="admin-form-group">
                            <label>Status</label>
                            <select name="status" defaultValue={currentExpenseData?.status || 'Active'}>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>Description</label>
                          <textarea name="description" defaultValue={currentExpenseData?.description} rows="3" placeholder="Procedure details"></textarea>
                        </div>
                      </>
                    )}

                    {/* Doctor Fees Form */}
                    {expenseCategory === 'doctorFees' && (
                      <>
                        <div className="admin-form-group">
                          <label>Doctor Name *</label>
                          <input type="text" name="name" defaultValue={currentExpenseData?.name} required placeholder="Full name" />
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Specialization *</label>
                            <input type="text" name="specialization" defaultValue={currentExpenseData?.specialization} required placeholder="e.g., Cardiologist" />
                          </div>
                          <div className="admin-form-group">
                            <label>Visit Type *</label>
                            <select name="visit_type" defaultValue={currentExpenseData?.visit_type} required>
                              <option value="">Select Type</option>
                              <option value="OPD">OPD</option>
                              <option value="IPD">IPD</option>
                              <option value="Consultation">Consultation</option>
                              <option value="Surgery">Surgery</option>
                            </select>
                          </div>
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>OPD Visit Fee (₹) *</label>
                            <input type="number" name="visit_fee_opd" defaultValue={currentExpenseData?.visit_fee_opd} required placeholder="OPD fee" />
                          </div>
                          <div className="admin-form-group">
                            <label>IPD Visit Fee (₹)</label>
                            <input type="number" name="visit_fee_ipd_per_visit" defaultValue={currentExpenseData?.visit_fee_ipd_per_visit} placeholder="IPD per visit" />
                          </div>
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Emergency Consultation (₹)</label>
                            <input type="number" name="consultation_fee_emergency" defaultValue={currentExpenseData?.consultation_fee_emergency} placeholder="Emergency fee" />
                          </div>
                          <div className="admin-form-group">
                            <label>Experience (years)</label>
                            <input type="number" name="experience" defaultValue={currentExpenseData?.experience} placeholder="Years of experience" />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>Status</label>
                          <select name="status" defaultValue={currentExpenseData?.status || 'Active'}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Nursing & Staff Charges Form */}
                    {expenseCategory === 'nursing' && (
                      <>
                        <div className="admin-form-group">
                          <label>Service Name *</label>
                          <input type="text" name="service_name" defaultValue={currentExpenseData?.service_name} required placeholder="e.g., Special Nursing Care" />
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Charge Type *</label>
                            <select name="charge_type" defaultValue={currentExpenseData?.charge_type} required>
                              <option value="">Select Type</option>
                              <option value="per_day">Per Day</option>
                              <option value="per_visit">Per Visit</option>
                            </select>
                          </div>
                          <div className="admin-form-group">
                            <label>Charge Amount (₹) *</label>
                            <input type="number" name="charge_amount" defaultValue={currentExpenseData?.charge_amount} required placeholder="Enter amount" />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>Status</label>
                          <select name="status" defaultValue={currentExpenseData?.status || 'Active'}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Miscellaneous Services Form */}
                    {expenseCategory === 'miscellaneous' && (
                      <>
                        <div className="admin-form-group">
                          <label>Service Name *</label>
                          <input type="text" name="service" defaultValue={currentExpenseData?.service} required placeholder="e.g., Ambulance Service" />
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Charge (₹) *</label>
                            <input type="number" name="charge" defaultValue={currentExpenseData?.charge} required placeholder="Enter charge" />
                          </div>
                          <div className="admin-form-group">
                            <label>Status</label>
                            <select name="status" defaultValue={currentExpenseData?.status || 'Active'}>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="admin-modal-actions">
                      <button type="button" className="admin-btn-secondary" onClick={closeExpenseModal}>
                        Cancel
                      </button>
                      <button type="submit" className="admin-btn-primary">
                        {expenseModalMode === 'add' ? 'Add' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
