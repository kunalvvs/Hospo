import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { chemistAPI } from '../services/api';
import socketService from '../services/socket';
import './ChemistDashboard.css';

const ChemistDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [chemistData, setChemistData] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Edit mode states for each section
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingLicense, setIsEditingLicense] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [isEditingPayments, setIsEditingPayments] = useState(false);
  const [editedData, setEditedData] = useState({});
  
  // Inventory management states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [newProduct, setNewProduct] = useState({
    productId: '',
    medicineName: '',
    genericName: '',
    manufacturer: '',
    formulation: '',
    strength: '',
    packDescription: '',
    mrp: '',
    price: '',
    costPrice: '',
    gstSlab: '',
    discount: '',
    quantity: '',
    offerTag: '',
    category: '',
    subCategory: '',
    prescriptionRequired: false,
    productStatus: 'active',
    mainImage: '',
    additionalImages: [],
    howToUse: '',
    dosageInformation: '',
    safetyInformation: ''
  });
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState({ type: 'in', productIndex: null, quantity: '', reason: '' });
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPrescription, setFilterPrescription] = useState('');
  
  // Medicine name suggestions based on existing inventory
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);
  
  // Update suggestions when inventory changes
  React.useEffect(() => {
    if (chemistData?.inventory && chemistData.inventory.length > 0) {
      const uniqueMedicines = [...new Set(chemistData.inventory.map(item => item.medicineName))];
      setMedicineSuggestions(uniqueMedicines);
    }
  }, [chemistData?.inventory]);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fetch chemist orders
  const fetchChemistOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await chemistAPI.getChemistOrders();
      
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching chemist orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch chemist profile from backend
  const fetchChemistData = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await chemistAPI.getProfile();
      
      if (response.success) {
        setChemistData(response.data);
        setCurrentUser(response.data);
        setLoading(false);
      } else {
        console.error('Failed to fetch chemist data:', response.message);
        // Try to get from localStorage as fallback
        const storedData = localStorage.getItem('chemistData');
        if (storedData) {
          setChemistData(JSON.parse(storedData));
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching chemist data:', error);
      
      // Fallback to localStorage if API fails
      const userString = localStorage.getItem('currentUser');
      const chemistDataString = localStorage.getItem('chemistData');
      
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          if (userData.role !== 'chemist') {
            alert('Access denied. This page is only for chemists/pharmacies.');
            navigate('/');
            return;
          }
          setCurrentUser(userData);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      if (chemistDataString) {
        try {
          setChemistData(JSON.parse(chemistDataString));
        } catch (e) {
          console.error('Error parsing chemist data:', e);
        }
      }
      
      setLoading(false);
      
      // Show error but don't block access
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchChemistData();
    fetchChemistOrders();
    
    // Check if there's a state with activeSection
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }

    // Setup Socket.IO for real-time order notifications
    if (chemistData?._id) {
      console.log('🔌 Connecting to Socket.IO for chemist:', chemistData._id);
      socketService.connect(chemistData._id, 'chemist');

      // Listen for new orders
      socketService.onNewOrder((orderData) => {
        console.log('🆕 New order received:', orderData);
        
        // Show notification
        alert(`New Order! Order #${orderData.orderNumber} - ₹${orderData.totalAmount}`);
        
        // Refresh orders
        fetchChemistOrders();
      });

      // Cleanup on unmount
      return () => {
        socketService.offNewOrder();
        socketService.disconnect();
      };
    }
  }, [navigate, location, chemistData?._id]);

  const handleLogout = () => {
    // Disconnect socket before logout
    socketService.disconnect();
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('chemistData');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // File upload handler
  const handleFileUpload = async (file, fieldName) => {
    if (!file) return null;

    try {
      setUploading(true);
      const response = await chemistAPI.uploadFile(file, fieldName);
      
      if (response.success) {
        // Update local state with new file URL
        setChemistData(prev => ({
          ...prev,
          [fieldName]: response.fileUrl
        }));
        alert('File uploaded successfully!');
        return response.fileUrl;
      } else {
        alert(response.message || 'File upload failed');
        return null;
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert(error.response?.data?.message || 'File upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Edit mode handlers
  const handleEdit = (section) => {
    setEditedData({...chemistData});
    if (section === 'identity') setIsEditingIdentity(true);
    else if (section === 'address') setIsEditingAddress(true);
    else if (section === 'contact') setIsEditingContact(true);
    else if (section === 'license') setIsEditingLicense(true);
    else if (section === 'bank') setIsEditingBank(true);
    else if (section === 'hours') setIsEditingHours(true);
    else if (section === 'services') setIsEditingServices(true);
    else if (section === 'payments') setIsEditingPayments(true);
  };

  const handleCancelEdit = (section) => {
    if (section === 'identity') setIsEditingIdentity(false);
    else if (section === 'address') setIsEditingAddress(false);
    else if (section === 'contact') setIsEditingContact(false);
    else if (section === 'license') setIsEditingLicense(false);
    else if (section === 'bank') setIsEditingBank(false);
    else if (section === 'hours') setIsEditingHours(false);
    else if (section === 'services') setIsEditingServices(false);
    else if (section === 'payments') setIsEditingPayments(false);
    setEditedData({});
  };

  const handleSaveEdit = async (section) => {
    try {
      let response;
      
      if (section === 'identity') {
        const updateData = {
          pharmacyName: editedData.pharmacyName,
          businessType: editedData.businessType,
          tagline: editedData.tagline,
          description: editedData.description,
          establishedYear: editedData.establishedYear
        };
        response = await chemistAPI.updateSection('identity', updateData);
        setIsEditingIdentity(false);
      } 
      else if (section === 'address') {
        const updateData = {
          shopNumber: editedData.shopNumber,
          building: editedData.building,
          locality: editedData.locality,
          city: editedData.city,
          state: editedData.state,
          pin: editedData.pin,
          landmark: editedData.landmark,
          latitude: editedData.latitude,
          longitude: editedData.longitude,
          branches: editedData.branches
        };
        response = await chemistAPI.updateSection('address', updateData);
        setIsEditingAddress(false);
      }
      else if (section === 'contact') {
        const updateData = {
          primaryPhone: editedData.primaryPhone,
          mobile: editedData.mobile,
          whatsappNumber: editedData.whatsappNumber,
          contactEmail: editedData.contactEmail,
          website: editedData.website,
          facebook: editedData.facebook,
          instagram: editedData.instagram,
          twitter: editedData.twitter
        };
        response = await chemistAPI.updateSection('contact', updateData);
        setIsEditingContact(false);
      }
      else if (section === 'license') {
        const updateData = {
          drugLicenseNumber: editedData.drugLicenseNumber,
          drugLicenseCertificate: editedData.drugLicenseCertificate,
          drugLicenseExpiry: editedData.drugLicenseExpiry,
          gstNumber: editedData.gstNumber,
          gstCertificate: editedData.gstCertificate,
          panNumber: editedData.panNumber,
          panCard: editedData.panCard,
          shopLicense: editedData.shopLicense,
          ownerIdentityProof: editedData.ownerIdentityProof,
          pharmacistRegistrationNumber: editedData.pharmacistRegistrationNumber,
          pharmacistCertificate: editedData.pharmacistCertificate
        };
        response = await chemistAPI.updateSection('license', updateData);
        setIsEditingLicense(false);
      }
      else if (section === 'bank') {
        const updateData = {
          accountDetails: editedData.accountDetails || {
            accountNumber: editedData.accountNumber,
            ifscCode: editedData.ifscCode,
            bankName: editedData.bankName,
            branchName: editedData.branchName,
            accountHolderName: editedData.accountHolderName,
            accountType: editedData.accountType,
            upiId: editedData.upiId
          }
        };
        response = await chemistAPI.updateSection('bank', updateData);
        setIsEditingBank(false);
      }
      else if (section === 'hours') {
        const updateData = {
          operatingHours: editedData.operatingHours || {},
          is24x7: editedData.is24x7 || false,
          deliveryStartTime: editedData.deliveryStartTime || '',
          deliveryEndTime: editedData.deliveryEndTime || '',
          nightServiceAvailable: editedData.nightServiceAvailable || false
        };
        console.log('Saving hours data:', updateData);
        response = await chemistAPI.updateSection('hours', updateData);
        setIsEditingHours(false);
      }
      else if (section === 'services') {
        const updateData = {
          services: editedData.services || {},
          serviceSettings: editedData.serviceSettings || {}
        };
        response = await chemistAPI.updateSection('services', updateData);
        setIsEditingServices(false);
      }
      else if (section === 'payments') {
        const updateData = {
          paymentSettings: editedData.paymentSettings || {},
          accountDetails: editedData.accountDetails || {},
          upiId: editedData.upiId
        };
        console.log('Saving payment data:', updateData);
        console.log('Account details being sent:', editedData.accountDetails);
        response = await chemistAPI.updateSection('payments', updateData);
        setIsEditingPayments(false);
      }
      
      if (response && response.success) {
        setChemistData(response.data);
        // Update localStorage as backup
        localStorage.setItem('chemistData', JSON.stringify(response.data));
        setEditedData({});
        alert('Details updated successfully!');
        
        // Refresh data from backend
        await fetchChemistData();
      } else {
        alert(response?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      alert(error.response?.data?.message || 'Failed to update. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Inventory management handlers
  const handleProductInputChange = (field, value) => {
    if (editingProduct !== null) {
      setEditingProduct(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      productId: '',
      medicineName: '',
      genericName: '',
      manufacturer: '',
      formulation: '',
      strength: '',
      packDescription: '',
      mrp: '',
      price: '',
      costPrice: '',
      gstSlab: '',
      discount: '',
      quantity: '',
      offerTag: '',
      category: '',
      subCategory: '',
      prescriptionRequired: false,
      productStatus: 'active',
      mainImage: '',
      additionalImages: [],
      howToUse: '',
      dosageInformation: '',
      safetyInformation: ''
    });
    setEditingProduct(null);
    setEditingProductIndex(null);
  };

  const handleProductImageUpload = async (file, fieldName) => {
    try {
      setUploading(true);
      const uploadedUrl = await handleFileUpload(file, fieldName);
      if (uploadedUrl) {
        if (fieldName === 'mainImage') {
          if (editingProduct !== null) {
            setEditingProduct(prev => ({ ...prev, mainImage: uploadedUrl }));
          } else {
            setNewProduct(prev => ({ ...prev, mainImage: uploadedUrl }));
          }
        } else if (fieldName.startsWith('additionalImage')) {
          if (editingProduct !== null) {
            setEditingProduct(prev => ({
              ...prev,
              additionalImages: [...(prev.additionalImages || []), uploadedUrl]
            }));
          } else {
            setNewProduct(prev => ({
              ...prev,
              additionalImages: [...(prev.additionalImages || []), uploadedUrl]
            }));
          }
        }
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAdditionalImage = (index) => {
    if (editingProduct !== null) {
      setEditingProduct(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter((_, i) => i !== index)
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleAddProduct = async () => {
    try {
      const productData = editingProduct || newProduct;
      
      if (!productData.medicineName || !productData.mrp || !productData.price) {
        alert('Please fill in required fields: Medicine Name, MRP, and Selling Price');
        return;
      }
      
      const currentInventory = chemistData?.inventory || [];
      let updatedInventory;

      if (editingProductIndex !== null) {
        // Update existing product
        updatedInventory = currentInventory.map((item, index) =>
          index === editingProductIndex ? { ...productData, lastUpdated: new Date() } : item
        );
      } else {
        // Add new product
        updatedInventory = [...currentInventory, {
          ...productData,
          addedDate: new Date(),
          lastUpdated: new Date()
        }];
      }
      
      const response = await chemistAPI.updateSection('inventory', { inventory: updatedInventory });
      
      if (response.success) {
        setChemistData(response.data);
        localStorage.setItem('chemistData', JSON.stringify(response.data));
        
        alert(editingProductIndex !== null ? 'Product updated successfully!' : 'Product added successfully!');
        resetProductForm();
        setShowAddProduct(false);
        setShowProductList(true);
      } else {
        alert(response.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEditProduct = (index) => {
    const product = chemistData?.inventory[index];
    if (product) {
      setEditingProduct({ ...product });
      setEditingProductIndex(index);
      setShowAddProduct(true);
      setShowProductList(false);
    }
  };
  
  const handleDeleteProduct = async (index) => {
    try {
      if (!confirm('Are you sure you want to delete this product?')) return;
      
      const currentInventory = chemistData?.inventory || [];
      const updatedInventory = currentInventory.filter((_, i) => i !== index);
      
      const response = await chemistAPI.updateSection('inventory', { inventory: updatedInventory });
      
      if (response.success) {
        setChemistData(response.data);
        localStorage.setItem('chemistData', JSON.stringify(response.data));
        alert('Product deleted successfully!');
      } else {
        alert(response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleStockUpdate = async () => {
    try {
      if (!stockAction.quantity || stockAction.quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
      }

      const currentInventory = chemistData?.inventory || [];
      const product = currentInventory[stockAction.productIndex];

      if (!product) {
        alert('Product not found');
        return;
      }

      const quantityChange = stockAction.type === 'in' 
        ? parseInt(stockAction.quantity) 
        : -parseInt(stockAction.quantity);

      const newQuantity = (product.quantity || 0) + quantityChange;

      if (newQuantity < 0) {
        alert('Insufficient stock for this operation');
        return;
      }

      const stockHistoryEntry = {
        type: stockAction.type,
        quantity: parseInt(stockAction.quantity),
        reason: stockAction.reason,
        date: new Date(),
        updatedBy: chemistData.name || 'Admin'
      };

      const updatedInventory = currentInventory.map((item, index) => {
        if (index === stockAction.productIndex) {
          return {
            ...item,
            quantity: newQuantity,
            stockHistory: [...(item.stockHistory || []), stockHistoryEntry],
            lastUpdated: new Date()
          };
        }
        return item;
      });

      const response = await chemistAPI.updateSection('inventory', { inventory: updatedInventory });

      if (response.success) {
        setChemistData(response.data);
        localStorage.setItem('chemistData', JSON.stringify(response.data));
        alert(`Stock ${stockAction.type === 'in' ? 'added' : 'removed'} successfully!`);
        setShowStockModal(false);
        setStockAction({ type: 'in', productIndex: null, quantity: '', reason: '' });
      } else {
        alert(response.message || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert(error.response?.data?.message || 'Failed to update stock');
    }
  };

  const openStockModal = (index, type) => {
    setStockAction({ type, productIndex: index, quantity: '', reason: '' });
    setShowStockModal(true);
  };

  // Filter inventory based on search and filter criteria
  const getFilteredInventory = () => {
    if (!chemistData?.inventory) return [];
    
    let filtered = chemistData.inventory;
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.medicineName?.toLowerCase().includes(query) ||
        product.genericName?.toLowerCase().includes(query) ||
        product.manufacturer?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.subCategory?.toLowerCase().includes(query) ||
        product.productId?.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(product => product.category === filterCategory);
    }
    
    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(product => product.productStatus === filterStatus);
    }
    
    // Apply prescription filter
    if (filterPrescription === 'yes') {
      filtered = filtered.filter(product => product.prescriptionRequired === true);
    } else if (filterPrescription === 'no') {
      filtered = filtered.filter(product => product.prescriptionRequired === false);
    }
    
    return filtered;
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
        background: '#234f83',
        color:'#fff'
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
                    <p className="stat-number">{ordersLoading ? '...' : orders.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🕐</div>
                  <div className="stat-info">
                    <h3>Pending</h3>
                    <p className="stat-number">{ordersLoading ? '...' : orders.filter(o => o.status === 'pending').length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>Processing</h3>
                    <p className="stat-number">{ordersLoading ? '...' : orders.filter(o => ['accepted', 'processing', 'ready', 'out-for-delivery'].includes(o.status)).length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Completed</h3>
                    <p className="stat-number">{ordersLoading ? '...' : orders.filter(o => o.status === 'delivered').length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="recent-orders">
                <h3>Recent Orders</h3>
                {ordersLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.slice(0, 10).map((order) => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <h4>{order.user?.name || 'Customer'}</h4>
                          <span className={`status-badge ${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                          </span>
                        </div>
                        <div className="order-details">
                          <p>💊 <strong>Order #:</strong> {order.orderNumber}</p>
                          <p>💊 <strong>Items:</strong> {order.medicines.map(m => m.medicineName).join(', ')}</p>
                          <p>💰 <strong>Amount:</strong> ₹{order.totalAmount}</p>
                          <p>📅 {new Date(order.createdAt).toLocaleDateString('en-IN')} • ⏰ {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                          {order.deliveryAddress && (
                            <p>📍 <strong>Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                          )}
                        </div>
                        <div className="order-actions">
                          <button className="btn-secondary">View Details</button>
                          {order.status === 'pending' && (
                            <button className="btn-primary">Accept Order</button>
                          )}
                          {['accepted', 'processing'].includes(order.status) && (
                            <button className="btn-primary">Update Status</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    {chemistData?.logo && (
                      <div className="info-row full-width" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img 
                          src={chemistData.logo} 
                          alt="Pharmacy Logo" 
                          style={{ 
                            maxWidth: '200px', 
                            maxHeight: '200px', 
                            objectFit: 'contain',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            padding: '10px'
                          }} 
                        />
                      </div>
                    )}
                    <div className="info-row">
                      <label>Pharmacy Name:</label>
                      <span>{chemistData?.pharmacyName || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Business Type:</label>
                      <span>{chemistData?.businessType || 'Not provided'}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Tagline:</label>
                      <span>{chemistData?.tagline || 'Not provided'}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Description:</label>
                      <span>{chemistData?.description || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Established Year:</label>
                      <span>{chemistData?.establishedYear || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEdit('identity')}>Edit Identity</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Pharmacy Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'logo');
                            if (url) {
                              setEditedData(prev => ({
                                ...prev,
                                logo: url
                              }));
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      {editedData.logo && (
                        <div style={{ marginTop: '10px' }}>
                          <img 
                            src={editedData.logo} 
                            alt="Logo Preview" 
                            style={{ 
                              maxWidth: '150px', 
                              maxHeight: '150px', 
                              objectFit: 'contain',
                              border: '2px solid #ddd',
                              borderRadius: '8px',
                              padding: '5px'
                            }} 
                          />
                        </div>
                      )}
                    </div>

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
                        <option value="retail-pharmacy">Retail Pharmacy</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="online-pharmacy">Online Pharmacy</option>
                        <option value="franchise">Franchise</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Tagline</label>
                      <input
                        type="text"
                        value={editedData.tagline || ''}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        placeholder="Brief description (1-2 lines)"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={editedData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Detailed description of your pharmacy"
                        rows="4"
                      />
                    </div>
                    <div className="form-group">
                      <label>Established Year</label>
                      <input
                        type="text"
                        value={editedData.establishedYear || ''}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                        placeholder="e.g., 2010"
                        maxLength="4"
                      />
                    </div>
                  </div>

                  {uploading && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#234f83' }}>
                      Uploading file...
                    </div>
                  )}

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit('identity')} disabled={uploading}>
                      Save Changes
                    </button>
                    <button className="btn-secondary" onClick={() => handleCancelEdit('identity')} disabled={uploading}>
                      Cancel
                    </button>
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

          {/* Working Hours Section */}
          {activeSection === 'hours' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🕐 Working Hours & Delivery Timings</h2>
                <p>Set your operating hours and delivery schedules</p>
              </div>
              
              {!isEditingHours ? (
                <>
                  <div className="info-grid">
                    <div className="info-row full-width">
                      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Daily Operating Hours</h3>
                    </div>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day} className="info-row">
                        <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                        <span>
                          {chemistData?.operatingHours?.[day]?.open && chemistData?.operatingHours?.[day]?.close
                            ? `${chemistData.operatingHours[day].open} - ${chemistData.operatingHours[day].close}`
                            : 'Not set'}
                        </span>
                      </div>
                    ))}
                    <div className="info-row">
                      <label>24×7 Available:</label>
                      <span>{chemistData?.is24x7 ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Night Service Available:</label>
                      <span>{chemistData?.nightServiceAvailable ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Home Delivery Windows</h3>
                    </div>
                    <div className="info-row">
                      <label>Delivery Start Time:</label>
                      <span>{chemistData?.deliveryStartTime || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Delivery End Time:</label>
                      <span>{chemistData?.deliveryEndTime || 'Not set'}</span>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEdit('hours')}>Edit Working Hours</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Daily Operating Hours</h3>
                    </div>

                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day} className="form-group">
                        <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                        <div className="time-input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="time" 
                            value={editedData.operatingHours?.[day]?.open || ''} 
                            onChange={(e) => setEditedData(prev => ({
                              ...prev, 
                              operatingHours: {
                                ...prev.operatingHours, 
                                [day]: {...prev.operatingHours?.[day], open: e.target.value}
                              }
                            }))}
                          />
                          <span>to</span>
                          <input 
                            type="time" 
                            value={editedData.operatingHours?.[day]?.close || ''} 
                            onChange={(e) => setEditedData(prev => ({
                              ...prev, 
                              operatingHours: {
                                ...prev.operatingHours, 
                                [day]: {...prev.operatingHours?.[day], close: e.target.value}
                              }
                            }))}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={editedData.is24x7 || false}
                          onChange={(e) => handleInputChange('is24x7', e.target.checked)}
                        />
                        24×7 Available
                      </label>
                    </div>

                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={editedData.nightServiceAvailable || false}
                          onChange={(e) => handleInputChange('nightServiceAvailable', e.target.checked)}
                        />
                        Night Service Available (Special hours)
                      </label>
                    </div>

                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Home Delivery Windows</h3>
                    </div>

                    <div className="form-group">
                      <label>Delivery Start Time</label>
                      <input 
                        type="time" 
                        value={editedData.deliveryStartTime || ''}
                        onChange={(e) => handleInputChange('deliveryStartTime', e.target.value)}
                        placeholder="e.g., 09:00" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Delivery End Time</label>
                      <input 
                        type="time" 
                        value={editedData.deliveryEndTime || ''}
                        onChange={(e) => handleInputChange('deliveryEndTime', e.target.value)}
                        placeholder="e.g., 21:00" 
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit('hours')}>Save Hours</button>
                    <button className="btn-secondary" onClick={() => handleCancelEdit('hours')}>Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Licenses & Registration Section (Optional but important) */}
          {activeSection === 'licenses' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📜 Licenses & Registration</h2>
                <p>Upload your legal documents and certifications</p>
              </div>
              
              {!isEditingLicense ? (
                <>
                  <div className="info-grid">
                    <div className="info-row">
                      <label>Drug License Number:</label>
                      <span>{chemistData?.drugLicenseNumber || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Drug License Certificate:</label>
                      {chemistData?.drugLicenseCertificate ? (
                        <button 
                          className="btn-link" 
                          onClick={() => {
                            const newWindow = window.open(chemistData.drugLicenseCertificate, '_blank');
                            if (!newWindow) alert('Please allow popups to view files');
                          }}
                        >
                          View Document
                        </button>
                      ) : (
                        <span>Not uploaded</span>
                      )}
                    </div>
                    <div className="info-row">
                      <label>GST Number:</label>
                      <span>{chemistData?.gstNumber || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>GST Certificate:</label>
                      {chemistData?.gstCertificate ? (
                        <button 
                          className="btn-link" 
                          onClick={() => {
                            const newWindow = window.open(chemistData.gstCertificate, '_blank');
                            if (!newWindow) alert('Please allow popups to view files');
                          }}
                        >
                          View Document
                        </button>
                      ) : (
                        <span>Not uploaded</span>
                      )}
                    </div>
                    <div className="info-row">
                      <label>PAN Number:</label>
                      <span>{chemistData?.panNumber || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>PAN Card:</label>
                      {chemistData?.panCard ? (
                        <button 
                          className="btn-link" 
                          onClick={() => {
                            const newWindow = window.open(chemistData.panCard, '_blank');
                            if (!newWindow) alert('Please allow popups to view files');
                          }}
                        >
                          View Document
                        </button>
                      ) : (
                        <span>Not uploaded</span>
                      )}
                    </div>
                    <div className="info-row">
                      <label>Shop License:</label>
                      {chemistData?.shopLicense ? (
                        <button 
                          className="btn-link" 
                          onClick={() => {
                            const newWindow = window.open(chemistData.shopLicense, '_blank');
                            if (!newWindow) alert('Please allow popups to view files');
                          }}
                        >
                          View Document
                        </button>
                      ) : (
                        <span>Not uploaded</span>
                      )}
                    </div>
                    <div className="info-row">
                      <label>Owner/Manager Identity Proof:</label>
                      {chemistData?.ownerIdentityProof ? (
                        <button 
                          className="btn-link" 
                          onClick={() => {
                            const newWindow = window.open(chemistData.ownerIdentityProof, '_blank');
                            if (!newWindow) alert('Please allow popups to view files');
                          }}
                        >
                          View Document
                        </button>
                      ) : (
                        <span>Not uploaded</span>
                      )}
                    </div>
                    <div className="info-row">
                      <label>Pharmacist Registration Number:</label>
                      <span>{chemistData?.pharmacistRegistrationNumber || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Pharmacist Registration Certificate:</label>
                      {chemistData?.pharmacistCertificate ? (
                        <button 
                          className="btn-link" 
                          onClick={() => {
                            const newWindow = window.open(chemistData.pharmacistCertificate, '_blank');
                            if (!newWindow) alert('Please allow popups to view files');
                          }}
                        >
                          View Document
                        </button>
                      ) : (
                        <span>Not uploaded</span>
                      )}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEdit('license')}>Edit License Details</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Drug License Number *</label>
                      <input 
                        type="text" 
                        value={editedData.drugLicenseNumber || ''}
                        onChange={(e) => handleInputChange('drugLicenseNumber', e.target.value)}
                        placeholder="State Drug Control Authority License" 
                      />
                      <small>Form 20/21/22 depending on state</small>
                    </div>

                    <div className="form-group full-width">
                      <label>Upload Drug License *</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'drugLicenseCertificate');
                            if (url) {
                              setEditedData(prev => ({
                                ...prev,
                                drugLicenseCertificate: url
                              }));
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      {editedData.drugLicenseCertificate && (
                        <small>
                          Current: <a href={editedData.drugLicenseCertificate} target="_blank" rel="noopener noreferrer">View File</a>
                        </small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>GST Registration Number</label>
                      <input 
                        type="text" 
                        value={editedData.gstNumber || ''}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        placeholder="GSTIN (if applicable)" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Upload GST Certificate</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'gstCertificate');
                            if (url) {
                              setEditedData(prev => ({
                                ...prev,
                                gstCertificate: url
                              }));
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      {editedData.gstCertificate && (
                        <small>
                          Current: <a href={editedData.gstCertificate} target="_blank" rel="noopener noreferrer">View File</a>
                        </small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>PAN Number</label>
                      <input 
                        type="text" 
                        value={editedData.panNumber || ''}
                        onChange={(e) => handleInputChange('panNumber', e.target.value)}
                        placeholder="PAN card number" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Upload PAN Card</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'panCard');
                            if (url) {
                              setEditedData(prev => ({
                                ...prev,
                                panCard: url
                              }));
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      {editedData.panCard && (
                        <small>
                          Current: <a href={editedData.panCard} target="_blank" rel="noopener noreferrer">View File</a>
                        </small>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Shop Establishment Certificate</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'shopLicense');
                            if (url) {
                              setEditedData(prev => ({
                                ...prev,
                                shopLicense: url
                              }));
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      <small>Trade license or rent deed</small>
                      {editedData.shopLicense && (
                        <small>
                          Current: <a href={editedData.shopLicense} target="_blank" rel="noopener noreferrer">View File</a>
                        </small>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Owner/Manager Identity Proof</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'ownerIdentityProof');
                            if (url) {
                              setEditedData(prev => ({
                                ...prev,
                                ownerIdentityProof: url
                              }));
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      <small>Aadhar Card / Voter ID / Driving License</small>
                      {editedData.ownerIdentityProof && (
                        <small>
                          Current: <a href={editedData.ownerIdentityProof} target="_blank" rel="noopener noreferrer">View File</a>
                        </small>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Pharmacist Registration Number</label>
                      <input 
                        type="text" 
                        value={editedData.pharmacistRegistrationNumber || ''}
                        onChange={(e) => handleInputChange('pharmacistRegistrationNumber', e.target.value)}
                        placeholder="State Pharmacy Council Registration" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Pharmacist Registration Certificate</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'pharmacistCertificate');
                            if (url) {
                              setEditedData(prev => ({
                                ...prev,
                                pharmacistCertificate: url
                              }));
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      {editedData.pharmacistCertificate && (
                        <small>
                          Current: <a href={editedData.pharmacistCertificate} target="_blank" rel="noopener noreferrer">View File</a>
                        </small>
                      )}
                    </div>
                  </div>

                  {uploading && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#234f83' }}>
                      Uploading file...
                    </div>
                  )}

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit('license')} disabled={uploading}>
                      Save Changes
                    </button>
                    <button className="btn-secondary" onClick={() => handleCancelEdit('license')} disabled={uploading}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Services & Facilities Section */}
          {activeSection === 'services' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🚚 Services & Facilities Offered</h2>
                <p>Configure your service offerings and policies</p>
              </div>
              
              {!isEditingServices ? (
                <>
                  <div className="info-grid">
                    <div className="info-row full-width">
                      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Available Services</h3>
                    </div>
                    <div className="info-row">
                      <label>Prescription Fulfilment:</label>
                      <span>{chemistData?.services?.prescriptionFulfilment ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Home Delivery:</label>
                      <span>{chemistData?.services?.homeDelivery ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Same-day Delivery:</label>
                      <span>{chemistData?.services?.sameDayDelivery ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Scheduled Delivery:</label>
                      <span>{chemistData?.services?.scheduledDelivery ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Online Ordering:</label>
                      <span>{chemistData?.services?.onlineOrdering ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Prepaid Orders:</label>
                      <span>{chemistData?.services?.prepaidOrders ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Cash on Delivery:</label>
                      <span>{chemistData?.services?.cashOnDelivery ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>24x7 Service:</label>
                      <span>{chemistData?.services?.twentyFourSeven ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Surgical Items:</label>
                      <span>{chemistData?.services?.surgicalItems ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Ayurvedic Medicines:</label>
                      <span>{chemistData?.services?.ayurvedic ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Service Settings</h3>
                    </div>
                    <div className="info-row">
                      <label>Medicine Substitutions:</label>
                      <span>{chemistData?.serviceSettings?.substitutionAllowed || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Accept Online Orders:</label>
                      <span>{chemistData?.serviceSettings?.onlineOrderAccept || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Order Cutoff Time:</label>
                      <span>{chemistData?.serviceSettings?.orderCutoffTime || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Max Delivery Radius:</label>
                      <span>{chemistData?.serviceSettings?.maxDeliveryRadius ? `${chemistData.serviceSettings.maxDeliveryRadius} km` : 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Minimum Order Value:</label>
                      <span>{chemistData?.serviceSettings?.minimumOrderValue ? `₹${chemistData.serviceSettings.minimumOrderValue}` : 'Not set'}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Refund Policy:</label>
                      <span>{chemistData?.serviceSettings?.refundPolicy || 'Not provided'}</span>
                    </div>
                    <div className="info-row full-width">
                      <label>Prescription Verification Policy:</label>
                      <span>{chemistData?.serviceSettings?.prescriptionVerificationPolicy || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEdit('services')}>Edit Services</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Available Services</h3>
                    </div>

                    <div className="form-group full-width">
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.prescriptionFulfilment || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, prescriptionFulfilment: e.target.checked}
                            }))}
                          />
                          Prescription Fulfilment (In-store)
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.homeDelivery || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, homeDelivery: e.target.checked}
                            }))}
                          />
                          Home Delivery
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.sameDayDelivery || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, sameDayDelivery: e.target.checked}
                            }))}
                          />
                          Same-day Delivery
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.scheduledDelivery || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, scheduledDelivery: e.target.checked}
                            }))}
                          />
                          Scheduled Delivery
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.onlineOrdering || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, onlineOrdering: e.target.checked}
                            }))}
                          />
                          Online Order
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.prepaidOrders || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, prepaidOrders: e.target.checked}
                            }))}
                          />
                          Prepaid Orders
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.cashOnDelivery || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, cashOnDelivery: e.target.checked}
                            }))}
                          />
                          Cash on Delivery (COD)
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.twentyFourSeven || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, twentyFourSeven: e.target.checked}
                            }))}
                          />
                          24x7 Available
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.surgicalItems || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, surgicalItems: e.target.checked}
                            }))}
                          />
                          Surgical Items
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.services?.ayurvedic || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              services: {...prev.services, ayurvedic: e.target.checked}
                            }))}
                          />
                          Ayurvedic Medicines
                        </label>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Service Settings</h3>
                    </div>

                    <div className="form-group">
                      <label>Medicine Substitutions Allowed?</label>
                      <select 
                        value={editedData.serviceSettings?.substitutionAllowed || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          serviceSettings: {...prev.serviceSettings, substitutionAllowed: e.target.value}
                        }))}
                      >
                        <option value="">Select</option>
                        <option value="Yes, with customer approval">Yes, with customer approval</option>
                        <option value="No, exact prescription only">No, exact prescription only</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Accept Online Orders?</label>
                      <select 
                        value={editedData.serviceSettings?.onlineOrderAccept || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          serviceSettings: {...prev.serviceSettings, onlineOrderAccept: e.target.value}
                        }))}
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Order Cutoff Time</label>
                      <input 
                        type="time" 
                        value={editedData.serviceSettings?.orderCutoffTime || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          serviceSettings: {...prev.serviceSettings, orderCutoffTime: e.target.value}
                        }))}
                        placeholder="e.g., 20:00" 
                      />
                      <small>Last time to accept orders</small>
                    </div>

                    <div className="form-group">
                      <label>Maximum Delivery Radius (km)</label>
                      <input 
                        type="number" 
                        value={editedData.serviceSettings?.maxDeliveryRadius || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          serviceSettings: {...prev.serviceSettings, maxDeliveryRadius: e.target.value}
                        }))}
                        placeholder="e.g., 5, 10" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Minimum Order Value</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={editedData.serviceSettings?.minimumOrderValue || ''}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            serviceSettings: {...prev.serviceSettings, minimumOrderValue: e.target.value}
                          }))}
                          placeholder="Minimum amount" 
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Refund / Return Policy</label>
                      <textarea 
                        rows="3" 
                        value={editedData.serviceSettings?.refundPolicy || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          serviceSettings: {...prev.serviceSettings, refundPolicy: e.target.value}
                        }))}
                        placeholder="Describe your refund and return policy..."
                      ></textarea>
                    </div>

                    <div className="form-group full-width">
                      <label>Prescription Verification Policy</label>
                      <textarea 
                        rows="3" 
                        value={editedData.serviceSettings?.prescriptionVerificationPolicy || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          serviceSettings: {...prev.serviceSettings, prescriptionVerificationPolicy: e.target.value}
                        }))}
                        placeholder="How do you verify prescriptions?"
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit('services')}>Save Services</button>
                    <button className="btn-secondary" onClick={() => handleCancelEdit('services')}>Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Payments & Billing Section */}
          {activeSection === 'payments' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>💳 Payments & Billing</h2>
                <p>Configure payment methods and billing settings</p>
              </div>
              
              {!isEditingPayments ? (
                <>
                  <div className="info-grid">
                    <div className="info-row full-width">
                      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Payment Methods Accepted</h3>
                    </div>
                    <div className="info-row">
                      <label>Cash:</label>
                      <span>{chemistData?.paymentSettings?.paymentMethods?.cash ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Credit/Debit Card:</label>
                      <span>{chemistData?.paymentSettings?.paymentMethods?.card ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>UPI:</label>
                      <span>{chemistData?.paymentSettings?.paymentMethods?.upi ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Mobile Wallets:</label>
                      <span>{chemistData?.paymentSettings?.paymentMethods?.wallet ? 'Yes' : 'No'}</span>
                    </div>
                    
                    <div className="info-row full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Online Payment Gateway</h3>
                    </div>
                    <div className="info-row">
                      <label>Payment Gateway Provider:</label>
                      <span>{chemistData?.paymentSettings?.paymentGateway?.provider || 'Not configured'}</span>
                    </div>
                    <div className="info-row">
                      <label>Gateway API Key:</label>
                      <span>{chemistData?.paymentSettings?.paymentGateway?.apiKey ? '••••••••' : 'Not configured'}</span>
                    </div>

                    <div className="info-row full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Bank Account for Payouts</h3>
                    </div>
                    <div className="info-row">
                      <label>Account Holder Name:</label>
                      <span>{chemistData?.accountDetails?.accountHolderName || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Account Number:</label>
                      <span>{chemistData?.accountDetails?.accountNumber || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>IFSC Code:</label>
                      <span>{chemistData?.accountDetails?.ifscCode || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Bank Name:</label>
                      <span>{chemistData?.accountDetails?.bankName || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Cancelled Cheque:</label>
                      {chemistData?.paymentSettings?.cancelledCheque ? (
                        <button 
                          className="btn-link" 
                          onClick={() => {
                            const newWindow = window.open(chemistData.paymentSettings.cancelledCheque, '_blank');
                            if (!newWindow) alert('Please allow popups to view files');
                          }}
                        >
                          View Document
                        </button>
                      ) : (
                        <span>Not uploaded</span>
                      )}
                    </div>

                    <div className="info-row full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>GST Billing Settings</h3>
                    </div>
                    <div className="info-row">
                      <label>GSTIN:</label>
                      <span>{chemistData?.paymentSettings?.gstBilling?.gstin || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <label>Legal Name on Bills:</label>
                      <span>{chemistData?.paymentSettings?.gstBilling?.legalName || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEdit('payments')}>Edit Payment Settings</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Payment Methods Accepted</h3>
                    </div>

                    <div className="form-group full-width">
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.paymentSettings?.paymentMethods?.cash || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              paymentSettings: {
                                ...prev.paymentSettings,
                                paymentMethods: {
                                  ...prev.paymentSettings?.paymentMethods,
                                  cash: e.target.checked
                                }
                              }
                            }))}
                          />
                          Cash
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.paymentSettings?.paymentMethods?.card || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              paymentSettings: {
                                ...prev.paymentSettings,
                                paymentMethods: {
                                  ...prev.paymentSettings?.paymentMethods,
                                  card: e.target.checked
                                }
                              }
                            }))}
                          />
                          Credit/Debit Card (POS)
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.paymentSettings?.paymentMethods?.upi || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              paymentSettings: {
                                ...prev.paymentSettings,
                                paymentMethods: {
                                  ...prev.paymentSettings?.paymentMethods,
                                  upi: e.target.checked
                                }
                              }
                            }))}
                          />
                          UPI
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editedData.paymentSettings?.paymentMethods?.wallet || false}
                            onChange={(e) => setEditedData(prev => ({
                              ...prev,
                              paymentSettings: {
                                ...prev.paymentSettings,
                                paymentMethods: {
                                  ...prev.paymentSettings?.paymentMethods,
                                  wallet: e.target.checked
                                }
                              }
                            }))}
                          />
                          Mobile Wallets (Paytm, PhonePe, etc.)
                        </label>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Online Payment Gateway</h3>
                    </div>

                    <div className="form-group">
                      <label>Payment Gateway Provider</label>
                      <select 
                        value={editedData.paymentSettings?.paymentGateway?.provider || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          paymentSettings: {
                            ...prev.paymentSettings,
                            paymentGateway: {
                              ...prev.paymentSettings?.paymentGateway,
                              provider: e.target.value
                            }
                          }
                        }))}
                      >
                        <option value="">Select provider</option>
                        <option value="razorpay">Razorpay</option>
                        <option value="paytm">Paytm</option>
                        <option value="phonepe">PhonePe</option>
                        <option value="stripe">Stripe</option>
                        <option value="ccavenue">CCAvenue</option>
                        <option value="instamojo">Instamojo</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Gateway API Key</label>
                      <input 
                        type="text" 
                        value={editedData.paymentSettings?.paymentGateway?.apiKey || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          paymentSettings: {
                            ...prev.paymentSettings,
                            paymentGateway: {
                              ...prev.paymentSettings?.paymentGateway,
                              apiKey: e.target.value
                            }
                          }
                        }))}
                        placeholder="API Key (if applicable)" 
                      />
                      <small>Enter your payment gateway API key</small>
                    </div>

                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Bank Account for Payouts</h3>
                    </div>

                    <div className="form-group">
                      <label>Account Holder Name</label>
                      <input 
                        type="text" 
                        value={editedData.accountDetails?.accountHolderName || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          accountDetails: {
                            ...prev.accountDetails,
                            accountHolderName: e.target.value
                          }
                        }))}
                        placeholder="As per bank records" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Bank Account Number</label>
                      <input 
                        type="text" 
                        value={editedData.accountDetails?.accountNumber || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          accountDetails: {
                            ...prev.accountDetails,
                            accountNumber: e.target.value
                          }
                        }))}
                        placeholder="Account number" 
                      />
                    </div>

                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input 
                        type="text" 
                        value={editedData.accountDetails?.ifscCode || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          accountDetails: {
                            ...prev.accountDetails,
                            ifscCode: e.target.value
                          }
                        }))}
                        placeholder="Bank IFSC code" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Bank Name</label>
                      <input 
                        type="text" 
                        value={editedData.accountDetails?.bankName || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          accountDetails: {
                            ...prev.accountDetails,
                            bankName: e.target.value
                          }
                        }))}
                        placeholder="Name of bank" 
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Upload Cancelled Cheque</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = await handleFileUpload(file, 'cancelledCheque');
                            if (url) {
                              setEditedData(prev => ({
                                ...prev,
                                paymentSettings: {
                                  ...prev.paymentSettings,
                                  cancelledCheque: url
                                }
                              }));
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      <small>For bank verification</small>
                      {editedData.paymentSettings?.cancelledCheque && (
                        <small>
                          Current: <a href={editedData.paymentSettings.cancelledCheque} target="_blank" rel="noopener noreferrer">View File</a>
                        </small>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>GST Billing Settings</h3>
                    </div>

                    <div className="form-group">
                      <label>GSTIN</label>
                      <input 
                        type="text" 
                        value={editedData.paymentSettings?.gstBilling?.gstin || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          paymentSettings: {
                            ...prev.paymentSettings,
                            gstBilling: {
                              ...prev.paymentSettings?.gstBilling,
                              gstin: e.target.value
                            }
                          }
                        }))}
                        placeholder="GST Number" 
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Bill Header/Legal Name</label>
                      <input 
                        type="text" 
                        value={editedData.paymentSettings?.gstBilling?.legalName || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          paymentSettings: {
                            ...prev.paymentSettings,
                            gstBilling: {
                              ...prev.paymentSettings?.gstBilling,
                              legalName: e.target.value
                            }
                          }
                        }))}
                        placeholder="Name to appear on bills" 
                      />
                    </div>
                  </div>

                  {uploading && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#234f83' }}>
                      Uploading file...
                    </div>
                  )}

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveEdit('payments')} disabled={uploading}>
                      Save Payment Settings
                    </button>
                    <button className="btn-secondary" onClick={() => handleCancelEdit('payments')} disabled={uploading}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Product Inventory Section */}
          {activeSection === 'inventory' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>💊 Product Inventory Management</h2>
                <p>Add and manage your medicine inventory</p>
              </div>
              
              {!showAddProduct && !showProductList && (
                <div className="form-actions" style={{ marginBottom: '20px' }}>
                  <button className="btn-primary" onClick={() => setShowAddProduct(true)}>Add Product</button>
                  <button className="btn-secondary" onClick={() => setShowProductList(true)}>
                    View All Products ({chemistData?.inventory?.length || 0})
                  </button>
                </div>
              )}

              {showAddProduct && (
                <>
                  <h3 style={{ marginBottom: '20px', color: '#234f83' }}>
                    {editingProductIndex !== null ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  <div className="form-grid">
                    {/* Basic Information */}
                    <div className="form-group full-width">
                      <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#234f83' }}>Basic Information</h4>
                    </div>

                    <div className="form-group">
                      <label>Product Status *</label>
                      <select 
                        value={(editingProduct || newProduct).productStatus}
                        onChange={(e) => handleProductInputChange('productStatus', e.target.value)}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Product ID / SKU</label>
                      <input 
                        type="text" 
                        value={(editingProduct || newProduct).productId}
                        onChange={(e) => handleProductInputChange('productId', e.target.value)}
                        placeholder="Unique identifier" 
                      />
                      <small>Alphanumeric code</small>
                    </div>

                    <div className="form-group">
                      <label>Medicine Name *</label>
                      <input 
                        type="text" 
                        list="medicine-suggestions"
                        value={(editingProduct || newProduct).medicineName}
                        onChange={(e) => handleProductInputChange('medicineName', e.target.value)}
                        placeholder="Brand + Generic name" 
                      />
                      <datalist id="medicine-suggestions">
                        {medicineSuggestions.map((medicine, index) => (
                          <option key={index} value={medicine} />
                        ))}
                      </datalist>
                      <small>Type to see suggestions from existing inventory</small>
                    </div>

                    <div className="form-group">
                      <label>Generic Name / Active Ingredient</label>
                      <input 
                        type="text" 
                        value={(editingProduct || newProduct).genericName}
                        onChange={(e) => handleProductInputChange('genericName', e.target.value)}
                        placeholder="e.g., Paracetamol" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Manufacturer *</label>
                      <input 
                        type="text" 
                        value={(editingProduct || newProduct).manufacturer}
                        onChange={(e) => handleProductInputChange('manufacturer', e.target.value)}
                        placeholder="Company name" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Category *</label>
                      <select 
                        value={(editingProduct || newProduct).category}
                        onChange={(e) => handleProductInputChange('category', e.target.value)}
                      >
                        <option value="">Select category</option>
                        <option value="tablets">Tablets</option>
                        <option value="syrup">Syrup</option>
                        <option value="drops">Drops</option>
                        <option value="ointment">Ointment</option>
                        <option value="injection">Injection</option>
                        <option value="supplement">Supplement</option>
                        <option value="device">Device</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Sub-Category</label>
                      <select 
                        value={(editingProduct || newProduct).subCategory}
                        onChange={(e) => handleProductInputChange('subCategory', e.target.value)}
                      >
                        <option value="">Select sub-category</option>
                        <option value="fever">Fever</option>
                        <option value="cold-cough">Cold & Cough</option>
                        <option value="diabetes">Diabetes</option>
                        <option value="bp">Blood Pressure</option>
                        <option value="skin">Skin</option>
                        <option value="pain-relief">Pain Relief</option>
                        <option value="antibiotics">Antibiotics</option>
                        <option value="vitamins">Vitamins</option>
                        <option value="digestive">Digestive</option>
                        <option value="cardiac">Cardiac</option>
                        <option value="respiratory">Respiratory</option>
                        <option value="neurological">Neurological</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Formulation *</label>
                      <select 
                        value={(editingProduct || newProduct).formulation}
                        onChange={(e) => handleProductInputChange('formulation', e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="tablet">Tablet</option>
                        <option value="capsule">Capsule</option>
                        <option value="syrup">Syrup</option>
                        <option value="injection">Injection</option>
                        <option value="ointment">Ointment</option>
                        <option value="drops">Drops</option>
                        <option value="inhaler">Inhaler</option>
                        <option value="supplement">Supplement</option>
                        <option value="device">Device</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Strength</label>
                      <input 
                        type="text" 
                        value={(editingProduct || newProduct).strength}
                        onChange={(e) => handleProductInputChange('strength', e.target.value)}
                        placeholder="e.g., 500 mg, 5 mg/5 ml" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Pack Description</label>
                      <input 
                        type="text" 
                        value={(editingProduct || newProduct).packDescription}
                        onChange={(e) => handleProductInputChange('packDescription', e.target.value)}
                        placeholder="e.g., Strip of 10 tablets" 
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          checked={(editingProduct || newProduct).prescriptionRequired || false}
                          onChange={(e) => handleProductInputChange('prescriptionRequired', e.target.checked)}
                          style={{ width: 'auto' }}
                        />
                        <span>Prescription Required?</span>
                      </label>
                    </div>

                    {/* Pricing Information */}
                    <div className="form-group full-width">
                      <h4 style={{ fontSize: '16px', marginBottom: '15px', marginTop: '20px', color: '#234f83' }}>Pricing Information</h4>
                    </div>

                    <div className="form-group">
                      <label>MRP (Maximum Retail Price) *</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={(editingProduct || newProduct).mrp}
                          onChange={(e) => handleProductInputChange('mrp', e.target.value)}
                          placeholder="Printed MRP" 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Selling Price *</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={(editingProduct || newProduct).price}
                          onChange={(e) => handleProductInputChange('price', e.target.value)}
                          placeholder="Customer price" 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Purchase/Cost Price</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={(editingProduct || newProduct).costPrice}
                          onChange={(e) => handleProductInputChange('costPrice', e.target.value)}
                          placeholder="Your buying cost" 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>GST Slab %</label>
                      <select 
                        value={(editingProduct || newProduct).gstSlab}
                        onChange={(e) => handleProductInputChange('gstSlab', e.target.value)}
                      >
                        <option value="">Select GST rate</option>
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Discount %</label>
                      <input 
                        type="number" 
                        value={(editingProduct || newProduct).discount}
                        onChange={(e) => handleProductInputChange('discount', e.target.value)}
                        placeholder="Current discount" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input 
                        type="number" 
                        value={(editingProduct || newProduct).quantity}
                        onChange={(e) => handleProductInputChange('quantity', e.target.value)}
                        placeholder="Available stock" 
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Offer / Promotion Tag</label>
                      <input 
                        type="text" 
                        value={(editingProduct || newProduct).offerTag}
                        onChange={(e) => handleProductInputChange('offerTag', e.target.value)}
                        placeholder="e.g., Buy 1 Get 1, 20% Off" 
                      />
                    </div>

                    {/* Product Images */}
                    <div className="form-group full-width">
                      <h4 style={{ fontSize: '16px', marginBottom: '15px', marginTop: '20px', color: '#234f83' }}>Product Images</h4>
                    </div>

                    <div className="form-group full-width">
                      <label>Main Product Image</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleProductImageUpload(file, 'mainImage');
                        }}
                        disabled={uploading}
                      />
                      {(editingProduct || newProduct).mainImage && (
                        <div style={{ marginTop: '10px' }}>
                          <img 
                            src={(editingProduct || newProduct).mainImage} 
                            alt="Main product" 
                            style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '4px', border: '1px solid #ddd' }} 
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Additional Images (up to 6)</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const currentImages = (editingProduct || newProduct).additionalImages || [];
                            if (currentImages.length >= 6) {
                              alert('Maximum 6 additional images allowed');
                              return;
                            }
                            handleProductImageUpload(file, 'additionalImage');
                          }
                        }}
                        disabled={uploading || ((editingProduct || newProduct).additionalImages || []).length >= 6}
                      />
                      {((editingProduct || newProduct).additionalImages || []).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                          {((editingProduct || newProduct).additionalImages || []).map((img, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                              <img 
                                src={img} 
                                alt={`Additional ${idx + 1}`} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} 
                              />
                              <button 
                                type="button"
                                onClick={() => handleRemoveAdditionalImage(idx)}
                                style={{ 
                                  position: 'absolute', 
                                  top: '-8px', 
                                  right: '-8px', 
                                  background: 'red', 
                                  color: 'white', 
                                  border: 'none', 
                                  borderRadius: '50%', 
                                  width: '24px', 
                                  height: '24px', 
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  lineHeight: '1'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <small>Current: {((editingProduct || newProduct).additionalImages || []).length} / 6 images</small>
                    </div>

                    {/* Usage & Safety Information */}
                    <div className="form-group full-width">
                      <h4 style={{ fontSize: '16px', marginBottom: '15px', marginTop: '20px', color: '#234f83' }}>Usage & Safety Information</h4>
                    </div>

                    <div className="form-group full-width">
                      <label>How to Use / Directions</label>
                      <textarea 
                        rows="3"
                        value={(editingProduct || newProduct).howToUse}
                        onChange={(e) => handleProductInputChange('howToUse', e.target.value)}
                        placeholder="Describe how to use this medicine..."
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Dosage Information</label>
                      <textarea 
                        rows="3"
                        value={(editingProduct || newProduct).dosageInformation}
                        onChange={(e) => handleProductInputChange('dosageInformation', e.target.value)}
                        placeholder="Recommended dosage and frequency..."
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Safety Information / Warnings</label>
                      <textarea 
                        rows="4"
                        value={(editingProduct || newProduct).safetyInformation}
                        onChange={(e) => handleProductInputChange('safetyInformation', e.target.value)}
                        placeholder="Side effects, contraindications, precautions..."
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>
                  </div>

                  {uploading && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#234f83' }}>
                      Uploading file...
                    </div>
                  )}

                  <div className="form-actions">
                    <button className="btn-primary" onClick={handleAddProduct} disabled={uploading}>
                      {editingProductIndex !== null ? 'Update Product' : 'Add Product'}
                    </button>
                    <button className="btn-secondary" onClick={() => {
                      resetProductForm();
                      setShowAddProduct(false);
                    }} disabled={uploading}>
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {showProductList && (
                <>
                  {/* Search and Filter Section */}
                  <div style={{ 
                    marginBottom: '25px', 
                    padding: '20px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}>
                    <h4 style={{ marginBottom: '15px', color: '#234f83', fontSize: '16px' }}>
                      🔍 Search & Filter Products
                    </h4>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      {/* Search Input */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                          Search
                        </label>
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Medicine name, category, manufacturer..."
                          style={{ 
                            width: '100%', 
                            padding: '10px', 
                            borderRadius: '4px', 
                            border: '1px solid #ddd',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                          Category
                        </label>
                        <select 
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '10px', 
                            borderRadius: '4px', 
                            border: '1px solid #ddd',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">All Categories</option>
                          <option value="tablets">Tablets</option>
                          <option value="syrup">Syrup</option>
                          <option value="drops">Drops</option>
                          <option value="ointment">Ointment</option>
                          <option value="injection">Injection</option>
                          <option value="supplement">Supplement</option>
                          <option value="device">Device</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                          Status
                        </label>
                        <select 
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '10px', 
                            borderRadius: '4px', 
                            border: '1px solid #ddd',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      {/* Prescription Filter */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                          Prescription
                        </label>
                        <select 
                          value={filterPrescription}
                          onChange={(e) => setFilterPrescription(e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '10px', 
                            borderRadius: '4px', 
                            border: '1px solid #ddd',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">All</option>
                          <option value="yes">Prescription Required</option>
                          <option value="no">No Prescription</option>
                        </select>
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchQuery || filterCategory || filterStatus || filterPrescription) && (
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setFilterCategory('');
                          setFilterStatus('');
                          setFilterPrescription('');
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Clear All Filters
                      </button>
                    )}

                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                      Showing <strong>{getFilteredInventory().length}</strong> of <strong>{chemistData?.inventory?.length || 0}</strong> products
                    </div>
                  </div>

                  <div className="product-list" style={{ marginBottom: '20px' }}>
                    {getFilteredInventory().length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {getFilteredInventory().map((product, index) => {
                          // Find original index for edit/delete operations
                          const originalIndex = chemistData.inventory.findIndex(p => 
                            p.medicineName === product.medicineName && 
                            p.manufacturer === product.manufacturer &&
                            p.productId === product.productId
                          );
                          
                          return (
                          <div key={index} style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            padding: '20px',
                            backgroundColor: product.productStatus === 'inactive' ? '#f5f5f5' : '#fff',
                            opacity: product.productStatus === 'inactive' ? 0.7 : 1
                          }}>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                              {/* Product Image */}
                              <div style={{ flexShrink: 0 }}>
                                {product.mainImage ? (
                                  <img 
                                    src={product.mainImage} 
                                    alt={product.medicineName}
                                    style={{ 
                                      width: '120px', 
                                      height: '120px', 
                                      objectFit: 'cover', 
                                      borderRadius: '8px',
                                      border: '1px solid #ddd'
                                    }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: '120px', 
                                    height: '120px', 
                                    backgroundColor: '#e9ecef',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '48px'
                                  }}>
                                    💊
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div style={{ flex: 1, minWidth: '300px' }}>
                                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '10px' }}>
                                  <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#234f83', fontSize: '18px' }}>
                                      {product.medicineName}
                                    </h4>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                      <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        fontSize: '12px',
                                        backgroundColor: product.productStatus === 'active' ? '#28a745' : '#6c757d',
                                        color: 'white'
                                      }}>
                                        {product.productStatus === 'active' ? 'Active' : 'Inactive'}
                                      </span>
                                      {product.prescriptionRequired && (
                                        <span style={{ 
                                          padding: '4px 8px', 
                                          borderRadius: '4px', 
                                          fontSize: '12px',
                                          backgroundColor: '#ffc107',
                                          color: '#000'
                                        }}>
                                          Rx Required
                                        </span>
                                      )}
                                      {product.category && (
                                        <span style={{ 
                                          padding: '4px 8px', 
                                          borderRadius: '4px', 
                                          fontSize: '12px',
                                          backgroundColor: '#17a2b8',
                                          color: 'white'
                                        }}>
                                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                  gap: '10px',
                                  fontSize: '14px', 
                                  color: '#666',
                                  marginBottom: '15px'
                                }}>
                                  {product.genericName && (
                                    <p style={{ margin: '5px 0' }}>
                                      <strong>Generic:</strong> {product.genericName}
                                    </p>
                                  )}
                                  {product.manufacturer && (
                                    <p style={{ margin: '5px 0' }}>
                                      <strong>Manufacturer:</strong> {product.manufacturer}
                                    </p>
                                  )}
                                  {product.formulation && (
                                    <p style={{ margin: '5px 0' }}>
                                      <strong>Formulation:</strong> {product.formulation}
                                    </p>
                                  )}
                                  {product.strength && (
                                    <p style={{ margin: '5px 0' }}>
                                      <strong>Strength:</strong> {product.strength}
                                    </p>
                                  )}
                                  {product.packDescription && (
                                    <p style={{ margin: '5px 0' }}>
                                      <strong>Pack:</strong> {product.packDescription}
                                    </p>
                                  )}
                                  {product.subCategory && (
                                    <p style={{ margin: '5px 0' }}>
                                      <strong>Sub-Category:</strong> {product.subCategory}
                                    </p>
                                  )}
                                </div>

                                {/* Pricing Row */}
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '20px', 
                                  flexWrap: 'wrap',
                                  padding: '10px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '4px',
                                  marginBottom: '10px'
                                }}>
                                  <div>
                                    <strong style={{ color: '#234f83' }}>MRP:</strong> 
                                    <span style={{ marginLeft: '5px', fontSize: '16px' }}>₹{product.mrp}</span>
                                  </div>
                                  <div>
                                    <strong style={{ color: '#28a745' }}>Selling Price:</strong> 
                                    <span style={{ marginLeft: '5px', fontSize: '16px', fontWeight: 'bold' }}>₹{product.price}</span>
                                  </div>
                                  {product.discount > 0 && (
                                    <div>
                                      <strong style={{ color: '#dc3545' }}>Discount:</strong> 
                                      <span style={{ marginLeft: '5px', fontSize: '16px' }}>{product.discount}%</span>
                                    </div>
                                  )}
                                  <div>
                                    <strong style={{ color: product.quantity <= 10 ? '#dc3545' : '#234f83' }}>Stock:</strong> 
                                    <span style={{ marginLeft: '5px', fontSize: '16px', fontWeight: 'bold' }}>
                                      {product.quantity || 0} units
                                    </span>
                                  </div>
                                </div>

                                {/* Additional Images */}
                                {product.additionalImages && product.additionalImages.length > 0 && (
                                  <div style={{ marginBottom: '10px' }}>
                                    <small style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
                                      Additional Images:
                                    </small>
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                      {product.additionalImages.map((img, idx) => (
                                        <img 
                                          key={idx}
                                          src={img} 
                                          alt={`Additional ${idx + 1}`}
                                          style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            objectFit: 'cover', 
                                            borderRadius: '4px',
                                            border: '1px solid #ddd'
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Additional Info */}
                                {(product.howToUse || product.dosageInformation || product.safetyInformation) && (
                                  <details style={{ marginTop: '10px', fontSize: '14px' }}>
                                    <summary style={{ cursor: 'pointer', color: '#234f83', fontWeight: 'bold' }}>
                                      View Usage & Safety Information
                                    </summary>
                                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                      {product.howToUse && (
                                        <div style={{ marginBottom: '10px' }}>
                                          <strong>How to Use:</strong>
                                          <p style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>{product.howToUse}</p>
                                        </div>
                                      )}
                                      {product.dosageInformation && (
                                        <div style={{ marginBottom: '10px' }}>
                                          <strong>Dosage:</strong>
                                          <p style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>{product.dosageInformation}</p>
                                        </div>
                                      )}
                                      {product.safetyInformation && (
                                        <div>
                                          <strong>Safety Information:</strong>
                                          <p style={{ margin: '5px 0', whiteSpace: 'pre-wrap' }}>{product.safetyInformation}</p>
                                        </div>
                                      )}
                                    </div>
                                  </details>
                                )}

                                {/* Action Buttons */}
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '10px', 
                                  flexWrap: 'wrap',
                                  marginTop: '15px'
                                }}>
                                  <button 
                                    className="btn-primary" 
                                    style={{ padding: '8px 16px', fontSize: '14px' }}
                                    onClick={() => handleEditProduct(originalIndex)}
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button 
                                    className="btn-secondary" 
                                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#28a745', color: 'white' }}
                                    onClick={() => openStockModal(originalIndex, 'in')}
                                  >
                                    📥 Stock In
                                  </button>
                                  <button 
                                    className="btn-secondary" 
                                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#ffc107', color: '#000' }}
                                    onClick={() => openStockModal(originalIndex, 'out')}
                                  >
                                    📤 Stock Out
                                  </button>
                                  <button 
                                    className="btn-link" 
                                    style={{ color: 'red', padding: '8px 16px', fontSize: '14px' }}
                                    onClick={() => handleDeleteProduct(originalIndex)}
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>

                                {/* Stock History Preview */}
                                {product.stockHistory && product.stockHistory.length > 0 && (
                                  <details style={{ marginTop: '10px', fontSize: '13px' }}>
                                    <summary style={{ cursor: 'pointer', color: '#6c757d' }}>
                                      Stock History ({product.stockHistory.length} entries)
                                    </summary>
                                    <div style={{ marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                      {product.stockHistory.slice(-5).reverse().map((entry, idx) => (
                                        <div key={idx} style={{ 
                                          padding: '5px 10px', 
                                          borderLeft: `3px solid ${entry.type === 'in' ? '#28a745' : '#ffc107'}`,
                                          marginBottom: '5px',
                                          backgroundColor: '#f8f9fa'
                                        }}>
                                          <strong>{entry.type === 'in' ? '📥 Stock In' : '📤 Stock Out'}:</strong> {entry.quantity} units
                                          {entry.reason && ` - ${entry.reason}`}
                                          <br/>
                                          <small>{new Date(entry.date).toLocaleString()}</small>
                                        </div>
                                      ))}
                                    </div>
                                  </details>
                                )}
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                        No products in inventory. Click "Add Product" to start adding medicines.
                      </p>
                    )}
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => {
                      setShowProductList(false);
                      setShowAddProduct(true);
                    }}>
                      Add New Product
                    </button>
                    <button className="btn-secondary" onClick={() => setShowProductList(false)}>Close</button>
                  </div>
                </>
              )}

              {/* Stock Management Modal */}
              {showStockModal && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '8px',
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ marginBottom: '20px', color: '#234f83' }}>
                      {stockAction.type === 'in' ? '📥 Add Stock' : '📤 Remove Stock'}
                    </h3>
                    
                    {stockAction.productIndex !== null && chemistData?.inventory[stockAction.productIndex] && (
                      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <strong>{chemistData.inventory[stockAction.productIndex].medicineName}</strong>
                        <br/>
                        <small>Current Stock: {chemistData.inventory[stockAction.productIndex].quantity || 0} units</small>
                      </div>
                    )}

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={stockAction.quantity}
                        onChange={(e) => setStockAction(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="Enter quantity"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          fontSize: '16px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Reason / Notes
                      </label>
                      <textarea
                        rows="3"
                        value={stockAction.reason}
                        onChange={(e) => setStockAction(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder={stockAction.type === 'in' ? 'e.g., New purchase, Return from customer' : 'e.g., Sale, Damaged, Expired'}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setShowStockModal(false);
                          setStockAction({ type: 'in', productIndex: null, quantity: '', reason: '' });
                        }}
                        style={{ padding: '10px 20px' }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-primary"
                        onClick={handleStockUpdate}
                        style={{ padding: '10px 20px' }}
                      >
                        {stockAction.type === 'in' ? 'Add Stock' : 'Remove Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
