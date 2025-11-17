import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ChemistDashboard.css';

const ChemistDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [chemistData, setChemistData] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Edit mode states for each section
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedData, setEditedData] = useState({});

  // Mock orders data
  const [orders] = useState([
    { id: 1, customer: 'Rajesh Kumar', items: 'Paracetamol 500mg, Cough Syrup', status: 'pending', date: '2025-11-14', time: '10:30 AM', amount: '₹350' },
    { id: 2, customer: 'Priya Sharma', items: 'Antibiotics, Vitamin D3', status: 'processing', date: '2025-11-14', time: '11:15 AM', amount: '₹850' },
    { id: 3, customer: 'Amit Patel', items: 'Blood Pressure Medicines', status: 'completed', date: '2025-11-13', time: '03:45 PM', amount: '₹1,250' },
  ]);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    const chemistDataString = localStorage.getItem('chemistData');
    
    if (!userString) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userString);
      
      if (userData.role !== 'chemist') {
        alert('Access denied. This page is only for chemists/pharmacies.');
        navigate('/');
        return;
      }

      if (chemistDataString) {
        setChemistData(JSON.parse(chemistDataString));
      } else {
        // Redirect to registration if data not found
        navigate('/chemist-registration');
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
    localStorage.removeItem('chemistData');
    navigate('/');
  };

  // Edit mode handlers
  const handleEdit = (section) => {
    setEditedData({...chemistData});
    if (section === 'identity') setIsEditingIdentity(true);
    else if (section === 'address') setIsEditingAddress(true);
    else if (section === 'contact') setIsEditingContact(true);
  };

  const handleCancelEdit = (section) => {
    if (section === 'identity') setIsEditingIdentity(false);
    else if (section === 'address') setIsEditingAddress(false);
    else if (section === 'contact') setIsEditingContact(false);
    setEditedData({});
  };

  const handleSaveEdit = (section) => {
    setChemistData(editedData);
    localStorage.setItem('chemistData', JSON.stringify(editedData));
    
    if (section === 'identity') setIsEditingIdentity(false);
    else if (section === 'address') setIsEditingAddress(false);
    else if (section === 'contact') setIsEditingContact(false);
    setEditedData({});
    alert('Details updated successfully!');
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'identity', icon: '🏪', label: 'Basic Identity' },
    { id: 'address', icon: '📍', label: 'Address & Location' },
    { id: 'contact', icon: '📞', label: 'Contact Details' },
    { id: 'hours', icon: '🕐', label: 'Working Hours' },
    { id: 'licenses', icon: '📜', label: 'Licenses & Registration' },
    { id: 'services', icon: '🚚', label: 'Services & Facilities' },
    { id: 'payments', icon: '💳', label: 'Payments & Billing' },
    { id: 'inventory', icon: '💊', label: 'Product Inventory' }
  ];

  const handleBottomNavClick = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
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

  if (!currentUser || !chemistData) return null;

  return (
    <div className="chemist-dashboard">
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
            <p>Chemist Portal</p>
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
            <h3>PHARMACY MANAGEMENT</h3>
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
          <p>Chemist Dashboard</p>
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
            <h1>Chemist Dashboard</h1>
            <p>Welcome, {chemistData.pharmacyName}</p>
          </div>
          <div className="user-info">
            {/* <button 
              className="wallet-icon-btn"
              title="My Wallet"
            >
              Wallet 💳
            </button> */}
            <span className="user-phone">📱 {chemistData.mobile}</span>
          </div>
        </header>

        <div className="content-body">
          {/* Home Section */}
          {activeSection === 'home' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🏠 Dashboard Overview</h2>
                <p>Manage your orders and medicine inventory</p>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{orders.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🕐</div>
                  <div className="stat-info">
                    <h3>Pending</h3>
                    <p className="stat-number">{orders.filter(o => o.status === 'pending').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>Processing</h3>
                    <p className="stat-number">{orders.filter(o => o.status === 'processing').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Completed</h3>
                    <p className="stat-number">{orders.filter(o => o.status === 'completed').length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="recent-orders">
                <h3>Recent Orders</h3>
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h4>{order.customer}</h4>
                        <span className={`status-badge ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="order-details">
                        <p>💊 <strong>Items:</strong> {order.items}</p>
                        <p>💰 <strong>Amount:</strong> {order.amount}</p>
                        <p>📅 {order.date} • ⏰ {order.time}</p>
                      </div>
                      <div className="order-actions">
                        <button className="btn-secondary">View Details</button>
                        {order.status === 'pending' && (
                          <button className="btn-primary">Accept Order</button>
                        )}
                        {order.status === 'processing' && (
                          <button className="btn-primary">Mark Ready</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Basic Identity Section */}
          {activeSection === 'identity' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🏪 Basic Identity</h2>
                <p>Pharmacy basic information (Registered during sign-up)</p>
              </div>

              {!isEditingIdentity ? (
                <>
                  <div className="info-display">
                    <div className="info-row">
                      <label>Pharmacy Name:</label>
                      <span>{chemistData.pharmacyName}</span>
                    </div>
                    <div className="info-row">
                      <label>Business Type:</label>
                      <span>{chemistData.businessType}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Tagline:</label>
                      <span>{chemistData.tagline || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEdit('identity')}>Request Edit</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Pharmacy Name *</label>
                      <input
                        type="text"
                        value={editedData.pharmacyName || ''}
                        onChange={(e) => handleInputChange('pharmacyName', e.target.value)}
                        placeholder="Enter pharmacy name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Business Type *</label>
                      <select
                        value={editedData.businessType || ''}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="Retail Pharmacy">Retail Pharmacy</option>
                        <option value="Medical Store">Medical Store</option>
                        <option value="Hospital Pharmacy">Hospital Pharmacy</option>
                        <option value="Chain Store">Chain Store</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Tagline</label>
                      <input
                        type="text"
                        value={editedData.tagline || ''}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        placeholder="Enter tagline (optional)"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit('identity')}>Save Changes</button>
                    <button className="btn-secondary" onClick={() => handleCancelEdit('identity')}>Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Address & Location Section */}
          {activeSection === 'address' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📍 Address & Location</h2>
                <p>Shop location and address details (Registered during sign-up)</p>
              </div>

              {!isEditingAddress ? (
                <>
                  <div className="info-display">
                    <div className="info-row">
                      <label>Shop Number:</label>
                      <span>{chemistData.shopNumber || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <label>Building:</label>
                      <span>{chemistData.building || 'N/A'}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Locality:</label>
                      <span>{chemistData.locality}</span>
                    </div>
                    <div className="info-row">
                      <label>City:</label>
                      <span>{chemistData.city}</span>
                    </div>
                    <div className="info-row">
                      <label>PIN Code:</label>
                      <span>{chemistData.pin}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Landmark:</label>
                      <span>{chemistData.landmark || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <label>Latitude:</label>
                      <span>{chemistData.latitude || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Longitude:</label>
                      <span>{chemistData.longitude || 'Not provided'}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Multiple Branches:</label>
                      <span>{chemistData.branches || 'No additional branches'}</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEdit('address')}>Request Edit</button>
                    <button className="btn-primary">View on Map</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Shop Number</label>
                      <input
                        type="text"
                        value={editedData.shopNumber || ''}
                        onChange={(e) => handleInputChange('shopNumber', e.target.value)}
                        placeholder="Shop/Door number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Building</label>
                      <input
                        type="text"
                        value={editedData.building || ''}
                        onChange={(e) => handleInputChange('building', e.target.value)}
                        placeholder="Building name"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Locality *</label>
                      <input
                        type="text"
                        value={editedData.locality || ''}
                        onChange={(e) => handleInputChange('locality', e.target.value)}
                        placeholder="Locality/Area"
                      />
                    </div>
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        value={editedData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label>PIN Code *</label>
                      <input
                        type="text"
                        value={editedData.pin || ''}
                        onChange={(e) => handleInputChange('pin', e.target.value)}
                        placeholder="PIN Code"
                        maxLength="6"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Landmark</label>
                      <input
                        type="text"
                        value={editedData.landmark || ''}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        placeholder="Nearby landmark"
                      />
                    </div>
                    <div className="form-group">
                      <label>Latitude</label>
                      <input
                        type="text"
                        value={editedData.latitude || ''}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        placeholder="Latitude"
                      />
                    </div>
                    <div className="form-group">
                      <label>Longitude</label>
                      <input
                        type="text"
                        value={editedData.longitude || ''}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        placeholder="Longitude"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Multiple Branches</label>
                      <textarea
                        rows="2"
                        value={editedData.branches || ''}
                        onChange={(e) => handleInputChange('branches', e.target.value)}
                        placeholder="List other branch locations if any"
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit('address')}>Save Changes</button>
                    <button className="btn-secondary" onClick={() => handleCancelEdit('address')}>Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Contact Details Section */}
          {activeSection === 'contact' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📞 Contact Details</h2>
                <p>Contact information (Registered during sign-up)</p>
              </div>

              {!isEditingContact ? (
                <>
                  <div className="info-display">
                    <div className="info-row">
                      <label>Primary Phone:</label>
                      <span>{chemistData.primaryPhone}</span>
                    </div>
                    <div className="info-row">
                      <label>Mobile Number:</label>
                      <span>{chemistData.mobile}</span>
                    </div>
                    <div className="info-row">
                      <label>WhatsApp Number:</label>
                      <span>{chemistData.whatsappNumber || 'Not provided'}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Email:</label>
                      <span>{chemistData.email}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Website:</label>
                      <span>{chemistData.website || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Facebook:</label>
                      <span>{chemistData.facebook || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Instagram:</label>
                      <span>{chemistData.instagram || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Twitter:</label>
                      <span>{chemistData.twitter || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEdit('contact')}>Request Edit</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Primary Phone *</label>
                      <input
                        type="tel"
                        value={editedData.primaryPhone || ''}
                        onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                        placeholder="Primary phone"
                        maxLength="10"
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        value={editedData.mobile || ''}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        placeholder="Mobile number"
                        maxLength="10"
                      />
                    </div>
                    <div className="form-group">
                      <label>WhatsApp Number</label>
                      <input
                        type="tel"
                        value={editedData.whatsappNumber || ''}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        placeholder="WhatsApp number"
                        maxLength="10"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={editedData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Website</label>
                      <input
                        type="url"
                        value={editedData.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="Website URL"
                      />
                    </div>
                    <div className="form-group">
                      <label>Facebook</label>
                      <input
                        type="text"
                        value={editedData.facebook || ''}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                        placeholder="Facebook page URL"
                      />
                    </div>
                    <div className="form-group">
                      <label>Instagram</label>
                      <input
                        type="text"
                        value={editedData.instagram || ''}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                        placeholder="Instagram handle"
                      />
                    </div>
                    <div className="form-group">
                      <label>Twitter</label>
                      <input
                        type="text"
                        value={editedData.twitter || ''}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        placeholder="Twitter handle"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit('contact')}>Save Changes</button>
                    <button className="btn-secondary" onClick={() => handleCancelEdit('contact')}>Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Working Hours Section (Optional - Can be skipped) */}
          {activeSection === 'hours' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🕐 Working Hours & Delivery Timings</h2>
                <p>Set your operating hours and delivery schedules</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Daily Operating Hours</h3>
                </div>

                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <React.Fragment key={day}>
                    <div className="form-group">
                      <label>{day}</label>
                      <div className="time-input-group">
                        <input type="time" placeholder="Opening time" />
                        <span style={{ margin: '0 10px' }}>to</span>
                        <input type="time" placeholder="Closing time" />
                      </div>
                    </div>
                  </React.Fragment>
                ))}

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    24×7 Available
                  </label>
                </div>

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    Night Service Available (Special hours)
                  </label>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Home Delivery Windows</h3>
                </div>

                <div className="form-group">
                  <label>Delivery Start Time</label>
                  <input type="time" placeholder="e.g., 09:00" />
                </div>

                <div className="form-group">
                  <label>Delivery End Time</label>
                  <input type="time" placeholder="e.g., 21:00" />
                </div>

                <div className="form-group full-width">
                  <label>Holiday/Closed Dates</label>
                  <textarea 
                    rows="3" 
                    placeholder="List any holidays or closed dates (one per line)"
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Hours</button>
                <button className="btn-secondary">Skip for Now</button>
              </div>
            </section>
          )}

          {/* Licenses & Registration Section (Optional but important) */}
          {activeSection === 'licenses' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📜 Licenses & Registration</h2>
                <p>Upload your legal documents and certifications</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Drug Licence Number *</label>
                  <input type="text" placeholder="State Drug Control Authority License" />
                  <small>Form 20/21/22 depending on state</small>
                </div>

                <div className="form-group full-width">
                  <label>Upload Drug Licence *</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>

                <div className="form-group">
                  <label>GST Registration Number</label>
                  <input type="text" placeholder="GSTIN (if applicable)" />
                </div>

                <div className="form-group">
                  <label>Upload GST Certificate</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>

                <div className="form-group full-width">
                  <label>Shop Establishment Certificate</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Trade license or rent deed</small>
                </div>

                <div className="form-group full-width">
                  <label>Owner/Manager Identity Proof</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Aadhaar/PAN/Passport</small>
                </div>

                <div className="form-group">
                  <label>Pharmacist Registration Number *</label>
                  <input type="text" placeholder="State Pharmacy Council registration" />
                </div>

                <div className="form-group full-width">
                  <label>Pharmacist Registration Certificate *</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>Who will supervise sales</small>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save & Submit for Verification</button>
                <button className="btn-secondary">Skip for Now</button>
              </div>
            </section>
          )}

          {/* Services & Facilities Section (Optional) */}
          {activeSection === 'services' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🚚 Services & Facilities Offered</h2>
                <p>Configure your service offerings and policies</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Available Services</h3>
                </div>

                <div className="form-group full-width">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      Prescription Fulfilment (In-store)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Home Delivery
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Same-day Delivery
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Scheduled Delivery
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Online Order
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Prepaid Orders
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Medicine Substitutions Allowed?</label>
                  <select>
                    <option value="">Select</option>
                    <option value="yes">Yes, with customer approval</option>
                    <option value="no">No, exact prescription only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Accept Online Orders?</label>
                  <select>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Order Cutoff Time</label>
                  <input type="time" placeholder="e.g., 20:00" />
                  <small>Last time to accept orders</small>
                </div>

                <div className="form-group">
                  <label>Maximum Delivery Radius (km)</label>
                  <input type="number" placeholder="e.g., 5, 10" />
                </div>

                <div className="form-group">
                  <label>Minimum Order Value</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Minimum amount" />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Refund / Return Policy</label>
                  <textarea 
                    rows="3" 
                    placeholder="Describe your refund and return policy..."
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Prescription Verification Policy</label>
                  <textarea 
                    rows="3" 
                    placeholder="How do you verify prescriptions?"
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Services</button>
                <button className="btn-secondary">Skip for Now</button>
              </div>
            </section>
          )}

          {/* Payments & Billing Section (Optional) */}
          {activeSection === 'payments' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>💳 Payments & Billing</h2>
                <p>Configure payment methods and billing settings</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Payment Methods Accepted</h3>
                </div>

                <div className="form-group full-width">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
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
                      Mobile Wallets (Paytm, PhonePe, etc.)
                    </label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Online Payment Gateway</h3>
                </div>

                <div className="form-group">
                  <label>Payment Gateway Provider</label>
                  <select>
                    <option value="">Select provider</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="paytm">Paytm</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Gateway API Key</label>
                  <input type="text" placeholder="API Key (if applicable)" />
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Bank Account for Payouts</h3>
                </div>

                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input type="text" placeholder="As per bank records" />
                </div>

                <div className="form-group">
                  <label>Bank Account Number</label>
                  <input type="text" placeholder="Account number" />
                </div>

                <div className="form-group">
                  <label>IFSC Code</label>
                  <input type="text" placeholder="Bank IFSC code" />
                </div>

                <div className="form-group">
                  <label>Bank Name</label>
                  <input type="text" placeholder="Name of bank" />
                </div>

                <div className="form-group full-width">
                  <label>Upload Cancelled Cheque</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <small>For bank verification</small>
                </div>

                <div className="form-group full-width">
                  <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>GST Billing Settings</h3>
                </div>

                <div className="form-group">
                  <label>GSTIN</label>
                  <input type="text" placeholder="GST Number" />
                </div>

                <div className="form-group full-width">
                  <label>Bill Header/Legal Name</label>
                  <input type="text" placeholder="Name to appear on bills" />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Payment Settings</button>
                <button className="btn-secondary">Skip for Now</button>
              </div>
            </section>
          )}

          {/* Product Inventory Section (Optional) */}
          {activeSection === 'inventory' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>💊 Product Inventory Management</h2>
                <p>Add and manage your medicine inventory</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Product ID / SKU</label>
                  <input type="text" placeholder="Unique identifier" />
                  <small>Alphanumeric code</small>
                </div>

                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" placeholder="Brand + Generic name" />
                </div>

                <div className="form-group">
                  <label>Brand / Manufacturer *</label>
                  <input type="text" placeholder="Company name" />
                </div>

                <div className="form-group">
                  <label>Generic Name / Active Ingredient</label>
                  <input type="text" placeholder="e.g., Paracetamol" />
                </div>

                <div className="form-group">
                  <label>Formulation *</label>
                  <select>
                    <option value="">Select type</option>
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="syrup">Syrup</option>
                    <option value="injection">Injection</option>
                    <option value="ointment">Ointment</option>
                    <option value="drops">Drops</option>
                    <option value="inhaler">Inhaler</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Strength</label>
                  <input type="text" placeholder="e.g., 500 mg, 5 mg/5 ml" />
                </div>

                <div className="form-group">
                  <label>Pack Description</label>
                  <input type="text" placeholder="e.g., Strip of 10 tablets" />
                </div>

                <div className="form-group">
                  <label>MRP (Maximum Retail Price) *</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Printed MRP" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Selling Price *</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Customer price" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Purchase/Cost Price</label>
                  <div className="input-with-icon">
                    <span className="icon">₹</span>
                    <input type="number" placeholder="Your buying cost" />
                  </div>
                </div>

                <div className="form-group">
                  <label>GST Slab %</label>
                  <select>
                    <option value="">Select GST rate</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Discount %</label>
                  <input type="number" placeholder="Current discount" />
                </div>

                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input type="number" placeholder="Available stock" />
                </div>

                <div className="form-group full-width">
                  <label>Offer / Promotion Tag</label>
                  <input type="text" placeholder="e.g., Buy 1 Get 1, 20% Off" />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Add Product</button>
                <button className="btn-secondary">View All Products</button>
                <button className="btn-secondary">Skip for Now</button>
              </div>
            </section>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📦 My Orders</h2>
                <p>View and manage all customer orders</p>
              </div>

              {/* Order Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{orders.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🕐</div>
                  <div className="stat-info">
                    <h3>Pending</h3>
                    <p className="stat-number">{orders.filter(o => o.status === 'pending').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>Processing</h3>
                    <p className="stat-number">{orders.filter(o => o.status === 'processing').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Completed</h3>
                    <p className="stat-number">{orders.filter(o => o.status === 'completed').length}</p>
                  </div>
                </div>
              </div>

              {/* All Orders */}
              <div className="recent-orders" style={{ marginTop: '30px' }}>
                <h3>All Orders</h3>
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h4>{order.customer}</h4>
                        <span className={`status-badge ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="order-details">
                        <p>💊 <strong>Items:</strong> {order.items}</p>
                        <p>💰 <strong>Amount:</strong> {order.amount}</p>
                        <p>📅 {order.date} • ⏰ {order.time}</p>
                      </div>
                      <div className="order-actions">
                        <button className="btn-secondary">View Details</button>
                        {order.status === 'pending' && (
                          <button className="btn-primary">Accept Order</button>
                        )}
                        {order.status === 'processing' && (
                          <button className="btn-primary">Mark Ready</button>
                        )}
                        {order.status === 'completed' && (
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
          className={`bottom-nav-item ${activeSection === 'orders' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('orders')}
        >
          <span className="bottom-nav-icon">📦</span>
          <span className="bottom-nav-label">Orders</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeSection === 'inventory' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('inventory')}
        >
          <span className="bottom-nav-icon">💊</span>
          <span className="bottom-nav-label">Inventory</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeSection === 'identity' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('identity')}
        >
          <span className="bottom-nav-icon">👤</span>
          <span className="bottom-nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default ChemistDashboard;
