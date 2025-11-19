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

  // Mock data for ambulances
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
                      <tr key={doctor.id}>
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
                      <tr key={chemist.id}>
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

          {/* Ambulance Management Section */}
          {activeSection === 'ambulances' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>🚑 Ambulance Management</h2>
                <button className="admin-add-btn" onClick={() => openModal('add', 'ambulances')}>
                  + Add Ambulance
                </button>
              </div>
              
              <div className="admin-filters">
                <input 
                  type="text" 
                  placeholder="Search by driver, vehicle number..." 
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
                  <option value="">All Vehicle Types</option>
                  <option value="basic">Basic Life Support</option>
                  <option value="advanced">Advanced Life Support</option>
                  <option value="transport">Patient Transport</option>
                </select>
                <select className="admin-filter-select">
                  <option value="">All Availability</option>
                  <option value="available">Available</option>
                  <option value="on-trip">On Trip</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
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
                      <th>Ambulance ID</th>
                      <th>Driver Name</th>
                      <th>Vehicle Number</th>
                      <th>Vehicle Type</th>
                      <th>City</th>
                      <th>Total Trips</th>
                      <th>Rating</th>
                      <th>Availability</th>
                      <th>Last Trip</th>
                      <th>KYC Status</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambulances.map(ambulance => (
                      <tr key={ambulance.id}>
                        <td>{ambulance.id}</td>
                        <td>{ambulance.driverName}</td>
                        <td>{ambulance.vehicleNumber}</td>
                        <td>
                          <span className={`admin-vehicle-badge ${ambulance.vehicleType.toLowerCase().replace(/ /g, '-')}`}>
                            {ambulance.vehicleType}
                          </span>
                        </td>
                        <td>{ambulance.city}</td>
                        <td>{ambulance.totalTrips}</td>
                        <td>
                          {ambulance.rating > 0 ? (
                            <span style={{color: '#f59e0b'}}>⭐ {ambulance.rating}</span>
                          ) : (
                            <span style={{color: '#9ca3af'}}>No rating</span>
                          )}
                        </td>
                        <td>
                          <span className={`admin-availability-badge ${ambulance.availability}`}>
                            {ambulance.availability.charAt(0).toUpperCase() + ambulance.availability.slice(1).replace('-', ' ')}
                          </span>
                        </td>
                        <td>
                          {ambulance.lastTrip ? new Date(ambulance.lastTrip).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                        <td>
                          <span className={`admin-status-badge ${ambulance.kycStatus}`}>
                            {ambulance.kycStatus.charAt(0).toUpperCase() + ambulance.kycStatus.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-status-badge ${ambulance.status}`}>
                            {ambulance.status.charAt(0).toUpperCase() + ambulance.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="admin-icon-btn" 
                            title="View Details"
                            onClick={() => openModal('view', 'ambulances', ambulance)}
                          >
                            👁️
                          </button>
                          <button 
                            className="admin-icon-btn" 
                            title="Trip History"
                            onClick={() => alert('View trip history for ' + ambulance.vehicleNumber)}
                          >
                            📋
                          </button>
                          <button 
                            className="admin-icon-btn" 
                            title="Edit"
                            onClick={() => openModal('edit', 'ambulances', ambulance)}
                          >
                            ✏️
                          </button>
                          {ambulance.status === 'pending' ? (
                            <>
                              <button className="admin-icon-btn" title="Approve">✅</button>
                              <button className="admin-icon-btn" title="Reject">❌</button>
                            </>
                          ) : ambulance.status !== 'blocked' ? (
                            <button className="admin-icon-btn" title="Block">🚫</button>
                          ) : (
                            <button className="admin-icon-btn" title="Unblock">✅</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-section-footer">
                <p>Showing {ambulances.length} ambulances</p>
                <div className="admin-pagination">
                  <button className="admin-page-btn">Previous</button>
                  <button className="admin-page-btn admin-active-page">1</button>
                  <button className="admin-page-btn">2</button>
                  <button className="admin-page-btn">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Pathlab Management Section */}
          {activeSection === 'pathlabs' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>🔬 Pathlab Management</h2>
                <button className="admin-add-btn" onClick={() => openModal('add', 'pathlabs')}>
                  + Add Pathlab
                </button>
              </div>
              
              <div className="admin-filters">
                <input 
                  type="text" 
                  placeholder="Search by lab name, license, owner..." 
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
                  <option value="">Sample Collection</option>
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
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
                      <th>Lab ID</th>
                      <th>Lab Name</th>
                      <th>Owner Name</th>
                      <th>City</th>
                      <th>License Number</th>
                      <th>License Expiry</th>
                      <th>Total Tests</th>
                      <th>Total Orders</th>
                      <th>Rating</th>
                      <th>Sample Collection</th>
                      <th>KYC Status</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pathlabs.map(lab => (
                      <tr key={lab.id}>
                        <td>{lab.id}</td>
                        <td>{lab.name}</td>
                        <td>{lab.owner}</td>
                        <td>{lab.city}</td>
                        <td><small>{lab.license}</small></td>
                        <td>{new Date(lab.licenseExpiry).toLocaleDateString('en-IN')}</td>
                        <td>{lab.totalTests}</td>
                        <td>{lab.totalOrders}</td>
                        <td>
                          {lab.rating > 0 ? (
                            <span style={{color: '#f59e0b'}}>⭐ {lab.rating}</span>
                          ) : (
                            <span style={{color: '#9ca3af'}}>No rating</span>
                          )}
                        </td>
                        <td>
                          <span className={`admin-collection-badge ${lab.sampleCollection}`}>
                            {lab.sampleCollection === 'yes' ? 'Available' : 'Not Available'}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-status-badge ${lab.kycStatus}`}>
                            {lab.kycStatus.charAt(0).toUpperCase() + lab.kycStatus.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-status-badge ${lab.status}`}>
                            {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="admin-icon-btn" 
                            title="View Details"
                            onClick={() => openModal('view', 'pathlabs', lab)}
                          >
                            👁️
                          </button>
                          <button 
                            className="admin-icon-btn" 
                            title="View Tests"
                            onClick={() => alert('View test catalog for ' + lab.name)}
                          >
                            🧪
                          </button>
                          <button 
                            className="admin-icon-btn" 
                            title="Edit"
                            onClick={() => openModal('edit', 'pathlabs', lab)}
                          >
                            ✏️
                          </button>
                          {lab.status === 'pending' ? (
                            <>
                              <button className="admin-icon-btn" title="Approve">✅</button>
                              <button className="admin-icon-btn" title="Reject">❌</button>
                            </>
                          ) : lab.status !== 'blocked' ? (
                            <button className="admin-icon-btn" title="Block">🚫</button>
                          ) : (
                            <button className="admin-icon-btn" title="Unblock">✅</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-section-footer">
                <p>Showing {pathlabs.length} pathlabs</p>
                <div className="admin-pagination">
                  <button className="admin-page-btn">Previous</button>
                  <button className="admin-page-btn admin-active-page">1</button>
                  <button className="admin-page-btn">2</button>
                  <button className="admin-page-btn">Next</button>
                </div>
              </div>
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
                      <th>City</th>
                      <th>Registered Date</th>
                      <th>Total Appointments</th>
                      <th>Last Appointment</th>
                      <th>Family Members</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(patient => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.name}</td>
                        <td>{patient.mobile}</td>
                        <td>{patient.email}</td>
                        <td>{patient.city}</td>
                        <td>{new Date(patient.registeredDate).toLocaleDateString('en-IN')}</td>
                        <td>{patient.totalAppointments}</td>
                        <td>{new Date(patient.lastAppointment).toLocaleDateString('en-IN')}</td>
                        <td>{patient.familyMembers}</td>
                        <td>
                          <span className={`admin-status-badge ${patient.status}`}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="admin-icon-btn" 
                            title="View Details"
                            onClick={() => openModal('view', 'patients', patient)}
                          >
                            👁️
                          </button>
                          <button 
                            className="admin-icon-btn" 
                            title="View History"
                            onClick={() => alert('View appointment history for ' + patient.name)}
                          >
                            📋
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
                      <th>Type</th>
                      <th>Fee (₹)</th>
                      <th>Payment Status</th>
                      <th>Appointment Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <tr key={apt.id}>
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
                        <td>{apt.type}</td>
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
                          <button className="admin-icon-btn" title="View Details">👁️</button>
                          <button className="admin-icon-btn" title="View Receipt">🧾</button>
                          {apt.appointmentStatus === 'pending' && (
                            <>
                              <button className="admin-icon-btn" title="Confirm">✅</button>
                              <button className="admin-icon-btn" title="Cancel">❌</button>
                            </>
                          )}
                          {apt.paymentStatus === 'failed' && (
                            <button className="admin-icon-btn" title="Retry Payment">💳</button>
                          )}
                        </td>
                      </tr>
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
                        <input type="number" name="ot_charges" defaultValue={selectedExpenseItem?.ot_charges} placeholder="Operation theatre charges" />
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
