import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'add', 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalSection, setModalSection] = useState(''); // which section's modal
  
  // Expandable hospital row state
  const [expandedHospitalId, setExpandedHospitalId] = useState(null);
  const [hospitalManagementTab, setHospitalManagementTab] = useState('kyc'); // 'kyc', 'operational', 'commission', 'majorExpenses'
  
  // Edit mode states for each section
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [isEditingOperational, setIsEditingOperational] = useState(false);
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [kycFormData, setKycFormData] = useState({});
  const [operationalFormData, setOperationalFormData] = useState({});
  const [commissionFormData, setCommissionFormData] = useState({});
  
  // Expandable doctor row state
  const [expandedDoctorId, setExpandedDoctorId] = useState(null);
  const [doctorManagementTab, setDoctorManagementTab] = useState('professional'); // 'professional', 'hospitalLinks', 'consultationFees', 'availability', 'kyc'
  
  // Edit mode states for doctor sections
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [isEditingHospitalLinks, setIsEditingHospitalLinks] = useState(false);
  const [isEditingConsultationFees, setIsEditingConsultationFees] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isEditingDoctorKyc, setIsEditingDoctorKyc] = useState(false);
  const [professionalFormData, setProfessionalFormData] = useState({});
  const [hospitalLinksFormData, setHospitalLinksFormData] = useState({});
  const [consultationFeesFormData, setConsultationFeesFormData] = useState({});
  const [availabilityFormData, setAvailabilityFormData] = useState({});
  const [doctorKycFormData, setDoctorKycFormData] = useState({});
  
  // Expandable patient row state
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [patientManagementTab, setPatientManagementTab] = useState('basicInfo'); // 'basicInfo', 'familyMembers', 'appointmentHistory', 'emergencyContact'
  
  // Edit mode states for patient sections
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingFamilyMembers, setIsEditingFamilyMembers] = useState(false);
  const [isEditingEmergencyContact, setIsEditingEmergencyContact] = useState(false);
  const [basicInfoFormData, setBasicInfoFormData] = useState({});
  const [familyMembersFormData, setFamilyMembersFormData] = useState({});
  const [emergencyContactFormData, setEmergencyContactFormData] = useState({});
  
  // Expandable appointment row state
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  
  // Expandable chemist row state
  const [expandedChemistId, setExpandedChemistId] = useState(null);
  const [chemistSectionTab, setChemistSectionTab] = useState('pharmacies'); // pharmacies or orders
  const [chemistManagementTab, setChemistManagementTab] = useState('license'); // 'license', 'service', 'financials', 'products'
  const [isEditingLicense, setIsEditingLicense] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [isEditingFinancials, setIsEditingFinancials] = useState(false);
  const [licenseFormData, setLicenseFormData] = useState({});
  const [serviceFormData, setServiceFormData] = useState({});
  const [financialsFormData, setFinancialsFormData] = useState({});
  
  // Expandable medicine order row state
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Hospital form dropdown states
  const [showKycSection, setShowKycSection] = useState(false);
  const [showOperationalSection, setShowOperationalSection] = useState(false);
  const [showCommissionSection, setShowCommissionSection] = useState(false);
  
  // Major Expenses states
  const [showMajorExpenses, setShowMajorExpenses] = useState(false);
  const [expenseSubSection, setExpenseSubSection] = useState(''); // 'rooms', 'procedures', 'doctors', 'nursing', 'miscellaneous'
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseModalMode, setExpenseModalMode] = useState('add'); // 'add', 'edit'
  const [selectedExpenseItem, setSelectedExpenseItem] = useState(null);

  // Ambulance Management States
  const [ambulanceSectionTab, setAmbulanceSectionTab] = useState('providers'); // 'providers', 'vehicles', 'bookings'
  const [expandedProviderId, setExpandedProviderId] = useState(null);
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [vehicleManagementTab, setVehicleManagementTab] = useState('basic'); // 'basic', 'equipment', 'pricing', 'documents'
  const [isEditingProviderKyc, setIsEditingProviderKyc] = useState(false);
  const [isEditingVehicleBasic, setIsEditingVehicleBasic] = useState(false);
  const [isEditingEquipment, setIsEditingEquipment] = useState(false);
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);
  const [providerKycFormData, setProviderKycFormData] = useState({});
  const [vehicleBasicFormData, setVehicleBasicFormData] = useState({});
  const [equipmentFormData, setEquipmentFormData] = useState({});
  const [pricingFormData, setPricingFormData] = useState({});
  const [documentsFormData, setDocumentsFormData] = useState({});

  // Pathlab Management States
  const [pathlabSectionTab, setPathlabSectionTab] = useState('labs'); // 'labs', 'tests', 'orders'
  const [expandedPathlabId, setExpandedPathlabId] = useState(null);
  const [expandedTestId, setExpandedTestId] = useState(null);
  const [expandedLabOrderId, setExpandedLabOrderId] = useState(null);
  const [pathlabManagementTab, setPathlabManagementTab] = useState('kyc'); // 'kyc'
  const [testManagementTab, setTestManagementTab] = useState('details'); // 'details', 'pricing', 'reference'
  const [isEditingLabKyc, setIsEditingLabKyc] = useState(false);
  const [isEditingTestDetails, setIsEditingTestDetails] = useState(false);
  const [isEditingTestPricing, setIsEditingTestPricing] = useState(false);
  const [isEditingTestReference, setIsEditingTestReference] = useState(false);
  const [labKycFormData, setLabKycFormData] = useState({});
  const [testDetailsFormData, setTestDetailsFormData] = useState({});
  const [testPricingFormData, setTestPricingFormData] = useState({});
  const [testReferenceFormData, setTestReferenceFormData] = useState({});

  // Toggle hospital row expansion
  const toggleHospitalExpansion = (hospitalId) => {
    if (expandedHospitalId === hospitalId) {
      setExpandedHospitalId(null);
      // Reset edit modes when closing
      setIsEditingKyc(false);
      setIsEditingOperational(false);
      setIsEditingCommission(false);
    } else {
      setExpandedHospitalId(hospitalId);
      setHospitalManagementTab('kyc'); // Default to KYC tab
      // Reset edit modes when opening new hospital
      setIsEditingKyc(false);
      setIsEditingOperational(false);
      setIsEditingCommission(false);
    }
  };

  // Handle KYC form save
  const handleKycSave = (hospitalId) => {
    console.log('Saving KYC data for hospital:', hospitalId, kycFormData);
    alert('KYC details updated successfully!');
    setIsEditingKyc(false);
    // Here you would update the hospital data in state
  };

  // Handle Operational form save
  const handleOperationalSave = (hospitalId) => {
    console.log('Saving Operational data for hospital:', hospitalId, operationalFormData);
    alert('Operational details updated successfully!');
    setIsEditingOperational(false);
    // Here you would update the hospital data in state
  };

  // Handle Commission form save
  const handleCommissionSave = (hospitalId) => {
    console.log('Saving Commission data for hospital:', hospitalId, commissionFormData);
    alert('Commission details updated successfully!');
    setIsEditingCommission(false);
    // Here you would update the hospital data in state
  };

  // Toggle doctor row expansion
  const toggleDoctorExpansion = (doctorId) => {
    if (expandedDoctorId === doctorId) {
      setExpandedDoctorId(null);
      // Reset edit modes when closing
      setIsEditingProfessional(false);
      setIsEditingHospitalLinks(false);
      setIsEditingConsultationFees(false);
      setIsEditingAvailability(false);
      setIsEditingDoctorKyc(false);
    } else {
      setExpandedDoctorId(doctorId);
      setDoctorManagementTab('professional'); // Default to Professional Info tab
      // Reset edit modes when opening new doctor
      setIsEditingProfessional(false);
      setIsEditingHospitalLinks(false);
      setIsEditingConsultationFees(false);
      setIsEditingAvailability(false);
      setIsEditingDoctorKyc(false);
    }
  };

  // Handle Professional Info form save
  const handleProfessionalSave = (doctorId) => {
    console.log('Saving Professional data for doctor:', doctorId, professionalFormData);
    alert('Professional details updated successfully!');
    setIsEditingProfessional(false);
  };

  // Handle Hospital Links form save
  const handleHospitalLinksSave = (doctorId) => {
    console.log('Saving Hospital Links data for doctor:', doctorId, hospitalLinksFormData);
    alert('Hospital links updated successfully!');
    setIsEditingHospitalLinks(false);
  };

  // Handle Consultation Fees form save
  const handleConsultationFeesSave = (doctorId) => {
    console.log('Saving Consultation Fees data for doctor:', doctorId, consultationFeesFormData);
    alert('Consultation fees updated successfully!');
    setIsEditingConsultationFees(false);
  };

  // Handle Availability form save
  const handleAvailabilitySave = (doctorId) => {
    console.log('Saving Availability data for doctor:', doctorId, availabilityFormData);
    alert('Availability updated successfully!');
    setIsEditingAvailability(false);
  };

  // Handle Doctor KYC form save
  const handleDoctorKycSave = (doctorId) => {
    console.log('Saving KYC data for doctor:', doctorId, doctorKycFormData);
    alert('KYC details updated successfully!');
    setIsEditingDoctorKyc(false);
  };

  // Toggle patient row expansion
  const togglePatientExpansion = (patientId) => {
    if (expandedPatientId === patientId) {
      setExpandedPatientId(null);
      // Reset edit modes when closing
      setIsEditingBasicInfo(false);
      setIsEditingFamilyMembers(false);
      setIsEditingEmergencyContact(false);
    } else {
      setExpandedPatientId(patientId);
      setPatientManagementTab('basicInfo'); // Default to Basic Info tab
      // Reset edit modes when opening new patient
      setIsEditingBasicInfo(false);
      setIsEditingFamilyMembers(false);
      setIsEditingEmergencyContact(false);
    }
  };

  // Handle Basic Info form save
  const handleBasicInfoSave = (patientId) => {
    console.log('Saving Basic Info data for patient:', patientId, basicInfoFormData);
    alert('Basic information updated successfully!');
    setIsEditingBasicInfo(false);
  };

  // Handle Family Members form save
  const handleFamilyMembersSave = (patientId) => {
    console.log('Saving Family Members data for patient:', patientId, familyMembersFormData);
    alert('Family members updated successfully!');
    setIsEditingFamilyMembers(false);
  };

  // Handle Emergency Contact form save
  const handleEmergencyContactSave = (patientId) => {
    console.log('Saving Emergency Contact data for patient:', patientId, emergencyContactFormData);
    alert('Emergency contact updated successfully!');
    setIsEditingEmergencyContact(false);
  };

  // Toggle appointment row expansion
  const toggleAppointmentExpansion = (appointmentId) => {
    setExpandedAppointmentId(expandedAppointmentId === appointmentId ? null : appointmentId);
  };

  // Toggle chemist row expansion
  const toggleChemistExpansion = (chemistId) => {
    if (expandedChemistId === chemistId) {
      setExpandedChemistId(null);
      setIsEditingLicense(false);
      setIsEditingService(false);
      setIsEditingFinancials(false);
    } else {
      setExpandedChemistId(chemistId);
      setChemistManagementTab('license');
      setIsEditingLicense(false);
      setIsEditingService(false);
      setIsEditingFinancials(false);
    }
  };

  // Handle License form save
  const handleLicenseSave = (chemistId) => {
    console.log('Saving License data for chemist:', chemistId, licenseFormData);
    alert('License details updated successfully!');
    setIsEditingLicense(false);
  };

  // Handle Service form save
  const handleServiceSave = (chemistId) => {
    console.log('Saving Service data for chemist:', chemistId, serviceFormData);
    alert('Service settings updated successfully!');
    setIsEditingService(false);
  };

  // Handle Financials form save
  const handleFinancialsSave = (chemistId) => {
    console.log('Saving Financials data for chemist:', chemistId, financialsFormData);
    alert('Financial details updated successfully!');
    setIsEditingFinancials(false);
  };

  // Toggle provider row expansion
  const toggleProviderExpansion = (providerId) => {
    if (expandedProviderId === providerId) {
      setExpandedProviderId(null);
      setIsEditingProviderKyc(false);
    } else {
      setExpandedProviderId(providerId);
      setIsEditingProviderKyc(false);
    }
  };

  // Handle Provider KYC form save
  const handleProviderKycSave = (providerId) => {
    console.log('Saving Provider KYC data:', providerId, providerKycFormData);
    alert('Provider KYC details updated successfully!');
    setIsEditingProviderKyc(false);
  };

  // Toggle vehicle row expansion
  const toggleVehicleExpansion = (vehicleId) => {
    if (expandedVehicleId === vehicleId) {
      setExpandedVehicleId(null);
      setIsEditingVehicleBasic(false);
      setIsEditingEquipment(false);
      setIsEditingPricing(false);
      setIsEditingDocuments(false);
    } else {
      setExpandedVehicleId(vehicleId);
      setVehicleManagementTab('basic');
      setIsEditingVehicleBasic(false);
      setIsEditingEquipment(false);
      setIsEditingPricing(false);
      setIsEditingDocuments(false);
    }
  };

  // Handle Vehicle Basic form save
  const handleVehicleBasicSave = (vehicleId) => {
    console.log('Saving Vehicle Basic data:', vehicleId, vehicleBasicFormData);
    alert('Vehicle basic details updated successfully!');
    setIsEditingVehicleBasic(false);
  };

  // Handle Equipment form save
  const handleEquipmentSave = (vehicleId) => {
    console.log('Saving Equipment data:', vehicleId, equipmentFormData);
    alert('Equipment details updated successfully!');
    setIsEditingEquipment(false);
  };

  // Handle Pricing form save
  const handlePricingSave = (vehicleId) => {
    console.log('Saving Pricing data:', vehicleId, pricingFormData);
    alert('Pricing details updated successfully!');
    setIsEditingPricing(false);
  };

  // Handle Documents form save
  const handleDocumentsSave = (vehicleId) => {
    console.log('Saving Documents data:', vehicleId, documentsFormData);
    alert('Documents updated successfully!');
    setIsEditingDocuments(false);
  };

  // Toggle booking row expansion
  const toggleBookingExpansion = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  // Toggle medicine order row expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Toggle pathlab row expansion
  const togglePathlabExpansion = (pathlabId) => {
    if (expandedPathlabId === pathlabId) {
      setExpandedPathlabId(null);
      setIsEditingLabKyc(false);
    } else {
      setExpandedPathlabId(pathlabId);
      setPathlabManagementTab('kyc');
      setIsEditingLabKyc(false);
    }
  };

  // Handle Lab KYC form save
  const handleLabKycSave = (e, pathlabId) => {
    e.preventDefault();
    console.log('Saving Lab KYC data for pathlab:', pathlabId, labKycFormData);
    alert('Lab KYC details updated successfully!');
    setIsEditingLabKyc(false);
  };

  // Toggle test row expansion
  const toggleTestExpansion = (testId) => {
    if (expandedTestId === testId) {
      setExpandedTestId(null);
      setIsEditingTestDetails(false);
      setIsEditingTestPricing(false);
      setIsEditingTestReference(false);
    } else {
      setExpandedTestId(testId);
      setTestManagementTab('details');
      setIsEditingTestDetails(false);
      setIsEditingTestPricing(false);
      setIsEditingTestReference(false);
    }
  };

  // Handle Test Details form save
  const handleTestDetailsSave = (e, testId) => {
    e.preventDefault();
    console.log('Saving Test Details for test:', testId, testDetailsFormData);
    alert('Test details updated successfully!');
    setIsEditingTestDetails(false);
  };

  // Handle Test Pricing form save
  const handleTestPricingSave = (e, testId) => {
    e.preventDefault();
    console.log('Saving Test Pricing for test:', testId, testPricingFormData);
    alert('Test pricing updated successfully!');
    setIsEditingTestPricing(false);
  };

  // Handle Test Reference Range form save
  const handleTestReferenceSave = (e, testId) => {
    e.preventDefault();
    console.log('Saving Test Reference Range for test:', testId, testReferenceFormData);
    alert('Test reference range updated successfully!');
    setIsEditingTestReference(false);
  };

  // Toggle lab order row expansion
  const toggleLabOrderExpansion = (orderId) => {
    setExpandedLabOrderId(expandedLabOrderId === orderId ? null : orderId);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('adminUser'));
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
      return;
    }
    setAdminUser(user);
  }, [navigate]);

  // Modal handlers
  const openModal = (mode, section, item = null) => {
    setModalMode(mode);
    setModalSection(section);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalMode('view');
    setModalSection('');
    setShowKycSection(false);
    setShowOperationalSection(false);
    setShowCommissionSection(false);
    setShowMajorExpenses(false);
  };

  // Expense modal handlers
  const openExpenseModal = (subSection, mode, item = null) => {
    setExpenseSubSection(subSection);
    setExpenseModalMode(mode);
    setSelectedExpenseItem(item);
    setShowExpenseModal(true);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setSelectedExpenseItem(null);
    setExpenseModalMode('add');
    setExpenseSubSection('');
  };

  const handleExpenseSave = (data) => {
    console.log('Saving expense data:', { subSection: expenseSubSection, mode: expenseModalMode, data });
    alert(`${expenseModalMode === 'add' ? 'Added' : 'Updated'} successfully!`);
    closeExpenseModal();
  };

  const handleExpenseDelete = (subSection, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      console.log('Deleting:', subSection, id);
      alert('Deleted successfully!');
    }
  };

  const handleSave = (data) => {
    // Here you would integrate with backend API
    console.log('Saving data:', { mode: modalMode, section: modalSection, data });
    alert(`${modalMode === 'add' ? 'Added' : 'Updated'} successfully! (Backend integration pending)`);
    closeModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  // Mock data for patients
  const [patients] = useState([
    {
      id: 'PAT001',
      name: 'Rahul Verma',
      mobile: '9876543210',
      email: 'rahul.verma@email.com',
      registeredDate: '2024-01-15',
      totalAppointments: 12,
      lastAppointment: '2024-11-10',
      status: 'active',
      familyMembers: 3,
      city: 'Mumbai'
    },
    {
      id: 'PAT002',
      name: 'Priya Sharma',
      mobile: '9876543211',
      email: 'priya.sharma@email.com',
      registeredDate: '2024-02-20',
      totalAppointments: 8,
      lastAppointment: '2024-11-12',
      status: 'active',
      familyMembers: 2,
      city: 'Delhi'
    },
    {
      id: 'PAT003',
      name: 'Amit Kumar',
      mobile: '9876543212',
      email: 'amit.kumar@email.com',
      registeredDate: '2024-03-10',
      totalAppointments: 5,
      lastAppointment: '2024-10-28',
      status: 'active',
      familyMembers: 4,
      city: 'Bangalore'
    },
    {
      id: 'PAT004',
      name: 'Sneha Patel',
      mobile: '9876543213',
      email: 'sneha.patel@email.com',
      registeredDate: '2024-04-05',
      totalAppointments: 15,
      lastAppointment: '2024-11-14',
      status: 'active',
      familyMembers: 1,
      city: 'Pune'
    },
    {
      id: 'PAT005',
      name: 'Vikram Singh',
      mobile: '9876543214',
      email: 'vikram.singh@email.com',
      registeredDate: '2024-05-12',
      totalAppointments: 3,
      lastAppointment: '2024-09-20',
      status: 'inactive',
      familyMembers: 2,
      city: 'Jaipur'
    },
    {
      id: 'PAT006',
      name: 'Ananya Reddy',
      mobile: '9876543215',
      email: 'ananya.reddy@email.com',
      registeredDate: '2024-06-18',
      totalAppointments: 20,
      lastAppointment: '2024-11-15',
      status: 'active',
      familyMembers: 5,
      city: 'Hyderabad'
    },
    {
      id: 'PAT007',
      name: 'Rohit Gupta',
      mobile: '9876543216',
      email: 'rohit.gupta@email.com',
      registeredDate: '2024-07-22',
      totalAppointments: 1,
      lastAppointment: '2024-08-05',
      status: 'blocked',
      familyMembers: 0,
      city: 'Chennai'
    }
  ]);

  // Mock data for medicine orders
  const [medicineOrders] = useState([
    {
      id: 'ORD001',
      date: '2024-11-17',
      time: '10:45 AM',
      userName: 'Rahul Verma',
      userId: 'PAT001',
      pharmacyName: 'MedPlus Pharmacy',
      pharmacyId: 'CHM001',
      type: 'With Prescription',
      prescriptionFile: 'presc_ORD001.pdf',
      items: [
        { id: 'MED001', name: 'Paracetamol 500mg', qty: 2, mrp: 25, discount: 0, finalPrice: 50 },
        { id: 'MED010', name: 'Cough Syrup', qty: 1, mrp: 145, discount: 10, finalPrice: 130 }
      ],
      totalAmount: 180,
      deliveryAddress: '12, MG Road, Mumbai, 400001',
      deliveryMode: 'Home Delivery',
      paymentMethod: 'Razorpay',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      statusLogs: [
        { time: '2024-11-17 10:46', status: 'Placed' },
        { time: '2024-11-17 11:10', status: 'Confirmed' },
        { time: '2024-11-17 13:05', status: 'Out for Delivery' },
        { time: '2024-11-17 14:20', status: 'Delivered' }
      ]
    },
    {
      id: 'ORD002',
      date: '2024-11-17',
      time: '11:15 AM',
      userName: 'Priya Sharma',
      userId: 'PAT002',
      pharmacyName: 'Apollo Pharmacy',
      pharmacyId: 'CHM002',
      type: 'Without Prescription',
      prescriptionFile: null,
      items: [
        { id: 'MED002', name: 'Amoxicillin 250mg', qty: 1, mrp: 85, discount: 0, finalPrice: 85 }
      ],
      totalAmount: 85,
      deliveryAddress: '45, Park Lane, Delhi, 110001',
      deliveryMode: 'Store Pickup',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      orderStatus: 'ready_for_pickup',
      statusLogs: [
        { time: '2024-11-17 11:16', status: 'Placed' },
        { time: '2024-11-17 11:30', status: 'Ready for Pickup' }
      ]
    },
    {
      id: 'ORD003',
      date: '2024-11-16',
      time: '09:20 AM',
      userName: 'Vikram Singh',
      userId: 'PAT005',
      pharmacyName: 'CureCare Chemist',
      pharmacyId: 'CHM005',
      type: 'With Prescription',
      prescriptionFile: 'presc_ORD003.pdf',
      items: [
        { id: 'MED005', name: 'Vitamin D3 Tablets', qty: 2, mrp: 320, discount: 20, finalPrice: 640 }
      ],
      totalAmount: 640,
      deliveryAddress: '78, Central Ave, Hyderabad, 500001',
      deliveryMode: 'Home Delivery',
      paymentMethod: 'GPay',
      paymentStatus: 'failed',
      orderStatus: 'payment_failed',
      statusLogs: [
        { time: '2024-11-16 09:21', status: 'Placed' },
        { time: '2024-11-16 09:45', status: 'Payment Failed' }
      ]
    }
  ]);

  // Mock data for hospitals
  const [hospitals] = useState([
    {
      id: 'HOS001',
      name: 'City General Hospital',
      contactPerson: 'Dr. Rajesh Kumar',
      mobile: '9876543210',
      email: 'citygeneralhospital@email.com',
      city: 'Mumbai',
      pincode: '400001',
      address: 'Andheri West, Mumbai',
      status: 'approved',
      kycStatus: 'approved',
      totalDoctors: 45,
      registeredDate: '2023-01-15',
      // KYC/Legal
      gstNumber: '27AABCU9603R1ZM',
      registrationCertificate: 'city_general_registration.pdf',
      panCard: 'city_general_pan.pdf',
      aadhaarCard: 'owner_aadhaar.pdf',
      accountHolderName: 'City General Hospital Pvt Ltd',
      accountNumber: '123456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branchName: 'Andheri West Branch',
      // Operational Details
      is24x7: true,
      openingTime: '00:00',
      closingTime: '23:59',
      minConsultFee: 500,
      maxConsultFee: 2000,
      availableServices: ['General Consultation', 'Emergency Care', 'Diagnostic Services', 'Pathology', 'Radiology', 'Surgery', 'ICU', 'NICU', 'Pharmacy'],
      facilities: ['ICU', 'NICU', 'OT', 'Pharmacy', 'Pathology', 'Radiology'],
      // Commission & Payout
      commissionType: 'percentage',
      commissionValue: 15,
      settlementCycle: 'monthly',
      paymentMode: 'bank'
    },
    {
      id: 'HOS002',
      name: 'Metro Clinic',
      contactPerson: 'Mr. Amit Sharma',
      mobile: '9876543211',
      email: 'metroc linic@email.com',
      city: 'Delhi',
      pincode: '110001',
      address: 'Connaught Place, New Delhi',
      status: 'pending',
      kycStatus: 'pending',
      totalDoctors: 12,
      registeredDate: '2024-10-20'
    },
    {
      id: 'HOS003',
      name: 'Sunrise Medical Center',
      contactPerson: 'Dr. Priya Patel',
      mobile: '9876543212',
      email: 'sunrisemedical@email.com',
      city: 'Bangalore',
      pincode: '560001',
      address: 'Koramangala, Bangalore',
      status: 'approved',
      kycStatus: 'approved',
      totalDoctors: 28,
      registeredDate: '2023-06-10',
      // KYC/Legal
      gstNumber: '29AABCS1234E1ZN',
      registrationCertificate: 'sunrise_registration.pdf',
      accountHolderName: 'Sunrise Medical Center',
      accountNumber: '987654321098',
      ifscCode: 'ICIC0005678',
      bankName: 'ICICI Bank',
      branchName: 'Koramangala Branch',
      // Operational Details
      is24x7: false,
      openingTime: '08:00',
      closingTime: '20:00',
      minConsultFee: 400,
      maxConsultFee: 1500,
      availableServices: ['General Consultation', 'Diagnostic Services', 'Pathology', 'Radiology', 'Physiotherapy', 'Vaccination'],
      facilities: ['Pharmacy', 'Pathology', 'Radiology'],
      // Commission & Payout
      commissionType: 'percentage',
      commissionValue: 12,
      settlementCycle: '15days',
      paymentMode: 'upi'
    },
    {
      id: 'HOS004',
      name: 'Care Plus Hospital',
      contactPerson: 'Mr. Vikram Singh',
      mobile: '9876543213',
      email: 'careplus@email.com',
      city: 'Pune',
      pincode: '411001',
      address: 'Shivaji Nagar, Pune',
      status: 'rejected',
      kycStatus: 'rejected',
      totalDoctors: 8,
      registeredDate: '2024-09-05'
    },
    {
      id: 'HOS005',
      name: 'Wellness Clinic',
      contactPerson: 'Dr. Anjali Desai',
      mobile: '9876543214',
      email: 'wellnessclinic@email.com',
      city: 'Ahmedabad',
      pincode: '380001',
      address: 'Satellite, Ahmedabad',
      status: 'blocked',
      kycStatus: 'approved',
      totalDoctors: 15,
      registeredDate: '2023-11-20'
    }
  ]);

  // Mock data for doctors
  const [doctors] = useState([
    {
      id: 'DOC001',
      name: 'Dr. Priya Sharma',
      speciality: 'Cardiologist',
      linkedHospitals: 'City General, Metro Clinic',
      city: 'Mumbai',
      experience: 15,
      mobile: '9876543220',
      email: 'priya.sharma@doctor.com',
      qualification: 'MD, DM (Cardiology)',
      fee: 800,
      kycStatus: 'approved',
      status: 'active',
      registeredDate: '2023-02-10'
    },
    {
      id: 'DOC002',
      name: 'Dr. Amit Verma',
      speciality: 'Neurologist',
      linkedHospitals: 'Sunrise Medical Center',
      city: 'Bangalore',
      experience: 12,
      mobile: '9876543221',
      email: 'amit.verma@doctor.com',
      qualification: 'MBBS, MD (Neurology)',
      fee: 1000,
      kycStatus: 'approved',
      status: 'active',
      registeredDate: '2023-04-15'
    },
    {
      id: 'DOC003',
      name: 'Dr. Sneha Patel',
      speciality: 'Pediatrician',
      linkedHospitals: 'Care Plus Hospital',
      city: 'Pune',
      experience: 8,
      mobile: '9876543222',
      email: 'sneha.patel@doctor.com',
      qualification: 'MBBS, MD (Pediatrics)',
      fee: 500,
      kycStatus: 'pending',
      status: 'pending',
      registeredDate: '2024-10-01'
    },
    {
      id: 'DOC004',
      name: 'Dr. Rajesh Kumar',
      speciality: 'Orthopedic',
      linkedHospitals: 'City General Hospital',
      city: 'Mumbai',
      experience: 20,
      mobile: '9876543223',
      email: 'rajesh.kumar@doctor.com',
      qualification: 'MBBS, MS (Orthopedics)',
      fee: 1200,
      kycStatus: 'approved',
      status: 'active',
      registeredDate: '2022-12-05'
    },
    {
      id: 'DOC005',
      name: 'Dr. Kavita Reddy',
      speciality: 'Dermatologist',
      linkedHospitals: 'Wellness Clinic',
      city: 'Ahmedabad',
      experience: 10,
      mobile: '9876543224',
      email: 'kavita.reddy@doctor.com',
      qualification: 'MBBS, MD (Dermatology)',
      fee: 600,
      kycStatus: 'approved',
      status: 'inactive',
      registeredDate: '2023-08-20'
    },
    {
      id: 'DOC006',
      name: 'Dr. Vikram Singh',
      speciality: 'General Physician',
      linkedHospitals: 'Metro Clinic',
      city: 'Delhi',
      experience: 5,
      mobile: '9876543225',
      email: 'vikram.singh@doctor.com',
      qualification: 'MBBS',
      fee: 300,
      kycStatus: 'rejected',
      status: 'blocked',
      registeredDate: '2024-07-10'
    }
  ]);

  // Mock data for appointments
  const [appointments] = useState([
    {
      id: 'APT001',
      date: '2024-11-17',
      time: '10:00 AM',
      patient: 'Rahul Verma',
      patientId: 'PAT001',
      doctor: 'Dr. Priya Sharma',
      hospital: 'City General Hospital',
      mode: 'Online Consult',
      type: 'Video Call',
      paymentStatus: 'paid',
      appointmentStatus: 'completed',
      fee: 500,
      transactionId: 'TXN123456'
    },
    {
      id: 'APT002',
      date: '2024-11-17',
      time: '11:30 AM',
      patient: 'Priya Sharma',
      patientId: 'PAT002',
      doctor: 'Dr. Rajesh Kumar',
      hospital: 'Metro Clinic',
      mode: 'OPD Visit',
      type: 'In-Person',
      paymentStatus: 'paid',
      appointmentStatus: 'confirmed',
      fee: 300,
      transactionId: 'TXN123457'
    },
    {
      id: 'APT003',
      date: '2024-11-17',
      time: '02:00 PM',
      patient: 'Amit Kumar',
      patientId: 'PAT003',
      doctor: 'Dr. Anjali Desai',
      hospital: 'City General Hospital',
      mode: 'Online Consult',
      type: 'Chat',
      paymentStatus: 'pending',
      appointmentStatus: 'pending',
      fee: 250,
      transactionId: 'TXN123458'
    },
    {
      id: 'APT004',
      date: '2024-11-17',
      time: '03:30 PM',
      patient: 'Sneha Patel',
      patientId: 'PAT004',
      doctor: 'Dr. Vikram Malhotra',
      hospital: 'Apollo Hospital',
      mode: 'OPD Visit',
      type: 'In-Person',
      paymentStatus: 'paid',
      appointmentStatus: 'confirmed',
      fee: 600,
      transactionId: 'TXN123459'
    },
    {
      id: 'APT005',
      date: '2024-11-18',
      time: '09:00 AM',
      patient: 'Ananya Reddy',
      patientId: 'PAT006',
      doctor: 'Dr. Sanjay Mehta',
      hospital: 'Metro Clinic',
      mode: 'Online Consult',
      type: 'Audio Call',
      paymentStatus: 'paid',
      appointmentStatus: 'confirmed',
      fee: 400,
      transactionId: 'TXN123460'
    },
    {
      id: 'APT006',
      date: '2024-11-18',
      time: '11:00 AM',
      patient: 'Rahul Verma',
      patientId: 'PAT001',
      doctor: 'Dr. Priya Sharma',
      hospital: 'City General Hospital',
      mode: 'OPD Visit',
      type: 'In-Person',
      paymentStatus: 'paid',
      appointmentStatus: 'confirmed',
      fee: 500,
      transactionId: 'TXN123461'
    },
    {
      id: 'APT007',
      date: '2024-11-16',
      time: '04:00 PM',
      patient: 'Vikram Singh',
      patientId: 'PAT005',
      doctor: 'Dr. Neha Kapoor',
      hospital: 'Fortis Hospital',
      mode: 'Online Consult',
      type: 'Video Call',
      paymentStatus: 'failed',
      appointmentStatus: 'cancelled',
      fee: 550,
      transactionId: 'TXN123462'
    },
    {
      id: 'APT008',
      date: '2024-11-19',
      time: '10:30 AM',
      patient: 'Priya Sharma',
      patientId: 'PAT002',
      doctor: 'Dr. Arun Patel',
      hospital: 'Apollo Hospital',
      mode: 'OPD Visit',
      type: 'In-Person',
      paymentStatus: 'paid',
      appointmentStatus: 'confirmed',
      fee: 700,
      transactionId: 'TXN123463'
    }
  ]);

  // Mock data for chemists
  const [chemists] = useState([
    {
      id: 'CHM001',
      name: 'MedPlus Pharmacy',
      owner: 'Rajesh Patel',
      mobile: '9876543220',
      email: 'medplus@email.com',
      city: 'Mumbai',
      license: 'DL-MH-2020-12345',
      licenseExpiry: '2026-12-31',
      totalProducts: 1250,
      totalOrders: 3420,
      kycStatus: 'approved',
      status: 'active',
      commission: 12,
      registeredDate: '2024-01-10'
    },
    {
      id: 'CHM002',
      name: 'Apollo Pharmacy',
      owner: 'Sunita Kumar',
      mobile: '9876543221',
      email: 'apollo.pharmacy@email.com',
      city: 'Delhi',
      license: 'DL-DL-2021-67890',
      licenseExpiry: '2027-06-30',
      totalProducts: 2100,
      totalOrders: 5680,
      kycStatus: 'approved',
      status: 'active',
      commission: 10,
      registeredDate: '2024-02-15'
    },
    {
      id: 'CHM003',
      name: 'HealthCare Chemist',
      owner: 'Amit Sharma',
      mobile: '9876543222',
      email: 'healthcare.chemist@email.com',
      city: 'Bangalore',
      license: 'DL-KA-2023-11111',
      licenseExpiry: '2028-03-31',
      totalProducts: 850,
      totalOrders: 1240,
      kycStatus: 'pending',
      status: 'pending',
      commission: 15,
      registeredDate: '2024-10-20'
    },
    {
      id: 'CHM004',
      name: 'Wellness Pharmacy',
      owner: 'Priya Desai',
      mobile: '9876543223',
      email: 'wellness@email.com',
      city: 'Pune',
      license: 'DL-MH-2022-22222',
      licenseExpiry: '2027-09-30',
      totalProducts: 950,
      totalOrders: 2180,
      kycStatus: 'approved',
      status: 'active',
      commission: 12,
      registeredDate: '2024-03-05'
    },
    {
      id: 'CHM005',
      name: 'CureCare Chemist',
      owner: 'Vikram Singh',
      mobile: '9876543224',
      email: 'curecare@email.com',
      city: 'Hyderabad',
      license: 'DL-TS-2021-33333',
      licenseExpiry: '2026-08-31',
      totalProducts: 1100,
      totalOrders: 2890,
      kycStatus: 'approved',
      status: 'active',
      commission: 11,
      registeredDate: '2024-01-25'
    },
    {
      id: 'CHM006',
      name: 'MediCare Plus',
      owner: 'Ananya Reddy',
      mobile: '9876543225',
      email: 'medicare.plus@email.com',
      city: 'Chennai',
      license: 'DL-TN-2023-44444',
      licenseExpiry: '2028-12-31',
      totalProducts: 680,
      totalOrders: 890,
      kycStatus: 'rejected',
      status: 'rejected',
      commission: 0,
      registeredDate: '2024-09-15'
    },
    {
      id: 'CHM007',
      name: '24/7 Pharmacy',
      owner: 'Rohit Malhotra',
      mobile: '9876543226',
      email: '247pharmacy@email.com',
      city: 'Jaipur',
      license: 'DL-RJ-2022-55555',
      licenseExpiry: '2027-05-31',
      totalProducts: 1450,
      totalOrders: 4120,
      kycStatus: 'approved',
      status: 'active',
      commission: 10,
      registeredDate: '2024-02-28'
    },
    {
      id: 'CHM008',
      name: 'QuickMeds Pharmacy',
      owner: 'Neha Kapoor',
      mobile: '9876543227',
      email: 'quickmeds@email.com',
      city: 'Kolkata',
      license: 'DL-WB-2020-66666',
      licenseExpiry: '2025-12-31',
      totalProducts: 780,
      totalOrders: 1560,
      kycStatus: 'approved',
      status: 'blocked',
      commission: 12,
      registeredDate: '2024-04-10'
    }
  ]);

  // Mock data for ambulance providers/fleet owners
  const [ambulanceProviders] = useState([
    {
      id: 'PROV001',
      providerName: 'LifeSaver Ambulance Services',
      contactPerson: 'Rajesh Kumar',
      phone: '9876543210',
      alternatePhone: '9876543211',
      email: 'lifesaver@ambulance.com',
      address: 'Plot No. 45, Sector 18',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      companyRegCert: 'CERT-MH-2020-001',
      gst: '27AABCU9603R1ZX',
      bankAccountNumber: '123456789012',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      kycStatus: 'verified',
      status: 'active',
      totalVehicles: 12,
      totalBookings: 456,
      rating: 4.7,
      registeredDate: '2024-01-15'
    },
    {
      id: 'PROV002',
      providerName: 'QuickCare Ambulance Fleet',
      contactPerson: 'Priya Sharma',
      phone: '9876543220',
      alternatePhone: '9876543221',
      email: 'quickcare@ambulance.com',
      address: 'Building 12, Nehru Place',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110019',
      companyRegCert: 'CERT-DL-2021-002',
      gst: '07AABCU9603R1ZY',
      bankAccountNumber: '987654321098',
      ifscCode: 'ICIC0002345',
      bankName: 'ICICI Bank',
      kycStatus: 'verified',
      status: 'active',
      totalVehicles: 8,
      totalBookings: 298,
      rating: 4.8,
      registeredDate: '2024-02-10'
    },
    {
      id: 'PROV003',
      providerName: 'MediTrans Services',
      contactPerson: 'Amit Desai',
      phone: '9876543230',
      alternatePhone: '9876543231',
      email: 'meditrans@ambulance.com',
      address: 'Shop 67, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      companyRegCert: 'CERT-KA-2022-003',
      gst: '29AABCU9603R1ZZ',
      bankAccountNumber: '456789123456',
      ifscCode: 'SBIN0003456',
      bankName: 'State Bank of India',
      kycStatus: 'pending',
      status: 'active',
      totalVehicles: 5,
      totalBookings: 87,
      rating: 4.5,
      registeredDate: '2024-03-20'
    }
  ]);

  // Mock data for ambulance vehicles
  const [ambulanceVehicles] = useState([
    {
      id: 'VEH001',
      vehicleId: 'AMB-MH-001',
      providerId: 'PROV001',
      providerName: 'LifeSaver Ambulance Services',
      vehicleNumber: 'MH-02-AB-1234',
      vehicleType: 'Basic Life Support (BLS)',
      capacity: '2 patients + 2 attendants',
      hasOxygen: true,
      hasVentilator: false,
      hasDefibrillator: true,
      hasStretcher: true,
      hasWheelchair: true,
      hasParamedic: true,
      hasDoctor: false,
      baseFare: 500,
      baseKm: 5,
      perKmCharge: 15,
      waitingCharge: 100,
      hasNightCharges: true,
      nightChargePercent: 20,
      hasEmergencySurcharge: true,
      emergencySurchargePercent: 30,
      baseLocation: 'Andheri, Mumbai',
      baseCity: 'Mumbai',
      hasGPS: true,
      currentStatus: 'available',
      rcBook: 'RC-MH-2022-1234.pdf',
      insurance: 'INS-2024-5678.pdf',
      driverLicense: 'DL-MH-9012.pdf',
      validityExpiry: '2025-12-31',
      approvalStatus: 'approved',
      status: 'active',
      totalTrips: 145,
      rating: 4.8,
      lastTrip: '2024-11-16'
    },
    {
      id: 'VEH002',
      vehicleId: 'AMB-DL-002',
      providerId: 'PROV002',
      providerName: 'QuickCare Ambulance Fleet',
      vehicleNumber: 'DL-03-CD-5678',
      vehicleType: 'Advanced Life Support (ALS)',
      capacity: '1 patient + 3 attendants',
      hasOxygen: true,
      hasVentilator: true,
      hasDefibrillator: true,
      hasStretcher: true,
      hasWheelchair: true,
      hasParamedic: true,
      hasDoctor: true,
      baseFare: 1500,
      baseKm: 10,
      perKmCharge: 25,
      waitingCharge: 150,
      hasNightCharges: true,
      nightChargePercent: 25,
      hasEmergencySurcharge: true,
      emergencySurchargePercent: 40,
      baseLocation: 'Connaught Place, Delhi',
      baseCity: 'Delhi',
      hasGPS: true,
      currentStatus: 'on-trip',
      rcBook: 'RC-DL-2023-5678.pdf',
      insurance: 'INS-2024-9012.pdf',
      driverLicense: 'DL-DL-3456.pdf',
      validityExpiry: '2026-06-30',
      approvalStatus: 'approved',
      status: 'active',
      totalTrips: 298,
      rating: 4.9,
      lastTrip: '2024-11-17'
    },
    {
      id: 'VEH003',
      vehicleId: 'AMB-KA-003',
      providerId: 'PROV003',
      providerName: 'MediTrans Services',
      vehicleNumber: 'KA-05-EF-9012',
      vehicleType: 'Cardiac Ambulance',
      capacity: '1 patient + 2 attendants',
      hasOxygen: true,
      hasVentilator: true,
      hasDefibrillator: true,
      hasStretcher: true,
      hasWheelchair: false,
      hasParamedic: true,
      hasDoctor: true,
      baseFare: 2000,
      baseKm: 8,
      perKmCharge: 30,
      waitingCharge: 200,
      hasNightCharges: true,
      nightChargePercent: 30,
      hasEmergencySurcharge: true,
      emergencySurchargePercent: 50,
      baseLocation: 'Koramangala, Bangalore',
      baseCity: 'Bangalore',
      hasGPS: true,
      currentStatus: 'available',
      rcBook: 'RC-KA-2023-9012.pdf',
      insurance: 'INS-2024-3456.pdf',
      driverLicense: 'DL-KA-7890.pdf',
      validityExpiry: '2025-09-30',
      approvalStatus: 'pending',
      status: 'active',
      totalTrips: 87,
      rating: 4.6,
      lastTrip: '2024-11-15'
    }
  ]);

  // Mock data for ambulance bookings
  const [ambulanceBookings] = useState([
    {
      id: 'BOOK001',
      requestTime: '2024-11-17 09:15 AM',
      patientName: 'Rahul Verma',
      callerName: 'Priya Verma',
      contactNumber: '9876543210',
      emergencyType: 'Cardiac Emergency',
      pickupLocation: 'Flat 301, Sunrise Apartments, Andheri West, Mumbai - 400058',
      dropLocation: 'Kokilaben Hospital, Andheri West, Mumbai - 400053',
      preferredHospital: 'Kokilaben Hospital',
      selectedVehicleType: 'Advanced Life Support (ALS)',
      providerId: 'PROV001',
      providerName: 'LifeSaver Ambulance Services',
      assignedVehicle: 'MH-02-AB-1234',
      assignedDriver: 'Ravi Kumar - 9876543211',
      startTime: '2024-11-17 09:25 AM',
      arrivalTime: '2024-11-17 09:40 AM',
      dropTime: '2024-11-17 10:10 AM',
      distanceTravelled: 12.5,
      baseFare: 1500,
      kmCharge: 187.5,
      waitingCharge: 0,
      nightCharge: 0,
      emergencyCharge: 600,
      totalFare: 2287.5,
      paymentMethod: 'UPI',
      transactionId: 'TXN20241117001',
      paymentStatus: 'paid',
      tripStatus: 'completed',
      statusLogs: [
        { time: '2024-11-17 09:15 AM', status: 'Requested' },
        { time: '2024-11-17 09:20 AM', status: 'Assigned' },
        { time: '2024-11-17 09:25 AM', status: 'En Route to Pickup' },
        { time: '2024-11-17 09:40 AM', status: 'Patient Picked Up' },
        { time: '2024-11-17 10:10 AM', status: 'Completed' }
      ]
    },
    {
      id: 'BOOK002',
      requestTime: '2024-11-17 02:30 PM',
      patientName: 'Amit Kumar',
      callerName: 'Amit Kumar',
      contactNumber: '9876543220',
      emergencyType: 'Accident',
      pickupLocation: 'Sector 15, Noida - 201301',
      dropLocation: 'Max Hospital, Saket, Delhi - 110017',
      preferredHospital: 'Max Hospital',
      selectedVehicleType: 'Basic Life Support (BLS)',
      providerId: 'PROV002',
      providerName: 'QuickCare Ambulance Fleet',
      assignedVehicle: 'DL-03-CD-5678',
      assignedDriver: 'Suresh Patil - 9876543221',
      startTime: '2024-11-17 02:35 PM',
      arrivalTime: '2024-11-17 02:50 PM',
      dropTime: '2024-11-17 03:35 PM',
      distanceTravelled: 18.2,
      baseFare: 500,
      kmCharge: 273,
      waitingCharge: 100,
      nightCharge: 0,
      emergencyCharge: 150,
      totalFare: 1023,
      paymentMethod: 'Cash',
      transactionId: null,
      paymentStatus: 'pending',
      tripStatus: 'completed',
      statusLogs: [
        { time: '2024-11-17 02:30 PM', status: 'Requested' },
        { time: '2024-11-17 02:35 PM', status: 'Assigned' },
        { time: '2024-11-17 02:35 PM', status: 'En Route to Pickup' },
        { time: '2024-11-17 02:50 PM', status: 'Patient Picked Up' },
        { time: '2024-11-17 03:35 PM', status: 'Completed' }
      ]
    },
    {
      id: 'BOOK003',
      requestTime: '2024-11-17 11:45 PM',
      patientName: 'Sneha Patel',
      callerName: 'Rajesh Patel',
      contactNumber: '9876543230',
      emergencyType: 'Pregnancy Emergency',
      pickupLocation: 'House No. 234, BTM Layout, Bangalore - 560076',
      dropLocation: 'Apollo Hospital, Bannerghatta Road, Bangalore - 560076',
      preferredHospital: 'Apollo Hospital',
      selectedVehicleType: 'Neonatal Ambulance',
      providerId: 'PROV003',
      providerName: 'MediTrans Services',
      assignedVehicle: null,
      assignedDriver: null,
      startTime: null,
      arrivalTime: null,
      dropTime: null,
      distanceTravelled: 0,
      baseFare: 2000,
      kmCharge: 0,
      waitingCharge: 0,
      nightCharge: 600,
      emergencyCharge: 1000,
      totalFare: 3600,
      paymentMethod: null,
      transactionId: null,
      paymentStatus: 'pending',
      tripStatus: 'requested',
      statusLogs: [
        { time: '2024-11-17 11:45 PM', status: 'Requested' }
      ]
    }
  ]);

  // Mock data for old ambulances (keeping for backward compatibility)
  const [ambulances] = useState([
    {
      id: 'AMB001',
      driverName: 'Ravi Kumar',
      vehicleNumber: 'MH-02-AB-1234',
      vehicleType: 'Basic Life Support',
      mobile: '9876543230',
      city: 'Mumbai',
      totalTrips: 145,
      availability: 'available',
      kycStatus: 'approved',
      status: 'active',
      rating: 4.8,
      lastTrip: '2024-11-16',
      registeredDate: '2024-01-15'
    },
    {
      id: 'AMB002',
      driverName: 'Suresh Patil',
      vehicleNumber: 'DL-03-CD-5678',
      vehicleType: 'Advanced Life Support',
      mobile: '9876543231',
      city: 'Delhi',
      totalTrips: 298,
      availability: 'on-trip',
      kycStatus: 'approved',
      status: 'active',
      rating: 4.9,
      lastTrip: '2024-11-17',
      registeredDate: '2024-02-10'
    },
    {
      id: 'AMB003',
      driverName: 'Mahesh Yadav',
      vehicleNumber: 'KA-05-EF-9012',
      vehicleType: 'Basic Life Support',
      mobile: '9876543232',
      city: 'Bangalore',
      totalTrips: 87,
      availability: 'available',
      kycStatus: 'approved',
      status: 'active',
      rating: 4.6,
      lastTrip: '2024-11-15',
      registeredDate: '2024-03-20'
    },
    {
      id: 'AMB004',
      driverName: 'Anil Sharma',
      vehicleNumber: 'MH-12-GH-3456',
      vehicleType: 'Patient Transport',
      mobile: '9876543233',
      city: 'Pune',
      totalTrips: 56,
      availability: 'available',
      kycStatus: 'approved',
      status: 'active',
      rating: 4.5,
      lastTrip: '2024-11-14',
      registeredDate: '2024-05-05'
    },
    {
      id: 'AMB005',
      driverName: 'Prakash Reddy',
      vehicleNumber: 'TS-09-IJ-7890',
      vehicleType: 'Advanced Life Support',
      mobile: '9876543234',
      city: 'Hyderabad',
      totalTrips: 203,
      availability: 'maintenance',
      kycStatus: 'approved',
      status: 'active',
      rating: 4.7,
      lastTrip: '2024-11-13',
      registeredDate: '2024-02-25'
    },
    {
      id: 'AMB006',
      driverName: 'Karthik Nair',
      vehicleNumber: 'TN-07-KL-2345',
      vehicleType: 'Basic Life Support',
      mobile: '9876543235',
      city: 'Chennai',
      totalTrips: 112,
      availability: 'available',
      kycStatus: 'approved',
      status: 'active',
      rating: 4.8,
      lastTrip: '2024-11-16',
      registeredDate: '2024-04-12'
    },
    {
      id: 'AMB007',
      driverName: 'Ramesh Gupta',
      vehicleNumber: 'RJ-14-MN-6789',
      vehicleType: 'Patient Transport',
      mobile: '9876543236',
      city: 'Jaipur',
      totalTrips: 34,
      availability: 'available',
      kycStatus: 'pending',
      status: 'pending',
      rating: 0,
      lastTrip: null,
      registeredDate: '2024-10-28'
    },
    {
      id: 'AMB008',
      driverName: 'Deepak Singh',
      vehicleNumber: 'WB-06-OP-0123',
      vehicleType: 'Basic Life Support',
      mobile: '9876543237',
      city: 'Kolkata',
      totalTrips: 178,
      availability: 'on-trip',
      kycStatus: 'approved',
      status: 'active',
      rating: 4.9,
      lastTrip: '2024-11-17',
      registeredDate: '2024-03-08'
    },
    {
      id: 'AMB009',
      driverName: 'Vijay Rao',
      vehicleNumber: 'AP-11-QR-4567',
      vehicleType: 'Advanced Life Support',
      mobile: '9876543238',
      city: 'Visakhapatnam',
      totalTrips: 156,
      availability: 'available',
      kycStatus: 'approved',
      status: 'active',
      rating: 4.7,
      lastTrip: '2024-11-15',
      registeredDate: '2024-01-30'
    },
    {
      id: 'AMB010',
      driverName: 'Santosh Kumar',
      vehicleNumber: 'UP-16-ST-8901',
      vehicleType: 'Patient Transport',
      mobile: '9876543239',
      city: 'Lucknow',
      totalTrips: 89,
      availability: 'offline',
      kycStatus: 'approved',
      status: 'blocked',
      rating: 3.2,
      lastTrip: '2024-10-20',
      registeredDate: '2024-06-18'
    }
  ]);

  // Mock data for rooms and boards
  const [rooms, setRooms] = useState([
    {
      room_id: 'ROOM001',
      room_type: 'ICU',
      room_name: 'ICU - Ward A',
      floor: '3rd Floor',
      charge_per_day: 5000,
      max_patients: 1,
      description: 'Intensive Care Unit with advanced monitoring',
      status: 'Active'
    },
    {
      room_id: 'ROOM002',
      room_type: 'General Ward',
      room_name: 'General Ward B',
      floor: '1st Floor',
      charge_per_day: 1500,
      max_patients: 6,
      description: 'Standard general ward with basic facilities',
      status: 'Active'
    },
    {
      room_id: 'ROOM003',
      room_type: 'Private',
      room_name: 'Private Room 301',
      floor: '3rd Floor',
      charge_per_day: 3000,
      max_patients: 1,
      description: 'Private AC room with attached bathroom',
      status: 'Active'
    }
  ]);

  // Mock data for medical procedures
  const [procedures, setProcedures] = useState([
    {
      procedure_id: 'PROC001',
      procedure_name: 'Appendectomy',
      procedure_type: 'Major Surgery',
      base_charge: 50000,
      ot_charges: 15000,
      anesthesia_charge: 8000,
      doctor_fee_default: 25000,
      description: 'Surgical removal of appendix',
      status: 'Active'
    },
    {
      procedure_id: 'PROC002',
      procedure_name: 'C-Section',
      procedure_type: 'Major Surgery',
      base_charge: 45000,
      ot_charges: 12000,
      anesthesia_charge: 7000,
      doctor_fee_default: 20000,
      description: 'Cesarean section delivery',
      status: 'Active'
    }
  ]);

  // Mock data for doctor fees
  const [doctorFees, setDoctorFees] = useState([
    {
      doctor_id: 'DFEE001',
      name: 'Dr. Rajesh Kumar',
      specialization: 'Cardiologist',
      visit_type: 'OPD',
      visit_fee_opd: 800,
      visit_fee_ipd_per_visit: 1200,
      consultation_fee_emergency: 1500,
      experience: 15,
      status: 'Active'
    },
    {
      doctor_id: 'DFEE002',
      name: 'Dr. Priya Sharma',
      specialization: 'Surgeon',
      visit_type: 'Surgery',
      visit_fee_opd: 1000,
      visit_fee_ipd_per_visit: 1500,
      consultation_fee_emergency: 2000,
      experience: 12,
      status: 'Active'
    }
  ]);

  // Mock data for nursing and staff charges
  const [nursingCharges, setNursingCharges] = useState([
    {
      service_id: 'NURS001',
      service_name: 'Special Nursing Care',
      charge_type: 'per_day',
      charge_amount: 2000,
      status: 'Active'
    },
    {
      service_id: 'NURS002',
      service_name: 'Physiotherapy Visit',
      charge_type: 'per_visit',
      charge_amount: 800,
      status: 'Active'
    }
  ]);

  // Mock data for miscellaneous services
  const [miscServices, setMiscServices] = useState([
    {
      service_id: 'MISC001',
      service: 'Ambulance Service',
      charge: 1500,
      status: 'Active'
    },
    {
      service_id: 'MISC002',
      service: 'Wheelchair Charges',
      charge: 200,
      status: 'Active'
    }
  ]);

  // Mock data for pathlabs
  const [pathlabs] = useState([
    {
      id: 'LAB001',
      name: 'PathCare Diagnostics',
      owner: 'Dr. Suresh Mehta',
      mobile: '9876543240',
      email: 'pathcare@email.com',
      city: 'Mumbai',
      license: 'LAB-MH-2020-1001',
      licenseExpiry: '2026-12-31',
      totalTests: 285,
      totalOrders: 2450,
      kycStatus: 'approved',
      status: 'active',
      rating: 4.7,
      sampleCollection: 'yes',
      registeredDate: '2024-01-12'
    },
    {
      id: 'LAB002',
      name: 'LifeLine Labs',
      owner: 'Dr. Anjali Verma',
      mobile: '9876543241',
      email: 'lifeline.labs@email.com',
      city: 'Delhi',
      license: 'LAB-DL-2021-1002',
      licenseExpiry: '2027-06-30',
      totalTests: 340,
      totalOrders: 3890,
      kycStatus: 'approved',
      status: 'active',
      rating: 4.9,
      sampleCollection: 'yes',
      registeredDate: '2024-02-18'
    },
    {
      id: 'LAB003',
      name: 'HealthCheck Diagnostics',
      owner: 'Dr. Ramesh Patel',
      mobile: '9876543242',
      email: 'healthcheck@email.com',
      city: 'Bangalore',
      license: 'LAB-KA-2023-1003',
      licenseExpiry: '2028-03-31',
      totalTests: 195,
      totalOrders: 1120,
      kycStatus: 'pending',
      status: 'pending',
      rating: 0,
      sampleCollection: 'yes',
      registeredDate: '2024-10-22'
    },
    {
      id: 'LAB004',
      name: 'AccuTest Labs',
      owner: 'Dr. Priya Singh',
      mobile: '9876543243',
      email: 'accutest@email.com',
      city: 'Pune',
      license: 'LAB-MH-2022-1004',
      licenseExpiry: '2027-09-30',
      totalTests: 210,
      totalOrders: 1780,
      kycStatus: 'approved',
      status: 'active',
      rating: 4.6,
      sampleCollection: 'no',
      registeredDate: '2024-03-08'
    },
    {
      id: 'LAB005',
      name: 'QuickDiag Pathology',
      owner: 'Dr. Vikram Reddy',
      mobile: '9876543244',
      email: 'quickdiag@email.com',
      city: 'Hyderabad',
      license: 'LAB-TS-2021-1005',
      licenseExpiry: '2026-08-31',
      totalTests: 265,
      totalOrders: 2340,
      kycStatus: 'approved',
      status: 'active',
      rating: 4.8,
      sampleCollection: 'yes',
      registeredDate: '2024-01-28'
    },
    {
      id: 'LAB006',
      name: 'Precise Diagnostics',
      owner: 'Dr. Kavita Nair',
      mobile: '9876543245',
      email: 'precise.diag@email.com',
      city: 'Chennai',
      license: 'LAB-TN-2022-1006',
      licenseExpiry: '2027-11-30',
      totalTests: 175,
      totalOrders: 980,
      kycStatus: 'approved',
      status: 'active',
      rating: 4.5,
      sampleCollection: 'yes',
      registeredDate: '2024-04-15'
    },
    {
      id: 'LAB007',
      name: 'MediScan Labs',
      owner: 'Dr. Arun Sharma',
      mobile: '9876543246',
      email: 'mediscan@email.com',
      city: 'Jaipur',
      license: 'LAB-RJ-2023-1007',
      licenseExpiry: '2028-05-31',
      totalTests: 145,
      totalOrders: 560,
      kycStatus: 'rejected',
      status: 'rejected',
      rating: 0,
      sampleCollection: 'no',
      registeredDate: '2024-09-10'
    },
    {
      id: 'LAB008',
      name: 'TrueCare Pathology',
      owner: 'Dr. Neha Kapoor',
      mobile: '9876543247',
      email: 'truecare.path@email.com',
      city: 'Kolkata',
      license: 'LAB-WB-2020-1008',
      licenseExpiry: '2025-12-31',
      totalTests: 220,
      totalOrders: 1890,
      kycStatus: 'approved',
      status: 'blocked',
      rating: 3.8,
      sampleCollection: 'yes',
      registeredDate: '2024-05-22'
    }
  ]);

    // Extended mock data for pathlab KYC documents
    const [pathlabsExtended] = useState([
      {
        id: 'LAB001',
        name: 'PathCare Diagnostics',
        owner: 'Dr. Suresh Mehta',
        mobile: '9876543240',
        email: 'pathcare@email.com',
        city: 'Mumbai',
        address: 'Plot 12, Andheri West',
        licenseNumber: 'LAB-MH-2020-1001',
        licenseExpiry: '2026-12-31',
        regCertificate: 'REG-LAB-MH-001.pdf',
        drugsLicense: 'DRUGS-LAB-MH-001.pdf',
        clinicalEstablishment: 'CER-LAB-MH-001.pdf',
        gstPan: '27AABCU9603R1ZX',
        ownerIdentity: 'Aadhar-XXXX-XXXX',
        totalTests: 285,
        totalOrders: 2450,
        kycStatus: 'approved',
        status: 'active'
      },
      {
        id: 'LAB002',
        name: 'LifeLine Labs',
        owner: 'Dr. Anjali Verma',
        mobile: '9876543241',
        email: 'lifeline.labs@email.com',
        city: 'Delhi',
        address: 'Sector 9, Rohini',
        licenseNumber: 'LAB-DL-2021-1002',
        licenseExpiry: '2027-06-30',
        regCertificate: 'REG-LAB-DL-002.pdf',
        drugsLicense: 'DRUGS-LAB-DL-002.pdf',
        clinicalEstablishment: 'CER-LAB-DL-002.pdf',
        gstPan: '07AABCU9603R1ZY',
        ownerIdentity: 'PAN-AABCU9603R',
        totalTests: 340,
        totalOrders: 3890,
        kycStatus: 'approved',
        status: 'active'
      },
      {
        id: 'LAB003',
        name: 'HealthCheck Diagnostics',
        owner: 'Dr. Ramesh Patel',
        mobile: '9876543242',
        email: 'healthcheck@email.com',
        city: 'Bangalore',
        address: 'MG Road',
        licenseNumber: 'LAB-KA-2023-1003',
        licenseExpiry: '2028-03-31',
        regCertificate: 'REG-LAB-KA-003.pdf',
        drugsLicense: 'DRUGS-LAB-KA-003.pdf',
        clinicalEstablishment: 'CER-LAB-KA-003.pdf',
        gstPan: '29AABCU9603R1ZZ',
        ownerIdentity: 'Aadhar-YYYY-YYYY',
        totalTests: 195,
        totalOrders: 1120,
        kycStatus: 'pending',
        status: 'pending'
      }
    ]);

    // Mock data for lab tests (Test Catalogue)
    const [labTests] = useState([
      {
        id: 'TEST001',
        testName: 'Complete Blood Count',
        shortCode: 'CBC',
        category: 'Hematology',
        sampleType: 'Blood',
        fastingRequired: 'No',
        tat: '24 hrs',
        price: 250,
        discount: 0,
        referenceRange: { male: '4.5-11.0 x10^9/L', female: '4.0-10.5 x10^9/L', child: '5.0-13.0 x10^9/L' },
        instructions: 'No fasting required. Avoid heavy exercise before sample collection.',
        status: 'active',
        labId: 'LAB001'
      },
      {
        id: 'TEST002',
        testName: 'Lipid Profile',
        shortCode: 'LIPID',
        category: 'Biochemistry',
        sampleType: 'Blood',
        fastingRequired: 'Yes',
        tat: '48 hrs',
        price: 800,
        discount: 10,
        referenceRange: { male: 'Total Cholesterol <200 mg/dL', female: 'Total Cholesterol <200 mg/dL', child: 'Refer pediatric ranges' },
        instructions: '12 hours fasting required. Avoid fatty meals prior to test.',
        status: 'active',
        labId: 'LAB002'
      },
      {
        id: 'TEST003',
        testName: 'Liver Function Test',
        shortCode: 'LFT',
        category: 'Biochemistry',
        sampleType: 'Blood',
        fastingRequired: 'No',
        tat: '24 hrs',
        price: 600,
        discount: 5,
        referenceRange: { male: 'ALT: 7-56 U/L', female: 'ALT: 7-56 U/L', child: 'Refer pediatric ranges' },
        instructions: 'No heavy meal before test. Morning sample preferred.',
        status: 'active',
        labId: 'LAB001'
      }
    ]);

    // Mock data for lab orders / bookings
    const [labOrders] = useState([
      {
        id: 'ORDER001',
        orderId: 'ORD-20241117001',
        orderTime: '2024-11-17 09:05 AM',
        patientName: 'Rahul Verma',
        patientAge: 45,
        patientGender: 'Male',
        contactNumber: '9876543210',
        hospitalRef: 'City General Hospital / Dr. Priya Sharma',
        testsList: [ { testId: 'TEST001', testName: 'Complete Blood Count', status: 'Completed', reportFile: 'CBC-ORD001.pdf' }, { testId: 'TEST003', testName: 'Liver Function Test', status: 'Completed', reportFile: 'LFT-ORD001.pdf' } ],
        sampleCollectionType: 'Home Collection',
        collectionStatus: 'Collected',
        paymentStatus: 'paid',
        reportStatus: 'Delivered',
        totalAmount: 850,
        transactionId: 'TXN123458',
        publishToPatientApp: true
      },
      {
        id: 'ORDER002',
        orderId: 'ORD-20241117002',
        orderTime: '2024-11-17 11:30 AM',
        patientName: 'Amit Kumar',
        patientAge: 30,
        patientGender: 'Male',
        contactNumber: '9876543220',
        hospitalRef: 'Max Hospital / Dr. Rajesh Kumar',
        testsList: [ { testId: 'TEST002', testName: 'Lipid Profile', status: 'Pending', reportFile: null } ],
        sampleCollectionType: 'Lab Visit',
        collectionStatus: 'Pending',
        paymentStatus: 'pending',
        reportStatus: 'Pending',
        totalAmount: 720,
        transactionId: null,
        publishToPatientApp: false
      }
    ]);

    // Mock data for payments & transactions
  const [payments] = useState([
    {
      id: 'TXN123456',
      date: '2024-11-17',
      time: '10:30 AM',
      type: 'Appointment Fee',
      from: 'Rahul Verma',
      to: 'Dr. Priya Sharma',
      amount: 500,
      gateway: 'Razorpay',
      status: 'paid',
      commission: 50,
      settlementStatus: 'pending'
    },
    {
      id: 'TXN123457',
      date: '2024-11-17',
      time: '11:45 AM',
      type: 'Medicine Order',
      from: 'Priya Sharma',
      to: 'MedPlus Pharmacy',
      amount: 850,
      gateway: 'Paytm',
      status: 'paid',
      commission: 102,
      settlementStatus: 'completed'
    },
    {
      id: 'TXN123458',
      date: '2024-11-17',
      time: '02:15 PM',
      type: 'Lab Test',
      from: 'Amit Kumar',
      to: 'PathCare Diagnostics',
      amount: 1200,
      gateway: 'Razorpay',
      status: 'pending',
      commission: 0,
      settlementStatus: 'pending'
    },
    {
      id: 'TXN123459',
      date: '2024-11-17',
      time: '03:30 PM',
      type: 'Ambulance Booking',
      from: 'Sneha Patel',
      to: 'Ravi Kumar (AMB001)',
      amount: 1500,
      gateway: 'PhonePe',
      status: 'paid',
      commission: 150,
      settlementStatus: 'pending'
    },
    {
      id: 'TXN123460',
      date: '2024-11-16',
      time: '09:20 AM',
      type: 'Appointment Fee',
      from: 'Ananya Reddy',
      to: 'Dr. Sanjay Mehta',
      amount: 400,
      gateway: 'Razorpay',
      status: 'paid',
      commission: 40,
      settlementStatus: 'completed'
    },
    {
      id: 'TXN123461',
      date: '2024-11-16',
      time: '04:50 PM',
      type: 'Medicine Order',
      from: 'Vikram Singh',
      to: 'Apollo Pharmacy',
      amount: 650,
      gateway: 'GPay',
      status: 'failed',
      commission: 0,
      settlementStatus: 'failed'
    },
    {
      id: 'TXN123462',
      date: '2024-11-16',
      time: '11:15 AM',
      type: 'Lab Test',
      from: 'Rohit Gupta',
      to: 'LifeLine Labs',
      amount: 2500,
      gateway: 'Paytm',
      status: 'paid',
      commission: 300,
      settlementStatus: 'completed'
    },
    {
      id: 'TXN123463',
      date: '2024-11-15',
      time: '01:40 PM',
      type: 'Appointment Fee',
      from: 'Priya Sharma',
      to: 'Dr. Arun Patel',
      amount: 700,
      gateway: 'Razorpay',
      status: 'paid',
      commission: 70,
      settlementStatus: 'completed'
    },
    {
      id: 'TXN123464',
      date: '2024-11-15',
      time: '10:25 AM',
      type: 'Medicine Order',
      from: 'Rahul Verma',
      to: 'Wellness Pharmacy',
      amount: 450,
      gateway: 'PhonePe',
      status: 'refunded',
      commission: 0,
      settlementStatus: 'refunded'
    },
    {
      id: 'TXN123465',
      date: '2024-11-15',
      time: '03:10 PM',
      type: 'Ambulance Booking',
      from: 'Amit Kumar',
      to: 'Suresh Patil (AMB002)',
      amount: 2000,
      gateway: 'Razorpay',
      status: 'paid',
      commission: 200,
      settlementStatus: 'pending'
    },
    {
      id: 'TXN123466',
      date: '2024-11-14',
      time: '09:55 AM',
      type: 'Lab Test',
      from: 'Sneha Patel',
      to: 'AccuTest Labs',
      amount: 800,
      gateway: 'GPay',
      status: 'paid',
      commission: 96,
      settlementStatus: 'completed'
    },
    {
      id: 'TXN123467',
      date: '2024-11-14',
      time: '02:30 PM',
      type: 'Appointment Fee',
      from: 'Ananya Reddy',
      to: 'Dr. Vikram Malhotra',
      amount: 600,
      gateway: 'Paytm',
      status: 'paid',
      commission: 60,
      settlementStatus: 'completed'
    },
    {
      id: 'TXN123468',
      date: '2024-11-14',
      time: '11:05 AM',
      type: 'Medicine Order',
      from: 'Vikram Singh',
      to: 'CureCare Chemist',
      amount: 1100,
      gateway: 'PhonePe',
      status: 'paid',
      commission: 132,
      settlementStatus: 'pending'
    },
    {
      id: 'TXN123469',
      date: '2024-11-13',
      time: '04:20 PM',
      type: 'Lab Test',
      from: 'Rohit Gupta',
      to: 'QuickDiag Pathology',
      amount: 1500,
      gateway: 'Razorpay',
      status: 'paid',
      commission: 180,
      settlementStatus: 'completed'
    },
    {
      id: 'TXN123470',
      date: '2024-11-13',
      time: '10:45 AM',
      type: 'Ambulance Booking',
      from: 'Priya Sharma',
      to: 'Mahesh Yadav (AMB003)',
      amount: 1800,
      gateway: 'GPay',
      status: 'paid',
      commission: 180,
      settlementStatus: 'completed'
    }
  ]);

  // Mock data for reviews & ratings
  const [reviews] = useState([
    {
      id: 'REV001',
      entityType: 'Doctor',
      entityName: 'Dr. Priya Sharma',
      userName: 'Rahul Verma',
      rating: 5,
      comment: 'Excellent consultation! Very professional and caring doctor.',
      date: '2024-11-17',
      status: 'approved',
      response: null
    },
    {
      id: 'REV002',
      entityType: 'Hospital',
      entityName: 'City General Hospital',
      userName: 'Priya Sharma',
      rating: 4,
      comment: 'Good facilities but long waiting time.',
      date: '2024-11-17',
      status: 'approved',
      response: 'Thank you for your feedback. We are working on reducing wait times.'
    },
    {
      id: 'REV003',
      entityType: 'Chemist',
      entityName: 'MedPlus Pharmacy',
      userName: 'Amit Kumar',
      rating: 5,
      comment: 'Fast delivery and genuine medicines. Highly recommended!',
      date: '2024-11-16',
      status: 'approved',
      response: null
    },
    {
      id: 'REV004',
      entityType: 'Ambulance',
      entityName: 'Ravi Kumar (AMB001)',
      userName: 'Sneha Patel',
      rating: 5,
      comment: 'Quick response and professional service in emergency.',
      date: '2024-11-16',
      status: 'approved',
      response: null
    },
    {
      id: 'REV005',
      entityType: 'Pathlab',
      entityName: 'PathCare Diagnostics',
      userName: 'Ananya Reddy',
      rating: 4,
      comment: 'Good service but report was delayed by one day.',
      date: '2024-11-15',
      status: 'pending',
      response: null
    },
    {
      id: 'REV006',
      entityType: 'Doctor',
      entityName: 'Dr. Rajesh Kumar',
      userName: 'Vikram Singh',
      rating: 2,
      comment: 'Doctor was rude and did not listen to my concerns properly.',
      date: '2024-11-15',
      status: 'pending',
      response: null
    },
    {
      id: 'REV007',
      entityType: 'Hospital',
      entityName: 'Metro Clinic',
      userName: 'Rohit Gupta',
      rating: 3,
      comment: 'Average experience. Staff needs better training.',
      date: '2024-11-14',
      status: 'approved',
      response: 'We appreciate your feedback and will train our staff better.'
    },
    {
      id: 'REV008',
      entityType: 'Chemist',
      entityName: 'Apollo Pharmacy',
      userName: 'Rahul Verma',
      rating: 5,
      comment: 'Excellent service with home delivery option.',
      date: '2024-11-14',
      status: 'approved',
      response: null
    },
    {
      id: 'REV009',
      entityType: 'Pathlab',
      entityName: 'LifeLine Labs',
      userName: 'Priya Sharma',
      rating: 5,
      comment: 'Very accurate reports and friendly staff.',
      date: '2024-11-13',
      status: 'approved',
      response: null
    },
    {
      id: 'REV010',
      entityType: 'Doctor',
      entityName: 'Dr. Anjali Desai',
      userName: 'Amit Kumar',
      rating: 4,
      comment: 'Good doctor but consultation fee is bit high.',
      date: '2024-11-13',
      status: 'approved',
      response: null
    },
    {
      id: 'REV011',
      entityType: 'Ambulance',
      entityName: 'Suresh Patil (AMB002)',
      userName: 'Sneha Patel',
      rating: 1,
      comment: 'Very unprofessional behavior. Driver was rash.',
      date: '2024-11-12',
      status: 'flagged',
      response: null
    },
    {
      id: 'REV012',
      entityType: 'Hospital',
      entityName: 'Apollo Hospital',
      userName: 'Ananya Reddy',
      rating: 5,
      comment: 'World class facilities and treatment. Highly satisfied!',
      date: '2024-11-12',
      status: 'approved',
      response: 'Thank you for your kind words!'
    }
  ]);

  // Mock data for CMS - Banners
  const [banners] = useState([
    {
      id: 'BAN001',
      title: 'Free Health Checkup',
      description: 'Get free full body checkup worth ₹2000',
      type: 'Homepage Banner',
      imageUrl: '/images/banner1.jpg',
      link: '/health-checkup',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      status: 'active',
      clicks: 1245
    },
    {
      id: 'BAN002',
      title: '50% Off on Medicines',
      description: 'Flat 50% discount on all medicines',
      type: 'Pharmacy Banner',
      imageUrl: '/images/banner2.jpg',
      link: '/pharmacy',
      startDate: '2024-11-10',
      endDate: '2024-11-25',
      status: 'active',
      clicks: 892
    },
    {
      id: 'BAN003',
      title: 'Book Ambulance in 5 Minutes',
      description: 'Emergency ambulance service available 24/7',
      type: 'Homepage Banner',
      imageUrl: '/images/banner3.jpg',
      link: '/ambulance',
      startDate: '2024-11-15',
      endDate: '2024-12-15',
      status: 'active',
      clicks: 567
    },
    {
      id: 'BAN004',
      title: 'Online Doctor Consultation',
      description: 'Consult with top doctors from home',
      type: 'Doctor Banner',
      imageUrl: '/images/banner4.jpg',
      link: '/doctors',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      status: 'expired',
      clicks: 2340
    },
    {
      id: 'BAN005',
      title: 'Lab Tests at Home',
      description: 'Book lab tests with free home sample collection',
      type: 'Pathlab Banner',
      imageUrl: '/images/banner5.jpg',
      link: '/lab-tests',
      startDate: '2024-11-20',
      endDate: '2024-12-20',
      status: 'scheduled',
      clicks: 0
    },
    {
      id: 'BAN006',
      title: 'New Year Health Package',
      description: 'Special health packages for new year',
      type: 'Homepage Banner',
      imageUrl: '/images/banner6.jpg',
      link: '/packages',
      startDate: '2024-12-20',
      endDate: '2025-01-10',
      status: 'scheduled',
      clicks: 0
    }
  ]);

  // Mock data for CMS - Coupons
  const [coupons] = useState([
    {
      id: 'COUP001',
      code: 'HEALTH50',
      description: '50% off on first appointment',
      discountType: 'percentage',
      discountValue: 50,
      maxDiscount: 500,
      minOrder: 200,
      validFrom: '2024-11-01',
      validTo: '2024-11-30',
      usageLimit: 1000,
      usedCount: 456,
      status: 'active',
      applicableOn: 'Appointments'
    },
    {
      id: 'COUP002',
      code: 'MEDS100',
      description: '₹100 off on medicine orders',
      discountType: 'flat',
      discountValue: 100,
      maxDiscount: 100,
      minOrder: 500,
      validFrom: '2024-11-10',
      validTo: '2024-11-25',
      usageLimit: 500,
      usedCount: 289,
      status: 'active',
      applicableOn: 'Medicines'
    },
    {
      id: 'COUP003',
      code: 'LABTEST20',
      description: '20% off on all lab tests',
      discountType: 'percentage',
      discountValue: 20,
      maxDiscount: 300,
      minOrder: 500,
      validFrom: '2024-11-15',
      validTo: '2024-12-15',
      usageLimit: 800,
      usedCount: 123,
      status: 'active',
      applicableOn: 'Lab Tests'
    },
    {
      id: 'COUP004',
      code: 'FIRSTORDER',
      description: 'Flat ₹200 off on first order',
      discountType: 'flat',
      discountValue: 200,
      maxDiscount: 200,
      minOrder: 1000,
      validFrom: '2024-10-01',
      validTo: '2024-10-31',
      usageLimit: 1000,
      usedCount: 1000,
      status: 'expired',
      applicableOn: 'All'
    },
    {
      id: 'COUP005',
      code: 'NEWYEAR2025',
      description: 'New year special - 40% off',
      discountType: 'percentage',
      discountValue: 40,
      maxDiscount: 1000,
      minOrder: 1000,
      validFrom: '2024-12-25',
      validTo: '2025-01-05',
      usageLimit: 2000,
      usedCount: 0,
      status: 'scheduled',
      applicableOn: 'All'
    },
    {
      id: 'COUP006',
      code: 'AMBULANCE10',
      description: '10% off on ambulance booking',
      discountType: 'percentage',
      discountValue: 10,
      maxDiscount: 200,
      minOrder: 500,
      validFrom: '2024-11-01',
      validTo: '2024-11-30',
      usageLimit: 300,
      usedCount: 145,
      status: 'active',
      applicableOn: 'Ambulance'
    },
    {
      id: 'COUP007',
      code: 'WEEKEND25',
      description: '25% off on weekend bookings',
      discountType: 'percentage',
      discountValue: 25,
      maxDiscount: 400,
      minOrder: 300,
      validFrom: '2024-11-01',
      validTo: '2024-11-30',
      usageLimit: 600,
      usedCount: 387,
      status: 'active',
      applicableOn: 'Appointments'
    },
    {
      id: 'COUP008',
      code: 'DISABLED',
      description: 'Test coupon - disabled',
      discountType: 'flat',
      discountValue: 50,
      maxDiscount: 50,
      minOrder: 100,
      validFrom: '2024-11-01',
      validTo: '2024-11-30',
      usageLimit: 100,
      usedCount: 12,
      status: 'inactive',
      applicableOn: 'All'
    }
  ]);

  // Mock data for notifications
  const [notifications] = useState([
    {
      id: 'NOT001',
      title: 'Welcome to Hospo Healthcare',
      message: 'Thank you for registering. Complete your profile to get started.',
      type: 'push',
      targetAudience: 'New Users',
      sentTo: 450,
      delivered: 445,
      opened: 320,
      clicked: 180,
      failed: 5,
      status: 'sent',
      scheduledDate: '2024-11-15',
      sentDate: '2024-11-15 10:00 AM',
      priority: 'normal'
    },
    {
      id: 'NOT002',
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Amit Patel is scheduled for tomorrow at 10:00 AM',
      type: 'sms',
      targetAudience: 'Patients with Appointments',
      sentTo: 234,
      delivered: 234,
      opened: 0,
      clicked: 0,
      failed: 0,
      status: 'sent',
      scheduledDate: '2024-11-16',
      sentDate: '2024-11-16 06:00 PM',
      priority: 'high'
    },
    {
      id: 'NOT003',
      title: 'Medicine Order Delivered',
      message: 'Your order #ORD12345 has been delivered. Rate your experience!',
      type: 'push',
      targetAudience: 'Order Customers',
      sentTo: 89,
      delivered: 87,
      opened: 65,
      clicked: 42,
      failed: 2,
      status: 'sent',
      scheduledDate: '2024-11-16',
      sentDate: '2024-11-16 02:30 PM',
      priority: 'normal'
    },
    {
      id: 'NOT004',
      title: 'Special Discount - 50% OFF',
      message: 'Use code HEALTH50 and get 50% discount on all appointments this weekend!',
      type: 'email',
      targetAudience: 'All Active Users',
      sentTo: 12500,
      delivered: 12487,
      opened: 8945,
      clicked: 3240,
      failed: 13,
      status: 'sent',
      scheduledDate: '2024-11-14',
      sentDate: '2024-11-14 09:00 AM',
      priority: 'normal'
    },
    {
      id: 'NOT005',
      title: 'Lab Test Results Ready',
      message: 'Your lab test results are now available. View in your dashboard.',
      type: 'push',
      targetAudience: 'Lab Test Customers',
      sentTo: 156,
      delivered: 154,
      opened: 138,
      clicked: 102,
      failed: 2,
      status: 'sent',
      scheduledDate: '2024-11-17',
      sentDate: '2024-11-17 11:00 AM',
      priority: 'high'
    },
    {
      id: 'NOT006',
      title: 'KYC Verification Pending',
      message: 'Please complete your KYC verification to start receiving bookings.',
      type: 'email',
      targetAudience: 'Service Providers',
      sentTo: 47,
      delivered: 47,
      opened: 35,
      clicked: 18,
      failed: 0,
      status: 'sent',
      scheduledDate: '2024-11-17',
      sentDate: '2024-11-17 10:30 AM',
      priority: 'high'
    },
    {
      id: 'NOT007',
      title: 'New Ambulance Booking',
      message: 'You have a new ambulance booking request. Please confirm.',
      type: 'sms',
      targetAudience: 'Ambulance Providers',
      sentTo: 89,
      delivered: 89,
      opened: 0,
      clicked: 0,
      failed: 0,
      status: 'sent',
      scheduledDate: '2024-11-17',
      sentDate: '2024-11-17 03:45 PM',
      priority: 'urgent'
    },
    {
      id: 'NOT008',
      title: 'Payment Settlement Completed',
      message: 'Your payment of ₹12,450 has been settled to your bank account.',
      type: 'push',
      targetAudience: 'Service Providers',
      sentTo: 234,
      delivered: 230,
      opened: 195,
      clicked: 78,
      failed: 4,
      status: 'sent',
      scheduledDate: '2024-11-16',
      sentDate: '2024-11-16 05:00 PM',
      priority: 'normal'
    },
    {
      id: 'NOT009',
      title: 'Weekend Health Checkup Packages',
      message: 'Special weekend offer! Book comprehensive health checkup packages at discounted prices.',
      type: 'email',
      targetAudience: 'All Users',
      sentTo: 15420,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      status: 'scheduled',
      scheduledDate: '2024-11-18',
      sentDate: '',
      priority: 'normal'
    },
    {
      id: 'NOT010',
      title: 'Prescription Upload Reminder',
      message: 'Upload your prescription to complete your medicine order.',
      type: 'push',
      targetAudience: 'Incomplete Orders',
      sentTo: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      status: 'draft',
      scheduledDate: '',
      sentDate: '',
      priority: 'normal'
    },
    {
      id: 'NOT011',
      title: 'Doctor Consultation - Book Now',
      message: 'Consult with top doctors from the comfort of your home. Book video consultation now!',
      type: 'sms',
      targetAudience: 'Mobile Verified Users',
      sentTo: 8900,
      delivered: 8897,
      opened: 0,
      clicked: 0,
      failed: 3,
      status: 'sent',
      scheduledDate: '2024-11-15',
      sentDate: '2024-11-15 11:00 AM',
      priority: 'normal'
    },
    {
      id: 'NOT012',
      title: 'Account Security Alert',
      message: 'We noticed a login from a new device. If this was not you, please reset your password immediately.',
      type: 'email',
      targetAudience: 'Security Alerts',
      sentTo: 23,
      delivered: 23,
      opened: 18,
      clicked: 12,
      failed: 0,
      status: 'sent',
      scheduledDate: '2024-11-17',
      sentDate: '2024-11-17 02:15 PM',
      priority: 'urgent'
    },
    {
      id: 'NOT013',
      title: 'Review Your Recent Appointment',
      message: 'How was your experience with Dr. Rajesh Kumar? Share your feedback.',
      type: 'push',
      targetAudience: 'Recent Appointments',
      sentTo: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      status: 'failed',
      scheduledDate: '2024-11-16',
      sentDate: '2024-11-16 07:00 PM',
      priority: 'normal'
    },
    {
      id: 'NOT014',
      title: 'Ambulance Service Available',
      message: 'Emergency ambulance service now available 24/7 in your area.',
      type: 'push',
      targetAudience: 'Location Based',
      sentTo: 3450,
      delivered: 3442,
      opened: 2103,
      clicked: 567,
      failed: 8,
      status: 'sent',
      scheduledDate: '2024-11-13',
      sentDate: '2024-11-13 09:00 AM',
      priority: 'normal'
    },
    {
      id: 'NOT015',
      title: 'Pharmacy Stock Alert',
      message: 'Low stock alert for frequently ordered medicines. Please update inventory.',
      type: 'email',
      targetAudience: 'Chemist Partners',
      sentTo: 567,
      delivered: 567,
      opened: 489,
      clicked: 234,
      failed: 0,
      status: 'sent',
      scheduledDate: '2024-11-17',
      sentDate: '2024-11-17 08:00 AM',
      priority: 'normal'
    },
    {
      id: 'NOT016',
      title: 'Family Health Plan - Join Now',
      message: 'Protect your entire family with our comprehensive family health plan. Special offer!',
      type: 'sms',
      targetAudience: 'Users with Family Members',
      sentTo: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      status: 'scheduled',
      scheduledDate: '2024-11-20',
      sentDate: '',
      priority: 'normal'
    },
    {
      id: 'NOT017',
      title: 'Monthly Health Tips',
      message: 'Stay healthy this winter! Tips for boosting immunity and staying fit.',
      type: 'email',
      targetAudience: 'All Active Users',
      sentTo: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      status: 'draft',
      scheduledDate: '',
      sentDate: '',
      priority: 'low'
    },
    {
      id: 'NOT018',
      title: 'Vaccination Drive Reminder',
      message: 'Don\'t miss the free vaccination drive at your nearest hospital this Sunday!',
      type: 'push',
      targetAudience: 'All Users',
      sentTo: 15420,
      delivered: 15405,
      opened: 9876,
      clicked: 2340,
      failed: 15,
      status: 'sent',
      scheduledDate: '2024-11-12',
      sentDate: '2024-11-12 08:00 AM',
      priority: 'high'
    }
  ]);

  // Mock data for reports
  const [reports] = useState([
    {
      id: 'REP001',
      title: 'Daily Revenue Report',
      category: 'Financial',
      description: 'Complete revenue breakdown for today',
      dateRange: '2024-11-17',
      totalRevenue: 456780,
      transactions: 1234,
      commissionEarned: 45678,
      status: 'completed',
      generatedDate: '2024-11-17 11:59 PM',
      format: 'PDF'
    },
    {
      id: 'REP002',
      title: 'Monthly User Activity Report',
      category: 'Users',
      description: 'User registration, activity, and retention metrics for November 2024',
      dateRange: '2024-11-01 to 2024-11-17',
      newUsers: 1245,
      activeUsers: 8934,
      churnRate: '5.2%',
      status: 'completed',
      generatedDate: '2024-11-17 10:00 AM',
      format: 'Excel'
    },
    {
      id: 'REP003',
      title: 'Hospital Performance Report',
      category: 'Hospitals',
      description: 'Hospital-wise appointment, revenue, and rating analysis',
      dateRange: '2024-11-01 to 2024-11-17',
      totalHospitals: 245,
      activeHospitals: 238,
      totalAppointments: 5678,
      averageRating: 4.3,
      status: 'completed',
      generatedDate: '2024-11-17 09:30 AM',
      format: 'PDF'
    },
    {
      id: 'REP004',
      title: 'Doctor Consultation Analytics',
      category: 'Doctors',
      description: 'Doctor-wise consultation count, revenue, and patient satisfaction',
      dateRange: '2024-11-01 to 2024-11-17',
      totalConsultations: 8934,
      onlineConsultations: 3456,
      opdConsultations: 5478,
      totalRevenue: 891200,
      status: 'completed',
      generatedDate: '2024-11-17 08:00 AM',
      format: 'CSV'
    },
    {
      id: 'REP005',
      title: 'Weekly Pharmacy Sales Report',
      category: 'Chemists',
      description: 'Medicine order trends and pharmacy performance',
      dateRange: '2024-11-11 to 2024-11-17',
      totalOrders: 2340,
      totalRevenue: 234500,
      topSellingMedicines: 45,
      averageOrderValue: 1002,
      status: 'completed',
      generatedDate: '2024-11-17 07:00 PM',
      format: 'Excel'
    },
    {
      id: 'REP006',
      title: 'Ambulance Service Utilization',
      category: 'Ambulances',
      description: 'Emergency response times and ambulance booking trends',
      dateRange: '2024-11-01 to 2024-11-17',
      totalBookings: 456,
      avgResponseTime: '12 minutes',
      emergencyCalls: 234,
      scheduledBookings: 222,
      status: 'completed',
      generatedDate: '2024-11-17 06:30 PM',
      format: 'PDF'
    },
    {
      id: 'REP007',
      title: 'Lab Tests Analytics Report',
      category: 'Pathlabs',
      description: 'Pathlab performance, popular tests, and turnaround time analysis',
      dateRange: '2024-11-01 to 2024-11-17',
      totalTests: 3456,
      totalRevenue: 567800,
      avgTurnaroundTime: '24 hours',
      popularTests: 23,
      status: 'completed',
      generatedDate: '2024-11-17 05:00 PM',
      format: 'CSV'
    },
    {
      id: 'REP008',
      title: 'Payment Gateway Comparison',
      category: 'Financial',
      description: 'Gateway-wise transaction success rate and settlement analysis',
      dateRange: '2024-11-01 to 2024-11-17',
      totalTransactions: 8934,
      successRate: '96.7%',
      totalAmount: 2345600,
      failedAmount: 78900,
      status: 'completed',
      generatedDate: '2024-11-17 04:00 PM',
      format: 'Excel'
    },
    {
      id: 'REP009',
      title: 'Geographic Distribution Report',
      category: 'Analytics',
      description: 'City-wise user distribution and service utilization',
      dateRange: '2024-11-01 to 2024-11-17',
      topCities: 15,
      totalUsers: 15420,
      servicesCovered: 45,
      growthRate: '12.5%',
      status: 'in-progress',
      generatedDate: '',
      format: 'PDF'
    },
    {
      id: 'REP010',
      title: 'Customer Reviews Summary',
      category: 'Reviews',
      description: 'Overall rating trends and review sentiment analysis',
      dateRange: '2024-11-01 to 2024-11-17',

     totalReviews: 2345,
      averageRating: 4.2,
      positiveReviews: 1890,
      negativeReviews: 123,
      status: 'completed',
      generatedDate: '2024-11-17 03:00 PM',
      format: 'PDF'
    },
    {
      id: 'REP011',
      title: 'Marketing Campaign Performance',
      category: 'Marketing',
      description: 'Campaign ROI, coupon usage, and banner click analysis',
      dateRange: '2024-11-01 to 2024-11-17',
      activeCampaigns: 6,
      totalClicks: 45678,
      totalConversions: 1234,
      conversionRate: '2.7%',
      status: 'completed',
      generatedDate: '2024-11-17 02:00 PM',
      format: 'Excel'
    },
    {
      id: 'REP012',
      title: 'Quarterly Business Report Q4 2024',
      category: 'Financial',
      description: 'Comprehensive business performance for Q4 2024',
      dateRange: '2024-10-01 to 2024-12-31',
      totalRevenue: 0,
      transactions: 0,
      commissionEarned: 0,
      status: 'scheduled',
      generatedDate: '',
      format: 'PDF'
    }
  ]);

  // Mock data for dashboard widgets
  const dashboardStats = {
    totalUsers: 15420,
    totalHospitals: 245,
    totalDoctors: 1834,
    activeAmbulances: 89,
    totalChemists: 567,
    totalPathlabs: 123,
    todayAppointmentsOnline: 342,
    todayAppointmentsOPD: 589,
    todayEmergencyCalls: 23,
    todayOrders: 156,
    todayLabTests: 234,
    pendingKYC: 47
  };

const menuSections = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'hospitals', label: 'Hospital Management', icon: '🏥' },
  { id: 'doctors', label: 'Doctor Management', icon: '👨‍⚕️' },
  { id: 'patients', label: 'Patient Management', icon: '👥' },
  { id: 'appointments', label: 'Appointments', icon: '📅' },
  { id: 'chemists', label: 'Chemist Management', icon: '💊' },
  { id: 'ambulances', label: 'Ambulance Management', icon: '🚑' },
  { id: 'pathlabs', label: 'Pathlab Management', icon: '🔬' },
  { id: 'payments', label: 'Payments & Payouts', icon: '💳' },
  { id: 'reviews', label: 'Reviews & Ratings', icon: '⭐' },
  { id: 'cms', label: 'CMS & Marketing', icon: '📢' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'reports', label: 'Reports & Analytics', icon: '📈' }
];


  if (!adminUser) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'admin-mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-header-content">
            <div className="admin-logo">⚙️</div>
            <h2>Admin Panel</h2>
            <p>Hospo Healthcare</p>
          </div>
          <button 
            className="admin-sidebar-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {menuSections.map(section => (
            <button
              key={section.id}
              className={activeSection === section.id ? 'admin-active' : ''}
              onClick={() => handleSectionClick(section.id)}
            >
              <span className="admin-nav-icon">{section.icon}</span>
              <span className="admin-nav-label">{section.label}</span>
            </button>
          ))}
          
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="admin-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Toggle */}
      <button 
        className={`admin-mobile-menu-toggle ${isMobileMenuOpen ? 'admin-hidden' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Main Content */}
      <main className="admin-main-content">
        <header className="admin-content-header">
          <div>
            <h1>Welcome, {adminUser.name}! 👋</h1>
            <p>Healthcare Management System - Admin Dashboard</p>
          </div>
          <div className="admin-user-info">
            <span className="admin-badge">⚙️ Admin</span>
            <span className="admin-email">{adminUser.email}</span>
          </div>
        </header>

        <div className="admin-content-body">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="admin-section">
              <h2>📊 Dashboard Overview</h2>
              
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#dbeafe'}}>👥</div>
                  <div className="admin-stat-info">
                    <h3>Total Registered Users</h3>
                    <p className="admin-stat-value">{dashboardStats.totalUsers.toLocaleString()}</p>
                    <span className="admin-stat-change positive">+234 this month</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#fce7f3'}}>🏥</div>
                  <div className="admin-stat-info">
                    <h3>Total Hospitals / Clinics</h3>
                    <p className="admin-stat-value">{dashboardStats.totalHospitals}</p>
                    <span className="admin-stat-change positive">+12 this month</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#e0e7ff'}}>👨‍⚕️</div>
                  <div className="admin-stat-info">
                    <h3>Total Doctors</h3>
                    <p className="admin-stat-value">{dashboardStats.totalDoctors.toLocaleString()}</p>
                    <span className="admin-stat-change positive">+89 this month</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#fed7aa'}}>🚑</div>
                  <div className="admin-stat-info">
                    <h3>Active Ambulances</h3>
                    <p className="admin-stat-value">{dashboardStats.activeAmbulances}</p>
                    <span className="admin-stat-change">Currently active</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#fce7f3'}}>💊</div>
                  <div className="admin-stat-info">
                    <h3>Total Chemists</h3>
                    <p className="admin-stat-value">{dashboardStats.totalChemists}</p>
                    <span className="admin-stat-change positive">+34 this month</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#ddd6fe'}}>🔬</div>
                  <div className="admin-stat-info">
                    <h3>Total Pathlabs</h3>
                    <p className="admin-stat-value">{dashboardStats.totalPathlabs}</p>
                    <span className="admin-stat-change positive">+8 this month</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#bbf7d0'}}>📅</div>
                  <div className="admin-stat-info">
                    <h3>Today's Online Consult</h3>
                    <p className="admin-stat-value">{dashboardStats.todayAppointmentsOnline}</p>
                    <span className="admin-stat-change">Video/Audio/Chat</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#bfdbfe'}}>🏥</div>
                  <div className="admin-stat-info">
                    <h3>Today's OPD Appointments</h3>
                    <p className="admin-stat-value">{dashboardStats.todayAppointmentsOPD}</p>
                    <span className="admin-stat-change">Clinic visits</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#fecaca'}}>🚨</div>
                  <div className="admin-stat-info">
                    <h3>Today's Emergency Calls</h3>
                    <p className="admin-stat-value">{dashboardStats.todayEmergencyCalls}</p>
                    <span className="admin-stat-change warning">Urgent attention</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#fef3c7'}}>🛒</div>
                  <div className="admin-stat-info">
                    <h3>Today's Orders</h3>
                    <p className="admin-stat-value">{dashboardStats.todayOrders}</p>
                    <span className="admin-stat-change">Medicine orders</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{background: '#e9d5ff'}}>🧪</div>
                  <div className="admin-stat-info">
                    <h3>Today's Lab Tests</h3>
                    <p className="admin-stat-value">{dashboardStats.todayLabTests}</p>
                    <span className="admin-stat-change">Test bookings</span>
                  </div>
                </div>

                <div className="admin-stat-card highlight">
                  <div className="admin-stat-icon" style={{background: '#fed7aa'}}>⏳</div>
                  <div className="admin-stat-info">
                    <h3>Pending KYC Approvals</h3>
                    <p className="admin-stat-value">{dashboardStats.pendingKYC}</p>
                    <span className="admin-stat-change warning">Requires action</span>
                  </div>
                </div>
              </div>

              <h3 style={{marginTop: '40px'}}>Quick Actions</h3>
              <div className="admin-quick-actions">
                <button className="admin-action-btn" onClick={() => setActiveSection('hospitals')}>
                  <span className="admin-action-icon">🏥</span>
                  <span>Approve Hospitals</span>
                </button>
                <button className="admin-action-btn" onClick={() => setActiveSection('doctors')}>
                  <span className="admin-action-icon">👨‍⚕️</span>
                  <span>Verify Doctors</span>
                </button>
                <button className="admin-action-btn" onClick={() => setActiveSection('payments')}>
                  <span className="admin-action-icon">💳</span>
                  <span>Process Payouts</span>
                </button>
                <button className="admin-action-btn" onClick={() => setActiveSection('reviews')}>
                  <span className="admin-action-icon">⭐</span>
                  <span>Moderate Reviews</span>
                </button>
              </div>
            </div>
          )}

          {/* Hospital Management Section */}
          {activeSection === 'hospitals' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>🏥 Hospital Management</h2>
                <button className="admin-add-btn" onClick={() => openModal('add', 'hospitals')}>
                  + Add Hospital
                </button>
              </div>

              <div className="admin-filters">
                <input type="text" placeholder="Search by name, city, phone..." className="admin-search-input" />
                <select className="admin-filter-select">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="blocked">Blocked</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">KYC Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Hospital ID</th>
                      <th>Hospital Name</th>
                      <th>City</th>
                      <th>Contact Person</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>KYC Status</th>
                      <th>Total Doctors</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map(hospital => (
                      <React.Fragment key={hospital.id}>
                        <tr style={{background: expandedHospitalId === hospital.id ? '#f0f9ff' : 'transparent'}}>
                          <td>{hospital.id}</td>
                          <td>{hospital.name}</td>
                          <td>{hospital.city}</td>
                          <td>{hospital.contactPerson}</td>
                          <td>{hospital.mobile}</td>
                          <td>
                            <span className={`admin-status-badge ${hospital.status}`}>
                              {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-status-badge ${hospital.kycStatus}`}>
                              {hospital.kycStatus.charAt(0).toUpperCase() + hospital.kycStatus.slice(1)}
                            </span>
                          </td>
                          <td>{hospital.totalDoctors}</td>
                          <td>
                            <button 
                              className="admin-icon-btn" 
                              title="View Details"
                              onClick={() => openModal('view', 'hospitals', hospital)}
                            >
                              👁️
                            </button>
                            <button 
                              className="admin-icon-btn" 
                              title="Edit"
                              onClick={() => openModal('edit', 'hospitals', hospital)}
                            >
                              ✏️
                            </button>
                            {hospital.status !== 'blocked' ? (
                              <button className="admin-icon-btn" title="Block">🚫</button>
                            ) : (
                              <button className="admin-icon-btn" title="Unblock">✅</button>
                            )}
                            <button 
                              className="admin-icon-btn" 
                              title="Manage Hospital Details"
                              onClick={() => toggleHospitalExpansion(hospital.id)}
                              style={{
                                background: expandedHospitalId === hospital.id ? '#234f83' : 'transparent',
                                color: expandedHospitalId === hospital.id ? '#fff' : 'inherit'
                              }}
                            >
                              {expandedHospitalId === hospital.id ? '▼' : '▶'}
                            </button>
                          </td>
                        </tr>
                        
                        {/* Expandable Management Section */}
                        {expandedHospitalId === hospital.id && (
                          <tr>
                            <td colSpan="9" style={{padding: 0, background: '#f9fafb'}}>
                              <div style={{padding: '20px'}}>
                                {/* Management Tabs */}
                                <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb'}}>
                                  <button
                                    onClick={() => setHospitalManagementTab('kyc')}
                                    style={{
                                      padding: '10px 20px',
                                      background: hospitalManagementTab === 'kyc' ? '#234f83' : 'transparent',
                                      color: hospitalManagementTab === 'kyc' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: hospitalManagementTab === 'kyc' ? '3px solid #234f83' : 'none',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                      fontSize: '14px'
                                    }}
                                  >
                                    📄 KYC/Legal
                                  </button>
                                  <button
                                    onClick={() => setHospitalManagementTab('operational')}
                                    style={{
                                      padding: '10px 20px',
                                      background: hospitalManagementTab === 'operational' ? '#234f83' : 'transparent',
                                      color: hospitalManagementTab === 'operational' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: hospitalManagementTab === 'operational' ? '3px solid #234f83' : 'none',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                      fontSize: '14px'
                                    }}
                                  >
                                    ⚙️ Operational
                                  </button>
                                  <button
                                    onClick={() => setHospitalManagementTab('commission')}
                                    style={{
                                      padding: '10px 20px',
                                      background: hospitalManagementTab === 'commission' ? '#234f83' : 'transparent',
                                      color: hospitalManagementTab === 'commission' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: hospitalManagementTab === 'commission' ? '3px solid #234f83' : 'none',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                      fontSize: '14px'
                                    }}
                                  >
                                    💰 Commission
                                  </button>
                                  <button
                                    onClick={() => setHospitalManagementTab('majorExpenses')}
                                    style={{
                                      padding: '10px 20px',
                                      background: hospitalManagementTab === 'majorExpenses' ? '#234f83' : 'transparent',
                                      color: hospitalManagementTab === 'majorExpenses' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: hospitalManagementTab === 'majorExpenses' ? '3px solid #234f83' : 'none',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                      fontSize: '14px'
                                    }}
                                  >
                                    💸 Major Expenses
                                  </button>
                                </div>

                                {/* Tab Content */}
                                <div style={{background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                  {/* KYC Tab Content */}
                                  {hospitalManagementTab === 'kyc' && (
                                    <div>
                                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                        <h3 style={{margin: 0, color: '#234f83'}}>📄 KYC/Legal Documents</h3>
                                        {!isEditingKyc && (
                                          <button 
                                            className="admin-btn-primary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => {
                                              setIsEditingKyc(true);
                                              setKycFormData({
                                                gstNumber: hospital.gstNumber || '',
                                                panNumber: hospital.panNumber || '',
                                                aadhaarNumber: hospital.aadhaarNumber || '',
                                                accountNumber: hospital.accountNumber || '',
                                                ifscCode: hospital.ifscCode || '',
                                                bankName: hospital.bankName || ''
                                              });
                                            }}
                                          >
                                            ✏️ Edit KYC Details
                                          </button>
                                        )}
                                      </div>

                                      {isEditingKyc ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleKycSave(hospital.id); }}>
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div className="admin-form-group">
                                              <label>GST Number *</label>
                                              <input 
                                                type="text" 
                                                value={kycFormData.gstNumber || ''} 
                                                onChange={(e) => setKycFormData({...kycFormData, gstNumber: e.target.value})}
                                                placeholder="Enter GST Number"
                                                required
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>PAN Number *</label>
                                              <input 
                                                type="text" 
                                                value={kycFormData.panNumber || ''} 
                                                onChange={(e) => setKycFormData({...kycFormData, panNumber: e.target.value})}
                                                placeholder="Enter PAN Number"
                                                required
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Aadhaar Number</label>
                                              <input 
                                                type="text" 
                                                value={kycFormData.aadhaarNumber || ''} 
                                                onChange={(e) => setKycFormData({...kycFormData, aadhaarNumber: e.target.value})}
                                                placeholder="Enter Aadhaar Number"
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Bank Name *</label>
                                              <input 
                                                type="text" 
                                                value={kycFormData.bankName || ''} 
                                                onChange={(e) => setKycFormData({...kycFormData, bankName: e.target.value})}
                                                placeholder="Enter Bank Name"
                                                required
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Account Number *</label>
                                              <input 
                                                type="text" 
                                                value={kycFormData.accountNumber || ''} 
                                                onChange={(e) => setKycFormData({...kycFormData, accountNumber: e.target.value})}
                                                placeholder="Enter Account Number"
                                                required
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>IFSC Code *</label>
                                              <input 
                                                type="text" 
                                                value={kycFormData.ifscCode || ''} 
                                                onChange={(e) => setKycFormData({...kycFormData, ifscCode: e.target.value})}
                                                placeholder="Enter IFSC Code"
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="admin-form-group" style={{marginTop: '15px'}}>
                                            <label>Registration Certificate</label>
                                            <input type="file" accept=".pdf,.jpg,.png" />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>PAN Card Document</label>
                                            <input type="file" accept=".pdf,.jpg,.png" />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Aadhaar Card Document</label>
                                            <input type="file" accept=".pdf,.jpg,.png" />
                                          </div>
                                          <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                            <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                            <button 
                                              type="button" 
                                              className="admin-btn-secondary" 
                                              style={{padding: '8px 16px'}}
                                              onClick={() => setIsEditingKyc(false)}
                                            >
                                              ✖️ Cancel
                                            </button>
                                          </div>
                                        </form>
                                      ) : (
                                        <>
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>GST Number:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.gstNumber || 'Not provided'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>PAN Number:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.panNumber || 'Not provided'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Registration Certificate:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.registrationCertificate ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>PAN Card:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.panCard ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Aadhaar Card:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.aadhaarCard ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Bank Account:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.accountNumber || 'Not provided'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>IFSC Code:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.ifscCode || 'Not provided'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>KYC Status:</strong>
                                              <p style={{margin: '5px 0 0 0'}}>
                                                <span className={`admin-status-badge ${hospital.kycStatus}`}>
                                                  {hospital.kycStatus.charAt(0).toUpperCase() + hospital.kycStatus.slice(1)}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                          <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                            <button className="admin-btn-primary" style={{padding: '8px 16px'}}>✅ Approve KYC</button>
                                            <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>❌ Reject KYC</button>
                                            <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>👁️ View Documents</button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}

                                  {/* Operational Tab Content */}
                                  {hospitalManagementTab === 'operational' && (
                                    <div>
                                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                        <h3 style={{margin: 0, color: '#234f83'}}>⚙️ Operational Details</h3>
                                        {!isEditingOperational && (
                                          <button 
                                            className="admin-btn-primary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => {
                                              setIsEditingOperational(true);
                                              setOperationalFormData({
                                                is24x7: hospital.is24x7 || false,
                                                openingTime: hospital.openingTime || '',
                                                closingTime: hospital.closingTime || '',
                                                minConsultFee: hospital.minConsultFee || '',
                                                maxConsultFee: hospital.maxConsultFee || '',
                                                availableServices: hospital.availableServices?.join(', ') || '',
                                                facilities: hospital.facilities?.join(', ') || '',
                                                totalBeds: hospital.totalBeds || '',
                                                icuBeds: hospital.icuBeds || '',
                                                ventilators: hospital.ventilators || ''
                                              });
                                            }}
                                          >
                                            ✏️ Edit Operational Details
                                          </button>
                                        )}
                                      </div>

                                      {isEditingOperational ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleOperationalSave(hospital.id); }}>
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div className="admin-form-group">
                                              <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                <input 
                                                  type="checkbox" 
                                                  checked={operationalFormData.is24x7 || false}
                                                  onChange={(e) => setOperationalFormData({...operationalFormData, is24x7: e.target.checked})}
                                                  style={{width: 'auto'}}
                                                />
                                                <span>Open 24x7</span>
                                              </label>
                                            </div>
                                            <div></div>
                                            <div className="admin-form-group">
                                              <label>Opening Time</label>
                                              <input 
                                                type="time" 
                                                value={operationalFormData.openingTime || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, openingTime: e.target.value})}
                                                disabled={operationalFormData.is24x7}
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Closing Time</label>
                                              <input 
                                                type="time" 
                                                value={operationalFormData.closingTime || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, closingTime: e.target.value})}
                                                disabled={operationalFormData.is24x7}
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Min Consultation Fee (₹)</label>
                                              <input 
                                                type="number" 
                                                value={operationalFormData.minConsultFee || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, minConsultFee: e.target.value})}
                                                placeholder="Minimum fee"
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Max Consultation Fee (₹)</label>
                                              <input 
                                                type="number" 
                                                value={operationalFormData.maxConsultFee || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, maxConsultFee: e.target.value})}
                                                placeholder="Maximum fee"
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Total Beds</label>
                                              <input 
                                                type="number" 
                                                value={operationalFormData.totalBeds || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, totalBeds: e.target.value})}
                                                placeholder="Total beds"
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>ICU Beds</label>
                                              <input 
                                                type="number" 
                                                value={operationalFormData.icuBeds || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, icuBeds: e.target.value})}
                                                placeholder="ICU beds"
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Ventilators</label>
                                              <input 
                                                type="number" 
                                                value={operationalFormData.ventilators || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, ventilators: e.target.value})}
                                                placeholder="Number of ventilators"
                                              />
                                            </div>
                                            <div className="admin-form-group" style={{gridColumn: '1 / -1'}}>
                                              <label>Available Services (comma-separated)</label>
                                              <textarea 
                                                value={operationalFormData.availableServices || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, availableServices: e.target.value})}
                                                placeholder="e.g., Emergency, Surgery, Cardiology, Neurology"
                                                rows="3"
                                              />
                                            </div>
                                            <div className="admin-form-group" style={{gridColumn: '1 / -1'}}>
                                              <label>Facilities (comma-separated)</label>
                                              <textarea 
                                                value={operationalFormData.facilities || ''} 
                                                onChange={(e) => setOperationalFormData({...operationalFormData, facilities: e.target.value})}
                                                placeholder="e.g., Pharmacy, Parking, Cafeteria, Lab"
                                                rows="3"
                                              />
                                            </div>
                                          </div>
                                          <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                            <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                            <button 
                                              type="button" 
                                              className="admin-btn-secondary" 
                                              style={{padding: '8px 16px'}}
                                              onClick={() => setIsEditingOperational(false)}
                                            >
                                              ✖️ Cancel
                                            </button>
                                          </div>
                                        </form>
                                      ) : (
                                        <>
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>24x7 Status:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                                <span className={`admin-status-badge ${hospital.is24x7 ? 'approved' : 'pending'}`}>
                                                  {hospital.is24x7 ? '24x7 Open' : 'Limited Hours'}
                                                </span>
                                              </p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Operating Hours:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.openingTime || 'N/A'} - {hospital.closingTime || 'N/A'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Consultation Fee Range:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>₹{hospital.minConsultFee || 0} - ₹{hospital.maxConsultFee || 0}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Available Services:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.availableServices?.length || 0} Services</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Facilities:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.facilities?.length || 0} Facilities</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Total Beds:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.totalBeds || 'Not specified'}</p>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}

                                  {/* Commission Tab Content */}
                                  {hospitalManagementTab === 'commission' && (
                                    <div>
                                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                        <h3 style={{margin: 0, color: '#234f83'}}>💰 Commission & Payout</h3>
                                        {!isEditingCommission && (
                                          <button 
                                            className="admin-btn-primary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => {
                                              setIsEditingCommission(true);
                                              setCommissionFormData({
                                                commissionType: hospital.commissionType || '',
                                                commissionValue: hospital.commissionValue || '',
                                                settlementCycle: hospital.settlementCycle || '',
                                                paymentMode: hospital.paymentMode || '',
                                                accountNumber: hospital.accountNumber || '',
                                                ifscCode: hospital.ifscCode || ''
                                              });
                                            }}
                                          >
                                            ✏️ Edit Commission
                                          </button>
                                        )}
                                      </div>

                                      {isEditingCommission ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleCommissionSave(hospital.id); }}>
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div className="admin-form-group">
                                              <label>Commission Type *</label>
                                              <select 
                                                value={commissionFormData.commissionType || ''} 
                                                onChange={(e) => setCommissionFormData({...commissionFormData, commissionType: e.target.value})}
                                                required
                                              >
                                                <option value="">Select Commission Type</option>
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="fixed">Fixed Amount (₹)</option>
                                              </select>
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Commission Value *</label>
                                              <input 
                                                type="number" 
                                                value={commissionFormData.commissionValue || ''} 
                                                onChange={(e) => setCommissionFormData({...commissionFormData, commissionValue: e.target.value})}
                                                placeholder={commissionFormData.commissionType === 'percentage' ? 'Enter %' : 'Enter ₹'}
                                                required
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Settlement Cycle *</label>
                                              <select 
                                                value={commissionFormData.settlementCycle || ''} 
                                                onChange={(e) => setCommissionFormData({...commissionFormData, settlementCycle: e.target.value})}
                                                required
                                              >
                                                <option value="">Select Settlement Cycle</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="15days">Every 15 Days</option>
                                                <option value="monthly">Monthly</option>
                                              </select>
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Payment Mode *</label>
                                              <select 
                                                value={commissionFormData.paymentMode || ''} 
                                                onChange={(e) => setCommissionFormData({...commissionFormData, paymentMode: e.target.value})}
                                                required
                                              >
                                                <option value="">Select Payment Mode</option>
                                                <option value="bank">Bank Transfer</option>
                                                <option value="upi">UPI</option>
                                                <option value="cheque">Cheque</option>
                                              </select>
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Bank Account Number *</label>
                                              <input 
                                                type="text" 
                                                value={commissionFormData.accountNumber || ''} 
                                                onChange={(e) => setCommissionFormData({...commissionFormData, accountNumber: e.target.value})}
                                                placeholder="Enter Account Number"
                                                required
                                              />
                                            </div>
                                            <div className="admin-form-group">
                                              <label>IFSC Code *</label>
                                              <input 
                                                type="text" 
                                                value={commissionFormData.ifscCode || ''} 
                                                onChange={(e) => setCommissionFormData({...commissionFormData, ifscCode: e.target.value})}
                                                placeholder="Enter IFSC Code"
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                            <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                            <button 
                                              type="button" 
                                              className="admin-btn-secondary" 
                                              style={{padding: '8px 16px'}}
                                              onClick={() => setIsEditingCommission(false)}
                                            >
                                              ✖️ Cancel
                                            </button>
                                          </div>
                                        </form>
                                      ) : (
                                        <>
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Commission Type:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                                <span className={`admin-status-badge ${hospital.commissionType === 'percentage' ? 'approved' : 'pending'}`}>
                                                  {hospital.commissionType?.charAt(0).toUpperCase() + hospital.commissionType?.slice(1) || 'N/A'}
                                                </span>
                                              </p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Commission Value:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>
                                                {hospital.commissionType === 'percentage' 
                                                  ? `${hospital.commissionValue}%` 
                                                  : `₹${hospital.commissionValue || 0}`}
                                              </p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Settlement Cycle:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.settlementCycle || 'Not set'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Payment Mode:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.paymentMode || 'Not set'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Bank Account:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.accountNumber || 'Not provided'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Last Settlement:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{hospital.registeredDate || 'N/A'}</p>
                                            </div>
                                          </div>
                                          <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                            <button className="admin-btn-primary" style={{padding: '8px 16px'}}>💳 Process Payout</button>
                                            <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📊 View Payout History</button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}

                                  {/* Major Expenses Tab Content */}
                                  {hospitalManagementTab === 'majorExpenses' && (
                                    <div>
                                      <h3 style={{marginTop: 0, color: '#234f83', marginBottom: '20px'}}>💸 Major Expenses</h3>
                                      
                                      {/* Category Cards */}
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px'}}>
                                        <div style={{padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: '#fff', textAlign: 'center'}}>
                                          <div style={{fontSize: '32px', marginBottom: '10px'}}>🛏️</div>
                                          <strong>Rooms & Boards</strong>
                                          <p style={{fontSize: '24px', fontWeight: 'bold', margin: '10px 0'}}>{rooms.length}</p>
                                          <button 
                                            onClick={() => openExpenseModal('rooms', 'add')}
                                            style={{padding: '6px 12px', background: '#fff', color: '#667eea', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'}}
                                          >
                                            + Add Room
                                          </button>
                                        </div>
                                        <div style={{padding: '15px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '8px', color: '#fff', textAlign: 'center'}}>
                                          <div style={{fontSize: '32px', marginBottom: '10px'}}>🏥</div>
                                          <strong>Medical Procedures</strong>
                                          <p style={{fontSize: '24px', fontWeight: 'bold', margin: '10px 0'}}>{procedures.length}</p>
                                          <button 
                                            onClick={() => openExpenseModal('procedures', 'add')}
                                            style={{padding: '6px 12px', background: '#fff', color: '#f5576c', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'}}
                                          >
                                            + Add Procedure
                                          </button>
                                        </div>
                                        <div style={{padding: '15px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '8px', color: '#fff', textAlign: 'center'}}>
                                          <div style={{fontSize: '32px', marginBottom: '10px'}}>👨‍⚕️</div>
                                          <strong>Doctor Fees</strong>
                                          <p style={{fontSize: '24px', fontWeight: 'bold', margin: '10px 0'}}>{doctorFees.length}</p>
                                          <button 
                                            onClick={() => openExpenseModal('doctorFees', 'add')}
                                            style={{padding: '6px 12px', background: '#fff', color: '#00f2fe', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'}}
                                          >
                                            + Add Fee
                                          </button>
                                        </div>
                                      </div>

                                      {/* Expense Tables */}
                                      <div style={{marginTop: '20px'}}>
                                        <h4 style={{color: '#234f83', marginBottom: '15px'}}>🛏️ Rooms & Boards</h4>
                                        <div style={{overflowX: 'auto', marginBottom: '20px'}}>
                                          <table className="admin-table" style={{fontSize: '13px'}}>
                                            <thead>
                                              <tr>
                                                <th>Room Type</th>
                                                <th>Name</th>
                                                <th>Floor</th>
                                                <th>Charge/Day</th>
                                                <th>Max Beds</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {rooms.slice(0, 3).map(room => (
                                                <tr key={room.room_id}>
                                                  <td>{room.room_type}</td>
                                                  <td>{room.room_name}</td>
                                                  <td>{room.floor}</td>
                                                  <td>₹{room.charge_per_day}</td>
                                                  <td>{room.max_patients}</td>
                                                  <td><span className={`admin-status-badge ${room.status.toLowerCase()}`}>{room.status}</span></td>
                                                  <td>
                                                    <button className="admin-icon-btn" onClick={() => openExpenseModal('rooms', 'edit', room)}>✏️</button>
                                                    <button className="admin-icon-btn" onClick={() => handleExpenseDelete('rooms', room.room_id)}>🗑️</button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>

                                        <h4 style={{color: '#234f83', marginBottom: '15px'}}>🏥 Medical Procedures</h4>
                                        <div style={{overflowX: 'auto'}}>
                                          <table className="admin-table" style={{fontSize: '13px'}}>
                                            <thead>
                                              <tr>
                                                <th>Procedure Name</th>
                                                <th>Type</th>
                                                <th>Base Charge</th>
                                                <th>OT Charges</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {procedures.slice(0, 3).map(proc => (
                                                <tr key={proc.procedure_id}>
                                                  <td>{proc.procedure_name}</td>
                                                  <td>{proc.procedure_type}</td>
                                                  <td>₹{proc.base_charge}</td>
                                                  <td>₹{proc.ot_charges}</td>
                                                  <td><span className={`admin-status-badge ${proc.status.toLowerCase()}`}>{proc.status}</span></td>
                                                  <td>
                                                    <button className="admin-icon-btn" onClick={() => openExpenseModal('procedures', 'edit', proc)}>✏️</button>
                                                    <button className="admin-icon-btn" onClick={() => handleExpenseDelete('procedures', proc.procedure_id)}>🗑️</button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Doctor Management Section */}
          {activeSection === 'doctors' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>👨‍⚕️ Doctor Management</h2>
                <button className="admin-add-btn" onClick={() => openModal('add', 'doctors')}>+ Add Doctor</button>
              </div>
              
              <div className="admin-filters">
                <input type="text" placeholder="Search by name, speciality..." className="admin-search-input" />
                <select className="admin-filter-select">
                  <option value="">All Speciality</option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="pediatrician">Pediatrician</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">KYC Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Doctor ID</th>
                      <th>Doctor Name</th>
                      <th>Speciality</th>
                      <th>Linked Hospitals</th>
                      <th>City</th>
                      <th>Experience</th>
                      <th>Fee (₹)</th>
                      <th>KYC Status</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map(doctor => (
                      <React.Fragment key={doctor.id}>
                        <tr style={{background: expandedDoctorId === doctor.id ? '#f0f7ff' : 'transparent'}}>
                          <td>{doctor.id}</td>
                          <td>{doctor.name}</td>
                          <td>{doctor.speciality}</td>
                          <td>{doctor.linkedHospitals}</td>
                          <td>{doctor.city}</td>
                          <td>{doctor.experience} years</td>
                          <td>₹{doctor.fee}</td>
                          <td>
                            <span className={`admin-status-badge ${doctor.kycStatus}`}>
                              {doctor.kycStatus.charAt(0).toUpperCase() + doctor.kycStatus.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-status-badge ${doctor.status}`}>
                              {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="admin-icon-btn" 
                              title={expandedDoctorId === doctor.id ? "Collapse" : "Expand Management"}
                              onClick={() => toggleDoctorExpansion(doctor.id)}
                              style={{fontSize: '16px', fontWeight: 'bold'}}
                            >
                              {expandedDoctorId === doctor.id ? '▼' : '▶'}
                            </button>
                            <button 
                              className="admin-icon-btn" 
                              title="View Details"
                              onClick={() => openModal('view', 'doctors', doctor)}
                            >
                              👁️
                            </button>
                            <button 
                              className="admin-icon-btn" 
                              title="Edit"
                              onClick={() => openModal('edit', 'doctors', doctor)}
                            >
                              ✏️
                            </button>
                            {doctor.status !== 'blocked' ? (
                              <button className="admin-icon-btn" title="Block">🚫</button>
                            ) : (
                              <button className="admin-icon-btn" title="Unblock">✅</button>
                            )}
                          </td>
                        </tr>

                        {/* Expandable Management Section */}
                        {expandedDoctorId === doctor.id && (
                          <tr>
                            <td colSpan="10" style={{padding: '0', background: '#f9fafb'}}>
                              <div style={{padding: '20px', borderTop: '2px solid #234f83'}}>
                                {/* Management Tabs */}
                                <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb'}}>
                                  <button
                                    onClick={() => setDoctorManagementTab('professional')}
                                    style={{
                                      padding: '12px 20px',
                                      background: doctorManagementTab === 'professional' ? '#234f83' : 'transparent',
                                      color: doctorManagementTab === 'professional' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: doctorManagementTab === 'professional' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    👨‍⚕️ Professional Info
                                  </button>
                                  <button
                                    onClick={() => setDoctorManagementTab('hospitalLinks')}
                                    style={{
                                      padding: '12px 20px',
                                      background: doctorManagementTab === 'hospitalLinks' ? '#234f83' : 'transparent',
                                      color: doctorManagementTab === 'hospitalLinks' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: doctorManagementTab === 'hospitalLinks' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    🏥 Hospital Links
                                  </button>
                                  <button
                                    onClick={() => setDoctorManagementTab('consultationFees')}
                                    style={{
                                      padding: '12px 20px',
                                      background: doctorManagementTab === 'consultationFees' ? '#234f83' : 'transparent',
                                      color: doctorManagementTab === 'consultationFees' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: doctorManagementTab === 'consultationFees' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    💰 Consultation Fees
                                  </button>
                                  <button
                                    onClick={() => setDoctorManagementTab('availability')}
                                    style={{
                                      padding: '12px 20px',
                                      background: doctorManagementTab === 'availability' ? '#234f83' : 'transparent',
                                      color: doctorManagementTab === 'availability' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: doctorManagementTab === 'availability' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    📅 Availability
                                  </button>
                                  <button
                                    onClick={() => setDoctorManagementTab('kyc')}
                                    style={{
                                      padding: '12px 20px',
                                      background: doctorManagementTab === 'kyc' ? '#234f83' : 'transparent',
                                      color: doctorManagementTab === 'kyc' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: doctorManagementTab === 'kyc' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    📄 KYC/Verification
                                  </button>
                                </div>

                                {/* Professional Info Tab */}
                                {doctorManagementTab === 'professional' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>👨‍⚕️ Professional Information</h3>
                                      {!isEditingProfessional && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingProfessional(true);
                                            setProfessionalFormData({
                                              speciality: doctor.speciality || '',
                                              subSpeciality: doctor.subSpeciality || '',
                                              qualification: doctor.qualification || '',
                                              experience: doctor.experience || '',
                                              registrationNumber: doctor.registrationNumber || '',
                                              languages: doctor.languages?.join(', ') || ''
                                            });
                                          }}
                                        >
                                          ✏️ Edit Professional Info
                                        </button>
                                      )}
                                    </div>

                                    {isEditingProfessional ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleProfessionalSave(doctor.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Speciality *</label>
                                            <select 
                                              value={professionalFormData.speciality || ''} 
                                              onChange={(e) => setProfessionalFormData({...professionalFormData, speciality: e.target.value})}
                                              required
                                            >
                                              <option value="">Select Speciality</option>
                                              <option value="Cardiologist">Cardiologist</option>
                                              <option value="Dermatologist">Dermatologist</option>
                                              <option value="Pediatrician">Pediatrician</option>
                                              <option value="Neurologist">Neurologist</option>
                                              <option value="Orthopedic">Orthopedic</option>
                                              <option value="General Physician">General Physician</option>
                                            </select>
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Sub-Speciality</label>
                                            <input 
                                              type="text" 
                                              value={professionalFormData.subSpeciality || ''} 
                                              onChange={(e) => setProfessionalFormData({...professionalFormData, subSpeciality: e.target.value})}
                                              placeholder="e.g., Interventional Cardiology"
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Qualification *</label>
                                            <input 
                                              type="text" 
                                              value={professionalFormData.qualification || ''} 
                                              onChange={(e) => setProfessionalFormData({...professionalFormData, qualification: e.target.value})}
                                              placeholder="e.g., MBBS, MD"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Years of Experience *</label>
                                            <input 
                                              type="number" 
                                              value={professionalFormData.experience || ''} 
                                              onChange={(e) => setProfessionalFormData({...professionalFormData, experience: e.target.value})}
                                              placeholder="Years"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Medical Council Reg. No. *</label>
                                            <input 
                                              type="text" 
                                              value={professionalFormData.registrationNumber || ''} 
                                              onChange={(e) => setProfessionalFormData({...professionalFormData, registrationNumber: e.target.value})}
                                              placeholder="Registration Number"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Languages (comma-separated)</label>
                                            <input 
                                              type="text" 
                                              value={professionalFormData.languages || ''} 
                                              onChange={(e) => setProfessionalFormData({...professionalFormData, languages: e.target.value})}
                                              placeholder="e.g., English, Hindi, Marathi"
                                            />
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingProfessional(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Speciality:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.speciality || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Sub-Speciality:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.subSpeciality || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Qualification:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.qualification || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Experience:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.experience || '0'} years</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Registration Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.registrationNumber || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Languages:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.languages?.join(', ') || 'Not provided'}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Hospital Links Tab */}
                                {doctorManagementTab === 'hospitalLinks' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>🏥 Hospital Links</h3>
                                      {!isEditingHospitalLinks && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingHospitalLinks(true);
                                            setHospitalLinksFormData({
                                              primaryHospital: doctor.primaryHospital || '',
                                              otherHospitals: doctor.otherHospitals?.join(', ') || ''
                                            });
                                          }}
                                        >
                                          ✏️ Edit Hospital Links
                                        </button>
                                      )}
                                    </div>

                                    {isEditingHospitalLinks ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleHospitalLinksSave(doctor.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Primary Hospital *</label>
                                            <select 
                                              value={hospitalLinksFormData.primaryHospital || ''} 
                                              onChange={(e) => setHospitalLinksFormData({...hospitalLinksFormData, primaryHospital: e.target.value})}
                                              required
                                            >
                                              <option value="">Select Primary Hospital</option>
                                              {hospitals.map(h => (
                                                <option key={h.id} value={h.id}>{h.name}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Other Hospitals/Clinics (comma-separated names or IDs)</label>
                                            <textarea 
                                              value={hospitalLinksFormData.otherHospitals || ''} 
                                              onChange={(e) => setHospitalLinksFormData({...hospitalLinksFormData, otherHospitals: e.target.value})}
                                              placeholder="e.g., Apollo Clinic, City Hospital"
                                              rows="3"
                                            />
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingHospitalLinks(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Primary Hospital:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.primaryHospital || 'Not assigned'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Other Hospitals/Clinics:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.otherHospitals?.join(', ') || 'None'}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Consultation Fees Tab */}
                                {doctorManagementTab === 'consultationFees' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>💰 Consultation Fees</h3>
                                      {!isEditingConsultationFees && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingConsultationFees(true);
                                            setConsultationFeesFormData({
                                              inClinicFee: doctor.inClinicFee || '',
                                              videoFee: doctor.videoFee || '',
                                              audioFee: doctor.audioFee || '',
                                              chatFee: doctor.chatFee || '',
                                              followUpFee: doctor.followUpFee || '',
                                              currency: doctor.currency || 'INR'
                                            });
                                          }}
                                        >
                                          ✏️ Edit Consultation Fees
                                        </button>
                                      )}
                                    </div>

                                    {isEditingConsultationFees ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleConsultationFeesSave(doctor.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>In-Clinic Consultation Fee (₹) *</label>
                                            <input 
                                              type="number" 
                                              value={consultationFeesFormData.inClinicFee || ''} 
                                              onChange={(e) => setConsultationFeesFormData({...consultationFeesFormData, inClinicFee: e.target.value})}
                                              placeholder="Amount"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Video Consultation Fee (₹)</label>
                                            <input 
                                              type="number" 
                                              value={consultationFeesFormData.videoFee || ''} 
                                              onChange={(e) => setConsultationFeesFormData({...consultationFeesFormData, videoFee: e.target.value})}
                                              placeholder="Amount"
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Audio Consultation Fee (₹)</label>
                                            <input 
                                              type="number" 
                                              value={consultationFeesFormData.audioFee || ''} 
                                              onChange={(e) => setConsultationFeesFormData({...consultationFeesFormData, audioFee: e.target.value})}
                                              placeholder="Amount"
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Chat Consultation Fee (₹)</label>
                                            <input 
                                              type="number" 
                                              value={consultationFeesFormData.chatFee || ''} 
                                              onChange={(e) => setConsultationFeesFormData({...consultationFeesFormData, chatFee: e.target.value})}
                                              placeholder="Amount"
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Follow-up Fee (₹)</label>
                                            <input 
                                              type="number" 
                                              value={consultationFeesFormData.followUpFee || ''} 
                                              onChange={(e) => setConsultationFeesFormData({...consultationFeesFormData, followUpFee: e.target.value})}
                                              placeholder="Amount"
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Currency</label>
                                            <select 
                                              value={consultationFeesFormData.currency || 'INR'} 
                                              onChange={(e) => setConsultationFeesFormData({...consultationFeesFormData, currency: e.target.value})}
                                            >
                                              <option value="INR">INR (₹)</option>
                                              <option value="USD">USD ($)</option>
                                              <option value="EUR">EUR (€)</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingConsultationFees(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>In-Clinic Fee:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>₹{doctor.inClinicFee || '0'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Video Consultation:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>₹{doctor.videoFee || '0'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Audio Consultation:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>₹{doctor.audioFee || '0'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Chat Consultation:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>₹{doctor.chatFee || '0'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Follow-up Fee:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>₹{doctor.followUpFee || '0'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Currency:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.currency || 'INR'}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Availability Tab */}
                                {doctorManagementTab === 'availability' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>📅 Availability Schedule</h3>
                                      {!isEditingAvailability && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingAvailability(true);
                                            setAvailabilityFormData({
                                              schedule: doctor.schedule || '',
                                              slotDuration: doctor.slotDuration || '30',
                                              maxAppointments: doctor.maxAppointments || '1',
                                              breakTimes: doctor.breakTimes || ''
                                            });
                                          }}
                                        >
                                          ✏️ Edit Availability
                                        </button>
                                      )}
                                    </div>

                                    {isEditingAvailability ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleAvailabilitySave(doctor.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Weekly Schedule (JSON format or description)</label>
                                            <textarea 
                                              value={availabilityFormData.schedule || ''} 
                                              onChange={(e) => setAvailabilityFormData({...availabilityFormData, schedule: e.target.value})}
                                              placeholder='e.g., Mon-Fri: 9:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM'
                                              rows="4"
                                            />
                                          </div>
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div className="admin-form-group">
                                              <label>Slot Duration (minutes)</label>
                                              <select 
                                                value={availabilityFormData.slotDuration || '30'} 
                                                onChange={(e) => setAvailabilityFormData({...availabilityFormData, slotDuration: e.target.value})}
                                              >
                                                <option value="15">15 minutes</option>
                                                <option value="20">20 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="45">45 minutes</option>
                                                <option value="60">60 minutes</option>
                                              </select>
                                            </div>
                                            <div className="admin-form-group">
                                              <label>Max Appointments per Slot</label>
                                              <input 
                                                type="number" 
                                                value={availabilityFormData.maxAppointments || '1'} 
                                                onChange={(e) => setAvailabilityFormData({...availabilityFormData, maxAppointments: e.target.value})}
                                                min="1"
                                              />
                                            </div>
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Break Times (optional)</label>
                                            <textarea 
                                              value={availabilityFormData.breakTimes || ''} 
                                              onChange={(e) => setAvailabilityFormData({...availabilityFormData, breakTimes: e.target.value})}
                                              placeholder="e.g., 1:00 PM - 2:00 PM (Lunch Break)"
                                              rows="2"
                                            />
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingAvailability(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Weekly Schedule:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px', whiteSpace: 'pre-wrap'}}>{doctor.schedule || 'Not set'}</p>
                                        </div>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Slot Duration:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.slotDuration || '30'} minutes</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Max Appointments/Slot:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.maxAppointments || '1'}</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Break Times:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.breakTimes || 'None'}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* KYC/Verification Tab */}
                                {doctorManagementTab === 'kyc' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>📄 KYC/Verification</h3>
                                      {!isEditingDoctorKyc && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingDoctorKyc(true);
                                            setDoctorKycFormData({
                                              govtIdNumber: doctor.govtIdNumber || '',
                                              kycStatus: doctor.kycStatus || 'pending',
                                              adminRemarks: doctor.adminRemarks || ''
                                            });
                                          }}
                                        >
                                          ✏️ Edit KYC Details
                                        </button>
                                      )}
                                    </div>

                                    {isEditingDoctorKyc ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleDoctorKycSave(doctor.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Govt ID Number (Aadhaar/PAN)</label>
                                            <input 
                                              type="text" 
                                              value={doctorKycFormData.govtIdNumber || ''} 
                                              onChange={(e) => setDoctorKycFormData({...doctorKycFormData, govtIdNumber: e.target.value})}
                                              placeholder="Enter ID Number"
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>KYC Status</label>
                                            <select 
                                              value={doctorKycFormData.kycStatus || 'pending'} 
                                              onChange={(e) => setDoctorKycFormData({...doctorKycFormData, kycStatus: e.target.value})}
                                            >
                                              <option value="pending">Pending</option>
                                              <option value="approved">Verified</option>
                                              <option value="rejected">Rejected</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="admin-form-group" style={{marginTop: '15px'}}>
                                          <label>Govt ID Document Upload</label>
                                          <input type="file" accept=".pdf,.jpg,.png" />
                                        </div>
                                        <div className="admin-form-group">
                                          <label>Degree Certificates Upload</label>
                                          <input type="file" accept=".pdf,.jpg,.png" multiple />
                                        </div>
                                        <div className="admin-form-group">
                                          <label>License Proof Upload</label>
                                          <input type="file" accept=".pdf,.jpg,.png" />
                                        </div>
                                        <div className="admin-form-group">
                                          <label>Admin Remarks</label>
                                          <textarea 
                                            value={doctorKycFormData.adminRemarks || ''} 
                                            onChange={(e) => setDoctorKycFormData({...doctorKycFormData, adminRemarks: e.target.value})}
                                            placeholder="Add any remarks or notes"
                                            rows="3"
                                          />
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingDoctorKyc(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Govt ID Number:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.govtIdNumber || 'Not provided'}</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>KYC Status:</strong>
                                            <p style={{margin: '5px 0 0 0'}}>
                                              <span className={`admin-status-badge ${doctor.kycStatus}`}>
                                                {doctor.kycStatus?.charAt(0).toUpperCase() + doctor.kycStatus?.slice(1) || 'Pending'}
                                              </span>
                                            </p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Govt ID Document:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.govtIdDoc ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Degree Certificates:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.degreeCerts ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>License Proof:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.licenseProof ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', gridColumn: '1 / -1'}}>
                                            <strong style={{color: '#666'}}>Admin Remarks:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{doctor.adminRemarks || 'No remarks'}</p>
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button className="admin-btn-primary" style={{padding: '8px 16px'}}>✅ Approve KYC</button>
                                          <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>❌ Reject KYC</button>
                                          <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>👁️ View Documents</button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications Management Section */}
          {activeSection === 'notifications' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>🔔 Notifications Management</h2>
                <button className="admin-add-btn" onClick={() => alert('Create new notification')}>
                  ➕ Create Notification
                </button>
              </div>
              
              <div className="admin-filters">
                <input 
                  type="text" 
                  placeholder="Search by title, message..." 
                  className="admin-search-input" 
                />
                <select className="admin-filter-select">
                  <option value="">All Types</option>
                  <option value="push">Push Notification</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="failed">Failed</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
                <input 
                  type="date" 
                  className="admin-filter-select" 
                  placeholder="From Date"
                />
                <input 
                  type="date" 
                  className="admin-filter-select" 
                  placeholder="To Date"
                />
              </div>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <h4>Total Sent</h4>
                  <p className="admin-stat-value">{notifications.filter(n => n.status === 'sent').length}</p>
                </div>
                <div className="admin-stat-card">
                  <h4>Delivered</h4>
                  <p className="admin-stat-value" style={{color: '#10b981'}}>
                    {notifications.reduce((acc, n) => acc + n.delivered, 0).toLocaleString()}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h4>Opened</h4>
                  <p className="admin-stat-value" style={{color: '#3b82f6'}}>
                    {notifications.reduce((acc, n) => acc + n.opened, 0).toLocaleString()}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h4>Clicked</h4>
                  <p className="admin-stat-value" style={{color: '#234f83'}}>
                    {notifications.reduce((acc, n) => acc + n.clicked, 0).toLocaleString()}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h4>Scheduled</h4>
                  <p className="admin-stat-value" style={{color: '#f59e0b'}}>
                    {notifications.filter(n => n.status === 'scheduled').length}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h4>Failed</h4>
                  <p className="admin-stat-value" style={{color: '#ef4444'}}>
                    {notifications.reduce((acc, n) => acc + n.failed, 0) + notifications.filter(n => n.status === 'failed').length}
                  </p>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Target Audience</th>
                      <th>Sent To</th>
                      <th>Delivered</th>
                      <th>Opened</th>
                      <th>Clicked</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Sent Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map(notification => (
                      <tr key={notification.id}>
                        <td>{notification.id}</td>
                        <td className="admin-cell-title">{notification.title}</td>
                        <td>
                          <span className={`admin-notification-type-badge ${notification.type}`}>
                            {notification.type === 'push' && '📱'}
                            {notification.type === 'sms' && '💬'}
                            {notification.type === 'email' && '📧'}
                            {' '}{notification.type.toUpperCase()}
                          </span>
                        </td>
                        <td>{notification.targetAudience}</td>
                        <td>{notification.sentTo > 0 ? notification.sentTo.toLocaleString() : '-'}</td>
                        <td>{notification.delivered > 0 ? notification.delivered.toLocaleString() : '-'}</td>
                        <td>{notification.opened > 0 ? notification.opened.toLocaleString() : '-'}</td>
                        <td>{notification.clicked > 0 ? notification.clicked.toLocaleString() : '-'}</td>
                        <td>
                          <span className={`admin-status-badge ${notification.status}`}>
                            {notification.status}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-priority-badge ${notification.priority}`}>
                            {notification.priority}
                          </span>
                        </td>
                        <td>{notification.sentDate || notification.scheduledDate}</td>
                        <td className="admin-actions">
                          <button className="admin-action-btn  notification-btn " onClick={() => alert('View details: ' + notification.id)}>
                            👁️ View
                          </button>
                          {notification.status === 'draft' && (
                            <button className="admin-action-btn edit notification-btn" onClick={() => alert('Edit: ' + notification.id)}>
                              ✏️ Edit
                            </button>
                          )}
                          {notification.status === 'scheduled' && (
                            <button className="admin-action-btn edit notification-btn" onClick={() => alert('Reschedule: ' + notification.id)}>
                              📅 Reschedule
                            </button>
                          )}
                          {notification.status === 'sent' && (
                            <button className="admin-action-btn view notification-btn" onClick={() => alert('Analytics: ' + notification.id)}>
                              📊 Analytics
                            </button>
                          )}
                          {notification.status === 'failed' && (
                            <button className="admin-action-btn edit notification-btn" onClick={() => alert('Retry: ' + notification.id)}>
                              🔄 Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <button className="admin-pagination-btn">Previous</button>
                <span className="admin-pagination-info">Page 1 of 1</span>
                <button className="admin-pagination-btn">Next</button>
              </div>
            </div>
          )}

          {/* Reports & Analytics Management Section */}
          {activeSection === 'reports' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>📈 Reports & Analytics</h2>
                <button className="admin-add-btn" onClick={() => alert('Generate new report')}>
                  📊 Generate Report
                </button>
              </div>
              
              <div className="admin-filters">
                <input 
                  type="text" 
                  placeholder="Search by report title..." 
                  className="admin-search-input" 
                />
                <select className="admin-filter-select">
                  <option value="">All Categories</option>
                  <option value="Financial">Financial</option>
                  <option value="Users">Users</option>
                  <option value="Hospitals">Hospitals</option>
                  <option value="Doctors">Doctors</option>
                  <option value="Chemists">Chemists</option>
                  <option value="Ambulances">Ambulances</option>
                  <option value="Pathlabs">Pathlabs</option>
                  <option value="Reviews">Reviews</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Analytics">Analytics</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="failed">Failed</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Formats</option>
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
                <input 
                  type="date" 
                  className="admin-filter-select" 
                  placeholder="From Date"
                />
                <input 
                  type="date" 
                  className="admin-filter-select" 
                  placeholder="To Date"
                />
              </div>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <h4>Total Reports</h4>
                  <p className="admin-stat-value">{reports.length}</p>
                </div>
                <div className="admin-stat-card">
                  <h4>Completed</h4>
                  <p className="admin-stat-value" style={{color: '#10b981'}}>
                    {reports.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h4>Categories</h4>
                  <p className="admin-stat-value" style={{color: '#3b82f6'}}>
                    {[...new Set(reports.map(r => r.category))].length}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h4>In Progress</h4>
                  <p className="admin-stat-value" style={{color: '#f59e0b'}}>
                    {reports.filter(r => r.status === 'in-progress').length}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h4>Scheduled</h4>
                  <p className="admin-stat-value" style={{color: '#234f83'}}>
                    {reports.filter(r => r.status === 'scheduled').length}
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h4>Failed</h4>
                  <p className="admin-stat-value" style={{color: '#ef4444'}}>
                    {reports.filter(r => r.status === 'failed').length}
                  </p>
                </div>
              </div>

              <div className="admin-reports-grid">
                {reports.map(report => (
                  <div key={report.id} className="admin-report-card">
                    <div className="admin-report-card-header">
                      <span className={`admin-report-status-badge ${report.status}`}>
                        {report.status}
                      </span>
                      <span className="admin-report-category-badge">
                        {report.category}
                      </span>
                    </div>
                    <h3 className="admin-report-title">{report.title}</h3>
                    <p className="admin-report-description">{report.description}</p>
                    <div className="admin-report-meta">
                      <div className="admin-report-meta-item">
                        <span className="admin-report-meta-label">📅 Date Range:</span>
                        <span className="admin-report-meta-value">{report.dateRange}</span>
                      </div>
                      {report.totalRevenue !== undefined && report.totalRevenue > 0 && (
                        <div className="admin-report-meta-item">
                          <span className="admin-report-meta-label">💰 Revenue:</span>
                          <span className="admin-report-meta-value">₹{report.totalRevenue.toLocaleString()}</span>
                        </div>
                      )}
                      {report.transactions !== undefined && report.transactions > 0 && (
                        <div className="admin-report-meta-item">
                          <span className="admin-report-meta-label">📊 Transactions:</span>
                          <span className="admin-report-meta-value">{report.transactions.toLocaleString()}</span>
                        </div>
                      )}
                      {report.newUsers !== undefined && (
                        <div className="admin-report-meta-item">
                          <span className="admin-report-meta-label">👥 New Users:</span>
                          <span className="admin-report-meta-value">{report.newUsers.toLocaleString()}</span>
                        </div>
                      )}
                      {report.activeUsers !== undefined && (
                        <div className="admin-report-meta-item">
                          <span className="admin-report-meta-label">✅ Active Users:</span>
                          <span className="admin-report-meta-value">{report.activeUsers.toLocaleString()}</span>
                        </div>
                      )}
                      {report.averageRating !== undefined && (
                        <div className="admin-report-meta-item">
                          <span className="admin-report-meta-label">⭐ Avg Rating:</span>
                          <span className="admin-report-meta-value">{report.averageRating}</span>
                        </div>
                      )}
                      {report.totalOrders !== undefined && (
                        <div className="admin-report-meta-item">
                          <span className="admin-report-meta-label">📦 Orders:</span>
                          <span className="admin-report-meta-value">{report.totalOrders.toLocaleString()}</span>
                        </div>
                      )}
                      {report.conversionRate !== undefined && (
                        <div className="admin-report-meta-item">
                          <span className="admin-report-meta-label">🎯 Conversion:</span>
                          <span className="admin-report-meta-value">{report.conversionRate}</span>
                        </div>
                      )}
                      {report.generatedDate && (
                        <div className="admin-report-meta-item">
                          <span className="admin-report-meta-label">🕒 Generated:</span>
                          <span className="admin-report-meta-value">{report.generatedDate}</span>
                        </div>
                      )}
                      <div className="admin-report-meta-item">
                        <span className="admin-report-meta-label">📄 Format:</span>
                        <span className={`admin-report-format-badge ${report.format.toLowerCase()}`}>
                          {report.format}
                        </span>
                      </div>
                    </div>
                    <div className="admin-report-actions">
                      {report.status === 'completed' && (
                        <>
                          <button className="admin-action-btn view" onClick={() => alert('Download: ' + report.id)}>
                            📥 Download
                          </button>
                          <button className="admin-action-btn view" onClick={() => alert('View: ' + report.id)}>
                            👁️ View
                          </button>
                          <button className="admin-action-btn edit" onClick={() => alert('Share: ' + report.id)}>
                            📤 Share
                          </button>
                        </>
                      )}
                      {report.status === 'in-progress' && (
                        <button className="admin-action-btn view" onClick={() => alert('Check status: ' + report.id)}>
                          ⏳ Check Status
                        </button>
                      )}
                      {report.status === 'scheduled' && (
                        <button className="admin-action-btn edit" onClick={() => alert('Edit schedule: ' + report.id)}>
                          📅 Edit Schedule
                        </button>
                      )}
                      {report.status === 'failed' && (
                        <button className="admin-action-btn edit" onClick={() => alert('Retry: ' + report.id)}>
                          🔄 Retry
                        </button>
                      )}
                      <button className="admin-action-btn delete" onClick={() => alert('Delete: ' + report.id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-pagination">
                <button className="admin-pagination-btn">Previous</button>
                <span className="admin-pagination-info">Page 1 of 1</span>
                <button className="admin-pagination-btn">Next</button>
              </div>
            </div>
          )}

          {/* Payments & Payouts Management Section */}
          {activeSection === 'payments' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>💳 Payments & Payouts Management</h2>
                <button className="admin-add-btn" onClick={() => alert('Export transactions')}>
                  📥 Export Transactions
                </button>
              </div>
              
              <div className="admin-filters">
                <input 
                  type="text" 
                  placeholder="Search by transaction ID, user..." 
                  className="admin-search-input" 
                />
                <input 
                  type="date" 
                  placeholder="From Date" 
                  className="admin-filter-select" 
                  style={{width: 'auto'}}
                />
                <input 
                  type="date" 
                  placeholder="To Date" 
                  className="admin-filter-select" 
                  style={{width: 'auto'}}
                />
                <select className="admin-filter-select">
                  <option value="">All Types</option>
                  <option value="appointment">Appointment Fee</option>
                  <option value="medicine">Medicine Order</option>
                  <option value="lab">Lab Test</option>
                  <option value="ambulance">Ambulance Booking</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Gateways</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="paytm">Paytm</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="gpay">GPay</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">Payment Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">Settlement Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Date & Time</th>
                      <th>Type</th>
                      <th>From (User)</th>
                      <th>To (Service Provider)</th>
                      <th>Amount (₹)</th>
                      <th>Gateway</th>
                      <th>Commission (₹)</th>
                      <th>Payment Status</th>
                      <th>Settlement Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id}>
                        <td><small>{payment.id}</small></td>
                        <td>
                          <div style={{whiteSpace: 'nowrap'}}>
                            {new Date(payment.date).toLocaleDateString('en-IN')}<br/>
                            <small style={{color: '#666'}}>{payment.time}</small>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-payment-type-badge ${payment.type.toLowerCase().replace(/ /g, '-')}`}>
                            {payment.type}
                          </span>
                        </td>
                        <td>{payment.from}</td>
                        <td><small>{payment.to}</small></td>
                        <td style={{fontWeight: '600'}}>₹{payment.amount}</td>
                        <td>
                          <span className="admin-gateway-badge">
                            {payment.gateway}
                          </span>
                        </td>
                        <td style={{color: '#10b981', fontWeight: '500'}}>₹{payment.commission}</td>
                        <td>
                          <span className={`admin-status-badge ${payment.status}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-settlement-badge ${payment.settlementStatus}`}>
                            {payment.settlementStatus.charAt(0).toUpperCase() + payment.settlementStatus.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button className="admin-icon-btn" title="View Details">👁️</button>
                          <button className="admin-icon-btn" title="Download Receipt">🧾</button>
                          {payment.settlementStatus === 'pending' && payment.status === 'paid' && (
                            <button className="admin-icon-btn" title="Process Settlement">💰</button>
                          )}
                          {payment.status === 'failed' && (
                            <button className="admin-icon-btn" title="Retry Payment">🔄</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-section-footer">
                <p>Showing {payments.length} transactions</p>
                <div className="admin-pagination">
                  <button className="admin-page-btn">Previous</button>
                  <button className="admin-page-btn admin-active-page">1</button>
                  <button className="admin-page-btn">2</button>
                  <button className="admin-page-btn">3</button>
                  <button className="admin-page-btn">Next</button>
                </div>
              </div>

              {/* Payment Statistics */}
              <div className="admin-appointment-stats" style={{marginTop: '30px'}}>
                <h3>Payment & Commission Summary</h3>
                <div className="admin-stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
                  <div className="admin-stat-card">
                    <h4>Total Transactions</h4>
                    <p className="admin-stat-value">{payments.length}</p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Successful Payments</h4>
                    <p className="admin-stat-value" style={{color: '#10b981'}}>
                      {payments.filter(p => p.status === 'paid').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Total Amount</h4>
                    <p className="admin-stat-value" style={{color: '#1e40af'}}>
                      ₹{payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Total Commission</h4>
                    <p className="admin-stat-value" style={{color: '#10b981'}}>
                      ₹{payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.commission, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Pending Settlements</h4>
                    <p className="admin-stat-value" style={{color: '#f59e0b'}}>
                      {payments.filter(p => p.settlementStatus === 'pending').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Failed Transactions</h4>
                    <p className="admin-stat-value" style={{color: '#ef4444'}}>
                      {payments.filter(p => p.status === 'failed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews & Ratings Management Section */}
          {activeSection === 'reviews' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>⭐ Reviews & Ratings Management</h2>
                <button className="admin-add-btn" onClick={() => alert('Export reviews')}>
                  📥 Export Reviews
                </button>
              </div>
              
              <div className="admin-filters">
                <input 
                  type="text" 
                  placeholder="Search by user, entity name..." 
                  className="admin-search-input" 
                />
                <select className="admin-filter-select">
                  <option value="">All Entity Types</option>
                  <option value="doctor">Doctor</option>
                  <option value="hospital">Hospital</option>
                  <option value="chemist">Chemist</option>
                  <option value="ambulance">Ambulance</option>
                  <option value="pathlab">Pathlab</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="flagged">Flagged</option>
                  <option value="rejected">Rejected</option>
                </select>
                <input 
                  type="date" 
                  placeholder="From Date" 
                  className="admin-filter-select" 
                  style={{width: 'auto'}}
                />
                <input 
                  type="date" 
                  placeholder="To Date" 
                  className="admin-filter-select" 
                  style={{width: 'auto'}}
                />
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Review ID</th>
                      <th>Entity Type</th>
                      <th>Entity Name</th>
                      <th>User Name</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review.id}>
                        <td>{review.id}</td>
                        <td>
                          <span className={`admin-entity-badge ${review.entityType.toLowerCase()}`}>
                            {review.entityType}
                          </span>
                        </td>
                        <td><small>{review.entityName}</small></td>
                        <td>{review.userName}</td>
                        <td>
                          <div className="admin-rating-display">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{color: i < review.rating ? '#f59e0b' : '#e5e7eb'}}>
                                ⭐
                              </span>
                            ))}
                            <span style={{marginLeft: '5px', color: '#666'}}>({review.rating})</span>
                          </div>
                        </td>
                        <td style={{maxWidth: '250px'}}>
                          <small>{review.comment}</small>
                        </td>
                        <td>{new Date(review.date).toLocaleDateString('en-IN')}</td>
                        <td>
                          <span className={`admin-status-badge ${review.status}`}>
                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button className="admin-icon-btn" title="View Details">👁️</button>
                          {review.status === 'pending' && (
                            <>
                              <button className="admin-icon-btn" title="Approve">✅</button>
                              <button className="admin-icon-btn" title="Reject">❌</button>
                              <button className="admin-icon-btn" title="Flag">🚩</button>
                            </>
                          )}
                          {review.status === 'flagged' && (
                            <button className="admin-icon-btn" title="Take Action">⚠️</button>
                          )}
                          {!review.response && review.status === 'approved' && (
                            <button className="admin-icon-btn" title="Add Response">💬</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-section-footer">
                <p>Showing {reviews.length} reviews</p>
                <div className="admin-pagination">
                  <button className="admin-page-btn">Previous</button>
                  <button className="admin-page-btn admin-active-page">1</button>
                  <button className="admin-page-btn">2</button>
                  <button className="admin-page-btn">Next</button>
                </div>
              </div>

              {/* Review Statistics */}
              <div className="admin-appointment-stats" style={{marginTop: '30px'}}>
                <h3>Reviews & Ratings Overview</h3>
                <div className="admin-stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
                  <div className="admin-stat-card">
                    <h4>Total Reviews</h4>
                    <p className="admin-stat-value">{reviews.length}</p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Average Rating</h4>
                    <p className="admin-stat-value" style={{color: '#f59e0b'}}>
                      {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} ⭐
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Approved Reviews</h4>
                    <p className="admin-stat-value" style={{color: '#10b981'}}>
                      {reviews.filter(r => r.status === 'approved').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Pending Reviews</h4>
                    <p className="admin-stat-value" style={{color: '#f59e0b'}}>
                      {reviews.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Flagged Reviews</h4>
                    <p className="admin-stat-value" style={{color: '#ef4444'}}>
                      {reviews.filter(r => r.status === 'flagged').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>5 Star Reviews</h4>
                    <p className="admin-stat-value" style={{color: '#10b981'}}>
                      {reviews.filter(r => r.rating === 5).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CMS & Marketing Management Section */}
          {activeSection === 'cms' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>📢 CMS & Marketing Management</h2>
                <button className="admin-add-btn" onClick={() => alert('Add new banner/coupon')}>
                  + Add New Item
                </button>
              </div>

              {/* Banners Sub-section */}
              <div style={{marginBottom: '40px'}}>
                <h3 style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  🖼️ Banner Management
                  <button 
                    className="admin-add-btn" 
                    style={{fontSize: '13px', padding: '6px 12px'}}
                    onClick={() => alert('Add new banner')}
                  >
                    + Add Banner
                  </button>
                </h3>
                
                <div className="admin-banner-grid">
                  {banners.map(banner => (
                    <div key={banner.id} className="admin-banner-card">
                      <div className="admin-banner-header">
                        <span className={`admin-banner-status ${banner.status}`}>
                          {banner.status.charAt(0).toUpperCase() + banner.status.slice(1)}
                        </span>
                        <span className="admin-banner-type">{banner.type}</span>
                      </div>
                      <div className="admin-banner-image">
                        <div className="admin-banner-placeholder">
                          🖼️ {banner.title}
                        </div>
                      </div>
                      <div className="admin-banner-content">
                        <h4>{banner.title}</h4>
                        <p>{banner.description}</p>
                        <div className="admin-banner-meta">
                          <small>📅 {new Date(banner.startDate).toLocaleDateString('en-IN')} - {new Date(banner.endDate).toLocaleDateString('en-IN')}</small>
                          <small>👁️ {banner.clicks} clicks</small>
                        </div>
                      </div>
                      <div className="admin-banner-actions">
                        <button className="admin-icon-btn" title="Edit">✏️</button>
                        <button className="admin-icon-btn" title="View Stats">📊</button>
                        {banner.status === 'active' ? (
                          <button className="admin-icon-btn" title="Deactivate">⏸️</button>
                        ) : (
                          <button className="admin-icon-btn" title="Activate">▶️</button>
                        )}
                        <button className="admin-icon-btn" title="Delete">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupons Sub-section */}
              <div style={{marginTop: '40px'}}>
                <h3 style={{marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  🎟️ Coupon Management
                  <button 
                    className="admin-add-btn" 
                    style={{fontSize: '13px', padding: '6px 12px'}}
                    onClick={() => alert('Add new coupon')}
                  >
                    + Add Coupon
                  </button>
                </h3>
                
                <div className="admin-filters">
                  <input 
                    type="text" 
                    placeholder="Search by coupon code..." 
                    className="admin-search-input" 
                  />
                  <select className="admin-filter-select">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="expired">Expired</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select className="admin-filter-select">
                    <option value="">Applicable On</option>
                    <option value="all">All</option>
                    <option value="appointments">Appointments</option>
                    <option value="medicines">Medicines</option>
                    <option value="lab-tests">Lab Tests</option>
                    <option value="ambulance">Ambulance</option>
                  </select>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Coupon ID</th>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Discount</th>
                        <th>Min Order</th>
                        <th>Valid Period</th>
                        <th>Usage</th>
                        <th>Applicable On</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map(coupon => (
                        <tr key={coupon.id}>
                          <td>{coupon.id}</td>
                          <td>
                            <span className="admin-coupon-code">
                              {coupon.code}
                            </span>
                          </td>
                          <td><small>{coupon.description}</small></td>
                          <td>
                            <span style={{fontWeight: '600', color: '#10b981'}}>
                              {coupon.discountType === 'percentage' 
                                ? `${coupon.discountValue}%` 
                                : `₹${coupon.discountValue}`
                              }
                            </span>
                            {coupon.maxDiscount && (
                              <><br/><small style={{color: '#666'}}>Max: ₹{coupon.maxDiscount}</small></>
                            )}
                          </td>
                          <td>₹{coupon.minOrder}</td>
                          <td style={{whiteSpace: 'nowrap'}}>
                            <small>
                              {new Date(coupon.validFrom).toLocaleDateString('en-IN')}<br/>
                              to {new Date(coupon.validTo).toLocaleDateString('en-IN')}
                            </small>
                          </td>
                          <td>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                              <span>{coupon.usedCount} / {coupon.usageLimit}</span>
                              <small style={{color: '#666'}}>
                                {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="admin-applicable-badge">
                              {coupon.applicableOn}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-status-badge ${coupon.status}`}>
                              {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <button className="admin-icon-btn" title="Edit">✏️</button>
                            <button className="admin-icon-btn" title="View Stats">📊</button>
                            {coupon.status === 'active' ? (
                              <button className="admin-icon-btn" title="Deactivate">⏸️</button>
                            ) : coupon.status === 'inactive' ? (
                              <button className="admin-icon-btn" title="Activate">▶️</button>
                            ) : null}
                            <button className="admin-icon-btn" title="Delete">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Chemist/Pharmacy Management Section */}
          {activeSection === 'chemists' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>💊 Chemist/Pharmacy Management</h2>
                <button className="admin-add-btn" onClick={() => openModal('add', 'chemists')}>
                  + Add Chemist
                </button>
              </div>

              {/* Sub-section Tabs */}
              <div style={{display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '3px solid #e5e7eb', background: '#f9fafb'}}>
                <button
                  onClick={() => setChemistSectionTab('pharmacies')}
                  style={{
                    flex: 1,
                    padding: '15px 24px',
                    background: chemistSectionTab === 'pharmacies' ? '#234f83' : 'transparent',
                    color: chemistSectionTab === 'pharmacies' ? '#fff' : '#666',
                    border: 'none',
                    borderBottom: chemistSectionTab === 'pharmacies' ? '4px solid #234f83' : '4px solid transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🏪 Pharmacy List ({chemists.length})
                </button>
                <button
                  onClick={() => setChemistSectionTab('orders')}
                  style={{
                    flex: 1,
                    padding: '15px 24px',
                    background: chemistSectionTab === 'orders' ? '#234f83' : 'transparent',
                    color: chemistSectionTab === 'orders' ? '#fff' : '#666',
                    border: 'none',
                    borderBottom: chemistSectionTab === 'orders' ? '4px solid #234f83' : '4px solid transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🛒 Medicine Orders ({medicineOrders.length})
                </button>
              </div>

              {/* Pharmacy List Tab */}
              {chemistSectionTab === 'pharmacies' && (
                <div>
                  <div className="admin-filters">
                    <input 
                      type="text" 
                      placeholder="Search by name, license, owner..." 
                      className="admin-search-input" 
                    />
                    <select className="admin-filter-select">
                      <option value="">All Cities</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="pune">Pune</option>
                      <option value="hyderabad">Hyderabad</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="blocked">Blocked</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">KYC Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Chemist ID</th>
                          <th>Pharmacy Name</th>
                          <th>Owner Name</th>
                          <th>City</th>
                          <th>License Number</th>
                          <th>License Expiry</th>
                          <th>Total Products</th>
                          <th>Total Orders</th>
                          <th>Commission (%)</th>
                          <th>KYC Status</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                  <tbody>
                    {chemists.map(chemist => (
                      <React.Fragment key={chemist.id}>
                        <tr style={{background: expandedChemistId === chemist.id ? '#f0f7ff' : 'transparent'}}>
                          <td>{chemist.id}</td>
                          <td>{chemist.name}</td>
                          <td>{chemist.owner}</td>
                          <td>{chemist.city}</td>
                          <td><small>{chemist.license}</small></td>
                          <td>{new Date(chemist.licenseExpiry).toLocaleDateString('en-IN')}</td>
                          <td>{chemist.totalProducts}</td>
                          <td>{chemist.totalOrders}</td>
                          <td>{chemist.commission}%</td>
                          <td>
                            <span className={`admin-status-badge ${chemist.kycStatus}`}>
                              {chemist.kycStatus.charAt(0).toUpperCase() + chemist.kycStatus.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-status-badge ${chemist.status}`}>
                              {chemist.status.charAt(0).toUpperCase() + chemist.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="admin-icon-btn" 
                              title={expandedChemistId === chemist.id ? "Collapse" : "Expand Management"}
                              onClick={() => toggleChemistExpansion(chemist.id)}
                              style={{fontSize: '16px', fontWeight: 'bold'}}
                            >
                              {expandedChemistId === chemist.id ? '▼' : '▶'}
                            </button>
                            <button 
                              className="admin-icon-btn" 
                              title="View Details"
                              onClick={() => openModal('view', 'chemists', chemist)}
                            >
                              👁️
                            </button>
                            <button 
                              className="admin-icon-btn" 
                              title="View Products"
                              onClick={() => alert('View products for ' + chemist.name)}
                            >
                              📦
                            </button>
                            <button 
                              className="admin-icon-btn" 
                              title="Edit"
                              onClick={() => openModal('edit', 'chemists', chemist)}
                            >
                              ✏️
                            </button>
                            {chemist.status === 'pending' ? (
                              <>
                                <button className="admin-icon-btn" title="Approve">✅</button>
                                <button className="admin-icon-btn" title="Reject">❌</button>
                              </>
                            ) : chemist.status !== 'blocked' ? (
                              <button className="admin-icon-btn" title="Block">🚫</button>
                            ) : (
                              <button className="admin-icon-btn" title="Unblock">✅</button>
                            )}
                          </td>
                        </tr>

                        {/* Expandable Management Section */}
                        {expandedChemistId === chemist.id && (
                          <tr>
                            <td colSpan="12" style={{padding: '0', background: '#f9fafb'}}>
                              <div style={{padding: '20px', borderTop: '2px solid #234f83'}}>
                                {/* Management Tabs */}
                                <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb'}}>
                                  <button
                                    onClick={() => setChemistManagementTab('license')}
                                    style={{
                                      padding: '12px 20px',
                                      background: chemistManagementTab === 'license' ? '#234f83' : 'transparent',
                                      color: chemistManagementTab === 'license' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: chemistManagementTab === 'license' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    📄 License & KYC
                                  </button>
                                  <button
                                    onClick={() => setChemistManagementTab('service')}
                                    style={{
                                      padding: '12px 20px',
                                      background: chemistManagementTab === 'service' ? '#234f83' : 'transparent',
                                      color: chemistManagementTab === 'service' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: chemistManagementTab === 'service' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    ⚙️ Service Settings
                                  </button>
                                  <button
                                    onClick={() => setChemistManagementTab('financials')}
                                    style={{
                                      padding: '12px 20px',
                                      background: chemistManagementTab === 'financials' ? '#234f83' : 'transparent',
                                      color: chemistManagementTab === 'financials' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: chemistManagementTab === 'financials' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    💰 Financials
                                  </button>
                                  <button
                                    onClick={() => setChemistManagementTab('products')}
                                    style={{
                                      padding: '12px 20px',
                                      background: chemistManagementTab === 'products' ? '#234f83' : 'transparent',
                                      color: chemistManagementTab === 'products' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: chemistManagementTab === 'products' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    📦 Products
                                  </button>
                                </div>

                                {/* License & KYC Tab */}
                                {chemistManagementTab === 'license' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>📄 License & KYC Information</h3>
                                      {!isEditingLicense && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingLicense(true);
                                            setLicenseFormData({
                                              drugLicense: chemist.license || '',
                                              licenseExpiry: chemist.licenseExpiry || '',
                                              gstNumber: chemist.gstNumber || '',
                                              shopCertificate: chemist.shopCertificate || '',
                                              ownerIdentity: chemist.ownerIdentity || '',
                                              pharmacistRegNumber: chemist.pharmacistRegNumber || '',
                                              kycStatus: chemist.kycStatus || 'pending'
                                            });
                                          }}
                                        >
                                          ✏️ Edit License & KYC
                                        </button>
                                      )}
                                    </div>

                                    {isEditingLicense ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleLicenseSave(chemist.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Drug License Number *</label>
                                            <input 
                                              type="text" 
                                              value={licenseFormData.drugLicense || ''} 
                                              onChange={(e) => setLicenseFormData({...licenseFormData, drugLicense: e.target.value})}
                                              placeholder="DL-XX-YYYY-NNNNN"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>License Expiry Date *</label>
                                            <input 
                                              type="date" 
                                              value={licenseFormData.licenseExpiry || ''} 
                                              onChange={(e) => setLicenseFormData({...licenseFormData, licenseExpiry: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>GST Number *</label>
                                            <input 
                                              type="text" 
                                              value={licenseFormData.gstNumber || ''} 
                                              onChange={(e) => setLicenseFormData({...licenseFormData, gstNumber: e.target.value})}
                                              placeholder="22AAAAA0000A1Z5"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Shop Establishment Certificate</label>
                                            <input 
                                              type="text" 
                                              value={licenseFormData.shopCertificate || ''} 
                                              onChange={(e) => setLicenseFormData({...licenseFormData, shopCertificate: e.target.value})}
                                              placeholder="Certificate Number"
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Owner Identity Proof</label>
                                            <input 
                                              type="file" 
                                              onChange={(e) => setLicenseFormData({...licenseFormData, ownerIdentity: e.target.files[0]?.name})}
                                            />
                                            {licenseFormData.ownerIdentity && <small>Current: {licenseFormData.ownerIdentity}</small>}
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Pharmacist Registration Number *</label>
                                            <input 
                                              type="text" 
                                              value={licenseFormData.pharmacistRegNumber || ''} 
                                              onChange={(e) => setLicenseFormData({...licenseFormData, pharmacistRegNumber: e.target.value})}
                                              placeholder="PRN-XXXXX"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Drug License Copy</label>
                                            <input 
                                              type="file" 
                                              onChange={(e) => setLicenseFormData({...licenseFormData, licenseCopy: e.target.files[0]?.name})}
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>KYC Status *</label>
                                            <select 
                                              value={licenseFormData.kycStatus || ''} 
                                              onChange={(e) => setLicenseFormData({...licenseFormData, kycStatus: e.target.value})}
                                              required
                                            >
                                              <option value="pending">Pending</option>
                                              <option value="approved">Approved</option>
                                              <option value="rejected">Rejected</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingLicense(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Drug License Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.license || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>License Expiry:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.licenseExpiry ? new Date(chemist.licenseExpiry).toLocaleDateString('en-IN') : 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>GST Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.gstNumber || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Shop Establishment Certificate:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.shopCertificate || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Owner Identity Proof:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.ownerIdentity || 'Not uploaded'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Pharmacist Registration Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.pharmacistRegNumber || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>KYC Status:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                            <span className={`admin-status-badge ${chemist.kycStatus}`}>
                                              {chemist.kycStatus.charAt(0).toUpperCase() + chemist.kycStatus.slice(1)}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Service Settings Tab */}
                                {chemistManagementTab === 'service' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>⚙️ Service Settings</h3>
                                      {!isEditingService && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingService(true);
                                            setServiceFormData({
                                              openingTime: chemist.openingTime || '09:00',
                                              closingTime: chemist.closingTime || '21:00',
                                              is24x7: chemist.is24x7 || false,
                                              deliveryAvailable: chemist.deliveryAvailable || false,
                                              deliveryRadius: chemist.deliveryRadius || 5,
                                              minOrderAmount: chemist.minOrderAmount || 0,
                                              serviceablePincodes: chemist.serviceablePincodes?.join(', ') || ''
                                            });
                                          }}
                                        >
                                          ✏️ Edit Service Settings
                                        </button>
                                      )}
                                    </div>

                                    {isEditingService ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleServiceSave(chemist.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Opening Time</label>
                                            <input 
                                              type="time" 
                                              value={serviceFormData.openingTime || ''} 
                                              onChange={(e) => setServiceFormData({...serviceFormData, openingTime: e.target.value})}
                                              disabled={serviceFormData.is24x7}
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Closing Time</label>
                                            <input 
                                              type="time" 
                                              value={serviceFormData.closingTime || ''} 
                                              onChange={(e) => setServiceFormData({...serviceFormData, closingTime: e.target.value})}
                                              disabled={serviceFormData.is24x7}
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                              <input 
                                                type="checkbox" 
                                                checked={serviceFormData.is24x7 || false} 
                                                onChange={(e) => setServiceFormData({...serviceFormData, is24x7: e.target.checked})}
                                              />
                                              24x7 Service Available
                                            </label>
                                          </div>
                                          <div className="admin-form-group">
                                            <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                              <input 
                                                type="checkbox" 
                                                checked={serviceFormData.deliveryAvailable || false} 
                                                onChange={(e) => setServiceFormData({...serviceFormData, deliveryAvailable: e.target.checked})}
                                              />
                                              Delivery Available
                                            </label>
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Delivery Radius (km)</label>
                                            <input 
                                              type="number" 
                                              value={serviceFormData.deliveryRadius || ''} 
                                              onChange={(e) => setServiceFormData({...serviceFormData, deliveryRadius: e.target.value})}
                                              placeholder="5"
                                              disabled={!serviceFormData.deliveryAvailable}
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Minimum Order Amount (₹)</label>
                                            <input 
                                              type="number" 
                                              value={serviceFormData.minOrderAmount || ''} 
                                              onChange={(e) => setServiceFormData({...serviceFormData, minOrderAmount: e.target.value})}
                                              placeholder="0"
                                            />
                                          </div>
                                          <div className="admin-form-group" style={{gridColumn: 'span 2'}}>
                                            <label>Serviceable Pincodes (comma-separated)</label>
                                            <textarea 
                                              value={serviceFormData.serviceablePincodes || ''} 
                                              onChange={(e) => setServiceFormData({...serviceFormData, serviceablePincodes: e.target.value})}
                                              placeholder="400001, 400002, 400003"
                                              rows="3"
                                              style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                                            />
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingService(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Store Timings:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                            {chemist.is24x7 ? '24x7 Open' : `${chemist.openingTime || '09:00'} - ${chemist.closingTime || '21:00'}`}
                                          </p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>24x7 Service:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.is24x7 ? '✅ Yes' : '❌ No'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Delivery Available:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.deliveryAvailable ? '✅ Yes' : '❌ No'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Delivery Radius:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.deliveryRadius || 'N/A'} km</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Min Order Amount:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>₹{chemist.minOrderAmount || 0}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Serviceable Pincodes:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.serviceablePincodes?.join(', ') || 'Not configured'}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Financials Tab */}
                                {chemistManagementTab === 'financials' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>💰 Financial Details</h3>
                                      {!isEditingFinancials && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingFinancials(true);
                                            setFinancialsFormData({
                                              commission: chemist.commission || 0,
                                              settlementCycle: chemist.settlementCycle || 'weekly',
                                              accountNumber: chemist.accountNumber || '',
                                              ifscCode: chemist.ifscCode || '',
                                              bankName: chemist.bankName || '',
                                              accountHolderName: chemist.accountHolderName || chemist.owner
                                            });
                                          }}
                                        >
                                          ✏️ Edit Financials
                                        </button>
                                      )}
                                    </div>

                                    {isEditingFinancials ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleFinancialsSave(chemist.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Commission Percentage (%) *</label>
                                            <input 
                                              type="number" 
                                              value={financialsFormData.commission || ''} 
                                              onChange={(e) => setFinancialsFormData({...financialsFormData, commission: e.target.value})}
                                              placeholder="10"
                                              step="0.1"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Settlement Cycle *</label>
                                            <select 
                                              value={financialsFormData.settlementCycle || ''} 
                                              onChange={(e) => setFinancialsFormData({...financialsFormData, settlementCycle: e.target.value})}
                                              required
                                            >
                                              <option value="daily">Daily</option>
                                              <option value="weekly">Weekly</option>
                                              <option value="biweekly">Bi-weekly</option>
                                              <option value="monthly">Monthly</option>
                                            </select>
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Account Holder Name *</label>
                                            <input 
                                              type="text" 
                                              value={financialsFormData.accountHolderName || ''} 
                                              onChange={(e) => setFinancialsFormData({...financialsFormData, accountHolderName: e.target.value})}
                                              placeholder="Account Holder Name"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Bank Name *</label>
                                            <input 
                                              type="text" 
                                              value={financialsFormData.bankName || ''} 
                                              onChange={(e) => setFinancialsFormData({...financialsFormData, bankName: e.target.value})}
                                              placeholder="Bank Name"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Account Number *</label>
                                            <input 
                                              type="text" 
                                              value={financialsFormData.accountNumber || ''} 
                                              onChange={(e) => setFinancialsFormData({...financialsFormData, accountNumber: e.target.value})}
                                              placeholder="Account Number"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>IFSC Code *</label>
                                            <input 
                                              type="text" 
                                              value={financialsFormData.ifscCode || ''} 
                                              onChange={(e) => setFinancialsFormData({...financialsFormData, ifscCode: e.target.value})}
                                              placeholder="IFSC Code"
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingFinancials(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Commission Percentage:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.commission || 0}%</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Settlement Cycle:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                            {chemist.settlementCycle ? chemist.settlementCycle.charAt(0).toUpperCase() + chemist.settlementCycle.slice(1) : 'Not configured'}
                                          </p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Account Holder Name:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.accountHolderName || chemist.owner || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Bank Name:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.bankName || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Account Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.accountNumber ? '•••• •••• •••• ' + chemist.accountNumber.slice(-4) : 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>IFSC Code:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{chemist.ifscCode || 'Not provided'}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Products Tab */}
                                {chemistManagementTab === 'products' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>📦 Products Inventory</h3>
                                      <div style={{display: 'flex', gap: '10px'}}>
                                        <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📥 Export</button>
                                        <button className="admin-btn-primary" style={{padding: '8px 16px'}}>+ Add Product</button>
                                      </div>
                                    </div>

                                    <div style={{marginBottom: '15px', display: 'flex', gap: '10px'}}>
                                      <input 
                                        type="text" 
                                        placeholder="Search products..." 
                                        style={{flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                                      />
                                      <select style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}>
                                        <option value="">All Categories</option>
                                        <option value="tablets">Tablets</option>
                                        <option value="capsules">Capsules</option>
                                        <option value="syrup">Syrup</option>
                                        <option value="injection">Injection</option>
                                      </select>
                                      <select style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}>
                                        <option value="">All Status</option>
                                        <option value="instock">In Stock</option>
                                        <option value="lowstock">Low Stock</option>
                                        <option value="outofstock">Out of Stock</option>
                                      </select>
                                    </div>

                                    <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                                      <table className="admin-table" style={{width: '100%', marginTop: '0'}}>
                                        <thead style={{position: 'sticky', top: 0, background: '#f9fafb', zIndex: 1}}>
                                          <tr>
                                            <th>Product Code</th>
                                            <th>Product Name</th>
                                            <th>Category</th>
                                            <th>Brand</th>
                                            <th>Price (₹)</th>
                                            <th>Stock</th>
                                            <th>Expiry</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>MED001</td>
                                            <td>Paracetamol 500mg</td>
                                            <td>Tablet</td>
                                            <td>Generic</td>
                                            <td>₹12.50</td>
                                            <td>250</td>
                                            <td>Dec 2025</td>
                                            <td><span className="admin-status-badge active">In Stock</span></td>
                                            <td>
                                              <button className="admin-icon-btn" title="View">👁️</button>
                                              <button className="admin-icon-btn" title="Edit">✏️</button>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>MED002</td>
                                            <td>Amoxicillin 250mg</td>
                                            <td>Capsule</td>
                                            <td>Brand A</td>
                                            <td>₹85.00</td>
                                            <td>120</td>
                                            <td>Mar 2026</td>
                                            <td><span className="admin-status-badge active">In Stock</span></td>
                                            <td>
                                              <button className="admin-icon-btn" title="View">👁️</button>
                                              <button className="admin-icon-btn" title="Edit">✏️</button>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>MED003</td>
                                            <td>Cough Syrup</td>
                                            <td>Syrup</td>
                                            <td>Brand B</td>
                                            <td>₹145.00</td>
                                            <td>45</td>
                                            <td>Jun 2026</td>
                                            <td><span className="admin-status-badge pending">Low Stock</span></td>
                                            <td>
                                              <button className="admin-icon-btn" title="View">👁️</button>
                                              <button className="admin-icon-btn" title="Edit">✏️</button>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>MED004</td>
                                            <td>Insulin Injection</td>
                                            <td>Injection</td>
                                            <td>Brand C</td>
                                            <td>₹850.00</td>
                                            <td>0</td>
                                            <td>Sep 2025</td>
                                            <td><span className="admin-status-badge rejected">Out of Stock</span></td>
                                            <td>
                                              <button className="admin-icon-btn" title="View">👁️</button>
                                              <button className="admin-icon-btn" title="Edit">✏️</button>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td>MED005</td>
                                            <td>Vitamin D3 Tablets</td>
                                            <td>Tablet</td>
                                            <td>Brand D</td>
                                            <td>₹320.00</td>
                                            <td>180</td>
                                            <td>Aug 2026</td>
                                            <td><span className="admin-status-badge active">In Stock</span></td>
                                            <td>
                                              <button className="admin-icon-btn" title="View">👁️</button>
                                              <button className="admin-icon-btn" title="Edit">✏️</button>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <div style={{marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                      <p style={{margin: 0, color: '#666'}}>Showing 5 of {chemist.totalProducts} products</p>
                                      <div style={{display: 'flex', gap: '5px'}}>
                                        <button className="admin-page-btn">Previous</button>
                                        <button className="admin-page-btn admin-active-page">1</button>
                                        <button className="admin-page-btn">2</button>
                                        <button className="admin-page-btn">3</button>
                                        <button className="admin-page-btn">Next</button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

                  <div className="admin-section-footer">
                    <p>Showing {chemists.length} chemists</p>
                    <div className="admin-pagination">
                      <button className="admin-page-btn">Previous</button>
                      <button className="admin-page-btn admin-active-page">1</button>
                      <button className="admin-page-btn">2</button>
                      <button className="admin-page-btn">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Medicine Orders Tab */}
              {chemistSectionTab === 'orders' && (
                <div>
                  <div className="admin-filters">
                    <input type="text" placeholder="Search by order ID, user, pharmacy..." className="admin-search-input" />
                    <select className="admin-filter-select">
                      <option value="">All Status</option>
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="payment_failed">Payment Failed</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Payment Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Order Type</option>
                      <option value="with_prescription">With Prescription</option>
                      <option value="without_prescription">Without Prescription</option>
                    </select>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date & Time</th>
                          <th>User</th>
                          <th>Pharmacy</th>
                          <th>Type</th>
                          <th>Total (₹)</th>
                          <th>Payment</th>
                          <th>Order Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicineOrders.map(order => (
                          <React.Fragment key={order.id}>
                            <tr style={{background: expandedOrderId === order.id ? '#f7fff7' : 'transparent'}}>
                              <td>{order.id}</td>
                              <td>{order.date} {order.time}</td>
                              <td>{order.userName} <br/><small>{order.userId}</small></td>
                              <td>{order.pharmacyName}</td>
                              <td>{order.type}</td>
                              <td>₹{order.totalAmount}</td>
                              <td>
                                <span className={`admin-status-badge ${order.paymentStatus}`}>{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${order.orderStatus.replace(/ /g, '_')}`}>{order.orderStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                              </td>
                              <td>
                                <button
                                  className="admin-icon-btn"
                                  title={expandedOrderId === order.id ? 'Collapse' : 'Expand Details'}
                                  onClick={() => toggleOrderExpansion(order.id)}
                                  style={{fontSize: '16px', fontWeight: 'bold'}}
                                >
                                  {expandedOrderId === order.id ? '▼' : '▶'}
                                </button>
                                <button className="admin-icon-btn" title="Invoice" onClick={() => alert('Download invoice for ' + order.id)}>🧾</button>
                                <button className="admin-icon-btn" title="Contact User" onClick={() => alert('Contact ' + order.userName)}>📞</button>
                              </td>
                            </tr>

                            {expandedOrderId === order.id && (
                              <tr>
                                <td colSpan="9" style={{padding: 0, background: '#fbfffb'}}>
                                  <div style={{padding: '20px', borderTop: '2px solid #10b981'}}>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
                                      <div style={{background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #d1fae5'}}>
                                        <strong style={{color: '#234f83', fontSize: '15px'}}>📋 Order Details</strong>
                                        <p style={{margin: '10px 0 0', fontSize: '14px'}}><strong>Order ID:</strong> {order.id}</p>
                                        <p style={{margin: '6px 0 0', fontSize: '14px'}}><strong>Placed On:</strong> {order.date} {order.time}</p>
                                        <p style={{margin: '6px 0 0', fontSize: '14px'}}><strong>Type:</strong> {order.type}</p>
                                        {order.prescriptionFile && <p style={{margin: '6px 0 0', fontSize: '14px'}}><strong>Prescription:</strong> <a href={`/${order.prescriptionFile}`} target="_blank" rel="noreferrer" style={{color: '#10b981'}}>📄 View File</a></p>}
                                      </div>
                                      <div style={{background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #d1fae5'}}>
                                        <strong style={{color: '#234f83', fontSize: '15px'}}>👤 User & Delivery</strong>
                                        <p style={{margin: '10px 0 0', fontSize: '14px'}}><strong>User:</strong> {order.userName} ({order.userId})</p>
                                        <p style={{margin: '6px 0 0', fontSize: '14px'}}><strong>Delivery:</strong> {order.deliveryMode}</p>
                                        <p style={{margin: '6px 0 0', fontSize: '14px'}}><strong>Address:</strong> {order.deliveryAddress}</p>
                                      </div>
                                    </div>                                    <div style={{background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #d1fae5', marginBottom: '16px'}}>
                                      <strong style={{color: '#234f83', fontSize: '15px'}}>💊 Order Items</strong>
                                      <table className="admin-table" style={{marginTop: '10px'}}>
                                        <thead>
                                          <tr>
                                            <th>Medicine</th>
                                            <th>Qty</th>
                                            <th>MRP (₹)</th>
                                            <th>Discount</th>
                                            <th>Final (₹)</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {order.items.map(it => (
                                            <tr key={it.id}>
                                              <td>{it.name}</td>
                                              <td>{it.qty}</td>
                                              <td>₹{it.mrp}</td>
                                              <td>{it.discount ? it.discount + '%' : '-'}</td>
                                              <td><strong>₹{it.finalPrice}</strong></td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                      <div style={{textAlign: 'right', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #e5e7eb'}}>
                                        <strong style={{fontSize: '16px', color: '#234f83'}}>Total Amount: ₹{order.totalAmount}</strong>
                                      </div>
                                    </div>

                                    <div style={{display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #d1fae5', marginBottom: '16px'}}>
                                      <div>
                                        <strong style={{color: '#234f83'}}>💳 Payment Method:</strong> {order.paymentMethod} &nbsp; 
                                        <span className={`admin-status-badge ${order.paymentStatus}`}>{order.paymentStatus}</span>
                                      </div>
                                      <div style={{display: 'flex', gap: '8px'}}>
                                        {order.orderStatus !== 'delivered' && <button className="admin-btn-primary" style={{padding: '8px 16px'}} onClick={() => alert('Marking ' + order.id + ' as Delivered')}>✅ Mark Delivered</button>}
                                        {order.paymentStatus !== 'paid' && <button className="admin-btn-secondary" style={{padding: '8px 16px'}} onClick={() => alert('Retry payment for ' + order.id)}>🔄 Retry Payment</button>}
                                        <button className="admin-btn-secondary" style={{padding: '8px 16px'}} onClick={() => alert('Download invoice for ' + order.id)}>📥 Invoice</button>
                                      </div>
                                    </div>

                                    <div style={{background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #d1fae5'}}>
                                      <strong style={{color: '#234f83', fontSize: '15px'}}>📊 Status Timeline</strong>
                                      <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
                                        {order.statusLogs.map((log, idx) => (
                                          <li key={idx} style={{marginBottom: '8px', fontSize: '14px'}}>
                                            <span style={{color: '#666'}}>{log.time}</span> — <strong style={{color: '#10b981'}}>{log.status}</strong>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-section-footer">
                    <p>Showing {medicineOrders.length} orders</p>
                    <div className="admin-pagination">
                      <button className="admin-page-btn">Previous</button>
                      <button className="admin-page-btn admin-active-page">1</button>
                      <button className="admin-page-btn">2</button>
                      <button className="admin-page-btn">Next</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ambulance Management Section */}
          {activeSection === 'ambulances' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>🚑 Ambulance Management</h2>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button className="admin-add-btn">+ Add Provider</button>
                  <button className="admin-add-btn">+ Add Vehicle</button>
                </div>
              </div>

              {/* Three Main Tabs */}
              <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb'}}>
                <button 
                  onClick={() => setAmbulanceSectionTab('providers')}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: ambulanceSectionTab === 'providers' ? '#234f83' : 'transparent',
                    color: ambulanceSectionTab === 'providers' ? 'white' : '#666',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontWeight: ambulanceSectionTab === 'providers' ? 'bold' : 'normal',
                    transition: 'all 0.3s'
                  }}
                >
                  🏢 Providers/Fleet Owners
                </button>
                <button 
                  onClick={() => setAmbulanceSectionTab('vehicles')}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: ambulanceSectionTab === 'vehicles' ? '#234f83' : 'transparent',
                    color: ambulanceSectionTab === 'vehicles' ? 'white' : '#666',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontWeight: ambulanceSectionTab === 'vehicles' ? 'bold' : 'normal',
                    transition: 'all 0.3s'
                  }}
                >
                  🚑 Vehicle Master
                </button>
                <button 
                  onClick={() => setAmbulanceSectionTab('bookings')}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: ambulanceSectionTab === 'bookings' ? '#234f83' : 'transparent',
                    color: ambulanceSectionTab === 'bookings' ? 'white' : '#666',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontWeight: ambulanceSectionTab === 'bookings' ? 'bold' : 'normal',
                    transition: 'all 0.3s'
                  }}
                >
                  📋 Booking Management
                </button>
              </div>

              {/* PROVIDERS TAB */}
              {ambulanceSectionTab === 'providers' && (
                <div>
                  <div className="admin-filters">
                    <input 
                      type="text" 
                      placeholder="Search by provider name, contact person..." 
                      className="admin-search-input" 
                    />
                    <select className="admin-filter-select">
                      <option value="">All Cities</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">KYC Status</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Provider ID</th>
                          <th>Provider Name</th>
                          <th>Contact Person</th>
                          <th>Phone</th>
                          <th>City</th>
                          <th>Total Vehicles</th>
                          <th>Total Bookings</th>
                          <th>Rating</th>
                          <th>KYC Status</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ambulanceProviders.map(provider => (
                          <React.Fragment key={provider.id}>
                            <tr style={{cursor: 'pointer'}} onClick={() => toggleProviderExpansion(provider.id)}>
                              <td>{provider.id}</td>
                              <td style={{fontWeight: 'bold', color: '#234f83'}}>{provider.providerName}</td>
                              <td>{provider.contactPerson}</td>
                              <td>{provider.phone}</td>
                              <td>{provider.city}</td>
                              <td>{provider.totalVehicles}</td>
                              <td>{provider.totalBookings}</td>
                              <td>
                                <span style={{color: '#f59e0b'}}>⭐ {provider.rating}</span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${provider.kycStatus === 'verified' ? 'active' : provider.kycStatus}`}>
                                  {provider.kycStatus.charAt(0).toUpperCase() + provider.kycStatus.slice(1)}
                                </span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${provider.status}`}>
                                  {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                                </span>
                              </td>
                              <td>
                                <button className="admin-icon-btn" title="Toggle Details">
                                  {expandedProviderId === provider.id ? '🔼' : '🔽'}
                                </button>
                                <button className="admin-icon-btn" title="View Vehicles">🚑</button>
                                <button className="admin-icon-btn" title="Block/Unblock">🚫</button>
                              </td>
                            </tr>

                            {/* Expanded Row - Provider KYC Details */}
                            {expandedProviderId === provider.id && (
                              <tr>
                                <td colSpan="11" style={{padding: '0', background: '#f9fafb'}}>
                                  <div style={{padding: '20px', background: 'white', margin: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>📄 Provider KYC Details</h3>
                                      {!isEditingProviderKyc ? (
                                        <button 
                                          className="admin-btn-primary" 
                                          onClick={() => {
                                            setIsEditingProviderKyc(true);
                                            setProviderKycFormData({
                                              email: provider.email,
                                              alternatePhone: provider.alternatePhone,
                                              address: provider.address,
                                              city: provider.city,
                                              state: provider.state,
                                              pincode: provider.pincode,
                                              companyRegCert: provider.companyRegCert,
                                              gst: provider.gst,
                                              bankAccountNumber: provider.bankAccountNumber,
                                              ifscCode: provider.ifscCode,
                                              bankName: provider.bankName
                                            });
                                          }}
                                          style={{padding: '8px 16px'}}
                                        >
                                          ✏️ Edit Details
                                        </button>
                                      ) : null}
                                    </div>

                                    {isEditingProviderKyc ? (
                                      <form onSubmit={(e) => handleProviderKycSave(e, provider.id)}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                          <div className="admin-form-group">
                                            <label>Email *</label>
                                            <input 
                                              type="email" 
                                              value={providerKycFormData.email || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, email: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Alternate Phone</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.alternatePhone || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, alternatePhone: e.target.value})}
                                            />
                                          </div>
                                          <div className="admin-form-group" style={{gridColumn: '1 / -1'}}>
                                            <label>Address *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.address || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, address: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>City *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.city || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, city: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>State *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.state || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, state: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Pincode *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.pincode || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, pincode: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Company Reg Certificate *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.companyRegCert || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, companyRegCert: e.target.value})}
                                              placeholder="Certificate Number"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>GST Number *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.gst || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, gst: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Bank Account Number *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.bankAccountNumber || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, bankAccountNumber: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>IFSC Code *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.ifscCode || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, ifscCode: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Bank Name *</label>
                                            <input 
                                              type="text" 
                                              value={providerKycFormData.bankName || ''} 
                                              onChange={(e) => setProviderKycFormData({...providerKycFormData, bankName: e.target.value})}
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingProviderKyc(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Email:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{provider.email}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Alternate Phone:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{provider.alternatePhone}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Complete Address:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{provider.address}, {provider.city}, {provider.state} - {provider.pincode}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Company Reg Cert:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{provider.companyRegCert}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>GST Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{provider.gst}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Bank Account:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>•••• •••• •••• {provider.bankAccountNumber.slice(-4)}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>IFSC Code:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{provider.ifscCode}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Bank Name:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{provider.bankName}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Registered Date:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{new Date(provider.registeredDate).toLocaleDateString('en-IN')}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-section-footer">
                    <p>Showing {ambulanceProviders.length} providers</p>
                    <div className="admin-pagination">
                      <button className="admin-page-btn">Previous</button>
                      <button className="admin-page-btn admin-active-page">1</button>
                      <button className="admin-page-btn">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* VEHICLES TAB */}
              {ambulanceSectionTab === 'vehicles' && (
                <div>
                  <div className="admin-filters">
                    <input 
                      type="text" 
                      placeholder="Search by vehicle ID, number, provider..." 
                      className="admin-search-input" 
                    />
                    <select className="admin-filter-select">
                      <option value="">All Providers</option>
                      {ambulanceProviders.map(p => (
                        <option key={p.id} value={p.id}>{p.providerName}</option>
                      ))}
                    </select>
                    <select className="admin-filter-select">
                      <option value="">All Vehicle Types</option>
                      <option value="bls">Basic Life Support</option>
                      <option value="als">Advanced Life Support</option>
                      <option value="cardiac">Cardiac Ambulance</option>
                      <option value="neonatal">Neonatal Ambulance</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">All Status</option>
                      <option value="available">Available</option>
                      <option value="on-trip">On Trip</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Approval Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Vehicle ID</th>
                          <th>Provider</th>
                          <th>Vehicle Number</th>
                          <th>Type</th>
                          <th>Capacity</th>
                          <th>Base Location</th>
                          <th>Total Trips</th>
                          <th>Rating</th>
                          <th>GPS</th>
                          <th>Status</th>
                          <th>Approval</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ambulanceVehicles.map(vehicle => (
                          <React.Fragment key={vehicle.id}>
                            <tr style={{cursor: 'pointer'}} onClick={() => toggleVehicleExpansion(vehicle.id)}>
                              <td style={{fontWeight: 'bold', color: '#234f83'}}>{vehicle.vehicleId}</td>
                              <td>{vehicle.providerName}</td>
                              <td>{vehicle.vehicleNumber}</td>
                              <td>
                                <span className="admin-status-badge active" style={{fontSize: '12px'}}>
                                  {vehicle.vehicleType}
                                </span>
                              </td>
                              <td>{vehicle.capacity}</td>
                              <td>{vehicle.baseLocation}</td>
                              <td>{vehicle.totalTrips}</td>
                              <td>
                                <span style={{color: '#f59e0b'}}>⭐ {vehicle.rating}</span>
                              </td>
                              <td>
                                <span style={{fontSize: '18px'}}>{vehicle.hasGPS ? '✅' : '❌'}</span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${vehicle.currentStatus === 'available' ? 'active' : vehicle.currentStatus === 'on-trip' ? 'pending' : 'rejected'}`}>
                                  {vehicle.currentStatus.charAt(0).toUpperCase() + vehicle.currentStatus.slice(1).replace('-', ' ')}
                                </span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${vehicle.approvalStatus === 'approved' ? 'active' : vehicle.approvalStatus}`}>
                                  {vehicle.approvalStatus.charAt(0).toUpperCase() + vehicle.approvalStatus.slice(1)}
                                </span>
                              </td>
                              <td>
                                <button className="admin-icon-btn" title="Toggle Details">
                                  {expandedVehicleId === vehicle.id ? '🔼' : '🔽'}
                                </button>
                                <button className="admin-icon-btn" title="Track Vehicle">📍</button>
                                {vehicle.approvalStatus === 'pending' && (
                                  <button className="admin-icon-btn" title="Approve">✅</button>
                                )}
                              </td>
                            </tr>

                            {/* Expanded Row - Vehicle Details with 4 Sub-tabs */}
                            {expandedVehicleId === vehicle.id && (
                              <tr>
                                <td colSpan="12" style={{padding: '0', background: '#f9fafb'}}>
                                  <div style={{padding: '20px', background: 'white', margin: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                                    
                                    {/* Vehicle Sub-tabs */}
                                    <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb'}}>
                                      <button 
                                        onClick={() => setVehicleManagementTab('basic')}
                                        style={{
                                          padding: '10px 20px',
                                          border: 'none',
                                          background: vehicleManagementTab === 'basic' ? '#234f83' : 'transparent',
                                          color: vehicleManagementTab === 'basic' ? 'white' : '#666',
                                          borderRadius: '8px 8px 0 0',
                                          cursor: 'pointer',
                                          fontWeight: vehicleManagementTab === 'basic' ? 'bold' : 'normal',
                                          fontSize: '14px'
                                        }}
                                      >
                                        📋 Basic Details
                                      </button>
                                      <button 
                                        onClick={() => setVehicleManagementTab('equipment')}
                                        style={{
                                          padding: '10px 20px',
                                          border: 'none',
                                          background: vehicleManagementTab === 'equipment' ? '#234f83' : 'transparent',
                                          color: vehicleManagementTab === 'equipment' ? 'white' : '#666',
                                          borderRadius: '8px 8px 0 0',
                                          cursor: 'pointer',
                                          fontWeight: vehicleManagementTab === 'equipment' ? 'bold' : 'normal',
                                          fontSize: '14px'
                                        }}
                                      >
                                        🏥 Equipment
                                      </button>
                                      <button 
                                        onClick={() => setVehicleManagementTab('pricing')}
                                        style={{
                                          padding: '10px 20px',
                                          border: 'none',
                                          background: vehicleManagementTab === 'pricing' ? '#234f83' : 'transparent',
                                          color: vehicleManagementTab === 'pricing' ? 'white' : '#666',
                                          borderRadius: '8px 8px 0 0',
                                          cursor: 'pointer',
                                          fontWeight: vehicleManagementTab === 'pricing' ? 'bold' : 'normal',
                                          fontSize: '14px'
                                        }}
                                      >
                                        💰 Pricing
                                      </button>
                                      <button 
                                        onClick={() => setVehicleManagementTab('documents')}
                                        style={{
                                          padding: '10px 20px',
                                          border: 'none',
                                          background: vehicleManagementTab === 'documents' ? '#234f83' : 'transparent',
                                          color: vehicleManagementTab === 'documents' ? 'white' : '#666',
                                          borderRadius: '8px 8px 0 0',
                                          cursor: 'pointer',
                                          fontWeight: vehicleManagementTab === 'documents' ? 'bold' : 'normal',
                                          fontSize: '14px'
                                        }}
                                      >
                                        📄 Documents
                                      </button>
                                    </div>

                                    {/* Basic Details Sub-tab */}
                                    {vehicleManagementTab === 'basic' && (
                                      <div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                          <h3 style={{margin: 0, color: '#234f83'}}>📋 Basic Details</h3>
                                          {!isEditingVehicleBasic ? (
                                            <button 
                                              className="admin-btn-primary" 
                                              onClick={() => {
                                                setIsEditingVehicleBasic(true);
                                                setVehicleBasicFormData({
                                                  vehicleId: vehicle.vehicleId,
                                                  vehicleNumber: vehicle.vehicleNumber,
                                                  vehicleType: vehicle.vehicleType,
                                                  capacity: vehicle.capacity,
                                                  baseLocation: vehicle.baseLocation,
                                                  baseCity: vehicle.baseCity
                                                });
                                              }}
                                              style={{padding: '8px 16px'}}
                                            >
                                              ✏️ Edit Details
                                            </button>
                                          ) : null}
                                        </div>

                                        {isEditingVehicleBasic ? (
                                          <form onSubmit={(e) => handleVehicleBasicSave(e, vehicle.id)}>
                                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                              <div className="admin-form-group">
                                                <label>Vehicle ID *</label>
                                                <input 
                                                  type="text" 
                                                  value={vehicleBasicFormData.vehicleId || ''} 
                                                  onChange={(e) => setVehicleBasicFormData({...vehicleBasicFormData, vehicleId: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Vehicle Number *</label>
                                                <input 
                                                  type="text" 
                                                  value={vehicleBasicFormData.vehicleNumber || ''} 
                                                  onChange={(e) => setVehicleBasicFormData({...vehicleBasicFormData, vehicleNumber: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Vehicle Type *</label>
                                                <select 
                                                  value={vehicleBasicFormData.vehicleType || ''} 
                                                  onChange={(e) => setVehicleBasicFormData({...vehicleBasicFormData, vehicleType: e.target.value})}
                                                  required
                                                  style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%'}}
                                                >
                                                  <option value="">Select Type</option>
                                                  <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
                                                  <option value="Advanced Life Support (ALS)">Advanced Life Support (ALS)</option>
                                                  <option value="Cardiac Ambulance">Cardiac Ambulance</option>
                                                  <option value="Neonatal Ambulance">Neonatal Ambulance</option>
                                                </select>
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Capacity *</label>
                                                <input 
                                                  type="text" 
                                                  value={vehicleBasicFormData.capacity || ''} 
                                                  onChange={(e) => setVehicleBasicFormData({...vehicleBasicFormData, capacity: e.target.value})}
                                                  placeholder="e.g., 2 patients + 2 attendants"
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Base Location *</label>
                                                <input 
                                                  type="text" 
                                                  value={vehicleBasicFormData.baseLocation || ''} 
                                                  onChange={(e) => setVehicleBasicFormData({...vehicleBasicFormData, baseLocation: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Base City *</label>
                                                <input 
                                                  type="text" 
                                                  value={vehicleBasicFormData.baseCity || ''} 
                                                  onChange={(e) => setVehicleBasicFormData({...vehicleBasicFormData, baseCity: e.target.value})}
                                                  required
                                                />
                                              </div>
                                            </div>
                                            <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                              <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                              <button 
                                                type="button" 
                                                className="admin-btn-secondary" 
                                                style={{padding: '8px 16px'}}
                                                onClick={() => setIsEditingVehicleBasic(false)}
                                              >
                                                ✖️ Cancel
                                              </button>
                                            </div>
                                          </form>
                                        ) : (
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Vehicle ID:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.vehicleId}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Provider:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.providerName}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Vehicle Number:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.vehicleNumber}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Type:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.vehicleType}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Capacity:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.capacity}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Base Location:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.baseLocation}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Base City:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.baseCity}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Total Trips:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.totalTrips}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Last Trip:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{new Date(vehicle.lastTrip).toLocaleDateString('en-IN')}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Equipment Sub-tab */}
                                    {vehicleManagementTab === 'equipment' && (
                                      <div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                          <h3 style={{margin: 0, color: '#234f83'}}>🏥 Equipment Configuration</h3>
                                          {!isEditingEquipment ? (
                                            <button 
                                              className="admin-btn-primary" 
                                              onClick={() => {
                                                setIsEditingEquipment(true);
                                                setEquipmentFormData({
                                                  hasOxygen: vehicle.hasOxygen,
                                                  hasVentilator: vehicle.hasVentilator,
                                                  hasDefibrillator: vehicle.hasDefibrillator,
                                                  hasStretcher: vehicle.hasStretcher,
                                                  hasWheelchair: vehicle.hasWheelchair,
                                                  hasParamedic: vehicle.hasParamedic,
                                                  hasDoctor: vehicle.hasDoctor
                                                });
                                              }}
                                              style={{padding: '8px 16px'}}
                                            >
                                              ✏️ Edit Equipment
                                            </button>
                                          ) : null}
                                        </div>

                                        {isEditingEquipment ? (
                                          <form onSubmit={(e) => handleEquipmentSave(e, vehicle.id)}>
                                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f9fafb', borderRadius: '8px'}}>
                                                <input 
                                                  type="checkbox" 
                                                  id="oxygen"
                                                  checked={equipmentFormData.hasOxygen || false} 
                                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, hasOxygen: e.target.checked})}
                                                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                />
                                                <label htmlFor="oxygen" style={{cursor: 'pointer', fontWeight: '500'}}>Oxygen Cylinder</label>
                                              </div>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f9fafb', borderRadius: '8px'}}>
                                                <input 
                                                  type="checkbox" 
                                                  id="ventilator"
                                                  checked={equipmentFormData.hasVentilator || false} 
                                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, hasVentilator: e.target.checked})}
                                                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                />
                                                <label htmlFor="ventilator" style={{cursor: 'pointer', fontWeight: '500'}}>Ventilator</label>
                                              </div>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f9fafb', borderRadius: '8px'}}>
                                                <input 
                                                  type="checkbox" 
                                                  id="defibrillator"
                                                  checked={equipmentFormData.hasDefibrillator || false} 
                                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, hasDefibrillator: e.target.checked})}
                                                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                />
                                                <label htmlFor="defibrillator" style={{cursor: 'pointer', fontWeight: '500'}}>Defibrillator</label>
                                              </div>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f9fafb', borderRadius: '8px'}}>
                                                <input 
                                                  type="checkbox" 
                                                  id="stretcher"
                                                  checked={equipmentFormData.hasStretcher || false} 
                                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, hasStretcher: e.target.checked})}
                                                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                />
                                                <label htmlFor="stretcher" style={{cursor: 'pointer', fontWeight: '500'}}>Stretcher</label>
                                              </div>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f9fafb', borderRadius: '8px'}}>
                                                <input 
                                                  type="checkbox" 
                                                  id="wheelchair"
                                                  checked={equipmentFormData.hasWheelchair || false} 
                                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, hasWheelchair: e.target.checked})}
                                                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                />
                                                <label htmlFor="wheelchair" style={{cursor: 'pointer', fontWeight: '500'}}>Wheelchair</label>
                                              </div>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f9fafb', borderRadius: '8px'}}>
                                                <input 
                                                  type="checkbox" 
                                                  id="paramedic"
                                                  checked={equipmentFormData.hasParamedic || false} 
                                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, hasParamedic: e.target.checked})}
                                                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                />
                                                <label htmlFor="paramedic" style={{cursor: 'pointer', fontWeight: '500'}}>Paramedic Staff</label>
                                              </div>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f9fafb', borderRadius: '8px'}}>
                                                <input 
                                                  type="checkbox" 
                                                  id="doctor"
                                                  checked={equipmentFormData.hasDoctor || false} 
                                                  onChange={(e) => setEquipmentFormData({...equipmentFormData, hasDoctor: e.target.checked})}
                                                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                />
                                                <label htmlFor="doctor" style={{cursor: 'pointer', fontWeight: '500'}}>Doctor on Board</label>
                                              </div>
                                            </div>
                                            <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                              <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                              <button 
                                                type="button" 
                                                className="admin-btn-secondary" 
                                                style={{padding: '8px 16px'}}
                                                onClick={() => setIsEditingEquipment(false)}
                                              >
                                                ✖️ Cancel
                                              </button>
                                            </div>
                                          </form>
                                        ) : (
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: vehicle.hasOxygen ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center'}}>
                                              <p style={{margin: 0, fontSize: '24px'}}>{vehicle.hasOxygen ? '✅' : '❌'}</p>
                                              <strong style={{color: '#666', fontSize: '14px'}}>Oxygen</strong>
                                            </div>
                                            <div style={{padding: '15px', background: vehicle.hasVentilator ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center'}}>
                                              <p style={{margin: 0, fontSize: '24px'}}>{vehicle.hasVentilator ? '✅' : '❌'}</p>
                                              <strong style={{color: '#666', fontSize: '14px'}}>Ventilator</strong>
                                            </div>
                                            <div style={{padding: '15px', background: vehicle.hasDefibrillator ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center'}}>
                                              <p style={{margin: 0, fontSize: '24px'}}>{vehicle.hasDefibrillator ? '✅' : '❌'}</p>
                                              <strong style={{color: '#666', fontSize: '14px'}}>Defibrillator</strong>
                                            </div>
                                            <div style={{padding: '15px', background: vehicle.hasStretcher ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center'}}>
                                              <p style={{margin: 0, fontSize: '24px'}}>{vehicle.hasStretcher ? '✅' : '❌'}</p>
                                              <strong style={{color: '#666', fontSize: '14px'}}>Stretcher</strong>
                                            </div>
                                            <div style={{padding: '15px', background: vehicle.hasWheelchair ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center'}}>
                                              <p style={{margin: 0, fontSize: '24px'}}>{vehicle.hasWheelchair ? '✅' : '❌'}</p>
                                              <strong style={{color: '#666', fontSize: '14px'}}>Wheelchair</strong>
                                            </div>
                                            <div style={{padding: '15px', background: vehicle.hasParamedic ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center'}}>
                                              <p style={{margin: 0, fontSize: '24px'}}>{vehicle.hasParamedic ? '✅' : '❌'}</p>
                                              <strong style={{color: '#666', fontSize: '14px'}}>Paramedic</strong>
                                            </div>
                                            <div style={{padding: '15px', background: vehicle.hasDoctor ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center'}}>
                                              <p style={{margin: 0, fontSize: '24px'}}>{vehicle.hasDoctor ? '✅' : '❌'}</p>
                                              <strong style={{color: '#666', fontSize: '14px'}}>Doctor</strong>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Pricing Sub-tab */}
                                    {vehicleManagementTab === 'pricing' && (
                                      <div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                          <h3 style={{margin: 0, color: '#234f83'}}>💰 Pricing Structure</h3>
                                          {!isEditingPricing ? (
                                            <button 
                                              className="admin-btn-primary" 
                                              onClick={() => {
                                                setIsEditingPricing(true);
                                                setPricingFormData({
                                                  baseFare: vehicle.baseFare,
                                                  baseKm: vehicle.baseKm,
                                                  perKmCharge: vehicle.perKmCharge,
                                                  waitingCharge: vehicle.waitingCharge,
                                                  hasNightCharges: vehicle.hasNightCharges,
                                                  nightChargePercent: vehicle.nightChargePercent,
                                                  hasEmergencySurcharge: vehicle.hasEmergencySurcharge,
                                                  emergencySurchargePercent: vehicle.emergencySurchargePercent
                                                });
                                              }}
                                              style={{padding: '8px 16px'}}
                                            >
                                              ✏️ Edit Pricing
                                            </button>
                                          ) : null}
                                        </div>

                                        {isEditingPricing ? (
                                          <form onSubmit={(e) => handlePricingSave(e, vehicle.id)}>
                                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                              <div className="admin-form-group">
                                                <label>Base Fare (₹) *</label>
                                                <input 
                                                  type="number" 
                                                  value={pricingFormData.baseFare || ''} 
                                                  onChange={(e) => setPricingFormData({...pricingFormData, baseFare: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Base Km Included *</label>
                                                <input 
                                                  type="number" 
                                                  value={pricingFormData.baseKm || ''} 
                                                  onChange={(e) => setPricingFormData({...pricingFormData, baseKm: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Per Km Charge (₹) *</label>
                                                <input 
                                                  type="number" 
                                                  value={pricingFormData.perKmCharge || ''} 
                                                  onChange={(e) => setPricingFormData({...pricingFormData, perKmCharge: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Waiting Charge (₹/hour) *</label>
                                                <input 
                                                  type="number" 
                                                  value={pricingFormData.waitingCharge || ''} 
                                                  onChange={(e) => setPricingFormData({...pricingFormData, waitingCharge: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                  <input 
                                                    type="checkbox" 
                                                    id="nightCharges"
                                                    checked={pricingFormData.hasNightCharges || false} 
                                                    onChange={(e) => setPricingFormData({...pricingFormData, hasNightCharges: e.target.checked})}
                                                    style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                  />
                                                  <label htmlFor="nightCharges" style={{cursor: 'pointer'}}>Night Charges (10 PM - 6 AM)</label>
                                                </div>
                                                {pricingFormData.hasNightCharges && (
                                                  <input 
                                                    type="number" 
                                                    value={pricingFormData.nightChargePercent || ''} 
                                                    onChange={(e) => setPricingFormData({...pricingFormData, nightChargePercent: e.target.value})}
                                                    placeholder="% Additional"
                                                    style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                                                  />
                                                )}
                                              </div>
                                              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                  <input 
                                                    type="checkbox" 
                                                    id="emergencySurcharge"
                                                    checked={pricingFormData.hasEmergencySurcharge || false} 
                                                    onChange={(e) => setPricingFormData({...pricingFormData, hasEmergencySurcharge: e.target.checked})}
                                                    style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                                  />
                                                  <label htmlFor="emergencySurcharge" style={{cursor: 'pointer'}}>Emergency Surcharge</label>
                                                </div>
                                                {pricingFormData.hasEmergencySurcharge && (
                                                  <input 
                                                    type="number" 
                                                    value={pricingFormData.emergencySurchargePercent || ''} 
                                                    onChange={(e) => setPricingFormData({...pricingFormData, emergencySurchargePercent: e.target.value})}
                                                    placeholder="% Additional"
                                                    style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                                                  />
                                                )}
                                              </div>
                                            </div>
                                            <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                              <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                              <button 
                                                type="button" 
                                                className="admin-btn-secondary" 
                                                style={{padding: '8px 16px'}}
                                                onClick={() => setIsEditingPricing(false)}
                                              >
                                                ✖️ Cancel
                                              </button>
                                            </div>
                                          </form>
                                        ) : (
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Base Fare:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>₹{vehicle.baseFare}</p>
                                              <p style={{margin: '5px 0 0 0', fontSize: '13px', color: '#999'}}>(Includes {vehicle.baseKm} km)</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Per Km Charge:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>₹{vehicle.perKmCharge}/km</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Waiting Charge:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>₹{vehicle.waitingCharge}/hour</p>
                                            </div>
                                            <div style={{padding: '15px', background: vehicle.hasNightCharges ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Night Charges:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                                {vehicle.hasNightCharges ? `+${vehicle.nightChargePercent}% (10 PM - 6 AM)` : 'Not Applicable'}
                                              </p>
                                            </div>
                                            <div style={{padding: '15px', background: vehicle.hasEmergencySurcharge ? '#fff3cd' : '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', gridColumn: '1 / -1'}}>
                                              <strong style={{color: '#666'}}>Emergency Surcharge:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                                {vehicle.hasEmergencySurcharge ? `+${vehicle.emergencySurchargePercent}% on total fare` : 'Not Applicable'}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Documents Sub-tab */}
                                    {vehicleManagementTab === 'documents' && (
                                      <div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                          <h3 style={{margin: 0, color: '#234f83'}}>📄 Vehicle Documents</h3>
                                          {!isEditingDocuments ? (
                                            <button 
                                              className="admin-btn-primary" 
                                              onClick={() => {
                                                setIsEditingDocuments(true);
                                                setDocumentsFormData({
                                                  rcBook: vehicle.rcBook,
                                                  insurance: vehicle.insurance,
                                                  driverLicense: vehicle.driverLicense,
                                                  validityExpiry: vehicle.validityExpiry
                                                });
                                              }}
                                              style={{padding: '8px 16px'}}
                                            >
                                              ✏️ Update Documents
                                            </button>
                                          ) : null}
                                        </div>

                                        {isEditingDocuments ? (
                                          <form onSubmit={(e) => handleDocumentsSave(e, vehicle.id)}>
                                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                              <div className="admin-form-group">
                                                <label>RC Book *</label>
                                                <input 
                                                  type="text" 
                                                  value={documentsFormData.rcBook || ''} 
                                                  onChange={(e) => setDocumentsFormData({...documentsFormData, rcBook: e.target.value})}
                                                  placeholder="RC Book filename or number"
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Insurance Certificate *</label>
                                                <input 
                                                  type="text" 
                                                  value={documentsFormData.insurance || ''} 
                                                  onChange={(e) => setDocumentsFormData({...documentsFormData, insurance: e.target.value})}
                                                  placeholder="Insurance certificate filename"
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Driver License *</label>
                                                <input 
                                                  type="text" 
                                                  value={documentsFormData.driverLicense || ''} 
                                                  onChange={(e) => setDocumentsFormData({...documentsFormData, driverLicense: e.target.value})}
                                                  placeholder="Driver license filename or number"
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Validity Expiry Date *</label>
                                                <input 
                                                  type="date" 
                                                  value={documentsFormData.validityExpiry || ''} 
                                                  onChange={(e) => setDocumentsFormData({...documentsFormData, validityExpiry: e.target.value})}
                                                  required
                                                />
                                              </div>
                                            </div>
                                            <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                              <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                              <button 
                                                type="button" 
                                                className="admin-btn-secondary" 
                                                style={{padding: '8px 16px'}}
                                                onClick={() => setIsEditingDocuments(false)}
                                              >
                                                ✖️ Cancel
                                              </button>
                                            </div>
                                          </form>
                                        ) : (
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>RC Book:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.rcBook}</p>
                                              <button className="admin-btn-secondary" style={{marginTop: '10px', padding: '6px 12px', fontSize: '13px'}}>📥 Download</button>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Insurance Certificate:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.insurance}</p>
                                              <button className="admin-btn-secondary" style={{marginTop: '10px', padding: '6px 12px', fontSize: '13px'}}>📥 Download</button>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Driver License:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{vehicle.driverLicense}</p>
                                              <button className="admin-btn-secondary" style={{marginTop: '10px', padding: '6px 12px', fontSize: '13px'}}>📥 Download</button>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Validity Expiry:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                                {new Date(vehicle.validityExpiry).toLocaleDateString('en-IN')}
                                                {new Date(vehicle.validityExpiry) < new Date() && (
                                                  <span style={{marginLeft: '10px', color: '#dc2626', fontWeight: 'bold'}}>⚠️ Expired</span>
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-section-footer">
                    <p>Showing {ambulanceVehicles.length} vehicles</p>
                    <div className="admin-pagination">
                      <button className="admin-page-btn">Previous</button>
                      <button className="admin-page-btn admin-active-page">1</button>
                      <button className="admin-page-btn">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* BOOKINGS TAB */}
              {ambulanceSectionTab === 'bookings' && (
                <div>
                  <div className="admin-filters">
                    <input 
                      type="text" 
                      placeholder="Search by booking ID, patient name, caller..." 
                      className="admin-search-input" 
                    />
                    <select className="admin-filter-select">
                      <option value="">All Emergency Types</option>
                      <option value="cardiac">Cardiac Emergency</option>
                      <option value="accident">Accident</option>
                      <option value="pregnancy">Pregnancy Emergency</option>
                      <option value="other">Other</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">All Trip Status</option>
                      <option value="requested">Requested</option>
                      <option value="assigned">Assigned</option>
                      <option value="en-route">En Route</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Payment Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📅 Date Filter</button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Request Time</th>
                          <th>Patient Name</th>
                          <th>Contact</th>
                          <th>Emergency Type</th>
                          <th>Provider</th>
                          <th>Vehicle</th>
                          <th>Distance (km)</th>
                          <th>Total Fare (₹)</th>
                          <th>Payment</th>
                          <th>Trip Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ambulanceBookings.map(booking => (
                          <React.Fragment key={booking.id}>
                            <tr style={{cursor: 'pointer'}} onClick={() => toggleBookingExpansion(booking.id)}>
                              <td style={{fontWeight: 'bold', color: '#234f83'}}>{booking.id}</td>
                              <td>{booking.requestTime}</td>
                              <td>{booking.patientName}</td>
                              <td>{booking.contactNumber}</td>
                              <td>
                                <span className="admin-status-badge pending" style={{fontSize: '12px'}}>
                                  {booking.emergencyType}
                                </span>
                              </td>
                              <td>{booking.providerName || 'Not Assigned'}</td>
                              <td>{booking.assignedVehicle || 'Not Assigned'}</td>
                              <td>{booking.distanceTravelled || 0}</td>
                              <td style={{fontWeight: 'bold'}}>₹{booking.totalFare}</td>
                              <td>
                                <span className={`admin-status-badge ${booking.paymentStatus === 'paid' ? 'active' : booking.paymentStatus === 'pending' ? 'pending' : 'rejected'}`}>
                                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                </span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${booking.tripStatus === 'completed' ? 'active' : booking.tripStatus === 'requested' ? 'pending' : 'pending'}`}>
                                  {booking.tripStatus.charAt(0).toUpperCase() + booking.tripStatus.slice(1)}
                                </span>
                              </td>
                              <td>
                                <button className="admin-icon-btn" title="Toggle Details">
                                  {expandedBookingId === booking.id ? '🔼' : '🔽'}
                                </button>
                                {booking.tripStatus === 'requested' && (
                                  <button className="admin-icon-btn" title="Assign Vehicle">🚑</button>
                                )}
                              </td>
                            </tr>

                            {/* Expanded Row - Booking Details */}
                            {expandedBookingId === booking.id && (
                              <tr>
                                <td colSpan="12" style={{padding: '0', background: '#f9fafb'}}>
                                  <div style={{padding: '20px', background: 'white', margin: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                                    
                                    <h3 style={{margin: '0 0 20px 0', color: '#234f83'}}>📋 Booking Details - {booking.id}</h3>

                                    {/* Patient & Caller Information */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>👤 Patient & Caller Information</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Patient Name:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.patientName}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Caller Name:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.callerName}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Contact Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.contactNumber}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Emergency Type:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.emergencyType}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', gridColumn: '2 / -1'}}>
                                          <strong style={{color: '#666'}}>Selected Vehicle Type:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.selectedVehicleType}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Location Information */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>📍 Location Details</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Pickup Location:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.pickupLocation}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Drop Location:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.dropLocation}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', gridColumn: '1 / -1'}}>
                                          <strong style={{color: '#666'}}>Preferred Hospital:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.preferredHospital}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Vehicle Assignment */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>🚑 Vehicle Assignment</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Provider:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.providerName || 'Not Assigned Yet'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Vehicle Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.assignedVehicle || 'Not Assigned Yet'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Driver:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.assignedDriver || 'Not Assigned Yet'}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Trip Timeline */}
                                    {booking.startTime && (
                                      <div style={{marginBottom: '25px'}}>
                                        <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>⏱️ Trip Timeline</h4>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px'}}>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Start Time:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.startTime}</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Arrival Time:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.arrivalTime || 'Pending'}</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Drop Time:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.dropTime || 'Pending'}</p>
                                          </div>
                                          <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                            <strong style={{color: '#666'}}>Distance:</strong>
                                            <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.distanceTravelled} km</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Fare Breakdown */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>💰 Fare Breakdown</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Base Fare:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>₹{booking.baseFare}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Km Charge:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>₹{booking.kmCharge}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Waiting Charge:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>₹{booking.waitingCharge}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Night Charge:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>₹{booking.nightCharge}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Emergency Charge:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>₹{booking.emergencyCharge}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#d1fae5', borderRadius: '8px', border: '2px solid #10b981'}}>
                                          <strong style={{color: '#666'}}>Total Fare:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#234f83'}}>₹{booking.totalFare}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>💳 Payment Information</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Payment Method:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.paymentMethod || 'Not Selected'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Transaction ID:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{booking.transactionId || 'N/A'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Payment Status:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                            <span className={`admin-status-badge ${booking.paymentStatus === 'paid' ? 'active' : booking.paymentStatus}`}>
                                              {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Trip Status Logs */}
                                    <div>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>📝 Trip Status Logs</h4>
                                      <div style={{padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                        {booking.statusLogs.map((log, index) => (
                                          <div 
                                            key={index} 
                                            style={{
                                              display: 'flex', 
                                              alignItems: 'center', 
                                              marginBottom: index < booking.statusLogs.length - 1 ? '15px' : '0',
                                              paddingBottom: index < booking.statusLogs.length - 1 ? '15px' : '0',
                                              borderBottom: index < booking.statusLogs.length - 1 ? '1px solid #e5e7eb' : 'none'
                                            }}
                                          >
                                            <div style={{
                                              width: '12px', 
                                              height: '12px', 
                                              borderRadius: '50%', 
                                              background: index === booking.statusLogs.length - 1 ? '#10b981' : '#9ca3af',
                                              marginRight: '15px'
                                            }}></div>
                                            <div style={{flex: 1}}>
                                              <p style={{margin: 0, fontWeight: 'bold', color: '#234f83'}}>{log.status}</p>
                                              <p style={{margin: '3px 0 0 0', fontSize: '13px', color: '#666'}}>{log.time}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                                      {booking.tripStatus === 'requested' && (
                                        <button className="admin-btn-primary" style={{padding: '8px 16px'}}>🚑 Assign Vehicle</button>
                                      )}
                                      {booking.tripStatus !== 'completed' && booking.tripStatus !== 'cancelled' && (
                                        <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>❌ Cancel Booking</button>
                                      )}
                                      <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📥 Download Invoice</button>
                                      <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📞 Call Patient</button>
                                    </div>

                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-section-footer">
                    <p>Showing {ambulanceBookings.length} bookings</p>
                    <div className="admin-pagination">
                      <button className="admin-page-btn">Previous</button>
                      <button className="admin-page-btn admin-active-page">1</button>
                      <button className="admin-page-btn">Next</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pathlab Management Section */}
          {activeSection === 'pathlabs' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>🔬 Pathlab Management</h2>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button className="admin-add-btn">+ Add Lab</button>
                  <button className="admin-add-btn">+ Add Test</button>
                </div>
              </div>

              {/* Three Main Tabs */}
              <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb'}}>
                <button 
                  onClick={() => setPathlabSectionTab('labs')}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: pathlabSectionTab === 'labs' ? '#234f83' : 'transparent',
                    color: pathlabSectionTab === 'labs' ? 'white' : '#666',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontWeight: pathlabSectionTab === 'labs' ? 'bold' : 'normal'
                  }}
                >
                  🔬 Labs / KYC Documents
                </button>
                <button 
                  onClick={() => setPathlabSectionTab('tests')}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: pathlabSectionTab === 'tests' ? '#234f83' : 'transparent',
                    color: pathlabSectionTab === 'tests' ? 'white' : '#666',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontWeight: pathlabSectionTab === 'tests' ? 'bold' : 'normal'
                  }}
                >
                  🧪 Test Catalogue
                </button>
                <button 
                  onClick={() => setPathlabSectionTab('orders')}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: pathlabSectionTab === 'orders' ? '#234f83' : 'transparent',
                    color: pathlabSectionTab === 'orders' ? 'white' : '#666',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontWeight: pathlabSectionTab === 'orders' ? 'bold' : 'normal'
                  }}
                >
                  📋 Lab Orders
                </button>
              </div>

              {/* LABS TAB */}
              {pathlabSectionTab === 'labs' && (
                <div>
                  <div className="admin-filters">
                    <input 
                      type="text" 
                      placeholder="Search by lab name, owner..." 
                      className="admin-search-input" 
                    />
                    <select className="admin-filter-select">
                      <option value="">All Cities</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">KYC Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Lab ID</th>
                          <th>Lab Name</th>
                          <th>Owner</th>
                          <th>Mobile</th>
                          <th>City</th>
                          <th>Total Tests</th>
                          <th>Total Orders</th>
                          <th>KYC Status</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pathlabsExtended.map(lab => (
                          <React.Fragment key={lab.id}>
                            <tr style={{cursor: 'pointer'}} onClick={() => togglePathlabExpansion(lab.id)}>
                              <td>{lab.id}</td>
                              <td style={{fontWeight: 'bold', color: '#234f83'}}>{lab.name}</td>
                              <td>{lab.owner}</td>
                              <td>{lab.mobile}</td>
                              <td>{lab.city}</td>
                              <td>{lab.totalTests}</td>
                              <td>{lab.totalOrders}</td>
                              <td>
                                <span className={`admin-status-badge ${lab.kycStatus === 'approved' ? 'active' : lab.kycStatus}`}>
                                  {lab.kycStatus.charAt(0).toUpperCase() + lab.kycStatus.slice(1)}
                                </span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${lab.status}`}>
                                  {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                                </span>
                              </td>
                              <td>
                                <button className="admin-icon-btn" title="Toggle Details">
                                  {expandedPathlabId === lab.id ? '🔼' : '🔽'}
                                </button>
                                <button className="admin-icon-btn" title="View Tests">🧪</button>
                              </td>
                            </tr>

                            {/* Expanded Row - Lab KYC Documents */}
                            {expandedPathlabId === lab.id && (
                              <tr>
                                <td colSpan="10" style={{padding: '0', background: '#f9fafb'}}>
                                  <div style={{padding: '20px', background: 'white', margin: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>📄 Lab KYC Documents</h3>
                                      {!isEditingLabKyc ? (
                                        <button 
                                          className="admin-btn-primary" 
                                          onClick={() => {
                                            setIsEditingLabKyc(true);
                                            setLabKycFormData({
                                              email: lab.email,
                                              address: lab.address,
                                              licenseNumber: lab.licenseNumber,
                                              licenseExpiry: lab.licenseExpiry,
                                              regCertificate: lab.regCertificate,
                                              drugsLicense: lab.drugsLicense,
                                              clinicalEstablishment: lab.clinicalEstablishment,
                                              gstPan: lab.gstPan,
                                              ownerIdentity: lab.ownerIdentity
                                            });
                                          }}
                                          style={{padding: '8px 16px'}}
                                        >
                                          ✏️ Edit KYC
                                        </button>
                                      ) : null}
                                    </div>

                                    {isEditingLabKyc ? (
                                      <form onSubmit={(e) => handleLabKycSave(e, lab.id)}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                          <div className="admin-form-group">
                                            <label>Email *</label>
                                            <input 
                                              type="email" 
                                              value={labKycFormData.email || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, email: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Address *</label>
                                            <input 
                                              type="text" 
                                              value={labKycFormData.address || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, address: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>License Number *</label>
                                            <input 
                                              type="text" 
                                              value={labKycFormData.licenseNumber || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, licenseNumber: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>License Expiry *</label>
                                            <input 
                                              type="date" 
                                              value={labKycFormData.licenseExpiry || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, licenseExpiry: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Lab Registration Certificate *</label>
                                            <input 
                                              type="text" 
                                              value={labKycFormData.regCertificate || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, regCertificate: e.target.value})}
                                              placeholder="Upload filename or URL"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Drugs & Diagnostic License *</label>
                                            <input 
                                              type="text" 
                                              value={labKycFormData.drugsLicense || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, drugsLicense: e.target.value})}
                                              placeholder="Upload filename or URL"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Clinical Establishment Registration *</label>
                                            <input 
                                              type="text" 
                                              value={labKycFormData.clinicalEstablishment || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, clinicalEstablishment: e.target.value})}
                                              placeholder="Upload filename or URL"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>GST/PAN *</label>
                                            <input 
                                              type="text" 
                                              value={labKycFormData.gstPan || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, gstPan: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Owner Identity *</label>
                                            <input 
                                              type="text" 
                                              value={labKycFormData.ownerIdentity || ''} 
                                              onChange={(e) => setLabKycFormData({...labKycFormData, ownerIdentity: e.target.value})}
                                              placeholder="Aadhar/PAN"
                                              required
                                            />
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingLabKyc(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Email:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{lab.email}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Address:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{lab.address}, {lab.city}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>License Number:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{lab.licenseNumber}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>License Expiry:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{new Date(lab.licenseExpiry).toLocaleDateString('en-IN')}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Lab Registration Certificate:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{lab.regCertificate}</p>
                                          <button className="admin-btn-secondary" style={{marginTop: '10px', padding: '6px 12px', fontSize: '13px'}}>📥 Download</button>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Drugs & Diagnostic License:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{lab.drugsLicense}</p>
                                          <button className="admin-btn-secondary" style={{marginTop: '10px', padding: '6px 12px', fontSize: '13px'}}>📥 Download</button>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Clinical Establishment Reg:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{lab.clinicalEstablishment}</p>
                                          <button className="admin-btn-secondary" style={{marginTop: '10px', padding: '6px 12px', fontSize: '13px'}}>📥 Download</button>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>GST/PAN:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{lab.gstPan}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Owner Identity:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{lab.ownerIdentity}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-section-footer">
                    <p>Showing {pathlabsExtended.length} labs</p>
                    <div className="admin-pagination">
                      <button className="admin-page-btn">Previous</button>
                      <button className="admin-page-btn admin-active-page">1</button>
                      <button className="admin-page-btn">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TESTS TAB */}
              {pathlabSectionTab === 'tests' && (
                <div>
                  <div className="admin-filters">
                    <input 
                      type="text" 
                      placeholder="Search by test name, code..." 
                      className="admin-search-input" 
                    />
                    <select className="admin-filter-select">
                      <option value="">All Categories</option>
                      <option value="biochemistry">Biochemistry</option>
                      <option value="hematology">Hematology</option>
                      <option value="serology">Serology</option>
                      <option value="microbiology">Microbiology</option>
                      <option value="radiology">Radiology</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Sample Type</option>
                      <option value="blood">Blood</option>
                      <option value="urine">Urine</option>
                      <option value="stool">Stool</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Test ID</th>
                          <th>Test Name</th>
                          <th>Short Code</th>
                          <th>Category</th>
                          <th>Sample Type</th>
                          <th>Fasting</th>
                          <th>TAT</th>
                          <th>Price (₹)</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labTests.map(test => (
                          <React.Fragment key={test.id}>
                            <tr style={{cursor: 'pointer'}} onClick={() => toggleTestExpansion(test.id)}>
                              <td>{test.id}</td>
                              <td style={{fontWeight: 'bold', color: '#234f83'}}>{test.testName}</td>
                              <td>{test.shortCode}</td>
                              <td>
                                <span className="admin-status-badge active" style={{fontSize: '12px'}}>
                                  {test.category}
                                </span>
                              </td>
                              <td>{test.sampleType}</td>
                              <td>{test.fastingRequired === 'Yes' ? '✅' : '❌'}</td>
                              <td>{test.tat}</td>
                              <td style={{fontWeight: 'bold'}}>₹{test.price}</td>
                              <td>
                                <span className={`admin-status-badge ${test.status}`}>
                                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                                </span>
                              </td>
                              <td>
                                <button className="admin-icon-btn" title="Toggle Details">
                                  {expandedTestId === test.id ? '🔼' : '🔽'}
                                </button>
                                <button className="admin-icon-btn" title="Edit">✏️</button>
                              </td>
                            </tr>

                            {/* Expanded Row - Test Details with 3 Sub-tabs */}
                            {expandedTestId === test.id && (
                              <tr>
                                <td colSpan="10" style={{padding: '0', background: '#f9fafb'}}>
                                  <div style={{padding: '20px', background: 'white', margin: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                                    
                                    {/* Test Sub-tabs */}
                                    <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb'}}>
                                      <button 
                                        onClick={() => setTestManagementTab('details')}
                                        style={{
                                          padding: '10px 20px',
                                          border: 'none',
                                          background: testManagementTab === 'details' ? '#234f83' : 'transparent',
                                          color: testManagementTab === 'details' ? 'white' : '#666',
                                          borderRadius: '8px 8px 0 0',
                                          cursor: 'pointer',
                                          fontWeight: testManagementTab === 'details' ? 'bold' : 'normal',
                                          fontSize: '14px'
                                        }}
                                      >
                                        📋 Test Details
                                      </button>
                                      <button 
                                        onClick={() => setTestManagementTab('pricing')}
                                        style={{
                                          padding: '10px 20px',
                                          border: 'none',
                                          background: testManagementTab === 'pricing' ? '#234f83' : 'transparent',
                                          color: testManagementTab === 'pricing' ? 'white' : '#666',
                                          borderRadius: '8px 8px 0 0',
                                          cursor: 'pointer',
                                          fontWeight: testManagementTab === 'pricing' ? 'bold' : 'normal',
                                          fontSize: '14px'
                                        }}
                                      >
                                        💰 Pricing
                                      </button>
                                      <button 
                                        onClick={() => setTestManagementTab('reference')}
                                        style={{
                                          padding: '10px 20px',
                                          border: 'none',
                                          background: testManagementTab === 'reference' ? '#234f83' : 'transparent',
                                          color: testManagementTab === 'reference' ? 'white' : '#666',
                                          borderRadius: '8px 8px 0 0',
                                          cursor: 'pointer',
                                          fontWeight: testManagementTab === 'reference' ? 'bold' : 'normal',
                                          fontSize: '14px'
                                        }}
                                      >
                                        📊 Reference Range
                                      </button>
                                    </div>

                                    {/* Test Details Sub-tab */}
                                    {testManagementTab === 'details' && (
                                      <div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                          <h3 style={{margin: 0, color: '#234f83'}}>📋 Test Details</h3>
                                          {!isEditingTestDetails ? (
                                            <button 
                                              className="admin-btn-primary" 
                                              onClick={() => {
                                                setIsEditingTestDetails(true);
                                                setTestDetailsFormData({
                                                  testName: test.testName,
                                                  shortCode: test.shortCode,
                                                  category: test.category,
                                                  sampleType: test.sampleType,
                                                  fastingRequired: test.fastingRequired,
                                                  tat: test.tat,
                                                  instructions: test.instructions
                                                });
                                              }}
                                              style={{padding: '8px 16px'}}
                                            >
                                              ✏️ Edit Details
                                            </button>
                                          ) : null}
                                        </div>

                                        {isEditingTestDetails ? (
                                          <form onSubmit={(e) => handleTestDetailsSave(e, test.id)}>
                                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                              <div className="admin-form-group">
                                                <label>Test Name *</label>
                                                <input 
                                                  type="text" 
                                                  value={testDetailsFormData.testName || ''} 
                                                  onChange={(e) => setTestDetailsFormData({...testDetailsFormData, testName: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Short Code *</label>
                                                <input 
                                                  type="text" 
                                                  value={testDetailsFormData.shortCode || ''} 
                                                  onChange={(e) => setTestDetailsFormData({...testDetailsFormData, shortCode: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Category *</label>
                                                <select 
                                                  value={testDetailsFormData.category || ''} 
                                                  onChange={(e) => setTestDetailsFormData({...testDetailsFormData, category: e.target.value})}
                                                  required
                                                  style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%'}}
                                                >
                                                  <option value="">Select Category</option>
                                                  <option value="Biochemistry">Biochemistry</option>
                                                  <option value="Hematology">Hematology</option>
                                                  <option value="Serology">Serology</option>
                                                  <option value="Microbiology">Microbiology</option>
                                                  <option value="Radiology">Radiology</option>
                                                </select>
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Sample Type *</label>
                                                <select 
                                                  value={testDetailsFormData.sampleType || ''} 
                                                  onChange={(e) => setTestDetailsFormData({...testDetailsFormData, sampleType: e.target.value})}
                                                  required
                                                  style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%'}}
                                                >
                                                  <option value="">Select Sample Type</option>
                                                  <option value="Blood">Blood</option>
                                                  <option value="Urine">Urine</option>
                                                  <option value="Stool">Stool</option>
                                                  <option value="Image">Image/Radiology</option>
                                                </select>
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Fasting Required *</label>
                                                <select 
                                                  value={testDetailsFormData.fastingRequired || ''} 
                                                  onChange={(e) => setTestDetailsFormData({...testDetailsFormData, fastingRequired: e.target.value})}
                                                  required
                                                  style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%'}}
                                                >
                                                  <option value="Yes">Yes</option>
                                                  <option value="No">No</option>
                                                </select>
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Report TAT *</label>
                                                <input 
                                                  type="text" 
                                                  value={testDetailsFormData.tat || ''} 
                                                  onChange={(e) => setTestDetailsFormData({...testDetailsFormData, tat: e.target.value})}
                                                  placeholder="e.g., 24 hrs"
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group" style={{gridColumn: '1 / -1'}}>
                                                <label>Test Instructions</label>
                                                <textarea 
                                                  value={testDetailsFormData.instructions || ''} 
                                                  onChange={(e) => setTestDetailsFormData({...testDetailsFormData, instructions: e.target.value})}
                                                  rows="3"
                                                  style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%'}}
                                                  placeholder="Special instructions, fasting hours, precautions..."
                                                />
                                              </div>
                                            </div>
                                            <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                              <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                              <button 
                                                type="button" 
                                                className="admin-btn-secondary" 
                                                style={{padding: '8px 16px'}}
                                                onClick={() => setIsEditingTestDetails(false)}
                                              >
                                                ✖️ Cancel
                                              </button>
                                            </div>
                                          </form>
                                        ) : (
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Test Name:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.testName}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Short Code:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.shortCode}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Category:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.category}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Sample Type:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.sampleType}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Fasting Required:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.fastingRequired}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Report TAT:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.tat}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', gridColumn: '1 / -1'}}>
                                              <strong style={{color: '#666'}}>Instructions:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.instructions}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Pricing Sub-tab */}
                                    {testManagementTab === 'pricing' && (
                                      <div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                          <h3 style={{margin: 0, color: '#234f83'}}>💰 Test Pricing</h3>
                                          {!isEditingTestPricing ? (
                                            <button 
                                              className="admin-btn-primary" 
                                              onClick={() => {
                                                setIsEditingTestPricing(true);
                                                setTestPricingFormData({
                                                  price: test.price,
                                                  discount: test.discount
                                                });
                                              }}
                                              style={{padding: '8px 16px'}}
                                            >
                                              ✏️ Edit Pricing
                                            </button>
                                          ) : null}
                                        </div>

                                        {isEditingTestPricing ? (
                                          <form onSubmit={(e) => handleTestPricingSave(e, test.id)}>
                                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                              <div className="admin-form-group">
                                                <label>Price / MRP (₹) *</label>
                                                <input 
                                                  type="number" 
                                                  value={testPricingFormData.price || ''} 
                                                  onChange={(e) => setTestPricingFormData({...testPricingFormData, price: e.target.value})}
                                                  required
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Discount (%) </label>
                                                <input 
                                                  type="number" 
                                                  value={testPricingFormData.discount || ''} 
                                                  onChange={(e) => setTestPricingFormData({...testPricingFormData, discount: e.target.value})}
                                                  placeholder="Optional discount percentage"
                                                />
                                              </div>
                                            </div>
                                            <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                              <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                              <button 
                                                type="button" 
                                                className="admin-btn-secondary" 
                                                style={{padding: '8px 16px'}}
                                                onClick={() => setIsEditingTestPricing(false)}
                                              >
                                                ✖️ Cancel
                                              </button>
                                            </div>
                                          </form>
                                        ) : (
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>MRP:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#234f83'}}>₹{test.price}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Discount:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#10b981'}}>{test.discount}%</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#d1fae5', borderRadius: '8px', border: '2px solid #10b981'}}>
                                              <strong style={{color: '#666'}}>Final Price:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#234f83'}}>
                                                ₹{test.price - (test.price * test.discount / 100)}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Reference Range Sub-tab */}
                                    {testManagementTab === 'reference' && (
                                      <div>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                          <h3 style={{margin: 0, color: '#234f83'}}>📊 Reference Range</h3>
                                          {!isEditingTestReference ? (
                                            <button 
                                              className="admin-btn-primary" 
                                              onClick={() => {
                                                setIsEditingTestReference(true);
                                                setTestReferenceFormData({
                                                  male: test.referenceRange.male || '',
                                                  female: test.referenceRange.female || '',
                                                  child: test.referenceRange.child || ''
                                                });
                                              }}
                                              style={{padding: '8px 16px'}}
                                            >
                                              ✏️ Edit Reference Range
                                            </button>
                                          ) : null}
                                        </div>

                                        {isEditingTestReference ? (
                                          <form onSubmit={(e) => handleTestReferenceSave(e, test.id)}>
                                            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '20px'}}>
                                              <div className="admin-form-group">
                                                <label>Male Reference Range</label>
                                                <input 
                                                  type="text" 
                                                  value={testReferenceFormData.male || ''} 
                                                  onChange={(e) => setTestReferenceFormData({...testReferenceFormData, male: e.target.value})}
                                                  placeholder="e.g., 4.5-11.0 x10^9/L"
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Female Reference Range</label>
                                                <input 
                                                  type="text" 
                                                  value={testReferenceFormData.female || ''} 
                                                  onChange={(e) => setTestReferenceFormData({...testReferenceFormData, female: e.target.value})}
                                                  placeholder="e.g., 4.0-10.5 x10^9/L"
                                                />
                                              </div>
                                              <div className="admin-form-group">
                                                <label>Child Reference Range</label>
                                                <input 
                                                  type="text" 
                                                  value={testReferenceFormData.child || ''} 
                                                  onChange={(e) => setTestReferenceFormData({...testReferenceFormData, child: e.target.value})}
                                                  placeholder="e.g., 5.0-13.0 x10^9/L"
                                                />
                                              </div>
                                            </div>
                                            <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                              <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                              <button 
                                                type="button" 
                                                className="admin-btn-secondary" 
                                                style={{padding: '8px 16px'}}
                                                onClick={() => setIsEditingTestReference(false)}
                                              >
                                                ✖️ Cancel
                                              </button>
                                            </div>
                                          </form>
                                        ) : (
                                          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Male Reference Range:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.referenceRange.male || 'Not specified'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Female Reference Range:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.referenceRange.female || 'Not specified'}</p>
                                            </div>
                                            <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                              <strong style={{color: '#666'}}>Child Reference Range:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{test.referenceRange.child || 'Not specified'}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-section-footer">
                    <p>Showing {labTests.length} tests</p>
                    <div className="admin-pagination">
                      <button className="admin-page-btn">Previous</button>
                      <button className="admin-page-btn admin-active-page">1</button>
                      <button className="admin-page-btn">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {pathlabSectionTab === 'orders' && (
                <div>
                  <div className="admin-filters">
                    <input 
                      type="text" 
                      placeholder="Search by order ID, patient name..." 
                      className="admin-search-input" 
                    />
                    <select className="admin-filter-select">
                      <option value="">Collection Type</option>
                      <option value="home">Home Collection</option>
                      <option value="lab">Lab Visit</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Collection Status</option>
                      <option value="pending">Pending</option>
                      <option value="collected">Collected</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Report Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <select className="admin-filter-select">
                      <option value="">Payment Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Order Time</th>
                          <th>Patient Name</th>
                          <th>Contact</th>
                          <th>Hospital/Doctor</th>
                          <th>Tests Count</th>
                          <th>Collection</th>
                          <th>Report Status</th>
                          <th>Payment</th>
                          <th>Total (₹)</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labOrders.map(order => (
                          <React.Fragment key={order.id}>
                            <tr style={{cursor: 'pointer'}} onClick={() => toggleLabOrderExpansion(order.id)}>
                              <td style={{fontWeight: 'bold', color: '#234f83'}}>{order.orderId}</td>
                              <td>{order.orderTime}</td>
                              <td>{order.patientName}</td>
                              <td>{order.contactNumber}</td>
                              <td><small>{order.hospitalRef}</small></td>
                              <td>{order.testsList.length}</td>
                              <td>
                                <span className={`admin-status-badge ${order.collectionStatus === 'Collected' ? 'active' : 'pending'}`}>
                                  {order.collectionStatus}
                                </span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${order.reportStatus === 'Delivered' ? 'active' : order.reportStatus === 'Completed' ? 'active' : 'pending'}`}>
                                  {order.reportStatus}
                                </span>
                              </td>
                              <td>
                                <span className={`admin-status-badge ${order.paymentStatus === 'paid' ? 'active' : 'pending'}`}>
                                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                </span>
                              </td>
                              <td style={{fontWeight: 'bold'}}>₹{order.totalAmount}</td>
                              <td>
                                <button className="admin-icon-btn" title="Toggle Details">
                                  {expandedLabOrderId === order.id ? '🔼' : '🔽'}
                                </button>
                                <button className="admin-icon-btn" title="Upload Report">📤</button>
                              </td>
                            </tr>

                            {/* Expanded Row - Order Details */}
                            {expandedLabOrderId === order.id && (
                              <tr>
                                <td colSpan="11" style={{padding: '0', background: '#f9fafb'}}>
                                  <div style={{padding: '20px', background: 'white', margin: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                                    
                                    <h3 style={{margin: '0 0 20px 0', color: '#234f83'}}>📋 Lab Order Details - {order.orderId}</h3>

                                    {/* Patient Information */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>👤 Patient Information</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Patient Name:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{order.patientName}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Age:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{order.patientAge} years</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Gender:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{order.patientGender}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Contact:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{order.contactNumber}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', gridColumn: '1 / -1'}}>
                                          <strong style={{color: '#666'}}>Hospital/Doctor Reference:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{order.hospitalRef}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Tests List */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>🧪 Ordered Tests</h4>
                                      <table className="admin-table" style={{marginTop: 0}}>
                                        <thead>
                                          <tr>
                                            <th>Test ID</th>
                                            <th>Test Name</th>
                                            <th>Status</th>
                                            <th>Report File</th>
                                            <th>Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {order.testsList.map((test, idx) => (
                                            <tr key={idx}>
                                              <td>{test.testId}</td>
                                              <td>{test.testName}</td>
                                              <td>
                                                <span className={`admin-status-badge ${test.status === 'Completed' ? 'active' : test.status === 'Collected' ? 'pending' : 'rejected'}`}>
                                                  {test.status}
                                                </span>
                                              </td>
                                              <td>
                                                {test.reportFile ? (
                                                  <span style={{color: '#10b981'}}>✅ {test.reportFile}</span>
                                                ) : (
                                                  <span style={{color: '#9ca3af'}}>Not uploaded</span>
                                                )}
                                              </td>
                                              <td>
                                                {test.reportFile ? (
                                                  <button className="admin-btn-secondary" style={{padding: '6px 12px', fontSize: '13px'}}>📥 Download</button>
                                                ) : (
                                                  <button className="admin-btn-primary" style={{padding: '6px 12px', fontSize: '13px'}}>📤 Upload Report</button>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Sample Collection */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>🩸 Sample Collection</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Collection Type:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{order.sampleCollectionType}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Collection Status:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                            <span className={`admin-status-badge ${order.collectionStatus === 'Collected' ? 'active' : 'pending'}`}>
                                              {order.collectionStatus}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>💳 Payment Information</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Total Amount:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#234f83'}}>₹{order.totalAmount}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Payment Status:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                            <span className={`admin-status-badge ${order.paymentStatus === 'paid' ? 'active' : 'pending'}`}>
                                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                            </span>
                                          </p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Transaction ID:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{order.transactionId || 'N/A'}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Report Status & Publishing */}
                                    <div style={{marginBottom: '25px'}}>
                                      <h4 style={{margin: '0 0 15px 0', color: '#666', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>📄 Report Status & Publishing</h4>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Report Status:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                            <span className={`admin-status-badge ${order.reportStatus === 'Delivered' ? 'active' : order.reportStatus === 'Completed' ? 'active' : 'pending'}`}>
                                              {order.reportStatus}
                                            </span>
                                          </p>
                                        </div>
                                        <div style={{padding: '15px', background: order.publishToPatientApp ? '#d1fae5' : '#fee2e2', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Published to Patient App:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px'}}>
                                            {order.publishToPatientApp ? '✅ Yes' : '❌ No'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                                      {order.collectionStatus === 'Pending' && (
                                        <button className="admin-btn-primary" style={{padding: '8px 16px'}}>✅ Mark as Collected</button>
                                      )}
                                      {order.reportStatus === 'Pending' && order.collectionStatus === 'Collected' && (
                                        <button className="admin-btn-primary" style={{padding: '8px 16px'}}>🔄 Update to In Progress</button>
                                      )}
                                      {order.reportStatus === 'In Progress' && (
                                        <button className="admin-btn-primary" style={{padding: '8px 16px'}}>✅ Mark as Completed</button>
                                      )}
                                      {order.reportStatus === 'Completed' && !order.publishToPatientApp && (
                                        <button className="admin-btn-primary" style={{padding: '8px 16px'}}>📱 Publish to Patient App</button>
                                      )}
                                      <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📤 Upload All Reports</button>
                                      <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📥 Download Reports</button>
                                      <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📞 Call Patient</button>
                                    </div>

                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-section-footer">
                    <p>Showing {labOrders.length} orders</p>
                    <div className="admin-pagination">
                      <button className="admin-page-btn">Previous</button>
                      <button className="admin-page-btn admin-active-page">1</button>
                      <button className="admin-page-btn">Next</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Patient Management Section */}
          {activeSection === 'patients' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>👥 Patient Management</h2>
                <button className="admin-add-btn" onClick={() => openModal('add', 'patients')}>
                  + Add Patient
                </button>
              </div>
              
              <div className="admin-filters">
                <input 
                  type="text" 
                  placeholder="Search by name, mobile, email..." 
                  className="admin-search-input" 
                />
                <input 
                  type="date" 
                  placeholder="From Date" 
                  className="admin-filter-select" 
                  style={{width: 'auto'}}
                />
                <input 
                  type="date" 
                  placeholder="To Date" 
                  className="admin-filter-select" 
                  style={{width: 'auto'}}
                />
                <select className="admin-filter-select">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Cities</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="pune">Pune</option>
                  <option value="hyderabad">Hyderabad</option>
                </select>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Registered Date</th>
                      <th>Total Appointments</th>
                      <th>Last Appointment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(patient => (
                      <React.Fragment key={patient.id}>
                        <tr style={{background: expandedPatientId === patient.id ? '#f0f7ff' : 'transparent'}}>
                          <td>{patient.id}</td>
                          <td>{patient.name}</td>
                          <td>{patient.mobile}</td>
                          <td>{patient.email}</td>
                          <td>{new Date(patient.registeredDate).toLocaleDateString('en-IN')}</td>
                          <td>{patient.totalAppointments}</td>
                          <td>{patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString('en-IN') : 'N/A'}</td>
                          <td>
                            <span className={`admin-status-badge ${patient.status}`}>
                              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="admin-icon-btn" 
                              title={expandedPatientId === patient.id ? "Collapse" : "Expand Details"}
                              onClick={() => togglePatientExpansion(patient.id)}
                              style={{fontSize: '16px', fontWeight: 'bold'}}
                            >
                              {expandedPatientId === patient.id ? '▼' : '▶'}
                            </button>
                            <button 
                              className="admin-icon-btn" 
                              title="View Details"
                              onClick={() => openModal('view', 'patients', patient)}
                            >
                              👁️
                            </button>
                            <button 
                              className="admin-icon-btn" 
                              title="Edit"
                              onClick={() => openModal('edit', 'patients', patient)}
                            >
                              ✏️
                            </button>
                            {patient.status !== 'blocked' ? (
                              <button className="admin-icon-btn" title="Block User">🚫</button>
                            ) : (
                              <button className="admin-icon-btn" title="Unblock User">✅</button>
                            )}
                          </td>
                        </tr>

                        {/* Expandable Patient Details Section */}
                        {expandedPatientId === patient.id && (
                          <tr>
                            <td colSpan="9" style={{padding: '0', background: '#f9fafb'}}>
                              <div style={{padding: '20px', borderTop: '2px solid #234f83'}}>
                                {/* Management Tabs */}
                                <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb'}}>
                                  <button
                                    onClick={() => setPatientManagementTab('basicInfo')}
                                    style={{
                                      padding: '12px 20px',
                                      background: patientManagementTab === 'basicInfo' ? '#234f83' : 'transparent',
                                      color: patientManagementTab === 'basicInfo' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: patientManagementTab === 'basicInfo' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    👤 Basic Info
                                  </button>
                                  <button
                                    onClick={() => setPatientManagementTab('familyMembers')}
                                    style={{
                                      padding: '12px 20px',
                                      background: patientManagementTab === 'familyMembers' ? '#234f83' : 'transparent',
                                      color: patientManagementTab === 'familyMembers' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: patientManagementTab === 'familyMembers' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    👨‍👩‍👧‍👦 Family Members
                                  </button>
                                  <button
                                    onClick={() => setPatientManagementTab('appointmentHistory')}
                                    style={{
                                      padding: '12px 20px',
                                      background: patientManagementTab === 'appointmentHistory' ? '#234f83' : 'transparent',
                                      color: patientManagementTab === 'appointmentHistory' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: patientManagementTab === 'appointmentHistory' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    📋 Appointment History
                                  </button>
                                  <button
                                    onClick={() => setPatientManagementTab('emergencyContact')}
                                    style={{
                                      padding: '12px 20px',
                                      background: patientManagementTab === 'emergencyContact' ? '#234f83' : 'transparent',
                                      color: patientManagementTab === 'emergencyContact' ? '#fff' : '#666',
                                      border: 'none',
                                      borderBottom: patientManagementTab === 'emergencyContact' ? '3px solid #234f83' : '3px solid transparent',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    🚨 Emergency Contact
                                  </button>
                                </div>

                                {/* Basic Info Tab */}
                                {patientManagementTab === 'basicInfo' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>👤 Basic Information</h3>
                                      {!isEditingBasicInfo && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingBasicInfo(true);
                                            setBasicInfoFormData({
                                              name: patient.name || '',
                                              gender: patient.gender || '',
                                              dob: patient.dob || '',
                                              email: patient.email || '',
                                              mobile: patient.mobile || '',
                                              city: patient.city || '',
                                              address: patient.address || '',
                                              bloodGroup: patient.bloodGroup || '',
                                              noShowCount: patient.noShowCount || 0,
                                              abuseFlag: patient.abuseFlag || false
                                            });
                                          }}
                                        >
                                          ✏️ Edit Basic Info
                                        </button>
                                      )}
                                    </div>

                                    {isEditingBasicInfo ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleBasicInfoSave(patient.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Full Name *</label>
                                            <input 
                                              type="text" 
                                              value={basicInfoFormData.name || ''} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, name: e.target.value})}
                                              placeholder="Enter full name"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Gender *</label>
                                            <select 
                                              value={basicInfoFormData.gender || ''} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, gender: e.target.value})}
                                              required
                                            >
                                              <option value="">Select Gender</option>
                                              <option value="Male">Male</option>
                                              <option value="Female">Female</option>
                                              <option value="Other">Other</option>
                                            </select>
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Date of Birth *</label>
                                            <input 
                                              type="date" 
                                              value={basicInfoFormData.dob || ''} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, dob: e.target.value})}
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Blood Group</label>
                                            <select 
                                              value={basicInfoFormData.bloodGroup || ''} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, bloodGroup: e.target.value})}
                                            >
                                              <option value="">Select Blood Group</option>
                                              <option value="A+">A+</option>
                                              <option value="A-">A-</option>
                                              <option value="B+">B+</option>
                                              <option value="B-">B-</option>
                                              <option value="O+">O+</option>
                                              <option value="O-">O-</option>
                                              <option value="AB+">AB+</option>
                                              <option value="AB-">AB-</option>
                                            </select>
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Email *</label>
                                            <input 
                                              type="email" 
                                              value={basicInfoFormData.email || ''} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, email: e.target.value})}
                                              placeholder="Email address"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Mobile *</label>
                                            <input 
                                              type="tel" 
                                              value={basicInfoFormData.mobile || ''} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, mobile: e.target.value})}
                                              placeholder="Mobile number"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>City</label>
                                            <input 
                                              type="text" 
                                              value={basicInfoFormData.city || ''} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, city: e.target.value})}
                                              placeholder="City"
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>No-Show Count</label>
                                            <input 
                                              type="number" 
                                              value={basicInfoFormData.noShowCount || 0} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, noShowCount: e.target.value})}
                                              min="0"
                                            />
                                          </div>
                                          <div className="admin-form-group" style={{gridColumn: '1 / -1'}}>
                                            <label>Address</label>
                                            <textarea 
                                              value={basicInfoFormData.address || ''} 
                                              onChange={(e) => setBasicInfoFormData({...basicInfoFormData, address: e.target.value})}
                                              placeholder="Full address"
                                              rows="2"
                                            />
                                          </div>
                                          <div className="admin-form-group" style={{gridColumn: '1 / -1'}}>
                                            <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                              <input 
                                                type="checkbox" 
                                                checked={basicInfoFormData.abuseFlag || false}
                                                onChange={(e) => setBasicInfoFormData({...basicInfoFormData, abuseFlag: e.target.checked})}
                                                style={{width: 'auto'}}
                                              />
                                              <span>Flag for Abuse/Inappropriate Behavior</span>
                                            </label>
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingBasicInfo(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Name:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.name}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Gender:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.gender || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Date of Birth:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.dob ? new Date(patient.dob).toLocaleDateString('en-IN') : 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Blood Group:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.bloodGroup || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Email:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.email}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Mobile:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.mobile}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>City:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.city || 'Not provided'}</p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>No-Show Count:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px', color: patient.noShowCount > 2 ? 'red' : 'inherit'}}>
                                            {patient.noShowCount || 0} {patient.noShowCount > 2 && '⚠️'}
                                          </p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                          <strong style={{color: '#666'}}>Abuse Flag:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>
                                            {patient.abuseFlag ? '🚩 Flagged' : '✅ Clean'}
                                          </p>
                                        </div>
                                        <div style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', gridColumn: '1 / -1'}}>
                                          <strong style={{color: '#666'}}>Address:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.address || 'Not provided'}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Continue with other tabs... */}

                                {/* Family Members Tab */}
                                {patientManagementTab === 'familyMembers' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>👨‍👩‍👧‍👦 Family Members</h3>
                                      {!isEditingFamilyMembers && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingFamilyMembers(true);
                                            setFamilyMembersFormData({
                                              familyMembers: patient.linkedFamilyMembers || ''
                                            });
                                          }}
                                        >
                                          ✏️ Edit Family Members
                                        </button>
                                      )}
                                    </div>

                                    {isEditingFamilyMembers ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleFamilyMembersSave(patient.id); }}>
                                        <div className="admin-form-group">
                                          <label>Linked Family Members (comma-separated names or IDs)</label>
                                          <textarea 
                                            value={familyMembersFormData.familyMembers || ''} 
                                            onChange={(e) => setFamilyMembersFormData({...familyMembersFormData, familyMembers: e.target.value})}
                                            placeholder="e.g., John Doe (Son), Jane Doe (Daughter), Robert Doe (Spouse)"
                                            rows="4"
                                          />
                                          <small style={{color: '#666'}}>Add family members who are linked to this account</small>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingFamilyMembers(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div>
                                        {patient.linkedFamilyMembers && patient.linkedFamilyMembers.length > 0 ? (
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            {patient.linkedFamilyMembers.split(',').map((member, index) => (
                                              <div key={index} style={{padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                                <strong style={{color: '#666'}}>Family Member {index + 1}:</strong>
                                                <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{member.trim()}</p>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div style={{padding: '30px', textAlign: 'center', background: '#fff', borderRadius: '8px', border: '1px dashed #e5e7eb'}}>
                                            <p style={{color: '#666', fontSize: '15px'}}>No family members linked to this account</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Appointment History Tab */}
                                {patientManagementTab === 'appointmentHistory' && (
                                  <div>
                                    <h3 style={{marginTop: 0, color: '#234f83', marginBottom: '20px'}}>📋 Appointment History</h3>
                                    
                                    <div style={{marginBottom: '15px', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px'}}>
                                        <div>
                                          <strong style={{color: '#666'}}>Total Appointments:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>{patient.totalAppointments || 0}</p>
                                        </div>
                                        <div>
                                          <strong style={{color: '#666'}}>Completed:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#28a745'}}>{patient.completedAppointments || 0}</p>
                                        </div>
                                        <div>
                                          <strong style={{color: '#666'}}>Cancelled:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#dc3545'}}>{patient.cancelledAppointments || 0}</p>
                                        </div>
                                        <div>
                                          <strong style={{color: '#666'}}>Last Appointment:</strong>
                                          <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString('en-IN') : 'N/A'}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="admin-table-container" style={{marginTop: '20px'}}>
                                      <table className="admin-table">
                                        <thead>
                                          <tr>
                                            <th>Appointment ID</th>
                                            <th>Date</th>
                                            <th>Doctor</th>
                                            <th>Hospital</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Fee</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {patient.appointmentHistory && patient.appointmentHistory.length > 0 ? (
                                            patient.appointmentHistory.map((apt, index) => (
                                              <tr key={index}>
                                                <td>{apt.id || `APT-${index + 1}`}</td>
                                                <td>{apt.date ? new Date(apt.date).toLocaleDateString('en-IN') : 'N/A'}</td>
                                                <td>{apt.doctor || 'N/A'}</td>
                                                <td>{apt.hospital || 'N/A'}</td>
                                                <td>{apt.type || 'In-Clinic'}</td>
                                                <td>
                                                  <span className={`admin-status-badge ${apt.status}`}>
                                                    {apt.status || 'Completed'}
                                                  </span>
                                                </td>
                                                <td>₹{apt.fee || '0'}</td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr>
                                              <td colSpan="7" style={{textAlign: 'center', padding: '30px', color: '#666'}}>
                                                No appointment history available
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {/* Emergency Contact Tab */}
                                {patientManagementTab === 'emergencyContact' && (
                                  <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                                      <h3 style={{margin: 0, color: '#234f83'}}>🚨 Emergency Contact</h3>
                                      {!isEditingEmergencyContact && (
                                        <button 
                                          className="admin-btn-primary" 
                                          style={{padding: '8px 16px'}}
                                          onClick={() => {
                                            setIsEditingEmergencyContact(true);
                                            setEmergencyContactFormData({
                                              emergencyName: patient.emergencyName || '',
                                              emergencyRelation: patient.emergencyRelation || '',
                                              emergencyPhone: patient.emergencyPhone || '',
                                              emergencyEmail: patient.emergencyEmail || ''
                                            });
                                          }}
                                        >
                                          ✏️ Edit Emergency Contact
                                        </button>
                                      )}
                                    </div>

                                    {isEditingEmergencyContact ? (
                                      <form onSubmit={(e) => { e.preventDefault(); handleEmergencyContactSave(patient.id); }}>
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                          <div className="admin-form-group">
                                            <label>Emergency Contact Name *</label>
                                            <input 
                                              type="text" 
                                              value={emergencyContactFormData.emergencyName || ''} 
                                              onChange={(e) => setEmergencyContactFormData({...emergencyContactFormData, emergencyName: e.target.value})}
                                              placeholder="Full name"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Relationship *</label>
                                            <select 
                                              value={emergencyContactFormData.emergencyRelation || ''} 
                                              onChange={(e) => setEmergencyContactFormData({...emergencyContactFormData, emergencyRelation: e.target.value})}
                                              required
                                            >
                                              <option value="">Select Relationship</option>
                                              <option value="Spouse">Spouse</option>
                                              <option value="Parent">Parent</option>
                                              <option value="Sibling">Sibling</option>
                                              <option value="Child">Child</option>
                                              <option value="Friend">Friend</option>
                                              <option value="Other">Other</option>
                                            </select>
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Emergency Phone *</label>
                                            <input 
                                              type="tel" 
                                              value={emergencyContactFormData.emergencyPhone || ''} 
                                              onChange={(e) => setEmergencyContactFormData({...emergencyContactFormData, emergencyPhone: e.target.value})}
                                              placeholder="Phone number"
                                              required
                                            />
                                          </div>
                                          <div className="admin-form-group">
                                            <label>Emergency Email</label>
                                            <input 
                                              type="email" 
                                              value={emergencyContactFormData.emergencyEmail || ''} 
                                              onChange={(e) => setEmergencyContactFormData({...emergencyContactFormData, emergencyEmail: e.target.value})}
                                              placeholder="Email address"
                                            />
                                          </div>
                                        </div>
                                        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                          <button type="submit" className="admin-btn-primary" style={{padding: '8px 16px'}}>💾 Save Changes</button>
                                          <button 
                                            type="button" 
                                            className="admin-btn-secondary" 
                                            style={{padding: '8px 16px'}}
                                            onClick={() => setIsEditingEmergencyContact(false)}
                                          >
                                            ✖️ Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <div>
                                        {patient.emergencyPhone ? (
                                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'}}>
                                            <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '2px solid #234f83'}}>
                                              <strong style={{color: '#666'}}>Contact Name:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>{patient.emergencyName || 'Not provided'}</p>
                                            </div>
                                            <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '2px solid #234f83'}}>
                                              <strong style={{color: '#666'}}>Relationship:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>{patient.emergencyRelation || 'Not provided'}</p>
                                            </div>
                                            <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '2px solid #234f83'}}>
                                              <strong style={{color: '#666'}}>Emergency Phone:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>{patient.emergencyPhone}</p>
                                            </div>
                                            <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '2px solid #234f83'}}>
                                              <strong style={{color: '#666'}}>Emergency Email:</strong>
                                              <p style={{margin: '5px 0 0 0', fontSize: '15px'}}>{patient.emergencyEmail || 'Not provided'}</p>
                                            </div>
                                          </div>
                                        ) : (
                                          <div style={{padding: '30px', textAlign: 'center', background: '#fff', borderRadius: '8px', border: '1px dashed #e5e7eb'}}>
                                            <p style={{color: '#dc3545', fontSize: '16px', fontWeight: 'bold'}}>⚠️ No emergency contact information available</p>
                                            <p style={{color: '#666', fontSize: '14px'}}>Please add emergency contact details for this patient</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-section-footer">
                <p>Showing {patients.length} patients</p>
                <div className="admin-pagination">
                  <button className="admin-page-btn">Previous</button>
                  <button className="admin-page-btn admin-active-page">1</button>
                  <button className="admin-page-btn">2</button>
                  <button className="admin-page-btn">3</button>
                  <button className="admin-page-btn">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Management Section */}
          {activeSection === 'appointments' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>📅 Appointments & Booking Management</h2>
                <button className="admin-add-btn" onClick={() => alert('Export appointments data')}>
                  📥 Export Data
                </button>
              </div>
              
              <div className="admin-filters">
                <input 
                  type="text" 
                  placeholder="Search by patient, doctor, appointment ID..." 
                  className="admin-search-input" 
                />
                <input 
                  type="date" 
                  placeholder="From Date" 
                  className="admin-filter-select" 
                  style={{width: 'auto'}}
                />
                <input 
                  type="date" 
                  placeholder="To Date" 
                  className="admin-filter-select" 
                  style={{width: 'auto'}}
                />
                <select className="admin-filter-select">
                  <option value="">All Hospitals</option>
                  <option value="city-general">City General Hospital</option>
                  <option value="metro-clinic">Metro Clinic</option>
                  <option value="apollo">Apollo Hospital</option>
                  <option value="fortis">Fortis Hospital</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Doctors</option>
                  <option value="priya">Dr. Priya Sharma</option>
                  <option value="rajesh">Dr. Rajesh Kumar</option>
                  <option value="anjali">Dr. Anjali Desai</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Modes</option>
                  <option value="online">Online Consult</option>
                  <option value="opd">OPD Visit</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">Appointment Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">Payment Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Appointment ID</th>
                      <th>Date & Time</th>
                      <th>Patient Name</th>
                      <th>Doctor Name</th>
                      <th>Hospital</th>
                      <th>Mode</th>
                      <th>Fee (₹)</th>
                      <th>Payment Status</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <React.Fragment key={apt.id}>
                        <tr style={{background: expandedAppointmentId === apt.id ? '#f0f7ff' : 'transparent'}}>
                          <td>{apt.id}</td>
                          <td>
                            <div style={{whiteSpace: 'nowrap'}}>
                              {new Date(apt.date).toLocaleDateString('en-IN')}<br/>
                              <small style={{color: '#666'}}>{apt.time}</small>
                            </div>
                          </td>
                          <td>{apt.patient}</td>
                          <td>{apt.doctor}</td>
                          <td>{apt.hospital}</td>
                          <td>
                            <span className={`admin-mode-badge ${apt.mode === 'Online Consult' ? 'online' : 'opd'}`}>
                              {apt.mode}
                            </span>
                          </td>
                          <td>₹{apt.fee}</td>
                          <td>
                            <span className={`admin-status-badge ${apt.paymentStatus}`}>
                              {apt.paymentStatus.charAt(0).toUpperCase() + apt.paymentStatus.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-status-badge ${apt.appointmentStatus}`}>
                              {apt.appointmentStatus.charAt(0).toUpperCase() + apt.appointmentStatus.slice(1)}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="admin-icon-btn" 
                              title={expandedAppointmentId === apt.id ? "Collapse" : "View Details"}
                              onClick={() => toggleAppointmentExpansion(apt.id)}
                              style={{fontSize: '16px', fontWeight: 'bold'}}
                            >
                              {expandedAppointmentId === apt.id ? '▼' : '▶'}
                            </button>
                            <button className="admin-icon-btn" title="View Receipt">🧾</button>
                            {apt.appointmentStatus === 'pending' && (
                              <>
                                <button className="admin-icon-btn" title="Confirm">✅</button>
                                <button className="admin-icon-btn" title="Cancel">❌</button>
                              </>
                            )}
                          </td>
                        </tr>

                        {/* Expandable Appointment Details */}
                        {expandedAppointmentId === apt.id && (
                          <tr>
                            <td colSpan="10" style={{padding: '20px', background: '#f9fafb', borderTop: '2px solid #234f83'}}>
                              <h3 style={{marginTop: 0, color: '#234f83', marginBottom: '20px'}}>📋 Appointment Details</h3>
                              
                              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
                                {/* Patient Details */}
                                <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                  <h4 style={{marginTop: 0, color: '#234f83', borderBottom: '2px solid #234f83', paddingBottom: '10px'}}>👤 Patient Details</h4>
                                  <div style={{display: 'grid', gap: '10px'}}>
                                    <div><strong>Name:</strong> {apt.patient}</div>
                                    <div><strong>Patient ID:</strong> {apt.patientId || 'N/A'}</div>
                                    <div><strong>Mobile:</strong> {apt.patientMobile || 'N/A'}</div>
                                    <div><strong>Email:</strong> {apt.patientEmail || 'N/A'}</div>
                                  </div>
                                </div>

                                {/* Doctor Details */}
                                <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                  <h4 style={{marginTop: 0, color: '#234f83', borderBottom: '2px solid #234f83', paddingBottom: '10px'}}>👨‍⚕️ Doctor Details</h4>
                                  <div style={{display: 'grid', gap: '10px'}}>
                                    <div><strong>Name:</strong> {apt.doctor}</div>
                                    <div><strong>Speciality:</strong> {apt.doctorSpeciality || 'N/A'}</div>
                                    <div><strong>Doctor ID:</strong> {apt.doctorId || 'N/A'}</div>
                                  </div>
                                </div>

                                {/* Hospital Details */}
                                <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                  <h4 style={{marginTop: 0, color: '#234f83', borderBottom: '2px solid #234f83', paddingBottom: '10px'}}>🏥 Hospital Details</h4>
                                  <div style={{display: 'grid', gap: '10px'}}>
                                    <div><strong>Hospital:</strong> {apt.hospital}</div>
                                    <div><strong>Location:</strong> {apt.hospitalLocation || 'N/A'}</div>
                                    <div><strong>Hospital ID:</strong> {apt.hospitalId || 'N/A'}</div>
                                  </div>
                                </div>

                                {/* Consultation Details */}
                                <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                  <h4 style={{marginTop: 0, color: '#234f83', borderBottom: '2px solid #234f83', paddingBottom: '10px'}}>💬 Consultation Details</h4>
                                  <div style={{display: 'grid', gap: '10px'}}>
                                    <div><strong>Mode:</strong> {apt.mode}</div>
                                    <div><strong>Type:</strong> {apt.type || 'Regular'}</div>
                                    <div><strong>Booking Date:</strong> {new Date(apt.bookingDate || apt.date).toLocaleString('en-IN')}</div>
                                  </div>
                                </div>

                                {/* Payment Details */}
                                <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '2px solid #234f83'}}>
                                  <h4 style={{marginTop: 0, color: '#234f83', borderBottom: '2px solid #234f83', paddingBottom: '10px'}}>💰 Payment Details</h4>
                                  <div style={{display: 'grid', gap: '10px'}}>
                                    <div><strong>Fee:</strong> ₹{apt.fee}</div>
                                    <div><strong>Taxes:</strong> ₹{apt.taxes || 0}</div>
                                    <div><strong>Discount:</strong> ₹{apt.discount || 0}</div>
                                    <div style={{fontSize: '18px', fontWeight: 'bold', color: '#234f83'}}>
                                      <strong>Final Amount:</strong> ₹{apt.finalAmount || apt.fee}
                                    </div>
                                    <div><strong>Payment Method:</strong> {apt.paymentMethod || 'N/A'}</div>
                                    <div><strong>Transaction ID:</strong> {apt.transactionId || 'N/A'}</div>
                                    <div>
                                      <strong>Payment Status:</strong>{' '}
                                      <span className={`admin-status-badge ${apt.paymentStatus}`}>
                                        {apt.paymentStatus.charAt(0).toUpperCase() + apt.paymentStatus.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Status Logs */}
                                <div style={{padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                                  <h4 style={{marginTop: 0, color: '#234f83', borderBottom: '2px solid #234f83', paddingBottom: '10px'}}>📊 Status Logs</h4>
                                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    {apt.statusLogs && apt.statusLogs.length > 0 ? (
                                      apt.statusLogs.map((log, index) => (
                                        <div key={index} style={{padding: '8px', background: '#f9fafb', borderLeft: '3px solid #234f83', paddingLeft: '12px'}}>
                                          <strong>{log.status}</strong>
                                          <br/>
                                          <small style={{color: '#666'}}>{new Date(log.timestamp).toLocaleString('en-IN')}</small>
                                        </div>
                                      ))
                                    ) : (
                                      <>
                                        <div style={{padding: '8px', background: '#f9fafb', borderLeft: '3px solid #234f83', paddingLeft: '12px'}}>
                                          <strong>Booked</strong>
                                          <br/>
                                          <small style={{color: '#666'}}>{new Date(apt.date).toLocaleString('en-IN')}</small>
                                        </div>
                                        {apt.appointmentStatus !== 'pending' && (
                                          <div style={{padding: '8px', background: '#f9fafb', borderLeft: '3px solid #28a745', paddingLeft: '12px'}}>
                                            <strong>{apt.appointmentStatus.charAt(0).toUpperCase() + apt.appointmentStatus.slice(1)}</strong>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                                {apt.appointmentStatus === 'pending' && (
                                  <>
                                    <button className="admin-btn-primary" style={{padding: '8px 16px'}}>✅ Confirm Appointment</button>
                                    <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>❌ Cancel Appointment</button>
                                  </>
                                )}
                                {apt.appointmentStatus === 'confirmed' && (
                                  <button className="admin-btn-primary" style={{padding: '8px 16px'}}>✔️ Mark as Completed</button>
                                )}
                                {apt.paymentStatus === 'failed' && (
                                  <button className="admin-btn-primary" style={{padding: '8px 16px'}}>💳 Retry Payment</button>
                                )}
                                {apt.paymentStatus === 'paid' && apt.appointmentStatus === 'cancelled' && (
                                  <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>💸 Process Refund</button>
                                )}
                                <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>🧾 Download Receipt</button>
                                <button className="admin-btn-secondary" style={{padding: '8px 16px'}}>📧 Send Notification</button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-section-footer">
                <p>Showing {appointments.length} appointments</p>
                <div className="admin-pagination">
                  <button className="admin-page-btn">Previous</button>
                  <button className="admin-page-btn admin-active-page">1</button>
                  <button className="admin-page-btn">2</button>
                  <button className="admin-page-btn">3</button>
                  <button className="admin-page-btn">Next</button>
                </div>
              </div>

              {/* Quick Stats for Appointments */}
              <div className="admin-appointment-stats" style={{marginTop: '30px'}}>
                <h3>Today's Appointment Statistics</h3>
                <div className="admin-stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
                  <div className="admin-stat-card">
                    <h4>Total Appointments</h4>
                    <p className="admin-stat-value">{appointments.filter(a => a.date === '2024-11-17').length}</p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Online Consults</h4>
                    <p className="admin-stat-value">
                      {appointments.filter(a => a.date === '2024-11-17' && a.mode === 'Online Consult').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>OPD Visits</h4>
                    <p className="admin-stat-value">
                      {appointments.filter(a => a.date === '2024-11-17' && a.mode === 'OPD Visit').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Completed</h4>
                    <p className="admin-stat-value">
                      {appointments.filter(a => a.date === '2024-11-17' && a.appointmentStatus === 'completed').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Pending Payment</h4>
                    <p className="admin-stat-value" style={{color: '#f59e0b'}}>
                      {appointments.filter(a => a.paymentStatus === 'pending').length}
                    </p>
                  </div>
                  <div className="admin-stat-card">
                    <h4>Total Revenue</h4>
                    <p className="admin-stat-value" style={{color: '#10b981'}}>
                      ₹{appointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.fee, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Universal Modal for All Sections */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>
                {modalMode === 'view' && '👁️ View Details'}
                {modalMode === 'add' && '➕ Add New'}
                {modalMode === 'edit' && '✏️ Edit Details'}
              </h2>
              <button className="admin-modal-close" onClick={closeModal}>✕</button>
            </div>
            
            <div className="admin-modal-body">
              {modalMode === 'view' ? (
                // View Mode - Display details
                <div className="admin-view-details">
                  {selectedItem && Object.entries(selectedItem).map(([key, value]) => (
                    <div key={key} className="admin-detail-row">
                      <span className="admin-detail-label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</span>
                      <span className="admin-detail-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                // Add/Edit Mode - Display form
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = Object.fromEntries(formData);
                  handleSave(data);
                }} className="admin-modal-form">
                  {modalSection === 'hospitals' && (
                    <>
                      <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#234f83', borderBottom: '2px solid #e9d5ff', paddingBottom: '10px' }}>Basic Information</h3>
                      
                      <div className="admin-form-group">
                        <label>Hospital Name *</label>
                        <input type="text" name="name" defaultValue={selectedItem?.name} required />
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Contact Person *</label>
                          <input type="text" name="contactPerson" defaultValue={selectedItem?.contactPerson} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Mobile *</label>
                          <input type="tel" name="mobile" defaultValue={selectedItem?.mobile} required />
                        </div>
                      </div>
                      <div className="admin-form-group">
                        <label>Email *</label>
                        <input type="email" name="email" defaultValue={selectedItem?.email} required />
                      </div>
                      <div className="admin-form-group">
                        <label >Website URL </label>
                        <input type="website" name='website' defaultValue={selectedItem?.website}  required/>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>City *</label>
                          <input type="text" name="city" defaultValue={selectedItem?.city} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Pincode *</label>
                          <input type="text" name="pincode" defaultValue={selectedItem?.pincode} required />
                        </div>
                      </div>
                      <div className="admin-form-group">
                        <label>Address *</label>
                        <textarea name="address" defaultValue={selectedItem?.address} required rows="3"></textarea>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Status</label>
                          <select name="status" defaultValue={selectedItem?.status || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label>KYC Status</label>
                          <select name="kycStatus" defaultValue={selectedItem?.kycStatus || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      {/* KYC/Legal Documents Dropdown */}
                      <div style={{ marginTop: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setShowKycSection(!showKycSection)}
                          style={{ 
                            padding: '15px 20px', 
                            background: '#f8f9fa', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: showKycSection ? '1px solid #e5e7eb' : 'none'
                          }}
                        >
                          <h3 style={{ margin: 0, color: '#234f83', fontSize: '16px' }}>KYC/Legal Documents</h3>
                          <span style={{ fontSize: '20px', color: '#234f83' }}>{showKycSection ? '▼' : '▶'}</span>
                        </div>
                        
                        {showKycSection && (
                          <div style={{ padding: '20px' }}>
                            <div className="admin-form-group">
                              <label>GST Number</label>
                              <input type="text" name="gstNumber" defaultValue={selectedItem?.gstNumber} placeholder="Enter GST Number" />
                                  </div>
                            <div className="admin-form-group">
                              <label>Hospital Registration Certificate</label>
                              <input type="file" name="registrationCertificate" accept="image/*,application/pdf" />
                              {selectedItem?.registrationCertificate && (
                                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>Current: {selectedItem.registrationCertificate}</small>
                              )}
                            </div>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>PAN Card</label>
                                <input type="file" name="panCard" accept="image/*,application/pdf" />
                                {selectedItem?.panCard && (
                                  <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>Current: {selectedItem.panCard}</small>
                                )}
                              </div>
                              <div className="admin-form-group">
                                <label>Owner Aadhaar Card</label>
                                <input type="file" name="aadhaarCard" accept="image/*,application/pdf" />
                                {selectedItem?.aadhaarCard && (
                                  <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>Current: {selectedItem.aadhaarCard}</small>
                                )}
                              </div>
                            </div>

                            <h4 style={{ marginTop: '20px', marginBottom: '15px', color: '#234f83' }}>Bank Details</h4>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>Account Holder Name</label>
                                <input type="text" name="accountHolderName" defaultValue={selectedItem?.accountHolderName} placeholder="Enter Account Holder Name" />
                              </div>
                              <div className="admin-form-group">
                                <label>Account Number</label>
                                <input type="text" name="accountNumber" defaultValue={selectedItem?.accountNumber} placeholder="Enter Account Number" />
                              </div>
                            </div>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>IFSC Code</label>
                                <input type="text" name="ifscCode" defaultValue={selectedItem?.ifscCode} placeholder="Enter IFSC Code" />
                              </div>
                              <div className="admin-form-group">
                                <label>Bank Name</label>
                                <input type="text" name="bankName" defaultValue={selectedItem?.bankName} placeholder="Enter Bank Name" />
                              </div>
                            </div>
                            <div className="admin-form-group">
                              <label>Branch Name</label>
                              <input type="text" name="branchName" defaultValue={selectedItem?.branchName} placeholder="Enter Branch Name" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Operational Details Dropdown */}
                      <div style={{ marginTop: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setShowOperationalSection(!showOperationalSection)}
                          style={{ 
                            padding: '15px 20px', 
                            background: '#f8f9fa', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: showOperationalSection ? '1px solid #e5e7eb' : 'none'
                          }}
                        >
                          <h3 style={{ margin: 0, color: '#234f83', fontSize: '16px' }}>Operational Details</h3>
                          <span style={{ fontSize: '20px', color: '#234f83' }}>{showOperationalSection ? '▼' : '▶'}</span>
                        </div>
                        
                        {showOperationalSection && (
                          <div style={{ padding: '20px' }}>
                            <div className="admin-form-group">
                              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" name="is24x7" defaultChecked={selectedItem?.is24x7} style={{ width: 'auto', marginRight: '10px' }} />
                                <span>Open 24x7</span>
                              </label>
                            </div>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>Opening Time</label>
                                <input type="time" name="openingTime" defaultValue={selectedItem?.openingTime} />
                              </div>
                              <div className="admin-form-group">
                                <label>Closing Time</label>
                                <input type="time" name="closingTime" defaultValue={selectedItem?.closingTime} />
                              </div>
                            </div>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>Min Consultation Fee (₹)</label>
                                <input type="number" name="minConsultFee" defaultValue={selectedItem?.minConsultFee} placeholder="Enter Min Fee" />
                              </div>
                              <div className="admin-form-group">
                                <label>Max Consultation Fee (₹)</label>
                                <input type="number" name="maxConsultFee" defaultValue={selectedItem?.maxConsultFee} placeholder="Enter Max Fee" />
                              </div>
                            </div>
                            
                            <div className="admin-form-group">
                              <label>Available Services</label>
                              <select name="availableServices" multiple style={{ height: '120px' }} defaultValue={selectedItem?.availableServices || []}>
                                <option value="General Consultation">General Consultation</option>
                                <option value="Emergency Care">Emergency Care</option>
                                <option value="Diagnostic Services">Diagnostic Services</option>
                                <option value="Pathology">Pathology</option>
                                <option value="Radiology">Radiology</option>
                                <option value="Pharmacy">Pharmacy</option>
                                <option value="Surgery">Surgery</option>
                                <option value="ICU">ICU</option>
                                <option value="NICU">NICU</option>
                                <option value="Dialysis">Dialysis</option>
                                <option value="Physiotherapy">Physiotherapy</option>
                                <option value="Vaccination">Vaccination</option>
                              </select>
                              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>Hold Ctrl/Cmd to select multiple services</small>
                            </div>

                            <h4 style={{ marginTop: '20px', marginBottom: '15px', color: '#234f83' }}>Facilities Available</h4>
                            <div className="admin-form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" name="facility_icu" defaultChecked={selectedItem?.facilities?.includes('ICU')} style={{ width: 'auto', marginRight: '10px' }} />
                                <span>ICU (Intensive Care Unit)</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" name="facility_nicu" defaultChecked={selectedItem?.facilities?.includes('NICU')} style={{ width: 'auto', marginRight: '10px' }} />
                                <span>NICU (Neonatal ICU)</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" name="facility_ot" defaultChecked={selectedItem?.facilities?.includes('OT')} style={{ width: 'auto', marginRight: '10px' }} />
                                <span>Operation Theatre (OT)</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" name="facility_pharmacy" defaultChecked={selectedItem?.facilities?.includes('Pharmacy')} style={{ width: 'auto', marginRight: '10px' }} />
                                <span>Pharmacy</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" name="facility_pathology" defaultChecked={selectedItem?.facilities?.includes('Pathology')} style={{ width: 'auto', marginRight: '10px' }} />
                                <span>Pathology Lab</span>
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" name="facility_radiology" defaultChecked={selectedItem?.facilities?.includes('Radiology')} style={{ width: 'auto', marginRight: '10px' }} />
                                <span>Radiology/Imaging</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Commission & Payout Dropdown */}
                      <div style={{ marginTop: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setShowCommissionSection(!showCommissionSection)}
                          style={{ 
                            padding: '15px 20px', 
                            background: '#f8f9fa', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: showCommissionSection ? '1px solid #e5e7eb' : 'none'
                          }}
                        >
                          <h3 style={{ margin: 0, color: '#234f83', fontSize: '16px' }}>Commission & Payout</h3>
                          <span style={{ fontSize: '20px', color: '#234f83' }}>{showCommissionSection ? '▼' : '▶'}</span>
                        </div>
                        
                        {showCommissionSection && (
                          <div style={{ padding: '20px' }}>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>Commission Type</label>
                                <select name="commissionType" defaultValue={selectedItem?.commissionType || 'percentage'}>
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                              </div>
                              <div className="admin-form-group">
                                <label>Commission Value</label>
                                <input type="number" name="commissionValue" defaultValue={selectedItem?.commissionValue} placeholder="Enter Commission Value" step="0.01" />
                              </div>
                            </div>
                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label>Settlement Cycle</label>
                                <select name="settlementCycle" defaultValue={selectedItem?.settlementCycle || 'monthly'}>
                                  <option value="weekly">Weekly</option>
                                  <option value="15days">15 Days</option>
                                  <option value="monthly">Monthly</option>
                                </select>
                              </div>
                              <div className="admin-form-group">
                                <label>Payment Mode</label>
                                <select name="paymentMode" defaultValue={selectedItem?.paymentMode || 'bank'}>
                                  <option value="bank">Bank Transfer</option>
                                  <option value="upi">UPI</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Major Expenses Dropdown */}
                      <div style={{ marginTop: '20px', marginBottom: '20px', border: '2px solid #234f83', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setShowMajorExpenses(!showMajorExpenses)}
                          style={{ 
                            padding: '15px 20px', 
                            background: 'linear-gradient(135deg, #234f83 0%, #1a3d66 100%)', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: showMajorExpenses ? '2px solid #234f83' : 'none'
                          }}
                        >
                          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: '600' }}>💰 Major Expenses</h3>
                          <span style={{ fontSize: '24px', color: '#fff', fontWeight: 'bold' }}>{showMajorExpenses ? '▼' : '▶'}</span>
                        </div>
                        
                        {showMajorExpenses && (
                          <div style={{ padding: '20px', background: '#f9fafb' }}>
                            {/* Rooms & Boards Section */}
                            <div style={{ marginBottom: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', background: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0, color: '#234f83' }}>🛏️ Rooms & Boards</h4>
                                <button 
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); openExpenseModal('rooms', 'add'); }}
                                  style={{ 
                                    padding: '8px 16px', 
                                    background: '#10b981', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                  }}
                                >
                                  + Add Room
                                </button>
                              </div>
                              <div className="admin-table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <table className="admin-table" style={{ fontSize: '13px' }}>
                                  <thead>
                                    <tr>
                                      <th>Room Type</th>
                                      <th>Name</th>
                                      <th>Floor</th>
                                      <th>Charge/Day</th>
                                      <th>Max Beds</th>
                                      <th>Status</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rooms.map(room => (
                                      <tr key={room.room_id}>
                                        <td>{room.room_type}</td>
                                        <td>{room.room_name}</td>
                                        <td>{room.floor}</td>
                                        <td>₹{room.charge_per_day}</td>
                                        <td>{room.max_patients}</td>
                                        <td><span className={`admin-status-badge ${room.status.toLowerCase()}`}>{room.status}</span></td>
                                        <td>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); openExpenseModal('rooms', 'edit', room); }}>✏️</button>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); handleExpenseDelete('rooms', room.room_id); }}>🗑️</button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Medical Procedures Section */}
                            <div style={{ marginBottom: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', background: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0, color: '#234f83' }}>🏥 Medical Procedures</h4>
                                <button 
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); openExpenseModal('procedures', 'add'); }}
                                  style={{ 
                                    padding: '8px 16px', 
                                    background: '#10b981', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                  }}
                                >
                                  + Add Procedure
                                </button>
                              </div>
                              <div className="admin-table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <table className="admin-table" style={{ fontSize: '13px' }}>
                                  <thead>
                                    <tr>
                                      <th>Procedure</th>
                                      <th>Type</th>
                                      <th>Base Charge</th>
                                      <th>OT Charge</th>
                                      <th>Anesthesia</th>
                                      <th>Status</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {procedures.map(proc => (
                                      <tr key={proc.procedure_id}>
                                        <td>{proc.procedure_name}</td>
                                        <td>{proc.procedure_type}</td>
                                        <td>₹{proc.base_charge}</td>
                                        <td>₹{proc.ot_charges || 0}</td>
                                        <td>₹{proc.anesthesia_charge || 0}</td>
                                        <td><span className={`admin-status-badge ${proc.status.toLowerCase()}`}>{proc.status}</span></td>
                                        <td>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); openExpenseModal('procedures', 'edit', proc); }}>✏️</button>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); handleExpenseDelete('procedures', proc.procedure_id); }}>🗑️</button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Doctor Fees Section */}
                            <div style={{ marginBottom: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', background: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0, color: '#234f83' }}>👨‍⚕️ Doctor & Specialist Fees</h4>
                                <button 
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); openExpenseModal('doctorFees', 'add'); }}
                                  style={{ 
                                    padding: '8px 16px', 
                                    background: '#10b981', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                  }}
                                >
                                  + Add Doctor Fee
                                </button>
                              </div>
                              <div className="admin-table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <table className="admin-table" style={{ fontSize: '13px' }}>
                                  <thead>
                                    <tr>
                                      <th>Doctor Name</th>
                                      <th>Specialization</th>
                                      <th>OPD Fee</th>
                                      <th>IPD Fee</th>
                                      <th>Emergency</th>
                                      <th>Status</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {doctorFees.map(doc => (
                                      <tr key={doc.doctor_id}>
                                        <td>{doc.name}</td>
                                        <td>{doc.specialization}</td>
                                        <td>₹{doc.visit_fee_opd}</td>
                                        <td>₹{doc.visit_fee_ipd_per_visit || 0}</td>
                                        <td>₹{doc.consultation_fee_emergency || 0}</td>
                                        <td><span className={`admin-status-badge ${doc.status.toLowerCase()}`}>{doc.status}</span></td>
                                        <td>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); openExpenseModal('doctorFees', 'edit', doc); }}>✏️</button>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); handleExpenseDelete('doctorFees', doc.doctor_id); }}>🗑️</button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Nursing & Staff Charges Section */}
                            <div style={{ marginBottom: '30px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', background: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0, color: '#234f83' }}>👩‍⚕️ Nursing & Staff Charges</h4>
                                <button 
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); openExpenseModal('nursing', 'add'); }}
                                  style={{ 
                                    padding: '8px 16px', 
                                    background: '#10b981', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                  }}
                                >
                                  + Add Service
                                </button>
                              </div>
                              <div className="admin-table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <table className="admin-table" style={{ fontSize: '13px' }}>
                                  <thead>
                                    <tr>
                                      <th>Service Name</th>
                                      <th>Charge Type</th>
                                      <th>Amount</th>
                                      <th>Status</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {nursingCharges.map(nurs => (
                                      <tr key={nurs.service_id}>
                                        <td>{nurs.service_name}</td>
                                        <td>{nurs.charge_type.replace('_', ' ')}</td>
                                        <td>₹{nurs.charge_amount}</td>
                                        <td><span className={`admin-status-badge ${nurs.status.toLowerCase()}`}>{nurs.status}</span></td>
                                        <td>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); openExpenseModal('nursing', 'edit', nurs); }}>✏️</button>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); handleExpenseDelete('nursing', nurs.service_id); }}>🗑️</button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Miscellaneous Services Section */}
                            <div style={{ marginBottom: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', background: '#fff' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0, color: '#234f83' }}>🔧 Miscellaneous Services</h4>
                                <button 
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); openExpenseModal('miscellaneous', 'add'); }}
                                  style={{ 
                                    padding: '8px 16px', 
                                    background: '#10b981', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                  }}
                                >
                                  + Add Service
                                </button>
                              </div>
                              <div className="admin-table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <table className="admin-table" style={{ fontSize: '13px' }}>
                                  <thead>
                                    <tr>
                                      <th>Service</th>
                                      <th>Charge</th>
                                      <th>Status</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {miscServices.map(misc => (
                                      <tr key={misc.service_id}>
                                        <td>{misc.service}</td>
                                        <td>₹{misc.charge}</td>
                                        <td><span className={`admin-status-badge ${misc.status.toLowerCase()}`}>{misc.status}</span></td>
                                        <td>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); openExpenseModal('miscellaneous', 'edit', misc); }}>✏️</button>
                                          <button type="button" className="admin-icon-btn" onClick={(e) => { e.preventDefault(); handleExpenseDelete('miscellaneous', misc.service_id); }}>🗑️</button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {modalSection === 'doctors' && (
                    <>
                      <div className="admin-form-group">
                        <label>Doctor Name *</label>
                        <input type="text" name="name" defaultValue={selectedItem?.name} required />
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Speciality *</label>
                          <select name="speciality" defaultValue={selectedItem?.speciality} required>
                            <option value="">Select Speciality</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Pediatrician">Pediatrician</option>
                            <option value="Orthopedic">Orthopedic</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="General Physician">General Physician</option>
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label>Experience (years) *</label>
                          <input type="number" name="experience" defaultValue={selectedItem?.experience} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Mobile *</label>
                          <input type="tel" name="mobile" defaultValue={selectedItem?.mobile} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Email *</label>
                          <input type="email" name="email" defaultValue={selectedItem?.email} required />
                        </div>
                      </div>
                      <div className="admin-form-group">
                        <label>Qualification *</label>
                        <input type="text" name="qualification" defaultValue={selectedItem?.qualification} required />
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>City *</label>
                          <input type="text" name="city" defaultValue={selectedItem?.city} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Consultation Fee (₹) *</label>
                          <input type="number" name="fee" defaultValue={selectedItem?.fee} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Status</label>
                          <select name="status" defaultValue={selectedItem?.status || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label>KYC Status</label>
                          <select name="kycStatus" defaultValue={selectedItem?.kycStatus || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {modalSection === 'patients' && (
                    <>
                      <div className="admin-form-group">
                        <label>Patient Name *</label>
                        <input type="text" name="name" defaultValue={selectedItem?.name} required />
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Mobile *</label>
                          <input type="tel" name="mobile" defaultValue={selectedItem?.mobile} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Email *</label>
                          <input type="email" name="email" defaultValue={selectedItem?.email} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>City *</label>
                          <input type="text" name="city" defaultValue={selectedItem?.city} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Status</label>
                          <select name="status" defaultValue={selectedItem?.status || 'active'}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {modalSection === 'chemists' && (
                    <>
                      <div className="admin-form-group">
                        <label>Pharmacy Name *</label>
                        <input type="text" name="name" defaultValue={selectedItem?.name} required />
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Owner Name *</label>
                          <input type="text" name="owner" defaultValue={selectedItem?.owner} required />
                        </div>
                        <div className="admin-form-group">
                          <label>License Number *</label>
                          <input type="text" name="license" defaultValue={selectedItem?.license} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Mobile *</label>
                          <input type="tel" name="mobile" defaultValue={selectedItem?.mobile} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Email *</label>
                          <input type="email" name="email" defaultValue={selectedItem?.email} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>City *</label>
                          <input type="text" name="city" defaultValue={selectedItem?.city} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Status</label>
                          <select name="status" defaultValue={selectedItem?.status || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {modalSection === 'ambulances' && (
                    <>
                      <div className="admin-form-group">
                        <label>Provider Name *</label>
                        <input type="text" name="providerName" defaultValue={selectedItem?.providerName} required />
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Vehicle Number *</label>
                          <input type="text" name="vehicleNumber" defaultValue={selectedItem?.vehicleNumber} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Vehicle Type *</label>
                          <select name="vehicleType" defaultValue={selectedItem?.vehicleType} required>
                            <option value="basic">Basic</option>
                            <option value="advanced">Advanced</option>
                            <option value="icu">ICU</option>
                          </select>
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Driver Name *</label>
                          <input type="text" name="driverName" defaultValue={selectedItem?.driverName} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Driver Mobile *</label>
                          <input type="tel" name="driverMobile" defaultValue={selectedItem?.driverMobile} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>City *</label>
                          <input type="text" name="city" defaultValue={selectedItem?.city} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Base Fare (₹) *</label>
                          <input type="number" name="baseFare" defaultValue={selectedItem?.baseFare} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Status</label>
                          <select name="status" defaultValue={selectedItem?.status || 'available'}>
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="offline">Offline</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label>Verification Status</label>
                          <select name="verified" defaultValue={selectedItem?.verified || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {modalSection === 'pathlabs' && (
                    <>
                      <div className="admin-form-group">
                        <label>Lab Name *</label>
                        <input type="text" name="name" defaultValue={selectedItem?.name} required />
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Owner/Director *</label>
                          <input type="text" name="owner" defaultValue={selectedItem?.owner} required />
                        </div>
                        <div className="admin-form-group">
                          <label>License Number *</label>
                          <input type="text" name="license" defaultValue={selectedItem?.license} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Mobile *</label>
                          <input type="tel" name="mobile" defaultValue={selectedItem?.mobile} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Email *</label>
                          <input type="email" name="email" defaultValue={selectedItem?.email} required />
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>City *</label>
                          <input type="text" name="city" defaultValue={selectedItem?.city} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Sample Collection</label>
                          <select name="sampleCollection" defaultValue={selectedItem?.sampleCollection || 'no'}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>
                      <div className="admin-form-row">
                        <div className="admin-form-group">
                          <label>Status</label>
                          <select name="status" defaultValue={selectedItem?.status || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label>KYC Status</label>
                          <select name="kycStatus" defaultValue={selectedItem?.kycStatus || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {(modalSection === 'payments' || modalSection === 'reviews' || 
                    modalSection === 'notifications' || modalSection === 'reports') && (
                    <div className="admin-info-message">
                      <p>📝 Forms for {modalSection} section will be available after backend integration.</p>
                      <p>Currently showing view-only mode for these sections.</p>
                    </div>
                  )}

                  <div className="admin-modal-actions">
                    <button type="button" className="admin-btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-btn-primary">
                      {modalMode === 'add' ? 'Add' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Major Expenses Modal */}
      {showExpenseModal && (
        <div className="admin-modal-overlay" onClick={closeExpenseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <div className="admin-modal-header">
              <h2>
                {expenseModalMode === 'add' ? '➕ Add' : '✏️ Edit'} {' '}
                {expenseSubSection === 'rooms' && 'Room/Board'}
                {expenseSubSection === 'procedures' && 'Medical Procedure'}
                {expenseSubSection === 'doctorFees' && 'Doctor Fee'}
                {expenseSubSection === 'nursing' && 'Nursing/Staff Charge'}
                {expenseSubSection === 'miscellaneous' && 'Miscellaneous Service'}
              </h2>
              <button className="admin-close-btn" onClick={closeExpenseModal}>✕</button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                handleExpenseSave(data);
              }} className="admin-modal-form">
                
                {/* Rooms & Boards Form */}
                {expenseSubSection === 'rooms' && (
                  <>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Room Type *</label>
                        <select name="room_type" defaultValue={selectedExpenseItem?.room_type} required>
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
                        <input type="text" name="room_name" defaultValue={selectedExpenseItem?.room_name} required placeholder="e.g., ICU Ward A" />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Floor</label>
                        <input type="text" name="floor" defaultValue={selectedExpenseItem?.floor} placeholder="e.g., 3rd Floor" />
                      </div>
                      <div className="admin-form-group">
                        <label>Charge Per Day (₹) *</label>
                        <input type="number" name="charge_per_day" defaultValue={selectedExpenseItem?.charge_per_day} required placeholder="Enter charge" />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Max Patients *</label>
                        <input type="number" name="max_patients" defaultValue={selectedExpenseItem?.max_patients} required placeholder="Number of beds" />
                      </div>
                      <div className="admin-form-group">
                        <label>Status</label>
                        <select name="status" defaultValue={selectedExpenseItem?.status || 'Active'}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Description</label>
                      <textarea name="description" defaultValue={selectedExpenseItem?.description} rows="3" placeholder="Room details and facilities"></textarea>
                    </div>
                  </>
                )}

                {/* Medical Procedures Form */}
                {expenseSubSection === 'procedures' && (
                  <>
                    <div className="admin-form-group">
                      <label>Procedure Name *</label>
                      <input type="text" name="procedure_name" defaultValue={selectedExpenseItem?.procedure_name} required placeholder="e.g., Appendectomy" />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Procedure Type *</label>
                        <select name="procedure_type" defaultValue={selectedExpenseItem?.procedure_type} required>
                          <option value="">Select Type</option>
                          <option value="Minor Surgery">Minor Surgery</option>
                          <option value="Major Surgery">Major Surgery</option>
                          <option value="Minor Procedure">Minor Procedure</option>
                          <option value="Major Procedure">Major Procedure</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Base Charge (₹) *</label>
                        <input type="number" name="base_charge" defaultValue={selectedExpenseItem?.base_charge} required placeholder="Base cost" />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>OT Charges (₹)</label>
                    ;   <input type="number" name="ot_charges" defaultValue={selectedExpenseItem?.ot_charges} placeholder="Operation theatre charges" />
                      </div>
                      <div className="admin-form-group">
                        <label>Anesthesia Charge (₹)</label>
                        <input type="number" name="anesthesia_charge" defaultValue={selectedExpenseItem?.anesthesia_charge} placeholder="Anesthesia cost" />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Default Doctor Fee (₹)</label>
                        <input type="number" name="doctor_fee_default" defaultValue={selectedExpenseItem?.doctor_fee_default} placeholder="Doctor fee" />
                      </div>
                      <div className="admin-form-group">
                        <label>Status</label>
                        <select name="status" defaultValue={selectedExpenseItem?.status || 'Active'}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Description</label>
                      <textarea name="description" defaultValue={selectedExpenseItem?.description} rows="3" placeholder="Procedure details"></textarea>
                    </div>
                  </>
                )}

                {/* Doctor Fees Form */}
                {expenseSubSection === 'doctorFees' && (
                  <>
                    <div className="admin-form-group">
                      <label>Doctor Name *</label>
                      <input type="text" name="name" defaultValue={selectedExpenseItem?.name} required placeholder="Full name" />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Specialization *</label>
                        <input type="text" name="specialization" defaultValue={selectedExpenseItem?.specialization} required placeholder="e.g., Cardiologist" />
                      </div>
                      <div className="admin-form-group">
                        <label>Visit Type *</label>
                        <select name="visit_type" defaultValue={selectedExpenseItem?.visit_type} required>
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
                        <input type="number" name="visit_fee_opd" defaultValue={selectedExpenseItem?.visit_fee_opd} required placeholder="OPD fee" />
                      </div>
                      <div className="admin-form-group">
                        <label>IPD Visit Fee (₹)</label>
                        <input type="number" name="visit_fee_ipd_per_visit" defaultValue={selectedExpenseItem?.visit_fee_ipd_per_visit} placeholder="IPD per visit" />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Emergency Consultation (₹)</label>
                        <input type="number" name="consultation_fee_emergency" defaultValue={selectedExpenseItem?.consultation_fee_emergency} placeholder="Emergency fee" />
                      </div>
                      <div className="admin-form-group">
                        <label>Experience (years)</label>
                        <input type="number" name="experience" defaultValue={selectedExpenseItem?.experience} placeholder="Years of experience" />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Status</label>
                      <select name="status" defaultValue={selectedExpenseItem?.status || 'Active'}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Nursing & Staff Charges Form */}
                {expenseSubSection === 'nursing' && (
                  <>
                    <div className="admin-form-group">
                      <label>Service Name *</label>
                      <input type="text" name="service_name" defaultValue={selectedExpenseItem?.service_name} required placeholder="e.g., Special Nursing Care" />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Charge Type *</label>
                        <select name="charge_type" defaultValue={selectedExpenseItem?.charge_type} required>
                          <option value="">Select Type</option>
                          <option value="per_day">Per Day</option>
                          <option value="per_visit">Per Visit</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Charge Amount (₹) *</label>
                        <input type="number" name="charge_amount" defaultValue={selectedExpenseItem?.charge_amount} required placeholder="Enter amount" />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Status</label>
                      <select name="status" defaultValue={selectedExpenseItem?.status || 'Active'}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Miscellaneous Services Form */}
                {expenseSubSection === 'miscellaneous' && (
                  <>
                    <div className="admin-form-group">
                      <label>Service Name *</label>
                      <input type="text" name="service" defaultValue={selectedExpenseItem?.service} required placeholder="e.g., Ambulance Service" />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Charge (₹) *</label>
                        <input type="number" name="charge" defaultValue={selectedExpenseItem?.charge} required placeholder="Enter charge" />
                      </div>
                      <div className="admin-form-group">
                        <label>Status</label>
                        <select name="status" defaultValue={selectedExpenseItem?.status || 'Active'}>
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
  );
};

export default AdminDashboard;
