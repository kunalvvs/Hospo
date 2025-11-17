import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('adminUser'));
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
      return;
    }
    setAdminUser(user);
  }, [navigate]);

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
                <button className="admin-add-btn" onClick={() => alert('Add Hospital form will open')}>
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
                    <tr>
                      <td>City General Hospital</td>
                      <td>Mumbai</td>
                      <td>Dr. Rajesh Kumar</td>
                      <td>9876543210</td>
                      <td><span className="admin-status-badge approved">Approved</span></td>
                      <td><span className="admin-status-badge approved">Approved</span></td>
                      <td>45</td>
                      <td>
                        <button className="admin-icon-btn" title="View">👁️</button>
                        <button className="admin-icon-btn" title="Edit">✏️</button>
                        <button className="admin-icon-btn" title="Block">🚫</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Metro Clinic</td>
                      <td>Delhi</td>
                      <td>Mr. Amit Sharma</td>
                      <td>9876543211</td>
                      <td><span className="admin-status-badge pending">Pending</span></td>
                      <td><span className="admin-status-badge pending">Pending</span></td>
                      <td>12</td>
                      <td>
                        <button className="admin-icon-btn" title="View">👁️</button>
                        <button className="admin-icon-btn" title="Verify">✅</button>
                        <button className="admin-icon-btn" title="Reject">❌</button>
                      </td>
                    </tr>
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
                <button className="admin-add-btn">+ Add Doctor</button>
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
                      <th>KYC Status</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>DOC001</td>
                      <td>Dr. Priya Sharma</td>
                      <td>Cardiologist</td>
                      <td>City General, Metro Clinic</td>
                      <td>Mumbai</td>
                      <td>15 years</td>
                      <td><span className="admin-status-badge approved">Approved</span></td>
                      <td><span className="admin-status-badge approved">Active</span></td>
                      <td>
                        <button className="admin-icon-btn">👁️</button>
                        <button className="admin-icon-btn">✏️</button>
                        <button className="admin-icon-btn">🚫</button>
                      </td>
                    </tr>
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
                  <p className="admin-stat-value" style={{color: '#8b5cf6'}}>
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
                          <button className="admin-action-btn view" onClick={() => alert('View details: ' + notification.id)}>
                            👁️ View
                          </button>
                          {notification.status === 'draft' && (
                            <button className="admin-action-btn edit" onClick={() => alert('Edit: ' + notification.id)}>
                              ✏️ Edit
                            </button>
                          )}
                          {notification.status === 'scheduled' && (
                            <button className="admin-action-btn edit" onClick={() => alert('Reschedule: ' + notification.id)}>
                              📅 Reschedule
                            </button>
                          )}
                          {notification.status === 'sent' && (
                            <button className="admin-action-btn view" onClick={() => alert('Analytics: ' + notification.id)}>
                              📊 Analytics
                            </button>
                          )}
                          {notification.status === 'failed' && (
                            <button className="admin-action-btn edit" onClick={() => alert('Retry: ' + notification.id)}>
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
                  <p className="admin-stat-value" style={{color: '#8b5cf6'}}>
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
                <button className="admin-add-btn" onClick={() => alert('Add Chemist form will open')}>
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
                          <button className="admin-icon-btn" title="View Details">👁️</button>
                          <button className="admin-icon-btn" title="View Products">📦</button>
                          <button className="admin-icon-btn" title="Edit">✏️</button>
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
                <button className="admin-add-btn" onClick={() => alert('Add Ambulance form will open')}>
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
                          <button className="admin-icon-btn" title="View Details">👁️</button>
                          <button className="admin-icon-btn" title="Trip History">📋</button>
                          <button className="admin-icon-btn" title="Edit">✏️</button>
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
                <button className="admin-add-btn" onClick={() => alert('Add Pathlab form will open')}>
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
                          <button className="admin-icon-btn" title="View Details">👁️</button>
                          <button className="admin-icon-btn" title="View Tests">🧪</button>
                          <button className="admin-icon-btn" title="Edit">✏️</button>
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
                <button className="admin-add-btn" onClick={() => alert('Patient details view')}>
                  👁️ View All Patients
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
                          <button className="admin-icon-btn" title="View Details">👁️</button>
                          <button className="admin-icon-btn" title="View History">📋</button>
                          <button className="admin-icon-btn" title="Edit">✏️</button>
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
    </div>
  );
};

export default AdminDashboard;
