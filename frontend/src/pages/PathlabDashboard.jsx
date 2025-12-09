import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathlabAPI } from '../services/api';
import './PathlabDashboard.css';

const PathlabDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [pathlabData, setPathlabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  
  // Edit states for basic sections
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // States for Licenses section
  const [uploadingFile, setUploadingFile] = useState(false);
  const [documents, setDocuments] = useState([]);

  // States for Tests Catalog section
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [isEditingTest, setIsEditingTest] = useState(false);
  const [editingTestId, setEditingTestId] = useState(null);
  const [testFormData, setTestFormData] = useState({
    testCode: '',
    testName: '',
    category: '',
    specimen: '',
    homeCollection: true,
    price: '',
    description: '',
    duration: ''
  });

  // States for Payments & Billing section
  const [isEditingPayments, setIsEditingPayments] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({});

  // States for Sample Collection section
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [collectionFormData, setCollectionFormData] = useState({});

  // States for Test Orders section
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');

  // States for Reports & Analytics section
  const [isEditingReports, setIsEditingReports] = useState(false);
  const [reportsFormData, setReportsFormData] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user || user.role !== 'pathlab') {
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Fetch pathlab profile from backend
    const loadProfile = async () => {
      try {
        const response = await pathlabAPI.getProfile();
        if (response.success && response.pathlab) {
          setPathlabData(response.pathlab);
          localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        }
        
        // Get profile completion
        const completionResponse = await pathlabAPI.getProfileCompletion();
        if (completionResponse.success) {
          setProfileCompletion(completionResponse.completionPercentage);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Fallback to localStorage if API fails
        const localData = JSON.parse(localStorage.getItem('pathlabData'));
        if (localData) {
          setPathlabData(localData);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
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
    setEditFormData({ 
      ...pathlabData,
      labName: pathlabData.name || pathlabData.labName || '',
      businessType: pathlabData.description || pathlabData.businessType || '',
      authorizedPerson: pathlabData.directorName || pathlabData.authorizedPerson || ''
    });
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
    // Extract doorNo and street from combined street field if needed
    const streetParts = pathlabData.address?.street?.split(',') || [];
    setEditFormData({ 
      ...pathlabData,
      doorNo: streetParts[0]?.trim() || '',
      street: streetParts[1]?.trim() || pathlabData.address?.street || '',
      locality: pathlabData.address?.landmark || pathlabData.locality || '',
      landmark: pathlabData.address?.landmark || pathlabData.landmark || '',
      city: pathlabData.address?.city || pathlabData.city || '',
      pincode: pathlabData.address?.pincode || pathlabData.pincode || ''
    });
  };

  const handleEditContact = () => {
    setIsEditingContact(true);
    setEditFormData({ 
      ...pathlabData,
      phoneNumber: pathlabData.alternatePhone || pathlabData.phoneNumber || '',
      landline: pathlabData.whatsappNumber || pathlabData.landline || '',
      primaryEmail: currentUser?.email || pathlabData.email || '',
      primaryMobile: currentUser?.phone || pathlabData.phone || '',
      workingHours: pathlabData.workingHours || '',
      sampleCollectionHours: pathlabData.sampleCollectionHours || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveIdentity = async () => {
    try {
      const updateData = {
        name: editFormData.labName,
        // Map businessType and authorizedPerson to appropriate fields
        description: editFormData.businessType,
        directorName: editFormData.authorizedPerson
      };
      
      const response = await pathlabAPI.updateSection('identity', updateData);
      
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        setIsEditingIdentity(false);
        alert('Identity details updated successfully!');
        
        // Refresh completion percentage
        const completionResponse = await pathlabAPI.getProfileCompletion();
        if (completionResponse.success) {
          setProfileCompletion(completionResponse.completionPercentage);
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update identity details');
    }
  };

  const handleSaveAddress = async () => {
    try {
      const updateData = {
        address: {
          street: `${editFormData.doorNo}, ${editFormData.street}`,
          landmark: editFormData.locality,
          city: editFormData.city,
          state: editFormData.city, // Can be updated with proper state field
          pincode: editFormData.pincode
        }
      };
      
      const response = await pathlabAPI.updateSection('address', updateData);
      
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        setIsEditingAddress(false);
        alert('Address details updated successfully!');
        
        // Refresh completion percentage
        const completionResponse = await pathlabAPI.getProfileCompletion();
        if (completionResponse.success) {
          setProfileCompletion(completionResponse.completionPercentage);
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update address details');
    }
  };

  const handleSaveContact = async () => {
    try {
      const updateData = {
        // Primary contact fields
        primaryEmail: editFormData.primaryEmail,
        primaryMobile: editFormData.primaryMobile,
        // Phone fields
        alternatePhone: editFormData.phoneNumber,
        phoneNumber: editFormData.phoneNumber,
        whatsappNumber: editFormData.landline,
        landline: editFormData.landline,
        // Working hours
        workingHours: editFormData.workingHours,
        sampleCollectionHours: editFormData.sampleCollectionHours
      };
      
      const response = await pathlabAPI.updateSection('contact', updateData);
      
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        setIsEditingContact(false);
        alert('Contact details updated successfully!');
        
        // Refresh completion percentage
        const completionResponse = await pathlabAPI.getProfileCompletion();
        if (completionResponse.success) {
          setProfileCompletion(completionResponse.completionPercentage);
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update contact details');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingIdentity(false);
    setIsEditingAddress(false);
    setIsEditingContact(false);
    setEditFormData({});
  };

  // ============ LICENSES SECTION HANDLERS ============
  const handleFileUpload = async (e, fieldName, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const response = await pathlabAPI.uploadFile(file, fieldName, docType);
      
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        alert('File uploaded successfully!');
        
        // Reload profile to get updated documents
        const profileResponse = await pathlabAPI.getProfile();
        if (profileResponse.success) {
          setPathlabData(profileResponse.pathlab);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleViewDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('No document available to view');
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await pathlabAPI.deleteDocument(docId);
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        alert('Document deleted successfully!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete document');
    }
  };

  // ============ TESTS CATALOG SECTION HANDLERS ============
  const handleAddTest = () => {
    setIsAddingTest(true);
    setTestFormData({
      testCode: '',
      testName: '',
      category: '',
      specimen: '',
      homeCollection: true,
      price: '',
      description: '',
      duration: ''
    });
  };

  const handleEditTest = (test) => {
    setIsEditingTest(true);
    setEditingTestId(test._id);
    setTestFormData({
      testCode: test.testCode || '',
      testName: test.testName || '',
      category: test.category || '',
      specimen: test.specimen || '',
      homeCollection: test.homeCollection !== false,
      price: test.price || '',
      description: test.description || '',
      duration: test.duration || ''
    });
  };

  const handleTestInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestFormData({
      ...testFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveTest = async () => {
    if (!testFormData.testName || !testFormData.category) {
      alert('Please fill in test name and category');
      return;
    }

    try {
      if (isEditingTest && editingTestId) {
        // Update existing test
        const response = await pathlabAPI.updateTest(editingTestId, testFormData);
        if (response.success) {
          setPathlabData(response.pathlab);
          localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
          alert('Test updated successfully!');
        }
      } else {
        // Add new test
        const response = await pathlabAPI.addTest(testFormData);
        if (response.success) {
          setPathlabData(response.pathlab);
          localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
          alert('Test added successfully!');
        }
      }
      setIsAddingTest(false);
      setIsEditingTest(false);
      setEditingTestId(null);
    } catch (error) {
      console.error('Save test error:', error);
      alert(error.response?.data?.message || 'Failed to save test');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;

    try {
      const response = await pathlabAPI.deleteTest(testId);
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        alert('Test deleted successfully!');
      }
    } catch (error) {
      console.error('Delete test error:', error);
      alert(error.response?.data?.message || 'Failed to delete test');
    }
  };

  const handleCancelTest = () => {
    setIsAddingTest(false);
    setIsEditingTest(false);
    setEditingTestId(null);
  };

  // ============ PAYMENTS & BILLING SECTION HANDLERS ============
  const handleEditPayments = () => {
    setIsEditingPayments(true);
    setPaymentFormData({
      // Payment modes
      paymentModes: pathlabData.paymentModes || {
        cash: true,
        card: true,
        upi: true,
        netBanking: true,
        wallet: true
      },
      // Payment options
      paymentOptions: pathlabData.paymentOptions || {
        prepaid: true,
        cod: true,
        emi: false
      },
      // Report delivery
      reportDelivery: pathlabData.reportDelivery || {
        email: true,
        whatsapp: true,
        sms: false,
        physical: false
      },
      // Invoice settings
      invoicePrefix: pathlabData.invoicePrefix || '',
      gstNumber: pathlabData.gstNumber || '',
      gstEnabled: pathlabData.gstEnabled || false,
      // Bank details
      bankDetails: pathlabData.bankDetails || {
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        accountType: 'Current'
      },
      upiId: pathlabData.upiId || ''
    });
  };

  const handlePaymentInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPaymentFormData({
        ...paymentFormData,
        [parent]: {
          ...paymentFormData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setPaymentFormData({
        ...paymentFormData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSavePayments = async () => {
    try {
      const response = await pathlabAPI.updateSection('payment', paymentFormData);
      
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        setIsEditingPayments(false);
        alert('Payment settings updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update payment settings');
    }
  };

  const handleCancelPayments = () => {
    setIsEditingPayments(false);
  };

  // ============ SAMPLE COLLECTION SECTION HANDLERS ============
  const handleEditCollection = () => {
    setIsEditingCollection(true);
    setCollectionFormData({
      homeCollectionAvailable: pathlabData.homeCollectionAvailable !== false,
      serviceRadius: pathlabData.serviceRadius || '',
      coveredPinCodes: pathlabData.coveredPinCodes?.join(', ') || '',
      homeCollectionCharges: pathlabData.homeCollectionCharges || '',
      freeCollectionMinOrder: pathlabData.freeCollectionMinOrder || '',
      collectionTimeSlots: pathlabData.collectionTimeSlots || {
        morning: true,
        afternoon: true,
        evening: true
      }
    });
  };

  const handleCollectionInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCollectionFormData({
        ...collectionFormData,
        [parent]: {
          ...collectionFormData[parent],
          [child]: checked
        }
      });
    } else {
      setCollectionFormData({
        ...collectionFormData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSaveCollection = async () => {
    try {
      const updateData = {
        ...collectionFormData,
        // Convert comma-separated PIN codes to array
        coveredPinCodes: collectionFormData.coveredPinCodes 
          ? collectionFormData.coveredPinCodes.split(',').map(pin => pin.trim()).filter(pin => pin)
          : []
      };

      const response = await pathlabAPI.updateSection('collection', updateData);
      
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        setIsEditingCollection(false);
        alert('Collection settings updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update collection settings');
    }
  };

  const handleCancelCollection = () => {
    setIsEditingCollection(false);
  };

  // ============ TEST ORDERS SECTION HANDLERS ============
  const handleUpdateOrderStatus = (orderId, currentStatus) => {
    setUpdatingOrderId(orderId);
    setNewOrderStatus(currentStatus);
  };

  const handleSaveOrderStatus = () => {
    // In a real implementation, this would call API to update order status
    alert(`Status updated to: ${newOrderStatus}\n\nIn a real implementation, this would update the database.`);
    setUpdatingOrderId(null);
    setNewOrderStatus('');
  };

  const handleCancelOrderStatus = () => {
    setUpdatingOrderId(null);
    setNewOrderStatus('');
  };

  // ============ REPORTS & ANALYTICS SECTION HANDLERS ============
  const handleEditReports = () => {
    setIsEditingReports(true);
    setReportsFormData({
      registrationNumber: pathlabData.registrationNumber || '',
      licenseNumber: pathlabData.licenseNumber || '',
      NABLAccreditation: pathlabData.NABLAccreditation || '',
      totalStaff: pathlabData.totalStaff || '',
      isActive: pathlabData.isActive !== false
    });
  };

  const handleReportsInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReportsFormData({
      ...reportsFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveReports = async () => {
    try {
      const response = await pathlabAPI.updateSection('reports', reportsFormData);
      
      if (response.success) {
        setPathlabData(response.pathlab);
        localStorage.setItem('pathlabData', JSON.stringify(response.pathlab));
        setIsEditingReports(false);
        alert('Lab information updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update lab information');
    }
  };

  const handleCancelReports = () => {
    setIsEditingReports(false);
  };

  // Mock data for orders
  const mockOrders = [
    { id: 'ORD001', patient: 'Rajesh Kumar', test: 'Complete Blood Count (CBC)', status: 'Pending', date: '2024-01-15' },
    { id: 'ORD002', patient: 'Priya Sharma', test: 'Liver Function Test (LFT)', status: 'Completed', date: '2024-01-14' },
    { id: 'ORD003', patient: 'Amit Patel', test: 'Kidney Function Test (KFT)', status: 'Sample Collected', date: '2024-01-13' }
  ];

  if (loading || !currentUser) {
    return <div className="pathlab-loading">Loading...</div>;
  }
  
  if (!pathlabData) {
    return <div className="pathlab-loading">No profile data found. Please complete registration.</div>;
  }

  return (
    <div className="pathlab-dashboard">
      {/* Sidebar */}
      <div className={`pathlab-sidebar ${isMobileMenuOpen ? 'pathlab-mobile-open' : ''}`}>
        <div className="pathlab-sidebar-header">
          <div className="pathlab-header-content">
            {/* <div className="pathlab-logo">🔬</div> */}
            <div className='logo'>
    <img src="/images/cosco.png" alt="logo" />

            </div>
             
            {/* <h2>{pathlabData.labName || 'Pathlab'}</h2> */}
            <p>{pathlabData.address?.city || pathlabData.city || 'Not specified'}</p>
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
          <h1>Welcome, {pathlabData.name || pathlabData.labName || 'Pathlab'}! 👋</h1>
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
                    <span className="pathlab-value">{pathlabData.name || pathlabData.labName || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Business Type:</span>
                    <span className="pathlab-value">{pathlabData.description || pathlabData.businessType || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Authorized Person:</span>
                    <span className="pathlab-value">{pathlabData.directorName || pathlabData.authorizedPerson || 'Not provided'}</span>
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
                    <span className="pathlab-value">{pathlabData.address?.street?.split(',')[0] || pathlabData.doorNo || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Street:</span>
                    <span className="pathlab-value">{pathlabData.address?.street || pathlabData.street || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Locality:</span>
                    <span className="pathlab-value">{pathlabData.address?.landmark || pathlabData.locality || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Landmark:</span>
                    <span className="pathlab-value">{pathlabData.address?.landmark || pathlabData.landmark || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">City:</span>
                    <span className="pathlab-value">{pathlabData.address?.city || pathlabData.city || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">PIN Code:</span>
                    <span className="pathlab-value">{pathlabData.address?.pincode || pathlabData.pincode || 'Not provided'}</span>
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
                    <span className="pathlab-value">{pathlabData.alternatePhone || pathlabData.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Landline:</span>
                    <span className="pathlab-value">{pathlabData.whatsappNumber || pathlabData.landline || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Primary Email:</span>
                    <span className="pathlab-value">{pathlabData.email || currentUser?.email || 'Not provided'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Primary Mobile:</span>
                    <span className="pathlab-value">{pathlabData.phone || currentUser?.phone || 'Not provided'}</span>
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
                  <div className="pathlab-license-actions">
                    <label className="pathlab-upload-btn">
                      📤 Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'labRegistrationCert', 'Lab Registration Certificate')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploadingFile}
                      />
                    </label>
                    {pathlabData.labRegistrationCert && (
                      <button 
                        className="pathlab-view-btn" 
                        onClick={() => handleViewDocument(pathlabData.labRegistrationCert)}
                      >
                        👁️ View
                      </button>
                    )}
                  </div>
                  {pathlabData.labRegistrationCert && (
                    <small className="pathlab-uploaded-status">✓ Uploaded</small>
                  )}
                </div>

                <div className="pathlab-license-card">
                  <h4>Clinical Establishment Registration</h4>
                  <p>Clinical Establishments (Registration and Regulation) Act certificate</p>
                  <div className="pathlab-license-actions">
                    <label className="pathlab-upload-btn">
                      📤 Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'clinicalEstablishmentCert', 'Clinical Establishment Cert')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploadingFile}
                      />
                    </label>
                    {pathlabData.clinicalEstablishmentCert && (
                      <button 
                        className="pathlab-view-btn" 
                        onClick={() => handleViewDocument(pathlabData.clinicalEstablishmentCert)}
                      >
                        👁️ View
                      </button>
                    )}
                  </div>
                  {pathlabData.clinicalEstablishmentCert && (
                    <small className="pathlab-uploaded-status">✓ Uploaded</small>
                  )}
                </div>

                <div className="pathlab-license-card">
                  <h4>Drugs & Diagnostic License</h4>
                  <p>License for operating diagnostic services and handling samples</p>
                  <div className="pathlab-license-actions">
                    <label className="pathlab-upload-btn">
                      📤 Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'drugsDiagnosticLicense', 'Drugs & Diagnostic License')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploadingFile}
                      />
                    </label>
                    {pathlabData.drugsDiagnosticLicense && (
                      <button 
                        className="pathlab-view-btn" 
                        onClick={() => handleViewDocument(pathlabData.drugsDiagnosticLicense)}
                      >
                        👁️ View
                      </button>
                    )}
                  </div>
                  {pathlabData.drugsDiagnosticLicense && (
                    <small className="pathlab-uploaded-status">✓ Uploaded</small>
                  )}
                </div>

                <div className="pathlab-license-card">
                  <h4>GST Document</h4>
                  <p>GST registration certificate</p>
                  <div className="pathlab-license-actions">
                    <label className="pathlab-upload-btn">
                      📤 Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'gstDocument', 'GST Document')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploadingFile}
                      />
                    </label>
                    {pathlabData.gstDocument && (
                      <button 
                        className="pathlab-view-btn" 
                        onClick={() => handleViewDocument(pathlabData.gstDocument)}
                      >
                        👁️ View
                      </button>
                    )}
                  </div>
                  {pathlabData.gstDocument && (
                    <small className="pathlab-uploaded-status">✓ Uploaded</small>
                  )}
                </div>

                <div className="pathlab-license-card">
                  <h4>PAN Document</h4>
                  <p>PAN card copy</p>
                  <div className="pathlab-license-actions">
                    <label className="pathlab-upload-btn">
                      📤 Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'panDocument', 'PAN Document')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploadingFile}
                      />
                    </label>
                    {pathlabData.panDocument && (
                      <button 
                        className="pathlab-view-btn" 
                        onClick={() => handleViewDocument(pathlabData.panDocument)}
                      >
                        👁️ View
                      </button>
                    )}
                  </div>
                  {pathlabData.panDocument && (
                    <small className="pathlab-uploaded-status">✓ Uploaded</small>
                  )}
                </div>

                <div className="pathlab-license-card">
                  <h4>Owner Identity Proof</h4>
                  <p>Aadhar card, passport, or other government ID of owner</p>
                  <div className="pathlab-license-actions">
                    <label className="pathlab-upload-btn">
                      📤 Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'ownerIdProof', 'Owner ID Proof')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploadingFile}
                      />
                    </label>
                    {pathlabData.ownerIdProof && (
                      <button 
                        className="pathlab-view-btn" 
                        onClick={() => handleViewDocument(pathlabData.ownerIdProof)}
                      >
                        👁️ View
                      </button>
                    )}
                  </div>
                  {pathlabData.ownerIdProof && (
                    <small className="pathlab-uploaded-status">✓ Uploaded</small>
                  )}
                </div>

                <div className="pathlab-license-card">
                  <h4>NABL Certificate</h4>
                  <p>NABL accreditation certificate (if applicable)</p>
                  <div className="pathlab-license-actions">
                    <label className="pathlab-upload-btn">
                      📤 Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'NABLCertificate', 'NABL Certificate')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploadingFile}
                      />
                    </label>
                    {pathlabData.NABLCertificate && (
                      <button 
                        className="pathlab-view-btn" 
                        onClick={() => handleViewDocument(pathlabData.NABLCertificate)}
                      >
                        👁️ View
                      </button>
                    )}
                  </div>
                  {pathlabData.NABLCertificate && (
                    <small className="pathlab-uploaded-status">✓ Uploaded</small>
                  )}
                </div>

                <div className="pathlab-license-card">
                  <h4>ISO Certificate</h4>
                  <p>ISO certification (if applicable)</p>
                  <div className="pathlab-license-actions">
                    <label className="pathlab-upload-btn">
                      📤 Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, 'ISOCertificate', 'ISO Certificate')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploadingFile}
                      />
                    </label>
                    {pathlabData.ISOCertificate && (
                      <button 
                        className="pathlab-view-btn" 
                        onClick={() => handleViewDocument(pathlabData.ISOCertificate)}
                      >
                        👁️ View
                      </button>
                    )}
                  </div>
                  {pathlabData.ISOCertificate && (
                    <small className="pathlab-uploaded-status">✓ Uploaded</small>
                  )}
                </div>
              </div>

              {uploadingFile && (
                <div className="pathlab-upload-progress">
                  <p>Uploading file... Please wait.</p>
                </div>
              )}
            </div>
          )}

          {/* Tests Catalog Section */}
          {activeSection === 'tests' && (
            <div className="pathlab-dash-section">
              <div className="pathlab-section-header">
                <h2>🧪 Tests Catalog / Inventory</h2>
                {!isAddingTest && !isEditingTest && (
                  <button className="pathlab-add-btn" onClick={handleAddTest}>+ Add New Test</button>
                )}
              </div>
              <p className="pathlab-section-desc">Manage your pathology tests and pricing</p>

              {/* Add/Edit Test Form */}
              {(isAddingTest || isEditingTest) && (
                <div className="pathlab-test-form">
                  <h3>{isEditingTest ? 'Edit Test' : 'Add New Test'}</h3>
                  <div className="pathlab-dash-form-grid">
                    <div className="pathlab-form-group">
                      <label>Test Code</label>
                      <input
                        type="text"
                        name="testCode"
                        value={testFormData.testCode}
                        onChange={handleTestInputChange}
                        placeholder="e.g., CBC001"
                      />
                    </div>
                    <div className="pathlab-form-group">
                      <label>Test Name *</label>
                      <input
                        type="text"
                        name="testName"
                        value={testFormData.testName}
                        onChange={handleTestInputChange}
                        placeholder="e.g., Complete Blood Count"
                        required
                      />
                    </div>
                    <div className="pathlab-form-group">
                      <label>Category *</label>
                      <select
                        name="category"
                        value={testFormData.category}
                        onChange={handleTestInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Hematology">Hematology</option>
                        <option value="Biochemistry">Biochemistry</option>
                        <option value="Microbiology">Microbiology</option>
                        <option value="Serology">Serology</option>
                        <option value="Pathology">Pathology</option>
                        <option value="Radiology">Radiology</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="pathlab-form-group">
                      <label>Specimen</label>
                      <select
                        name="specimen"
                        value={testFormData.specimen}
                        onChange={handleTestInputChange}
                      >
                        <option value="">Select Specimen</option>
                        <option value="Blood">Blood</option>
                        <option value="Urine">Urine</option>
                        <option value="Stool">Stool</option>
                        <option value="Saliva">Saliva</option>
                        <option value="Tissue">Tissue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="pathlab-form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={testFormData.price}
                        onChange={handleTestInputChange}
                        placeholder="e.g., 400"
                      />
                    </div>
                    <div className="pathlab-form-group">
                      <label>Report Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={testFormData.duration}
                        onChange={handleTestInputChange}
                        placeholder="e.g., 24 hours"
                      />
                    </div>
                    <div className="pathlab-form-group full-width">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={testFormData.description}
                        onChange={handleTestInputChange}
                        placeholder="Brief description of the test"
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="pathlab-form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="homeCollection"
                          checked={testFormData.homeCollection}
                          onChange={handleTestInputChange}
                        />
                        {' '}Home Collection Available
                      </label>
                    </div>
                  </div>
                  <div className="pathlab-edit-actions">
                    <button className="pathlab-save-btn" onClick={handleSaveTest}>
                      💾 Save Test
                    </button>
                    <button className="pathlab-cancel-btn" onClick={handleCancelTest}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Tests Table */}
              {!isAddingTest && !isEditingTest && (
                <div className="pathlab-tests-table">
                  {pathlabData.testsCatalog && pathlabData.testsCatalog.length > 0 ? (
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
                        {pathlabData.testsCatalog.map((test) => (
                          <tr key={test._id}>
                            <td>{test.testCode || '-'}</td>
                            <td>{test.testName}</td>
                            <td>{test.category}</td>
                            <td>{test.specimen || '-'}</td>
                            <td>
                              <span className={`pathlab-badge ${test.homeCollection ? 'pathlab-yes' : 'pathlab-no'}`}>
                                {test.homeCollection ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td>₹{test.price || 0}</td>
                            <td>
                              <button 
                                className="pathlab-icon-btn" 
                                onClick={() => handleEditTest(test)}
                                title="Edit Test"
                              >
                                ✏️
                              </button>
                              <button 
                                className="pathlab-icon-btn" 
                                onClick={() => handleDeleteTest(test._id)}
                                title="Delete Test"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="pathlab-empty-state">
                      <p>No tests added yet. Click "Add New Test" to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Payments & Billing Section */}
          {activeSection === 'payments' && (
            <div className="pathlab-dash-section">
              <div className="pathlab-section-header">
                <h2>💳 Payments, Billing & Invoicing</h2>
                {!isEditingPayments && (
                  <button className="pathlab-edit-btn" onClick={handleEditPayments}>
                    ✏️ Edit
                  </button>
                )}
              </div>
              <p className="pathlab-section-desc">Configure payment methods and billing settings</p>

              {!isEditingPayments ? (
                <div className="pathlab-payments-config">
                  <div className="pathlab-config-card">
                    <h3>Payment Modes</h3>
                    <div className="pathlab-info-display">
                      <p>Cash: {pathlabData.paymentModes?.cash ? '✓ Enabled' : '✗ Disabled'}</p>
                      <p>Card: {pathlabData.paymentModes?.card ? '✓ Enabled' : '✗ Disabled'}</p>
                      <p>UPI: {pathlabData.paymentModes?.upi ? '✓ Enabled' : '✗ Disabled'}</p>
                      <p>Net Banking: {pathlabData.paymentModes?.netBanking ? '✓ Enabled' : '✗ Disabled'}</p>
                      <p>Wallet: {pathlabData.paymentModes?.wallet ? '✓ Enabled' : '✗ Disabled'}</p>
                    </div>
                  </div>

                  <div className="pathlab-config-card">
                    <h3>Invoice Settings</h3>
                    <div className="pathlab-info-display">
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">Invoice Prefix:</span>
                        <span className="pathlab-value">{pathlabData.invoicePrefix || 'Not set'}</span>
                      </div>
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">GST Number:</span>
                        <span className="pathlab-value">{pathlabData.gstNumber || 'Not set'}</span>
                      </div>
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">GST Enabled:</span>
                        <span className="pathlab-value">{pathlabData.gstEnabled ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pathlab-config-card">
                    <h3>Bank Details</h3>
                    <div className="pathlab-info-display">
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">Account Holder:</span>
                        <span className="pathlab-value">{pathlabData.bankDetails?.accountHolderName || 'Not set'}</span>
                      </div>
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">Account Number:</span>
                        <span className="pathlab-value">{pathlabData.bankDetails?.accountNumber || 'Not set'}</span>
                      </div>
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">IFSC Code:</span>
                        <span className="pathlab-value">{pathlabData.bankDetails?.ifscCode || 'Not set'}</span>
                      </div>
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">Bank Name:</span>
                        <span className="pathlab-value">{pathlabData.bankDetails?.bankName || 'Not set'}</span>
                      </div>
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">UPI ID:</span>
                        <span className="pathlab-value">{pathlabData.upiId || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pathlab-payments-edit-form">
                  <div className="pathlab-dash-form-grid">
                    <div className="pathlab-config-card">
                      <h3>Payment Modes</h3>
                      <div className="pathlab-checkbox-group">
                        <label>
                          <input 
                            type="checkbox" 
                            name="paymentModes.cash"
                            checked={paymentFormData.paymentModes?.cash}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}Cash
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="paymentModes.card"
                            checked={paymentFormData.paymentModes?.card}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}Card (Credit/Debit)
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="paymentModes.upi"
                            checked={paymentFormData.paymentModes?.upi}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}UPI
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="paymentModes.netBanking"
                            checked={paymentFormData.paymentModes?.netBanking}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}Net Banking
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="paymentModes.wallet"
                            checked={paymentFormData.paymentModes?.wallet}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}Wallets
                        </label>
                      </div>
                    </div>

                    <div className="pathlab-config-card">
                      <h3>Payment Options</h3>
                      <div className="pathlab-checkbox-group">
                        <label>
                          <input 
                            type="checkbox" 
                            name="paymentOptions.prepaid"
                            checked={paymentFormData.paymentOptions?.prepaid}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}Prepaid (Pay Online)
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="paymentOptions.cod"
                            checked={paymentFormData.paymentOptions?.cod}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}Cash on Delivery (COD)
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="paymentOptions.emi"
                            checked={paymentFormData.paymentOptions?.emi}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}EMI Options
                        </label>
                      </div>
                    </div>

                    <div className="pathlab-config-card">
                      <h3>Report Delivery</h3>
                      <div className="pathlab-checkbox-group">
                        <label>
                          <input 
                            type="checkbox" 
                            name="reportDelivery.email"
                            checked={paymentFormData.reportDelivery?.email}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}Email (PDF)
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="reportDelivery.whatsapp"
                            checked={paymentFormData.reportDelivery?.whatsapp}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}WhatsApp
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="reportDelivery.sms"
                            checked={paymentFormData.reportDelivery?.sms}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}SMS Link
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            name="reportDelivery.physical"
                            checked={paymentFormData.reportDelivery?.physical}
                            onChange={handlePaymentInputChange}
                          />
                          {' '}Physical Copy
                        </label>
                      </div>
                    </div>

                    <div className="pathlab-form-group">
                      <label>Invoice Prefix</label>
                      <input 
                        type="text" 
                        name="invoicePrefix"
                        value={paymentFormData.invoicePrefix}
                        onChange={handlePaymentInputChange}
                        placeholder="e.g., PL/2024/" 
                      />
                    </div>

                    <div className="pathlab-form-group">
                      <label>GST Number</label>
                      <input 
                        type="text" 
                        name="gstNumber"
                        value={paymentFormData.gstNumber}
                        onChange={handlePaymentInputChange}
                        placeholder="Enter GST number" 
                      />
                    </div>

                    <div className="pathlab-form-group">
                      <label>
                        <input 
                          type="checkbox" 
                          name="gstEnabled"
                          checked={paymentFormData.gstEnabled}
                          onChange={handlePaymentInputChange}
                        />
                        {' '}Enable GST
                      </label>
                    </div>

                    <h3 className="pathlab-section-title full-width">Bank Details</h3>

                    <div className="pathlab-form-group">
                      <label>Account Holder Name</label>
                      <input 
                        type="text" 
                        name="bankDetails.accountHolderName"
                        value={paymentFormData.bankDetails?.accountHolderName}
                        onChange={handlePaymentInputChange}
                        placeholder="Account holder name" 
                      />
                    </div>

                    <div className="pathlab-form-group">
                      <label>Account Number</label>
                      <input 
                        type="text" 
                        name="bankDetails.accountNumber"
                        value={paymentFormData.bankDetails?.accountNumber}
                        onChange={handlePaymentInputChange}
                        placeholder="Account number" 
                      />
                    </div>

                    <div className="pathlab-form-group">
                      <label>IFSC Code</label>
                      <input 
                        type="text" 
                        name="bankDetails.ifscCode"
                        value={paymentFormData.bankDetails?.ifscCode}
                        onChange={handlePaymentInputChange}
                        placeholder="IFSC code" 
                      />
                    </div>

                    <div className="pathlab-form-group">
                      <label>Bank Name</label>
                      <input 
                        type="text" 
                        name="bankDetails.bankName"
                        value={paymentFormData.bankDetails?.bankName}
                        onChange={handlePaymentInputChange}
                        placeholder="Bank name" 
                      />
                    </div>

                    <div className="pathlab-form-group">
                      <label>Branch Name</label>
                      <input 
                        type="text" 
                        name="bankDetails.branchName"
                        value={paymentFormData.bankDetails?.branchName}
                        onChange={handlePaymentInputChange}
                        placeholder="Branch name" 
                      />
                    </div>

                    <div className="pathlab-form-group">
                      <label>Account Type</label>
                      <select
                        name="bankDetails.accountType"
                        value={paymentFormData.bankDetails?.accountType}
                        onChange={handlePaymentInputChange}
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                      </select>
                    </div>

                    <div className="pathlab-form-group full-width">
                      <label>UPI ID</label>
                      <input 
                        type="text" 
                        name="upiId"
                        value={paymentFormData.upiId}
                        onChange={handlePaymentInputChange}
                        placeholder="e.g., yourname@paytm" 
                      />
                    </div>
                  </div>

                  <div className="pathlab-edit-actions">
                    <button className="pathlab-save-btn" onClick={handleSavePayments}>
                      💾 Save Settings
                    </button>
                    <button className="pathlab-cancel-btn" onClick={handleCancelPayments}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sample Collection Section */}
          {activeSection === 'collection' && (
            <div className="pathlab-dash-section">
              <div className="pathlab-section-header">
                <h2>🏠 Sample Collection Details</h2>
                {!isEditingCollection && (
                  <button className="pathlab-edit-btn" onClick={handleEditCollection}>
                    ✏️ Edit
                  </button>
                )}
              </div>
              <p className="pathlab-section-desc">Configure home sample collection service</p>

              {!isEditingCollection ? (
                <div className="pathlab-collection-config">
                  <div className="pathlab-config-card">
                    <h3>Service Availability</h3>
                    <div className="pathlab-info-display">
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">Home Collection:</span>
                        <span className="pathlab-value">{pathlabData.homeCollectionAvailable !== false ? 'Available' : 'Not Available'}</span>
                      </div>
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">Service Radius:</span>
                        <span className="pathlab-value">{pathlabData.serviceRadius ? `${pathlabData.serviceRadius} km` : 'Not set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pathlab-config-card">
                    <h3>Charges</h3>
                    <div className="pathlab-info-display">
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">Collection Fee:</span>
                        <span className="pathlab-value">₹{pathlabData.homeCollectionCharges || 0}</span>
                      </div>
                      <div className="pathlab-info-item">
                        <span className="pathlab-label">Free Collection Above:</span>
                        <span className="pathlab-value">₹{pathlabData.freeCollectionMinOrder || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pathlab-config-card">
                    <h3>Time Slots</h3>
                    <div className="pathlab-info-display">
                      <p>Morning: {pathlabData.collectionTimeSlots?.morning !== false ? '✓ Available' : '✗ Not Available'}</p>
                      <p>Afternoon: {pathlabData.collectionTimeSlots?.afternoon !== false ? '✓ Available' : '✗ Not Available'}</p>
                      <p>Evening: {pathlabData.collectionTimeSlots?.evening !== false ? '✓ Available' : '✗ Not Available'}</p>
                    </div>
                  </div>

                  {pathlabData.coveredPinCodes && pathlabData.coveredPinCodes.length > 0 && (
                    <div className="pathlab-config-card">
                      <h3>Covered PIN Codes</h3>
                      <p>{pathlabData.coveredPinCodes.join(', ')}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pathlab-collection-edit-form">
                  <div className="pathlab-dash-form-grid">
                    <div className="pathlab-form-group">
                      <label>
                        <input 
                          type="checkbox" 
                          name="homeCollectionAvailable"
                          checked={collectionFormData.homeCollectionAvailable}
                          onChange={handleCollectionInputChange}
                        />
                        {' '}Home Collection Available
                      </label>
                    </div>

                    <div className="pathlab-form-group">
                      <label>Service Radius (in km)</label>
                      <input 
                        type="number" 
                        name="serviceRadius"
                        value={collectionFormData.serviceRadius}
                        onChange={handleCollectionInputChange}
                        placeholder="e.g., 10" 
                      />
                      <small>Distance from lab for home collection</small>
                    </div>

                    <div className="pathlab-form-group full-width">
                      <label>Covered PIN Codes</label>
                      <textarea 
                        name="coveredPinCodes"
                        value={collectionFormData.coveredPinCodes}
                        onChange={handleCollectionInputChange}
                        rows="4" 
                        placeholder="Enter PIN codes separated by commas (e.g., 400001, 400002, 400003)"
                      ></textarea>
                    </div>

                    <div className="pathlab-form-group">
                      <label>Home Collection Fee (₹)</label>
                      <input 
                        type="number" 
                        name="homeCollectionCharges"
                        value={collectionFormData.homeCollectionCharges}
                        onChange={handleCollectionInputChange}
                        placeholder="e.g., 100" 
                      />
                    </div>

                    <div className="pathlab-form-group">
                      <label>Minimum Order Value for Free Collection (₹)</label>
                      <input 
                        type="number" 
                        name="freeCollectionMinOrder"
                        value={collectionFormData.freeCollectionMinOrder}
                        onChange={handleCollectionInputChange}
                        placeholder="e.g., 500" 
                      />
                      <small>Orders above this amount get free home collection</small>
                    </div>

                    <h3 className="pathlab-section-title full-width">Collection Time Slots</h3>

                    <div className="pathlab-checkbox-group">
                      <label>
                        <input 
                          type="checkbox" 
                          name="collectionTimeSlots.morning"
                          checked={collectionFormData.collectionTimeSlots?.morning}
                          onChange={handleCollectionInputChange}
                        />
                        {' '}Morning (6 AM - 12 PM)
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          name="collectionTimeSlots.afternoon"
                          checked={collectionFormData.collectionTimeSlots?.afternoon}
                          onChange={handleCollectionInputChange}
                        />
                        {' '}Afternoon (12 PM - 4 PM)
                      </label>
                      <label>
                        <input 
                          type="checkbox" 
                          name="collectionTimeSlots.evening"
                          checked={collectionFormData.collectionTimeSlots?.evening}
                          onChange={handleCollectionInputChange}
                        />
                        {' '}Evening (4 PM - 8 PM)
                      </label>
                    </div>
                  </div>

                  <div className="pathlab-edit-actions">
                    <button className="pathlab-save-btn" onClick={handleSaveCollection}>
                      💾 Save Settings
                    </button>
                    <button className="pathlab-cancel-btn" onClick={handleCancelCollection}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
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

                    {updatingOrderId === order.id ? (
                      // Status Update Dropdown
                      <div className="pathlab-order-status-update">
                        <label>
                          <strong>Update Status:</strong>
                          <select 
                            value={newOrderStatus} 
                            onChange={(e) => setNewOrderStatus(e.target.value)}
                            className="pathlab-status-dropdown"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Sample Collected">Sample Collected</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </label>
                        <div className="pathlab-status-actions">
                          <button 
                            className="pathlab-btn-small pathlab-primary"
                            onClick={handleSaveOrderStatus}
                          >
                            Save
                          </button>
                          <button 
                            className="pathlab-btn-small pathlab-secondary"
                            onClick={handleCancelOrderStatus}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Normal Action Buttons
                      <div className="pathlab-order-actions">
                        <button 
                          className="pathlab-btn-small pathlab-primary"
                          onClick={() => alert(`View details for order ${order.id}\n\nPatient: ${order.patient}\nTest: ${order.test}\nDate: ${order.date}\nStatus: ${order.status}`)}
                        >
                          View Details
                        </button>
                        <button 
                          className="pathlab-btn-small pathlab-secondary"
                          onClick={() => handleUpdateOrderStatus(order.id, order.status)}
                        >
                          Update Status
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports & Analytics Section */}
          {activeSection === 'reports' && (
            <div className="pathlab-dash-section">
              <div className="pathlab-section-header">
                <div>
                  <h2>📊 Reports & Analytics</h2>
                  <p className="pathlab-section-desc">View your lab performance and statistics</p>
                </div>
                {!isEditingReports && (
                  <button className="pathlab-edit-btn" onClick={handleEditReports}>
                    ✏️ Edit Lab Info
                  </button>
                )}
              </div>

              <div className="pathlab-stats-grid">
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">🧪</div>
                  <div className="pathlab-stat-info">
                    <h3>Total Tests</h3>
                    <p className="pathlab-stat-value">{pathlabData.totalTests || 0}</p>
                    <span className="pathlab-stat-change">Tests conducted</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">👥</div>
                  <div className="pathlab-stat-info">
                    <h3>Total Patients</h3>
                    <p className="pathlab-stat-value">{pathlabData.totalPatients || 0}</p>
                    <span className="pathlab-stat-change">Patients served</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">⭐</div>
                  <div className="pathlab-stat-info">
                    <h3>Lab Rating</h3>
                    <p className="pathlab-stat-value">{pathlabData.rating || 0}/5</p>
                    <span className="pathlab-stat-change">Based on {pathlabData.totalReviews || 0} reviews</span>
                  </div>
                </div>
                <div className="pathlab-stat-card">
                  <div className="pathlab-stat-icon">📋</div>
                  <div className="pathlab-stat-info">
                    <h3>Tests Catalog</h3>
                    <p className="pathlab-stat-value">{pathlabData.testsCatalog?.length || 0}</p>
                    <span className="pathlab-stat-change">Tests available</span>
                  </div>
                </div>
              </div>

              <div className="pathlab-info-section">
                <h3>Lab Information</h3>
                {isEditingReports ? (
                  <div className="pathlab-edit-form">
                    <div className="pathlab-form-grid">
                      <div className="pathlab-form-group">
                        <label>Registration Number</label>
                        <input
                          type="text"
                          name="registrationNumber"
                          value={reportsFormData.registrationNumber}
                          onChange={handleReportsInputChange}
                          placeholder="Enter registration number"
                        />
                      </div>
                      <div className="pathlab-form-group">
                        <label>License Number</label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={reportsFormData.licenseNumber}
                          onChange={handleReportsInputChange}
                          placeholder="Enter license number"
                        />
                      </div>
                      <div className="pathlab-form-group">
                        <label>NABL Accreditation</label>
                        <input
                          type="text"
                          name="NABLAccreditation"
                          value={reportsFormData.NABLAccreditation}
                          onChange={handleReportsInputChange}
                          placeholder="Enter NABL accreditation"
                        />
                      </div>
                      <div className="pathlab-form-group">
                        <label>Total Staff</label>
                        <input
                          type="number"
                          name="totalStaff"
                          value={reportsFormData.totalStaff}
                          onChange={handleReportsInputChange}
                          placeholder="Enter total staff count"
                        />
                      </div>
                      <div className="pathlab-form-group pathlab-checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={reportsFormData.isActive}
                            onChange={handleReportsInputChange}
                          />
                          Account is Active
                        </label>
                      </div>
                    </div>
                    <div className="pathlab-edit-actions">
                      <button className="pathlab-save-btn" onClick={handleSaveReports}>
                        💾 Save Changes
                      </button>
                      <button className="pathlab-cancel-btn" onClick={handleCancelReports}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pathlab-info-display">
                    <div className="pathlab-info-item">
                      <span className="pathlab-label">Lab Name:</span>
                      <span className="pathlab-value">{pathlabData.name || pathlabData.labName || 'Not set'}</span>
                    </div>
                    <div className="pathlab-info-item">
                      <span className="pathlab-label">Business Type:</span>
                      <span className="pathlab-value">{pathlabData.businessType || 'Not set'}</span>
                    </div>
                    <div className="pathlab-info-item">
                      <span className="pathlab-label">Registration Number:</span>
                      <span className="pathlab-value">{pathlabData.registrationNumber || 'Not set'}</span>
                    </div>
                    <div className="pathlab-info-item">
                      <span className="pathlab-label">License Number:</span>
                      <span className="pathlab-value">{pathlabData.licenseNumber || 'Not set'}</span>
                    </div>
                    <div className="pathlab-info-item">
                      <span className="pathlab-label">NABL Accreditation:</span>
                      <span className="pathlab-value">{pathlabData.NABLAccreditation || 'Not accredited'}</span>
                    </div>
                    <div className="pathlab-info-item">
                      <span className="pathlab-label">Profile Completion:</span>
                      <span className="pathlab-value">{profileCompletion}%</span>
                    </div>
                    <div className="pathlab-info-item">
                      <span className="pathlab-label">Verification Status:</span>
                      <span className="pathlab-value">{pathlabData.verificationStatus || 'pending'}</span>
                    </div>
                    <div className="pathlab-info-item">
                      <span className="pathlab-label">Account Status:</span>
                      <span className="pathlab-value">{pathlabData.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pathlab-info-section">
                <h3>Services & Facilities</h3>
                <div className="pathlab-info-display">
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Services Offered:</span>
                    <span className="pathlab-value">{pathlabData.services?.length || 0} services</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Facilities:</span>
                    <span className="pathlab-value">{pathlabData.facilities?.length || 0} facilities</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Equipment:</span>
                    <span className="pathlab-value">{pathlabData.equipment?.length || 0} equipment types</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Total Staff:</span>
                    <span className="pathlab-value">{pathlabData.totalStaff || 'Not set'}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Pathologists:</span>
                    <span className="pathlab-value">{pathlabData.pathologists?.length || 0}</span>
                  </div>
                  <div className="pathlab-info-item">
                    <span className="pathlab-label">Home Collection:</span>
                    <span className="pathlab-value">{pathlabData.homeCollectionAvailable !== false ? 'Available' : 'Not Available'}</span>
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
