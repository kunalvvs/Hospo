import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PathlabDashboard.css';

const PathlabDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [pathlabData, setPathlabData] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Edit states
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const pathlab = JSON.parse(localStorage.getItem('pathlabData'));
    
    if (!user || user.role !== 'pathlab') {
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    setPathlabData(pathlab || {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const handleBottomNavClick = (section) => {
    const sectionMap = {
      home: 'home',
      tests: 'tests',
      orders: 'orders',
      profile: 'identity'
    };
    setActiveSection(sectionMap[section] || section);
  };

  // Edit handlers
  const handleEditIdentity = () => {
    setIsEditingIdentity(true);
    setEditFormData({ ...pathlabData });
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
    setEditFormData({ ...pathlabData });
  };

  const handleEditContact = () => {
    setIsEditingContact(true);
    setEditFormData({ ...pathlabData });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveIdentity = () => {
    const updatedData = {
      ...pathlabData,
      labName: editFormData.labName,
      businessType: editFormData.businessType,
      authorizedPerson: editFormData.authorizedPerson
    };
    localStorage.setItem('pathlabData', JSON.stringify(updatedData));
    setPathlabData(updatedData);
    setIsEditingIdentity(false);
    alert('Identity details updated successfully!');
  };

  const handleSaveAddress = () => {
    const updatedData = {
      ...pathlabData,
      doorNo: editFormData.doorNo,
      street: editFormData.street,
      locality: editFormData.locality,
      landmark: editFormData.landmark,
      city: editFormData.city,
      pincode: editFormData.pincode
    };
    localStorage.setItem('pathlabData', JSON.stringify(updatedData));
    setPathlabData(updatedData);
    setIsEditingAddress(false);
    alert('Address details updated successfully!');
  };

  const handleSaveContact = () => {
    const updatedData = {
      ...pathlabData,
      phoneNumber: editFormData.phoneNumber,
      landline: editFormData.landline,
      primaryEmail: editFormData.primaryEmail,
      primaryMobile: editFormData.primaryMobile,
      workingHours: editFormData.workingHours,
      sampleCollectionHours: editFormData.sampleCollectionHours
    };
    localStorage.setItem('pathlabData', JSON.stringify(updatedData));
    setPathlabData(updatedData);
    setIsEditingContact(false);
    alert('Contact details updated successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditingIdentity(false);
    setIsEditingAddress(false);
    setIsEditingContact(false);
    setEditFormData({});
  };

  // Mock data for orders
  const mockOrders = [
    { id: 'ORD001', patient: 'Rajesh Kumar', test: 'Complete Blood Count (CBC)', status: 'Pending', date: '2024-01-15' },
    { id: 'ORD002', patient: 'Priya Sharma', test: 'Liver Function Test (LFT)', status: 'Completed', date: '2024-01-14' },
    { id: 'ORD003', patient: 'Amit Patel', test: 'Kidney Function Test (KFT)', status: 'Sample Collected', date: '2024-01-13' }
  ];

  if (!currentUser || !pathlabData) {
    return <div className="pathlab-loading">Loading...</div>;
  }

  return (
    <div className="pathlab-dashboard">
      {/* Sidebar */}
      <div className={`pathlab-sidebar ${isMobileMenuOpen ? 'pathlab-mobile-open' : ''}`}>
        <div className="pathlab-sidebar-header">
          <div className="pathlab-header-content">
            <div className="pathlab-logo">🔬</div>
            <h2>{pathlabData.labName || 'Pathlab'}</h2>
            <p>{pathlabData.city || 'Not specified'}</p>
          </div>
          <button 
            className="pathlab-sidebar-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="pathlab-sidebar-nav">
          <button 
            className={activeSection === 'home' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('home')}
          >
            🏠 Dashboard Home
          </button>
          <button 
            className={activeSection === 'identity' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('identity')}
          >
            🆔 Lab Identity
          </button>
          <button 
            className={activeSection === 'address' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('address')}
          >
            📍 Address Details
          </button>
          <button 
            className={activeSection === 'contact' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('contact')}
          >
            📞 Contact Info
          </button>
          <button 
            className={activeSection === 'licenses' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('licenses')}
          >
            📜 Legal Licenses
          </button>
          <button 
            className={activeSection === 'tests' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('tests')}
          >
            🧪 Tests Catalog
          </button>
          <button 
            className={activeSection === 'payments' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('payments')}
          >
            💳 Payments & Billing
          </button>
          <button 
            className={activeSection === 'collection' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('collection')}
          >
            🏠 Sample Collection
          </button>
          <button 
            className={activeSection === 'orders' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('orders')}
          >
            📋 Test Orders
          </button>
          <button 
            className={activeSection === 'reports' ? 'pathlab-active' : ''} 
            onClick={() => handleSectionClick('reports')}
          >
            📊 Reports & Analytics
          </button>
          
          <button className="pathlab-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="pathlab-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Toggle */}
      <button 
        className={`pathlab-mobile-menu-toggle ${isMobileMenuOpen ? 'pathlab-hidden' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Main Content */}
      <div className="pathlab-main-content">
        <div className="pathlab-content-header">
          <h1>Welcome, {pathlabData.labName || 'Pathlab'}! 👋</h1>
          <p>Manage your pathology lab operations efficiently</p>
        </div>

        <div className="pathlab-content-body">
          {/* Home Section */}
          {activeSection === 'home' && (
            <div className="pathlab-dash-section">
              <h2>📊 Dashboard Overview</h2>
              
              <div className="pathlab-stats-grid">
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">📋</div>
                  <div className="pathlab-stat-info">
                    <h3>Total Orders</h3>
                    <p className="pathlab-stat-value">156</p>
                    <span className="pathlab-stat-change pathlab-positive">+12% this month</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">⏳</div>
                  <div className="pathlab-stat-info">
                    <h3>Pending Tests</h3>
                    <p className="pathlab-stat-value">23</p>
                    <span className="pathlab-stat-change">Awaiting results</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">✅</div>
                  <div className="pathlab-stat-info">
                    <h3>Completed Today</h3>
                    <p className="pathlab-stat-value">12</p>
                    <span className="pathlab-stat-change pathlab-positive">On track</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">💰</div>
                  <div className="pathlab-stat-info">
                    <h3>Revenue (Month)</h3>
                    <p className="pathlab-stat-value">₹2.4L</p>
                    <span className="pathlab-stat-change pathlab-positive">+8% growth</span>
                  </div>
                </div>
              </div>

              <h3>Recent Test Orders</h3>
              <div className="pathlab-orders-list">
                {mockOrders.map(order => (
                  <div key={order.id} className="pathlab-order-card">
                    <div className="pathlab-order-header">
                      <span className="pathlab-order-id">{order.id}</span>
                      <span className={`pathlab-status-badge pathlab-status-${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="pathlab-order-details">
                      <p><strong>Patient:</strong> {order.patient}</p>
                      <p><strong>Test:</strong> {order.test}</p>
                      <p><strong>Date:</strong> {order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab Identity Section */}
          {activeSection === 'identity' && (
            <div className="pathlab-dash-section">
              <div className="pathlab-section-header">
                <h2>🆔 Lab Identity</h2>
                {!isEditingIdentity && (
                  <button className="pathlab-edit-btn" onClick={handleEditIdentity}>
                    ✏️ Edit
                  </button>
                )}
              </div>

              {!isEditingIdentity ? (
                <div className="pathlab-info-display">
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Lab Name:</span>
                    <span className="pathlab-value">{pathlabData.labName || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Business Type:</span>
                    <span className="pathlab-value">{pathlabData.businessType || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Authorized Person:</span>
                    <span className="pathlab-value">{pathlabData.authorizedPerson || 'Not provided'}</span>
                  </div>
                </div>
              ) : (
                <div className="pathlab-dash-form-grid">
                  <div className="pathlab-form-group">
                    <label>Lab Name</label>
                    <input
                      type="text"
                      name="labName"
                      value={editFormData.labName || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Business Type</label>
                    <select
                      name="businessType"
                      value={editFormData.businessType || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="proprietorship">Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="pvt-ltd">Private Limited</option>
                      <option value="llp">LLP</option>
                    </select>
                  </div>
                  <div className="pathlab-form-group">
                    <label>Authorized Person</label>
                    <input
                      type="text"
                      name="authorizedPerson"
                      value={editFormData.authorizedPerson || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-edit-actions">
                    <button className="pathlab-save-btn" onClick={handleSaveIdentity}>
                      💾 Save Changes
                    </button>
                    <button className="pathlab-cancel-btn" onClick={handleCancelEdit}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Address Details Section */}
          {activeSection === 'address' && (
            <div className="pathlab-dash-section">
              <div className="pathlab-section-header">
                <h2>📍 Address Details</h2>
                {!isEditingAddress && (
                  <button className="pathlab-edit-btn" onClick={handleEditAddress}>
                    ✏️ Edit
                  </button>
                )}
              </div>

              {!isEditingAddress ? (
                <div className="pathlab-info-display">
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Door No.:</span>
                    <span className="pathlab-value">{pathlabData.doorNo || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Street:</span>
                    <span className="pathlab-value">{pathlabData.street || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Locality:</span>
                    <span className="pathlab-value">{pathlabData.locality || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Landmark:</span>
                    <span className="pathlab-value">{pathlabData.landmark || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">City:</span>
                    <span className="pathlab-value">{pathlabData.city || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">PIN Code:</span>
                    <span className="pathlab-value">{pathlabData.pincode || 'Not provided'}</span>
                  </div>
                </div>
              ) : (
                <div className="pathlab-dash-form-grid">
                  <div className="pathlab-form-group">
                    <label>Door No.</label>
                    <input
                      type="text"
                      name="doorNo"
                      value={editFormData.doorNo || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      value={editFormData.street || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Locality</label>
                    <input
                      type="text"
                      name="locality"
                      value={editFormData.locality || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={editFormData.landmark || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editFormData.city || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      value={editFormData.pincode || ''}
                      onChange={handleInputChange}
                      maxLength="6"
                    />
                  </div>
                  <div className="pathlab-edit-actions">
                    <button className="pathlab-save-btn" onClick={handleSaveAddress}>
                      💾 Save Changes
                    </button>
                    <button className="pathlab-cancel-btn" onClick={handleCancelEdit}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Info Section */}
          {activeSection === 'contact' && (
            <div className="pathlab-dash-section">
              <div className="pathlab-section-header">
                <h2>📞 Contact Information</h2>
                {!isEditingContact && (
                  <button className="pathlab-edit-btn" onClick={handleEditContact}>
                    ✏️ Edit
                  </button>
                )}
              </div>

              {!isEditingContact ? (
                <div className="pathlab-info-display">
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Phone Number:</span>
                    <span className="pathlab-value">{pathlabData.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Landline:</span>
                    <span className="pathlab-value">{pathlabData.landline || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Primary Email:</span>
                    <span className="pathlab-value">{pathlabData.primaryEmail || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Primary Mobile:</span>
                    <span className="pathlab-value">{pathlabData.primaryMobile || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Working Hours:</span>
                    <span className="pathlab-value">{pathlabData.workingHours || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Sample Collection Hours:</span>
                    <span className="pathlab-value">{pathlabData.sampleCollectionHours || 'Not provided'}</span>
                  </div>
                </div>
              ) : (
                <div className="pathlab-dash-form-grid">
                  <div className="pathlab-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editFormData.phoneNumber || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Landline</label>
                    <input
                      type="tel"
                      name="landline"
                      value={editFormData.landline || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Primary Email</label>
                    <input
                      type="email"
                      name="primaryEmail"
                      value={editFormData.primaryEmail || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Primary Mobile</label>
                    <input
                      type="tel"
                      name="primaryMobile"
                      value={editFormData.primaryMobile || ''}
                      onChange={handleInputChange}
                      maxLength="10"
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Working Hours</label>
                    <input
                      type="text"
                      name="workingHours"
                      value={editFormData.workingHours || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-form-group">
                    <label>Sample Collection Hours</label>
                    <input
                      type="text"
                      name="sampleCollectionHours"
                      value={editFormData.sampleCollectionHours || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pathlab-edit-actions">
                    <button className="pathlab-save-btn" onClick={handleSaveContact}>
                      💾 Save Changes
                    </button>
                    <button className="pathlab-cancel-btn" onClick={handleCancelEdit}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Legal Licenses Section */}
          {activeSection === 'licenses' && (
            <div className="pathlab-dash-section">
              <h2>📜 Legal Licenses & Registrations</h2>
              <p className="pathlab-section-desc">Upload and manage your lab's legal documents</p>

              <div className="pathlab-licenses-grid">
                <div className="pathlab-license-card">
                  <h4>Lab Registration Certificate</h4>
                  <p>Upload your lab registration certificate from health authorities</p>
                  <button className="pathlab-upload-btn">📤 Upload Certificate</button>
                </div>
                <div className="pathlab-license-card">
                  <h4>Clinical Establishment Registration</h4>
                  <p>Clinical Establishments (Registration and Regulation) Act certificate</p>
                  <button className="pathlab-upload-btn">📤 Upload Certificate</button>
                </div>
                <div className="pathlab-license-card">
                  <h4>Drugs & Diagnostic License</h4>
                  <p>License for operating diagnostic services and handling samples</p>
                  <button className="pathlab-upload-btn">📤 Upload License</button>
                </div>
                <div className="pathlab-license-card">
                  <h4>GSTIN & PAN</h4>
                  <p>Tax registration documents (GSTIN and PAN card)</p>
                  <button className="pathlab-upload-btn">📤 Upload Documents</button>
                </div>
                <div className="pathlab-license-card">
                  <h4>Owner Identity Proof</h4>
                  <p>Aadhar card, passport, or other government ID of owner</p>
                  <button className="pathlab-upload-btn">📤 Upload ID Proof</button>
                </div>
                <div className="pathlab-license-card">
                  <h4>Other Certifications</h4>
                  <p>Any additional certifications (ISO, NABL, etc.)</p>
                  <button className="pathlab-upload-btn">📤 Upload Certificate</button>
                </div>
              </div>
            </div>
          )}

          {/* Tests Catalog Section */}
          {activeSection === 'tests' && (
            <div className="pathlab-dash-section">
              <div className="pathlab-section-header">
                <h2>🧪 Tests Catalog / Inventory</h2>
                <button className="pathlab-add-btn">+ Add New Test</button>
              </div>
              <p className="pathlab-section-desc">Manage your pathology tests and pricing</p>

              <div className="pathlab-tests-table">
                <table>
                  <thead>
                    <tr>
                      <th>Test Code</th>
                      <th>Test Name</th>
                      <th>Category</th>
                      <th>Specimen</th>
                      <th>Home Collection</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>CBC001</td>
                      <td>Complete Blood Count</td>
                      <td>Hematology</td>
                      <td>Blood</td>
                      <td><span className="pathlab-badge pathlab-yes">Yes</span></td>
                      <td>₹400</td>
                      <td>
                        <button className="pathlab-icon-btn">✏️</button>
                        <button className="pathlab-icon-btn">🗑️</button>
                      </td>
                    </tr>
                    <tr>
                      <td>LFT001</td>
                      <td>Liver Function Test</td>
                      <td>Biochemistry</td>
                      <td>Blood</td>
                      <td><span className="pathlab-badge pathlab-yes">Yes</span></td>
                      <td>₹600</td>
                      <td>
                        <button className="pathlab-icon-btn">✏️</button>
                        <button className="pathlab-icon-btn">🗑️</button>
                      </td>
                    </tr>
                    <tr>
                      <td>KFT001</td>
                      <td>Kidney Function Test</td>
                      <td>Biochemistry</td>
                      <td>Blood</td>
                      <td><span className="pathlab-badge pathlab-yes">Yes</span></td>
                      <td>₹550</td>
                      <td>
                        <button className="pathlab-icon-btn">✏️</button>
                        <button className="pathlab-icon-btn">🗑️</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments & Billing Section */}
          {activeSection === 'payments' && (
            <div className="pathlab-dash-section">
              <h2>💳 Payments, Billing & Invoicing</h2>
              <p className="pathlab-section-desc">Configure payment methods and billing settings</p>

              <div className="pathlab-payments-config">
                <div className="pathlab-config-card">
                  <h3>Payment Modes</h3>
                  <div className="pathlab-checkbox-group">
                    <label><input type="checkbox" checked readOnly /> Cash</label>
                    <label><input type="checkbox" checked readOnly /> Card (Credit/Debit)</label>
                    <label><input type="checkbox" checked readOnly /> UPI</label>
                    <label><input type="checkbox" checked readOnly /> Net Banking</label>
                    <label><input type="checkbox" checked readOnly /> Wallets (Paytm, PhonePe, etc.)</label>
                  </div>
                </div>

                <div className="pathlab-config-card">
                  <h3>Payment Options</h3>
                  <div className="pathlab-checkbox-group">
                    <label><input type="checkbox" checked readOnly /> Prepaid (Pay Online)</label>
                    <label><input type="checkbox" checked readOnly /> Cash on Delivery (COD)</label>
                    <label><input type="checkbox" /> EMI Options</label>
                  </div>
                </div>

                <div className="pathlab-config-card">
                  <h3>Report Delivery</h3>
                  <div className="pathlab-checkbox-group">
                    <label><input type="checkbox" checked readOnly /> Email (PDF)</label>
                    <label><input type="checkbox" checked readOnly /> WhatsApp</label>
                    <label><input type="checkbox" /> SMS Link</label>
                    <label><input type="checkbox" /> Physical Copy</label>
                  </div>
                </div>

                <div className="pathlab-config-card">
                  <h3>Invoice Settings</h3>
                  <div className="pathlab-form-group">
                    <label>Invoice Prefix</label>
                    <input type="text" placeholder="e.g., PL/2024/" />
                  </div>
                  <div className="pathlab-form-group">
                    <label>GST Number</label>
                    <input type="text" placeholder="Enter GST number" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sample Collection Section */}
          {activeSection === 'collection' && (
            <div className="pathlab-dash-section">
              <h2>🏠 Sample Collection Details</h2>
              <p className="pathlab-section-desc">Configure home sample collection service</p>

              <div className="pathlab-collection-config">
                <div className="pathlab-config-card">
                  <h3>Coverage Area</h3>
                  <div className="pathlab-form-group">
                    <label>Service Radius (in km)</label>
                    <input type="number" placeholder="e.g., 10" />
                    <small>Distance from lab for home collection</small>
                  </div>
                  <div className="pathlab-form-group">
                    <label>Covered PIN Codes</label>
                    <textarea rows="4" placeholder="Enter PIN codes separated by commas (e.g., 400001, 400002, 400003)"></textarea>
                  </div>
                </div>

                <div className="pathlab-config-card">
                  <h3>Collection Charges</h3>
                  <div className="pathlab-form-group">
                    <label>Minimum Order Value for Free Collection</label>
                    <input type="number" placeholder="e.g., 500" />
                    <small>Orders above this amount get free home collection</small>
                  </div>
                  <div className="pathlab-form-group">
                    <label>Home Collection Fee (Below Minimum)</label>
                    <input type="number" placeholder="e.g., 100" />
                  </div>
                </div>

                <div className="pathlab-config-card">
                  <h3>Collection Time Slots</h3>
                  <div className="pathlab-checkbox-group">
                    <label><input type="checkbox" checked readOnly /> Morning (6 AM - 12 PM)</label>
                    <label><input type="checkbox" checked readOnly /> Afternoon (12 PM - 4 PM)</label>
                    <label><input type="checkbox" checked readOnly /> Evening (4 PM - 8 PM)</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Orders Section */}
          {activeSection === 'orders' && (
            <div className="pathlab-dash-section">
              <h2>📋 Test Orders</h2>
              <p className="pathlab-section-desc">Manage incoming test orders and track progress</p>

              <div className="pathlab-orders-list">
                {mockOrders.map(order => (
                  <div key={order.id} className="pathlab-order-card">
                    <div className="pathlab-order-header">
                      <span className="pathlab-order-id">{order.id}</span>
                      <span className={`pathlab-status-badge pathlab-status-${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="pathlab-order-details">
                      <p><strong>Patient:</strong> {order.patient}</p>
                      <p><strong>Test:</strong> {order.test}</p>
                      <p><strong>Date:</strong> {order.date}</p>
                    </div>
                    <div className="pathlab-order-actions">
                      <button className="pathlab-btn-small pathlab-primary">View Details</button>
                      <button className="pathlab-btn-small pathlab-secondary">Update Status</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports & Analytics Section */}
          {activeSection === 'reports' && (
            <div className="pathlab-dash-section">
              <h2>📊 Reports & Analytics</h2>
              <p className="pathlab-section-desc">View your lab performance and statistics</p>

              <div className="pathlab-stats-grid">
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">📅</div>
                  <div className="pathlab-stat-info">
                    <h3>This Month</h3>
                    <p className="pathlab-stat-value">₹2.4L</p>
                    <span className="pathlab-stat-change pathlab-positive">+8% vs last month</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">🎯</div>
                  <div className="pathlab-stat-info">
                    <h3>Popular Test</h3>
                    <p className="pathlab-stat-value">CBC</p>
                    <span className="pathlab-stat-change">45 orders this month</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">⭐</div>
                  <div className="pathlab-stat-info">
                    <h3>Customer Rating</h3>
                    <p className="pathlab-stat-value">4.5/5</p>
                    <span className="pathlab-stat-change">Based on 120 reviews</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">🏠</div>
                  <div className="pathlab-stat-info">
                    <h3>Home Collections</h3>
                    <p className="pathlab-stat-value">67%</p>
                    <span className="pathlab-stat-change">Of total orders</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="pathlab-mobile-bottom-nav">
        <button 
          className={`pathlab-bottom-nav-item ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('home')}
        >
          <span className="pathlab-nav-icon">🏠</span>
          <span className="pathlab-nav-label">Home</span>
        </button>
        <button 
          className={`pathlab-bottom-nav-item ${activeSection === 'tests' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('tests')}
        >
          <span className="pathlab-nav-icon">🧪</span>
          <span className="pathlab-nav-label">Tests</span>
        </button>
        <button 
          className={`pathlab-bottom-nav-item ${activeSection === 'orders' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('orders')}
        >
          <span className="pathlab-nav-icon">📋</span>
          <span className="pathlab-nav-label">Orders</span>
        </button>
        <button 
          className={`pathlab-bottom-nav-item ${activeSection === 'identity' ? 'active' : ''}`}
          onClick={() => handleBottomNavClick('profile')}
        >
          <span className="pathlab-nav-icon">👤</span>
          <span className="pathlab-nav-label">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default PathlabDashboard;
