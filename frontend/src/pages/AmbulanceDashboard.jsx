import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ambulanceAPI } from '../services/api';
import './AmbulanceDashboard.css';

const AmbulanceDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [ambulanceData, setAmbulanceData] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  
  // Date formatting utility
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  };
  
  // Edit mode states for each section
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingDriver, setIsEditingDriver] = useState(false);
  const [isEditingKYC, setIsEditingKYC] = useState(false);
  const [isEditingQualifications, setIsEditingQualifications] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [isEditingVehicleDocuments, setIsEditingVehicleDocuments] = useState(false);
  const [isEditingEquipment, setIsEditingEquipment] = useState(false);
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingOperations, setIsEditingOperations] = useState(false);
  
  const [editFormData, setEditFormData] = useState({});
  const [uploadingFile, setUploadingFile] = useState(false);
  const [documents, setDocuments] = useState([]);

  // Multiple profiles state
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [expandedDrivers, setExpandedDrivers] = useState({}); // Track which drivers are expanded
  const [expandedVehicles, setExpandedVehicles] = useState({}); // Track which vehicles are expanded

  // Mock bookings data
  const [bookings] = useState([
    { id: 1, patient: 'Rajesh Kumar', pickup: 'MG Road', destination: 'Apollo Hospital', status: 'ongoing', date: '2025-11-13', time: '10:30 AM' },
    { id: 2, patient: 'Priya Sharma', pickup: 'Jubilee Hills', destination: 'Care Hospital', status: 'pending', date: '2025-11-13', time: '02:15 PM' },
    { id: 3, patient: 'Amit Patel', pickup: 'Banjara Hills', destination: 'Continental Hospital', status: 'completed', date: '2025-11-12', time: '08:45 AM' },
  ]);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    
    if (!userString) {
      navigate('/login');
      return;
    }
    
    const loadProfile = async () => {
      try {
        const userData = JSON.parse(userString);
        
        if (userData.role !== 'ambulance') {
          alert('Access denied. This page is only for ambulance services.');
          navigate('/');
          return;
        }

        setCurrentUser(userData);

        // Fetch ambulance profile from backend
        const response = await ambulanceAPI.getProfile();
        
        if (response.success) {
          setAmbulanceData(response.ambulance);
          localStorage.setItem('ambulanceData', JSON.stringify(response.ambulance));
          
          // Load drivers and vehicles arrays
          setDrivers(response.ambulance.drivers || []);
          setVehicles(response.ambulance.vehicles || []);
          
          // Get profile completion
          const completionResponse = await ambulanceAPI.getProfileCompletion();
          if (completionResponse.success) {
            setProfileCompletion(completionResponse.profileCompletion);
          }
          
          // Get documents
          const docsResponse = await ambulanceAPI.getDocuments();
          if (docsResponse.success) {
            setDocuments(docsResponse.documents);
          }
        }
        
        setLoading(false);

        // Check if there's a state with activeSection
        if (location.state?.activeSection) {
          setActiveSection(location.state.activeSection);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        
        // Check if registration is not complete
        if (error.response?.status === 404) {
          alert('Profile not found. Please complete registration first.');
          navigate('/ambulance-registration');
        } else {
          alert('Failed to load profile. Using cached data if available.');
          
          // Try to use cached data
          const cachedData = localStorage.getItem('ambulanceData');
          if (cachedData) {
            setAmbulanceData(JSON.parse(cachedData));
          } else {
            navigate('/ambulance-registration');
          }
        }
        
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('ambulanceData');
    localStorage.removeItem('token');
    navigate('/');
  };

  // ============ COMMON EDIT HANDLERS ============
  const handleEditSection = (section) => {
    switch(section) {
      case 'account':
        setIsEditingAccount(true);
        setEditFormData({
          serviceName: ambulanceData.serviceName || '',
          contactPerson: ambulanceData.contactPerson || '',
          mobile: ambulanceData.mobile || '',
          email: ambulanceData.email || '',
          businessType: ambulanceData.businessType || '',
          serviceArea: ambulanceData.serviceArea || ''
        });
        break;
      case 'driver':
        setIsEditingDriver(true);
        setEditFormData({
          driverName: ambulanceData.driverName || '',
          driverDOB: formatDateForInput(ambulanceData.driverDOB) || '',
          driverAge: ambulanceData.driverAge || '',
          driverGender: ambulanceData.driverGender || '',
          driverMobile: ambulanceData.driverMobile || '',
          driverAlternateMobile: ambulanceData.driverAlternateMobile || '',
          driverPermanentAddress: ambulanceData.driverPermanentAddress || '',
          driverCurrentAddress: ambulanceData.driverCurrentAddress || '',
          driverLanguages: ambulanceData.driverLanguages || [],
          emergencyContactName: ambulanceData.emergencyContactName || '',
          emergencyContactRelation: ambulanceData.emergencyContactRelation || '',
          emergencyContactPhone: ambulanceData.emergencyContactPhone || ''
        });
        break;
      case 'kyc':
        setIsEditingKYC(true);
        setEditFormData({
          governmentIdType: ambulanceData.governmentIdType || '',
          governmentIdNumber: ambulanceData.governmentIdNumber || '',
          drivingLicenceNumber: ambulanceData.drivingLicenceNumber || '',
          drivingLicenceIssue: formatDateForInput(ambulanceData.drivingLicenceIssue) || '',
          drivingLicenceExpiry: formatDateForInput(ambulanceData.drivingLicenceExpiry) || '',
          panCard: ambulanceData.panCard || ''
        });
        break;
      case 'qualifications':
        setIsEditingQualifications(true);
        setEditFormData({
          drivingExperienceYears: ambulanceData.drivingExperienceYears || '',
          emergencyVehicleExperience: ambulanceData.emergencyVehicleExperience || '',
          emergencyVehicleExperienceYears: ambulanceData.emergencyVehicleExperienceYears || '',
          certificationType: ambulanceData.certificationType || '',
          certificationCourseName: ambulanceData.certificationCourseName || '',
          issuingOrganization: ambulanceData.issuingOrganization || '',
          certificateExpiry: formatDateForInput(ambulanceData.certificateExpiry) || '',
          paramedicTraining: ambulanceData.paramedicTraining || '',
          defensiveDrivingCertificate: ambulanceData.defensiveDrivingCertificate || '',
          communicationSkills: ambulanceData.communicationSkills || ''
        });
        break;
      case 'vehicle':
        setIsEditingVehicle(true);
        setEditFormData({
          vehicleType: ambulanceData.vehicleType || '',
          vehicleRegistrationNumber: ambulanceData.vehicleRegistrationNumber || '',
          vehicleMake: ambulanceData.vehicleMake || '',
          vehicleModel: ambulanceData.vehicleModel || '',
          manufacturingYear: ambulanceData.manufacturingYear || '',
          vehicleColor: ambulanceData.vehicleColor || '',
          chassisNumber: ambulanceData.chassisNumber || '',
          engineNumber: ambulanceData.engineNumber || '',
          ownershipType: ambulanceData.ownershipType || '',
          commercialPermitNumber: ambulanceData.commercialPermitNumber || '',
          seatingCapacity: ambulanceData.seatingCapacity || '',
          stretcherCapacity: ambulanceData.stretcherCapacity || ''
        });
        break;
      case 'vehicleDocuments':
        setIsEditingVehicleDocuments(true);
        setEditFormData({
          insurancePolicyNumber: ambulanceData.insurancePolicyNumber || '',
          insuranceCompany: ambulanceData.insuranceCompany || '',
          insuranceExpiryDate: formatDateForInput(ambulanceData.insuranceExpiryDate) || '',
          pucCertificateNumber: ambulanceData.pucCertificateNumber || '',
          pucValidUntil: formatDateForInput(ambulanceData.pucValidUntil) || ''
        });
        break;
      case 'equipment':
        setIsEditingEquipment(true);
        setEditFormData({
          hasStretcher: ambulanceData.hasStretcher || false,
          stretcherType: ambulanceData.stretcherType || '',
          stretcherQuantity: ambulanceData.stretcherQuantity || '',
          stretcherCondition: ambulanceData.stretcherCondition || '',
          stretcherLastMaintenance: formatDateForInput(ambulanceData.stretcherLastMaintenance) || '',
          hasOxygenCylinder: ambulanceData.hasOxygenCylinder || false,
          oxygenQuantity: ambulanceData.oxygenQuantity || '',
          oxygenCapacity: ambulanceData.oxygenCapacity || '',
          oxygenLastRefill: formatDateForInput(ambulanceData.oxygenLastRefill) || '',
          oxygenRegulatorCondition: ambulanceData.oxygenRegulatorCondition || '',
          hasAmbuBag: ambulanceData.hasAmbuBag || false,
          ambuBagAdultQty: ambulanceData.ambuBagAdultQty || '',
          ambuBagPediatricQty: ambulanceData.ambuBagPediatricQty || '',
          ambuBagCondition: ambulanceData.ambuBagCondition || '',
          hasSuctionMachine: ambulanceData.hasSuctionMachine || false,
          suctionQuantity: ambulanceData.suctionQuantity || '',
          suctionStatus: ambulanceData.suctionStatus || '',
          suctionLastMaintenance: formatDateForInput(ambulanceData.suctionLastMaintenance) || '',
          hasBPApparatus: ambulanceData.hasBPApparatus || false,
          hasPulseOximeter: ambulanceData.hasPulseOximeter || false,
          hasGlucometer: ambulanceData.hasGlucometer || false,
          hasThermometer: ambulanceData.hasThermometer || false,
          hasSplints: ambulanceData.hasSplints || false,
          hasCervicalCollar: ambulanceData.hasCervicalCollar || false,
          hasImmobilizationBoard: ambulanceData.hasImmobilizationBoard || false,
          hasWoundDressings: ambulanceData.hasWoundDressings || false,
          hasIVSets: ambulanceData.hasIVSets || false,
          hasCannulas: ambulanceData.hasCannulas || false,
          hasSyringes: ambulanceData.hasSyringes || false,
          medicalSuppliesExpiryDate: formatDateForInput(ambulanceData.medicalSuppliesExpiryDate) || '',
          hasEmergencyDrugsKit: ambulanceData.hasEmergencyDrugsKit || false,
          emergencyDrugsList: ambulanceData.emergencyDrugsList || '',
          emergencyDrugsExpiry: formatDateForInput(ambulanceData.emergencyDrugsExpiry) || '',
          hasFireExtinguisher: ambulanceData.hasFireExtinguisher || false,
          hasFirstAidBox: ambulanceData.hasFirstAidBox || false,
          hasSurgicalMasks: ambulanceData.hasSurgicalMasks || false,
          hasGloves: ambulanceData.hasGloves || false,
          hasDisinfectant: ambulanceData.hasDisinfectant || false,
          hasHandSanitizer: ambulanceData.hasHandSanitizer || false
        });
        break;
      case 'pricing':
        setIsEditingPricing(true);
        setEditFormData({
          baseCharge: ambulanceData.baseCharge || '',
          baseDistanceIncluded: ambulanceData.baseDistanceIncluded || '',
          perKmCharge: ambulanceData.perKmCharge || '',
          nightCharges: ambulanceData.nightCharges || '',
          waitingCharges: ambulanceData.waitingCharges || '',
          oxygenCharges: ambulanceData.oxygenCharges || '',
          intercityTransferRates: ambulanceData.intercityTransferRates || '',
          paymentCash: ambulanceData.paymentCash || false,
          paymentCard: ambulanceData.paymentCard || false,
          paymentUPI: ambulanceData.paymentUPI || false,
          paymentWallet: ambulanceData.paymentWallet || false,
          paymentCorporate: ambulanceData.paymentCorporate || false,
          paymentInsurance: ambulanceData.paymentInsurance || false,
          bankAccountHolderName: ambulanceData.bankAccountHolderName || '',
          bankAccountNumber: ambulanceData.bankAccountNumber || '',
          bankIFSC: ambulanceData.bankIFSC || '',
          bankName: ambulanceData.bankName || ''
        });
        break;
      case 'bank':
        setIsEditingBank(true);
        setEditFormData({
          accountHolderName: ambulanceData.bankDetails?.accountHolderName || '',
          accountNumber: ambulanceData.bankDetails?.accountNumber || '',
          accountType: ambulanceData.bankDetails?.accountType || '',
          ifscCode: ambulanceData.bankDetails?.ifscCode || '',
          bankName: ambulanceData.bankDetails?.bankName || '',
          branchName: ambulanceData.bankDetails?.branchName || '',
          branchAddress: ambulanceData.bankDetails?.branchAddress || '',
          upiId: ambulanceData.upiId || ''
        });
        break;
      case 'operations':
        setIsEditingOperations(true);
        setEditFormData({
          serviceAvailability: ambulanceData.serviceAvailability || '',
          operatingHours: ambulanceData.operatingHours || {},
          serviceCities: ambulanceData.serviceCities || [],
          serviceRadius: ambulanceData.serviceRadius || '',
          intercityService: ambulanceData.intercityService || false,
          interstateService: ambulanceData.interstateService || false,
          currentStatus: ambulanceData.currentStatus || 'offline'
        });
        break;
      default:
        break;
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData({
      ...editFormData,
      [field]: value
    });
  };

  const handleSaveSection = async (section) => {
    try {
      // Special handling for bank section - nest fields under bankDetails
      let dataToSend = editFormData;
      if (section === 'bank') {
        dataToSend = {
          bankDetails: {
            accountHolderName: editFormData.accountHolderName,
            accountNumber: editFormData.accountNumber,
            accountType: editFormData.accountType,
            ifscCode: editFormData.ifscCode,
            bankName: editFormData.bankName,
            branchName: editFormData.branchName,
            branchAddress: editFormData.branchAddress
          },
          upiId: editFormData.upiId
        };
      }
      
      const response = await ambulanceAPI.updateSection(section, dataToSend);
      
      if (response.success) {
        setAmbulanceData(response.ambulance);
        localStorage.setItem('ambulanceData', JSON.stringify(response.ambulance));
        
        // Reset edit states
        setIsEditingAccount(false);
        setIsEditingDriver(false);
        setIsEditingKYC(false);
        setIsEditingQualifications(false);
        setIsEditingVehicle(false);
        setIsEditingVehicleDocuments(false);
        setIsEditingEquipment(false);
        setIsEditingPricing(false);
        setIsEditingBank(false);
        setIsEditingOperations(false);
        
        setEditFormData({});
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} details updated successfully!`);
        
        // Refresh profile completion
        const completionResponse = await ambulanceAPI.getProfileCompletion();
        if (completionResponse.success) {
          setProfileCompletion(completionResponse.profileCompletion);
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || `Failed to update ${section} details`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAccount(false);
    setIsEditingDriver(false);
    setIsEditingKYC(false);
    setIsEditingQualifications(false);
    setIsEditingVehicle(false);
    setIsEditingVehicleDocuments(false);
    setIsEditingEquipment(false);
    setIsEditingPricing(false);
    setIsEditingBank(false);
    setIsEditingOperations(false);
    setEditFormData({});
    setIsAddingDriver(false);
    setIsAddingVehicle(false);
    setSelectedDriverId(null);
    setSelectedVehicleId(null);
  };

  // ============ DRIVER CRUD HANDLERS ============
  const handleAddNewDriver = () => {
    setIsAddingDriver(true);
    setIsEditingDriver(true);
    setSelectedDriverId(null);
    setEditFormData({
      driverName: '',
      driverMobile: '',
      drivingLicenceNumber: '',
      driverGender: 'Male',
      driverLanguages: [],
      governmentIdType: 'aadhaar',
      emergencyVehicleExperience: 'no',
      paramedicTraining: 'none',
      defensiveDrivingCertificate: 'no'
    });
  };

  const handleEditDriver = (driver) => {
    setIsEditingDriver(true);
    setIsAddingDriver(false);
    setSelectedDriverId(driver._id);
    setEditFormData({
      // Driver Details
      driverName: driver.driverName || '',
      driverDOB: formatDateForInput(driver.driverDOB) || '',
      driverAge: driver.driverAge || '',
      driverGender: driver.driverGender || 'Male',
      driverMobile: driver.driverMobile || '',
      driverAlternateMobile: driver.driverAlternateMobile || '',
      driverPermanentAddress: driver.driverPermanentAddress || '',
      driverCurrentAddress: driver.driverCurrentAddress || '',
      driverLanguages: driver.driverLanguages || [],
      driverExperience: driver.driverExperience || '',
      driverQualification: driver.driverQualification || '',
      emergencyContactName: driver.emergencyContactName || '',
      emergencyContactRelation: driver.emergencyContactRelation || '',
      emergencyContactPhone: driver.emergencyContactPhone || '',
      // KYC
      governmentIdType: driver.governmentIdType || 'aadhaar',
      governmentIdNumber: driver.governmentIdNumber || '',
      drivingLicenceNumber: driver.drivingLicenceNumber || '',
      drivingLicenceIssue: formatDateForInput(driver.drivingLicenceIssue) || '',
      drivingLicenceExpiry: formatDateForInput(driver.drivingLicenceExpiry) || '',
      licenseType: driver.licenseType || '',
      panCard: driver.panCard || '',
      // Qualifications
      drivingExperienceYears: driver.drivingExperienceYears || '',
      emergencyVehicleExperience: driver.emergencyVehicleExperience || 'no',
      emergencyVehicleExperienceYears: driver.emergencyVehicleExperienceYears || '',
      certificationType: driver.certificationType || '',
      certificationCourseName: driver.certificationCourseName || '',
      issuingOrganization: driver.issuingOrganization || '',
      certificateExpiry: formatDateForInput(driver.certificateExpiry) || '',
      paramedicTraining: driver.paramedicTraining || 'none',
      defensiveDrivingCertificate: driver.defensiveDrivingCertificate || 'no',
      communicationSkills: driver.communicationSkills || ''
    });
  };

  const handleSaveDriver = async () => {
    try {
      if (isAddingDriver) {
        // Add new driver
        const response = await ambulanceAPI.addDriver(editFormData);
        if (response.success) {
          setDrivers(response.ambulance.drivers || []);
          setAmbulanceData(response.ambulance);
          alert('Driver added successfully!');
        }
      } else {
        // Update existing driver
        const response = await ambulanceAPI.updateDriver(selectedDriverId, editFormData);
        if (response.success) {
          setDrivers(response.ambulance.drivers || []);
          setAmbulanceData(response.ambulance);
          alert('Driver updated successfully!');
        }
      }
      handleCancelEdit();
    } catch (error) {
      console.error('Save driver error:', error);
      alert(error.response?.data?.message || 'Failed to save driver');
    }
  };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('Are you sure you want to delete this driver profile?')) return;
    
    try {
      const response = await ambulanceAPI.deleteDriver(driverId);
      if (response.success) {
        setDrivers(response.ambulance.drivers || []);
        setAmbulanceData(response.ambulance);
        alert('Driver deleted successfully!');
      }
    } catch (error) {
      console.error('Delete driver error:', error);
      alert(error.response?.data?.message || 'Failed to delete driver');
    }
  };

  // ============ VEHICLE CRUD HANDLERS ============
  const handleAddNewVehicle = () => {
    setIsAddingVehicle(true);
    setIsEditingVehicle(true);
    setSelectedVehicleId(null);
    setEditFormData({
      vehicleType: 'bls',
      vehicleRegistrationNumber: '',
      ownershipType: 'owned',
      hasStretcher: false,
      hasOxygenCylinder: false,
      acAvailable: false
    });
  };

  const handleEditVehicle = (vehicle) => {
    setIsEditingVehicle(true);
    setIsAddingVehicle(false);
    setSelectedVehicleId(vehicle._id);
    setEditFormData({
      // Vehicle Details
      vehicleType: vehicle.vehicleType || 'bls',
      vehicleRegistrationNumber: vehicle.vehicleRegistrationNumber || '',
      vehicleMake: vehicle.vehicleMake || '',
      vehicleModel: vehicle.vehicleModel || '',
      manufacturingYear: vehicle.manufacturingYear || '',
      vehicleColor: vehicle.vehicleColor || '',
      chassisNumber: vehicle.chassisNumber || '',
      engineNumber: vehicle.engineNumber || '',
      ownershipType: vehicle.ownershipType || 'owned',
      commercialPermitNumber: vehicle.commercialPermitNumber || '',
      ownerName: vehicle.ownerName || '',
      seatingCapacity: vehicle.seatingCapacity || '',
      stretcherCapacity: vehicle.stretcherCapacity || '',
      acAvailable: vehicle.acAvailable || false,
      oxygenCylinder: vehicle.oxygenCylinder || false,
      ventilatorAvailable: vehicle.ventilatorAvailable || false,
      // Documents
      insurancePolicyNumber: vehicle.insurancePolicyNumber || '',
      insuranceCompany: vehicle.insuranceCompany || '',
      insuranceExpiryDate: formatDateForInput(vehicle.insuranceExpiryDate) || '',
      pucCertificateNumber: vehicle.pucCertificateNumber || '',
      pucValidUntil: formatDateForInput(vehicle.pucValidUntil) || '',
      // Equipment
      hasStretcher: vehicle.hasStretcher || false,
      stretcherType: vehicle.stretcherType || '',
      stretcherQuantity: vehicle.stretcherQuantity || '',
      stretcherCondition: vehicle.stretcherCondition || '',
      stretcherLastMaintenance: formatDateForInput(vehicle.stretcherLastMaintenance) || '',
      hasOxygenCylinder: vehicle.hasOxygenCylinder || false,
      oxygenQuantity: vehicle.oxygenQuantity || '',
      oxygenCapacity: vehicle.oxygenCapacity || '',
      oxygenLastRefill: formatDateForInput(vehicle.oxygenLastRefill) || '',
      oxygenRegulatorCondition: vehicle.oxygenRegulatorCondition || '',
      hasAmbuBag: vehicle.hasAmbuBag || false,
      ambuBagAdultQty: vehicle.ambuBagAdultQty || '',
      ambuBagPediatricQty: vehicle.ambuBagPediatricQty || '',
      ambuBagCondition: vehicle.ambuBagCondition || '',
      hasSuctionMachine: vehicle.hasSuctionMachine || false,
      suctionQuantity: vehicle.suctionQuantity || '',
      suctionStatus: vehicle.suctionStatus || '',
      suctionLastMaintenance: formatDateForInput(vehicle.suctionLastMaintenance) || '',
      hasBPApparatus: vehicle.hasBPApparatus || false,
      hasPulseOximeter: vehicle.hasPulseOximeter || false,
      hasGlucometer: vehicle.hasGlucometer || false,
      hasThermometer: vehicle.hasThermometer || false,
      hasSplints: vehicle.hasSplints || false,
      hasCervicalCollar: vehicle.hasCervicalCollar || false,
      hasImmobilizationBoard: vehicle.hasImmobilizationBoard || false,
      hasWoundDressings: vehicle.hasWoundDressings || false,
      hasIVSets: vehicle.hasIVSets || false,
      hasCannulas: vehicle.hasCannulas || false,
      hasSyringes: vehicle.hasSyringes || false,
      medicalSuppliesExpiryDate: formatDateForInput(vehicle.medicalSuppliesExpiryDate) || '',
      hasEmergencyDrugsKit: vehicle.hasEmergencyDrugsKit || false,
      emergencyDrugsList: vehicle.emergencyDrugsList || '',
      emergencyDrugsExpiry: formatDateForInput(vehicle.emergencyDrugsExpiry) || '',
      hasFireExtinguisher: vehicle.hasFireExtinguisher || false,
      hasFirstAidBox: vehicle.hasFirstAidBox || false,
      hasSurgicalMasks: vehicle.hasSurgicalMasks || false,
      hasGloves: vehicle.hasGloves || false,
      hasDisinfectant: vehicle.hasDisinfectant || false,
      hasHandSanitizer: vehicle.hasHandSanitizer || false
    });
  };

  const handleSaveVehicle = async () => {
    try {
      if (isAddingVehicle) {
        // Add new vehicle
        const response = await ambulanceAPI.addVehicle(editFormData);
        if (response.success) {
          setVehicles(response.ambulance.vehicles || []);
          setAmbulanceData(response.ambulance);
          alert('Vehicle added successfully!');
        }
      } else {
        // Update existing vehicle
        const response = await ambulanceAPI.updateVehicle(selectedVehicleId, editFormData);
        if (response.success) {
          setVehicles(response.ambulance.vehicles || []);
          setAmbulanceData(response.ambulance);
          alert('Vehicle updated successfully!');
        }
      }
      handleCancelEdit();
    } catch (error) {
      console.error('Save vehicle error:', error);
      alert(error.response?.data?.message || 'Failed to save vehicle');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle profile?')) return;
    
    try {
      const response = await ambulanceAPI.deleteVehicle(vehicleId);
      if (response.success) {
        setVehicles(response.ambulance.vehicles || []);
        setAmbulanceData(response.ambulance);
        alert('Vehicle deleted successfully!');
      }
    } catch (error) {
      console.error('Delete vehicle error:', error);
      alert(error.response?.data||message || 'Failed to delete vehicle');
    }
  };

  // ============ FILE UPLOAD HANDLER ============
  const handleFileUpload = async (e, fieldName, docType = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    
    try {
      const response = await ambulanceAPI.uploadFile(file, fieldName, docType);
      
      if (response.success) {
        setAmbulanceData(response.ambulance);
        localStorage.setItem('ambulanceData', JSON.stringify(response.ambulance));
        alert('File uploaded successfully!');
        
        // Refresh documents if docType was provided
        if (docType) {
          const docsResponse = await ambulanceAPI.getDocuments();
          if (docsResponse.success) {
            setDocuments(docsResponse.documents);
          }
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
      alert('No document available');
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await ambulanceAPI.deleteDocument(docId);
      
      if (response.success) {
        setAmbulanceData(response.ambulance);
        localStorage.setItem('ambulanceData', JSON.stringify(response.ambulance));
        
        const docsResponse = await ambulanceAPI.getDocuments();
        if (docsResponse.success) {
          setDocuments(docsResponse.documents);
        }
        
        alert('Document deleted successfully!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete document');
    }
  };

  // ============ LEGACY HANDLERS (for compatibility) ============
  const handleEditAccount = () => handleEditSection('account');
  // handleEditDriver removed - now uses CRUD handler for driver profiles

  const handleSaveEdit = (section) => handleSaveSection(section);

  // ============ TOGGLE EXPANDED VIEW ============
  const toggleDriverExpanded = (driverId) => {
    setExpandedDrivers(prev => ({
      ...prev,
      [driverId]: !prev[driverId]
    }));
  };

  const toggleVehicleExpanded = (vehicleId) => {
    setExpandedVehicles(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'account', icon: '👤', label: 'Account Details' },
    { id: 'driver', icon: '🚗', label: 'Driver Management' }, // Merged: Driver + KYC + Qualifications
    { id: 'vehicle', icon: '🚑', label: 'Vehicle Management' }, // Merged: Vehicle + Documents + Equipment
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
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>Loading Dashboard</h2>
        <p>Please wait while we fetch your data...</p>
      </div>
    );
  }

  if (!currentUser || !ambulanceData) {
    return (
      <div className="no-data-screen">
        <h2>📋 No Data Available</h2>
        <p>Please complete your registration first to access the dashboard.</p>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/ambulance-registration')}
        >
          Go to Registration
        </button>
      </div>
    );
  }

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
              <img src="/images/cosco.png" alt="logo" />

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
            <p>Welcome, {ambulanceData?.serviceName || ambulanceData?.contactPerson || 'Provider'}</p>
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

          {/* Account Details Section */}
          {activeSection === 'account' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>👤 Account Details</h2>
                <p>Basic sign-in and business information</p>
              </div>

              {!isEditingAccount ? (
                <>
                  <div className="info-display">
                    <div className="info-row">
                      <label>Service Name:</label>
                      <span>{ambulanceData.serviceName || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Primary Contact Person:</label>
                      <span>{ambulanceData.contactPerson || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Mobile Number:</label>
                      <span>{ambulanceData.mobile || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Email Address:</label>
                      <span>{ambulanceData.email || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Business Type:</label>
                      <span>{ambulanceData.businessType || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Service Area:</label>
                      <span>{ambulanceData.serviceArea || 'Not set'}</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={handleEditAccount}>✏️ Edit Details</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Service Name *</label>
                      <input
                        type="text"
                        value={editFormData.serviceName || ''}
                        onChange={(e) => handleInputChange('serviceName', e.target.value)}
                        placeholder="Enter service name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Primary Contact Person *</label>
                      <input
                        type="text"
                        value={editFormData.contactPerson || ''}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        placeholder="Enter contact person name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        value={editFormData.mobile || ''}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        placeholder="Enter mobile number"
                        maxLength="10"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="form-group">
                      <label>Business Type *</label>
                      <select
                        value={editFormData.businessType || ''}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                      >
                        <option value="">Select type</option>
                        <option value="proprietorship">Proprietorship</option>
                        <option value="pvt-ltd">Private Limited</option>
                        <option value="ngo">NGO</option>
                        <option value="hospital-owned">Hospital-owned</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Service Area *</label>
                      <input
                        type="text"
                        value={editFormData.serviceArea || ''}
                        onChange={(e) => handleInputChange('serviceArea', e.target.value)}
                        placeholder="Enter service area"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveSection('account')}>
                      💾 Save Changes
                    </button>
                    <button className="btn-secondary" onClick={handleCancelEdit}>
                      ❌ Cancel
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Driver Details Section */}
          {/* Driver Details Section - MERGED WITH KYC & QUALIFICATIONS */}
          {activeSection === 'driver' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🚗 Driver Management</h2>
                <p id='ph'>Driver profiles with complete information (Personal + KYC + Qualifications)</p>
                {!isEditingDriver && (
                  <button className="btn-primary" onClick={handleAddNewDriver}>
                    ➕ Add New Driver
                  </button>
                )}
              </div>

              {!isEditingDriver ? (
                <>
                  {drivers.length === 0 ? (
                    <div className="empty-state">
                      <p>No drivers added yet. Click "Add New Driver" to get started.</p>
                    </div>
                  ) : (
                    <div className="profiles-list">
                      {drivers.map((driver, index) => (
                        <div key={driver._id} className="profile-card">
                          <div className="profile-header">
                            <h3>Driver #{index + 1}: {driver.driverName}</h3>
                            <div className="profile-actions">
                              <button className="btn-view-details" onClick={() => toggleDriverExpanded(driver._id)}>
                                {expandedDrivers[driver._id] ? '👁️ Hide Details' : '👁️ View Details'}
                              </button>
                              <button className="btn-edit" onClick={() => handleEditDriver(driver)}>✏️ Edit</button>
                              <button className="btn-delete" onClick={() => handleDeleteDriver(driver._id)}>🗑️ Delete</button>
                            </div>
                          </div>
                          
                          <div className="profile-body">
                            <div className="profile-section">
                              <h4>Personal Details</h4>
                              <div className="info-grid">
                                <div className="info-item">
                                  <span className="label">Mobile:</span>
                                  <span className="value">{driver.driverMobile || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Gender:</span>
                                  <span className="value">{driver.driverGender || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">DOB:</span>
                                  <span className="value">{driver.driverDOB ? new Date(driver.driverDOB).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Languages:</span>
                                  <span className="value">{driver.driverLanguages?.join(', ') || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {expandedDrivers[driver._id] && (
                              <>
                                <div className="profile-section">
                                  <h4>Complete Personal Information</h4>
                                  <div className="info-grid">
                                    <div className="info-item">
                                      <span className="label">Age:</span>
                                      <span className="value">{driver.driverAge || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Alternate Mobile:</span>
                                      <span className="value">{driver.driverAlternateMobile || 'N/A'}</span>
                                    </div>
                                    <div className="info-item full-width">
                                      <span className="label">Permanent Address:</span>
                                      <span className="value">{driver.driverPermanentAddress || 'N/A'}</span>
                                    </div>
                                    <div className="info-item full-width">
                                      <span className="label">Current Address:</span>
                                      <span className="value">{driver.driverCurrentAddress || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Experience:</span>
                                      <span className="value">{driver.driverExperience ? `${driver.driverExperience} years` : 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Qualification:</span>
                                      <span className="value">{driver.driverQualification || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="profile-section">
                                  <h4>Emergency Contact</h4>
                                  <div className="info-grid">
                                    <div className="info-item">
                                      <span className="label">Name:</span>
                                      <span className="value">{driver.emergencyContactName || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Relation:</span>
                                      <span className="value">{driver.emergencyContactRelation || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Phone:</span>
                                      <span className="value">{driver.emergencyContactPhone || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="profile-section">
                              <h4>KYC Documents</h4>
                              <div className="info-grid">
                                <div className="info-item">
                                  <span className="label">ID Type:</span>
                                  <span className="value">{driver.governmentIdType?.toUpperCase() || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Licence No:</span>
                                  <span className="value">{driver.drivingLicenceNumber || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Licence Expiry:</span>
                                  <span className="value">{driver.drivingLicenceExpiry ? new Date(driver.drivingLicenceExpiry).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">PAN:</span>
                                  <span className="value">{driver.panCard || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {expandedDrivers[driver._id] && (
                              <>
                                <div className="profile-section">
                                  <h4>Complete KYC Information</h4>
                                  <div className="info-grid">
                                    <div className="info-item">
                                      <span className="label">ID Number:</span>
                                      <span className="value">{driver.governmentIdNumber || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Licence Issue:</span>
                                      <span className="value">{driver.drivingLicenceIssue ? new Date(driver.drivingLicenceIssue).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">License Type:</span>
                                      <span className="value">{driver.licenseType || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Documents:</span>
                                      <span className="value">
                                        {driver.governmentIdFile && <button className="btn-view-doc" onClick={() => window.open(driver.governmentIdFile, '_blank')}>ID</button>}
                                        {driver.drivingLicenceFile && <button className="btn-view-doc" onClick={() => window.open(driver.drivingLicenceFile, '_blank')}>Licence</button>}
                                        {driver.panCardFile && <button className="btn-view-doc" onClick={() => window.open(driver.panCardFile, '_blank')}>PAN</button>}
                                        {driver.driverPhoto && <button className="btn-view-doc" onClick={() => window.open(driver.driverPhoto, '_blank')}>Photo</button>}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="profile-section">
                              <h4>Qualifications</h4>
                              <div className="info-grid">
                                <div className="info-item">
                                  <span className="label">Experience:</span>
                                  <span className="value">{driver.drivingExperienceYears ? `${driver.drivingExperienceYears} years` : 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Emergency Vehicle:</span>
                                  <span className="value">{driver.emergencyVehicleExperience === 'yes' ? '✅ Yes' : '❌ No'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Certification:</span>
                                  <span className="value">{driver.certificationType?.toUpperCase() || 'None'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Paramedic Training:</span>
                                  <span className="value">{driver.paramedicTraining || 'None'}</span>
                                </div>
                              </div>
                            </div>

                            {expandedDrivers[driver._id] && (
                              <>
                                <div className="profile-section">
                                  <h4>Complete Qualifications</h4>
                                  <div className="info-grid">
                                    <div className="info-item">
                                      <span className="label">Emergency Vehicle Years:</span>
                                      <span className="value">{driver.emergencyVehicleExperienceYears ? `${driver.emergencyVehicleExperienceYears} years` : 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Course Name:</span>
                                      <span className="value">{driver.certificationCourseName || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Issuing Organization:</span>
                                      <span className="value">{driver.issuingOrganization || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Certificate Expiry:</span>
                                      <span className="value">{driver.certificateExpiry ? new Date(driver.certificateExpiry).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Defensive Driving:</span>
                                      <span className="value">{driver.defensiveDrivingCertificate === 'yes' ? '✅ Yes' : '❌ No'}</span>
                                    </div>
                                    <div className="info-item full-width">
                                      <span className="label">Communication Skills:</span>
                                      <span className="value">{driver.communicationSkills || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="edit-form">
                  <h3>{isAddingDriver ? '➕ Add New Driver' : '✏️ Edit Driver Profile'}</h3>
                  
                  {/* Personal Details */}
                  <div className="form-section">
                    <h4>Personal Details</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Driver Full Name *</label>
                        <input type="text" value={editFormData.driverName || ''} onChange={(e) => handleInputChange('driverName', e.target.value)} placeholder="Enter driver name" required />
                      </div>
                      <div className="form-group">
                        <label>Date of Birth *</label>
                        <input type="date" value={editFormData.driverDOB || ''} onChange={(e) => handleInputChange('driverDOB', e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Age</label>
                        <input type="number" value={editFormData.driverAge || ''} onChange={(e) => handleInputChange('driverAge', e.target.value)} placeholder="Age" />
                      </div>
                      <div className="form-group">
                        <label>Gender *</label>
                        <select value={editFormData.driverGender || 'Male'} onChange={(e) => handleInputChange('driverGender', e.target.value)} required>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Mobile Number *</label>
                        <input type="tel" value={editFormData.driverMobile || ''} onChange={(e) => handleInputChange('driverMobile', e.target.value)} placeholder="10-digit mobile" maxLength="10" required />
                      </div>
                      <div className="form-group">
                        <label>Alternate Phone</label>
                        <input type="tel" value={editFormData.driverAlternateMobile || ''} onChange={(e) => handleInputChange('driverAlternateMobile', e.target.value)} placeholder="Alternate phone" maxLength="10" />
                      </div>
                      <div className="form-group full-width">
                        <label>Permanent Address *</label>
                        <textarea rows="2" value={editFormData.driverPermanentAddress || ''} onChange={(e) => handleInputChange('driverPermanentAddress', e.target.value)} placeholder="Enter permanent address" required></textarea>
                      </div>
                      <div className="form-group full-width">
                        <label>Current Address</label>
                        <textarea rows="2" value={editFormData.driverCurrentAddress || ''} onChange={(e) => handleInputChange('driverCurrentAddress', e.target.value)} placeholder="Enter current address"></textarea>
                      </div>
                      <div className="form-group">
                        <label>Languages Spoken</label>
                        <input type="text" value={editFormData.driverLanguages?.join(', ') || ''} onChange={(e) => handleInputChange('driverLanguages', e.target.value.split(',').map(l => l.trim()))} placeholder="English, Hindi, Telugu" />
                      </div>
                      <div className="form-group">
                        <label>Driver Experience (years)</label>
                        <input type="number" value={editFormData.driverExperience || ''} onChange={(e) => handleInputChange('driverExperience', e.target.value)} placeholder="Years" />
                      </div>
                      <div className="form-group">
                        <label>Qualification</label>
                        <input type="text" value={editFormData.driverQualification || ''} onChange={(e) => handleInputChange('driverQualification', e.target.value)} placeholder="Educational qualification" />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="form-section">
                    <h4>Emergency Contact</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Contact Name *</label>
                        <input type="text" value={editFormData.emergencyContactName || ''} onChange={(e) => handleInputChange('emergencyContactName', e.target.value)} placeholder="Emergency contact name" required />
                      </div>
                      <div className="form-group">
                        <label>Relation *</label>
                        <input type="text" value={editFormData.emergencyContactRelation || ''} onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)} placeholder="Relation" required />
                      </div>
                      <div className="form-group">
                        <label>Contact Phone *</label>
                        <input type="tel" value={editFormData.emergencyContactPhone || ''} onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)} placeholder="Emergency phone" maxLength="10" required />
                      </div>
                    </div>
                  </div>

                  {/* KYC Documents */}
                  <div className="form-section">
                    <h4>KYC Documents</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Government ID Type *</label>
                        <select value={editFormData.governmentIdType || 'aadhaar'} onChange={(e) => handleInputChange('governmentIdType', e.target.value)} required>
                          <option value="aadhaar">Aadhaar Card</option>
                          <option value="passport">Passport</option>
                          <option value="driving-licence">Driving Licence</option>
                          <option value="voter-id">Voter ID</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>ID Number *</label>
                        <input type="text" value={editFormData.governmentIdNumber || ''} onChange={(e) => handleInputChange('governmentIdNumber', e.target.value)} placeholder="ID number" required />
                      </div>
                      <div className="form-group">
                        <label>Driving Licence Number *</label>
                        <input type="text" value={editFormData.drivingLicenceNumber || ''} onChange={(e) => handleInputChange('drivingLicenceNumber', e.target.value)} placeholder="Licence number" required />
                      </div>
                      <div className="form-group">
                        <label>Licence Issue Date</label>
                        <input type="date" value={editFormData.drivingLicenceIssue || ''} onChange={(e) => handleInputChange('drivingLicenceIssue', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Licence Expiry Date *</label>
                        <input type="date" value={editFormData.drivingLicenceExpiry || ''} onChange={(e) => handleInputChange('drivingLicenceExpiry', e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Licence Type</label>
                        <input type="text" value={editFormData.licenseType || ''} onChange={(e) => handleInputChange('licenseType', e.target.value)} placeholder="Light/Heavy" />
                      </div>
                      <div className="form-group">
                        <label>PAN Card Number</label>
                        <input type="text" value={editFormData.panCard || ''} onChange={(e) => handleInputChange('panCard', e.target.value)} placeholder="PAN number" maxLength="10" />
                      </div>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="form-section">
                    <h4>Qualifications & Certifications</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Driving Experience (Years) *</label>
                        <input type="number" value={editFormData.drivingExperienceYears || ''} onChange={(e) => handleInputChange('drivingExperienceYears', e.target.value)} placeholder="Years" required />
                      </div>
                      <div className="form-group">
                        <label>Emergency Vehicle Experience *</label>
                        <select value={editFormData.emergencyVehicleExperience || 'no'} onChange={(e) => handleInputChange('emergencyVehicleExperience', e.target.value)} required>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      {editFormData.emergencyVehicleExperience === 'yes' && (
                        <div className="form-group">
                          <label>Emergency Vehicle Experience (Years)</label>
                          <input type="number" value={editFormData.emergencyVehicleExperienceYears || ''} onChange={(e) => handleInputChange('emergencyVehicleExperienceYears', e.target.value)} placeholder="Years" />
                        </div>
                      )}
                      <div className="form-group">
                        <label>Certification Type</label>
                        <select value={editFormData.certificationType || ''} onChange={(e) => handleInputChange('certificationType', e.target.value)}>
                          <option value="">No Certification</option>
                          <option value="first-aid">First Aid</option>
                          <option value="bls">BLS (Basic Life Support)</option>
                          <option value="cpr">CPR</option>
                          <option value="multiple">Multiple Certifications</option>
                        </select>
                      </div>
                      {editFormData.certificationType && (
                        <>
                          <div className="form-group">
                            <label>Course Name</label>
                            <input type="text" value={editFormData.certificationCourseName || ''} onChange={(e) => handleInputChange('certificationCourseName', e.target.value)} placeholder="Course name" />
                          </div>
                          <div className="form-group">
                            <label>Issuing Organization</label>
                            <input type="text" value={editFormData.issuingOrganization || ''} onChange={(e) => handleInputChange('issuingOrganization', e.target.value)} placeholder="Organization" />
                          </div>
                          <div className="form-group">
                            <label>Certificate Expiry</label>
                            <input type="date" value={editFormData.certificateExpiry || ''} onChange={(e) => handleInputChange('certificateExpiry', e.target.value)} />
                          </div>
                        </>
                      )}
                      <div className="form-group">
                        <label>Paramedic Training</label>
                        <select value={editFormData.paramedicTraining || 'none'} onChange={(e) => handleInputChange('paramedicTraining', e.target.value)}>
                          <option value="none">None</option>
                          <option value="basic-emt">Basic EMT</option>
                          <option value="advanced-emt">Advanced EMT</option>
                          <option value="paramedic">Paramedic</option>
                          <option value="nursing">Nursing</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Defensive Driving Certificate</label>
                        <select value={editFormData.defensiveDrivingCertificate || 'no'} onChange={(e) => handleInputChange('defensiveDrivingCertificate', e.target.value)}>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label>Communication Skills</label>
                        <textarea rows="3" value={editFormData.communicationSkills || ''} onChange={(e) => handleInputChange('communicationSkills', e.target.value)} placeholder="Describe communication skills"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSaveDriver}>
                      💾 {isAddingDriver ? 'Add Driver' : 'Update Driver'}
                    </button>
                    <button className="btn-cancel" onClick={handleCancelEdit}>
                      ✖ Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* KYC Documents Section - NOW MERGED INTO DRIVER */}
          {activeSection === 'kyc' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🆔 KYC Documents</h2>
                <p className="merged-notice">✨ KYC documents are now part of Driver Management. Please go to Driver Details section.</p>
              </div>
              <div className="info-box">
                <h4>📌 Important Notice</h4>
                <p>KYC documents have been merged into the <strong>Driver Details</strong> section for better organization. All your driver KYC information can be managed there.</p>
                <button className="btn-primary" onClick={() => setActiveSection('driver')}>Go to Driver Management</button>
              </div>
            </section>
          )}

          {/* Qualifications Section - NOW MERGED INTO DRIVER */}
          {activeSection === 'qualifications' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📜 Qualifications</h2>
                <p className="merged-notice">✨ Qualifications are now part of Driver Management. Please go to Driver Details section.</p>
              </div>
              <div className="info-box">
                <h4>📌 Important Notice</h4>
                <p>Driver qualifications and certifications have been merged into the <strong>Driver Details</strong> section for better organization. All qualification information can be managed there.</p>
                <button className="btn-primary" onClick={() => setActiveSection('driver')}>Go to Driver Management</button>
              </div>
            </section>
          )}

          {/* KYC Documents Section (OLD - KEEPING FOR REFERENCE) */}
          {activeSection === 'kyc-old' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🆔 KYC Documents</h2>
                <p>Identity verification and legal documents</p>
              </div>

              {!isEditingKYC ? (
                <>
                  <div className="info-display">
                    <div className="info-row">
                      <label>Government ID Type:</label>
                      <span>{ambulanceData.governmentIdType || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Government ID Number:</label>
                      <span>{ambulanceData.governmentIdNumber || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Government ID File:</label>
                      <span>
                        {ambulanceData.governmentIdFile ? (
                          <button className="btn-view" onClick={() => handleViewDocument(ambulanceData.governmentIdFile)}>
                            View Document
                          </button>
                        ) : (
                          'Not uploaded'
                        )}
                      </span>
                    </div>
                    <div className="info-row">
                      <label>Driving Licence Number:</label>
                      <span>{ambulanceData.drivingLicenceNumber || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Licence Issue Date:</label>
                      <span>{ambulanceData.drivingLicenceIssue ? new Date(ambulanceData.drivingLicenceIssue).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Licence Expiry Date:</label>
                      <span>{ambulanceData.drivingLicenceExpiry ? new Date(ambulanceData.drivingLicenceExpiry).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Driving Licence File:</label>
                      <span>
                        {ambulanceData.drivingLicenceFile ? (
                          <button className="btn-view" onClick={() => handleViewDocument(ambulanceData.drivingLicenceFile)}>
                            View Document
                          </button>
                        ) : (
                          'Not uploaded'
                        )}
                      </span>
                    </div>
                    <div className="info-row">
                      <label>PAN Card Number:</label>
                      <span>{ambulanceData.panCard || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>PAN Card File:</label>
                      <span>
                        {ambulanceData.panCardFile ? (
                          <button className="btn-view" onClick={() => handleViewDocument(ambulanceData.panCardFile)}>
                            View Document
                          </button>
                        ) : (
                          'Not uploaded'
                        )}
                      </span>
                    </div>
                    <div className="info-row">
                      <label>Police Verification:</label>
                      <span>
                        {ambulanceData.policeVerification ? (
                          <button className="btn-view" onClick={() => handleViewDocument(ambulanceData.policeVerification)}>
                            View Document
                          </button>
                        ) : (
                          'Not uploaded'
                        )}
                      </span>
                    </div>
                    <div className="info-row">
                      <label>Medical Certificate:</label>
                      <span>
                        {ambulanceData.medicalCertificate ? (
                          <button className="btn-view" onClick={() => handleViewDocument(ambulanceData.medicalCertificate)}>
                            View Document
                          </button>
                        ) : (
                          'Not uploaded'
                        )}
                      </span>
                    </div>
                    <div className="info-row">
                      <label>Driver Passport Photo:</label>
                      <span>
                        {ambulanceData.driverPassportPhoto ? (
                          <button className="btn-view" onClick={() => handleViewDocument(ambulanceData.driverPassportPhoto)}>
                            View Photo
                          </button>
                        ) : (
                          'Not uploaded'
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEditSection('kyc')}>Edit Documents</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Government ID Type *</label>
                      <select
                        value={editFormData.governmentIdType || ''}
                        onChange={(e) => handleInputChange('governmentIdType', e.target.value)}
                      >
                        <option value="">Select ID type</option>
                        <option value="Aadhaar">Aadhaar Card</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Passport">Passport</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Government ID Number *</label>
                      <input
                        type="text"
                        value={editFormData.governmentIdNumber || ''}
                        onChange={(e) => handleInputChange('governmentIdNumber', e.target.value)}
                        placeholder="Enter ID number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Government ID Document</label>
                      <div className="file-upload-wrapper">
                        <label className="file-upload-button">
                          {uploadingFile ? 'Uploading...' : 'Upload Document'}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'governmentIdFile')}
                            disabled={uploadingFile}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {ambulanceData.governmentIdFile && (
                          <button 
                            type="button" 
                            className="btn-view"
                            onClick={() => handleViewDocument(ambulanceData.governmentIdFile)}
                          >
                            View Current
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Driving Licence Number *</label>
                      <input
                        type="text"
                        value={editFormData.drivingLicenceNumber || ''}
                        onChange={(e) => handleInputChange('drivingLicenceNumber', e.target.value)}
                        placeholder="Enter licence number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Licence Issue Date</label>
                      <input
                        type="date"
                        value={editFormData.drivingLicenceIssue ? new Date(editFormData.drivingLicenceIssue).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('drivingLicenceIssue', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Licence Expiry Date</label>
                      <input
                        type="date"
                        value={editFormData.drivingLicenceExpiry ? new Date(editFormData.drivingLicenceExpiry).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('drivingLicenceExpiry', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Driving Licence Document</label>
                      <div className="file-upload-wrapper">
                        <label className="file-upload-button">
                          {uploadingFile ? 'Uploading...' : 'Upload Licence'}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'drivingLicenceFile')}
                            disabled={uploadingFile}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {ambulanceData.drivingLicenceFile && (
                          <button 
                            type="button" 
                            className="btn-view"
                            onClick={() => handleViewDocument(ambulanceData.drivingLicenceFile)}
                          >
                            View Current
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>PAN Card Number</label>
                      <input
                        type="text"
                        value={editFormData.panCard || ''}
                        onChange={(e) => handleInputChange('panCard', e.target.value)}
                        placeholder="Enter PAN number"
                      />
                    </div>
                    <div className="form-group">
                      <label>PAN Card Document</label>
                      <div className="file-upload-wrapper">
                        <label className="file-upload-button">
                          {uploadingFile ? 'Uploading...' : 'Upload PAN Card'}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'panCardFile')}
                            disabled={uploadingFile}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {ambulanceData.panCardFile && (
                          <button 
                            type="button" 
                            className="btn-view"
                            onClick={() => handleViewDocument(ambulanceData.panCardFile)}
                          >
                            View Current
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Police Verification</label>
                      <div className="file-upload-wrapper">
                        <label className="file-upload-button">
                          {uploadingFile ? 'Uploading...' : 'Upload Certificate'}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'policeVerification')}
                            disabled={uploadingFile}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {ambulanceData.policeVerification && (
                          <button 
                            type="button" 
                            className="btn-view"
                            onClick={() => handleViewDocument(ambulanceData.policeVerification)}
                          >
                            View Current
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Medical Certificate</label>
                      <div className="file-upload-wrapper">
                        <label className="file-upload-button">
                          {uploadingFile ? 'Uploading...' : 'Upload Certificate'}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'medicalCertificate')}
                            disabled={uploadingFile}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {ambulanceData.medicalCertificate && (
                          <button 
                            type="button" 
                            className="btn-view"
                            onClick={() => handleViewDocument(ambulanceData.medicalCertificate)}
                          >
                            View Current
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Driver Passport Photo</label>
                      <div className="file-upload-wrapper">
                        <label className="file-upload-button">
                          {uploadingFile ? 'Uploading...' : 'Upload Photo'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'driverPassportPhoto')}
                            disabled={uploadingFile}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {ambulanceData.driverPassportPhoto && (
                          <button 
                            type="button" 
                            className="btn-view"
                            onClick={() => handleViewDocument(ambulanceData.driverPassportPhoto)}
                          >
                            View Current
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveSection('kyc')}>Save Changes</button>
                    <button className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Driver Qualifications Section */}
          {activeSection === 'qualifications' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🎓 Driver Qualifications & Training</h2>
                <p>Professional certifications and training records</p>
              </div>

              {!isEditingQualifications ? (
                <>
                  <div className="info-display">
                    <div className="info-row">
                      <label>Driving Experience (Years):</label>
                      <span>{ambulanceData.drivingExperienceYears || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Emergency Vehicle Experience:</label>
                      <span>{ambulanceData.emergencyVehicleExperience || 'Not set'}</span>
                    </div>
                    {ambulanceData.emergencyVehicleExperience === 'yes' && (
                      <div className="info-row">
                        <label>Emergency Experience (Years):</label>
                        <span>{ambulanceData.emergencyVehicleExperienceYears || 'Not set'}</span>
                      </div>
                    )}
                    <div className="info-row">
                      <label>Certification Type:</label>
                      <span>{ambulanceData.certificationType || 'Not set'}</span>
                    </div>
                    {ambulanceData.certificationType && (
                      <>
                        <div className="info-row">
                          <label>Course Name:</label>
                          <span>{ambulanceData.certificationCourseName || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                          <label>Issuing Organization:</label>
                          <span>{ambulanceData.issuingOrganization || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                          <label>Certificate Expiry:</label>
                          <span>{ambulanceData.certificateExpiry ? new Date(ambulanceData.certificateExpiry).toLocaleDateString() : 'Not set'}</span>
                        </div>
                      </>
                    )}
                    <div className="info-row">
                      <label>Paramedic Training:</label>
                      <span>{ambulanceData.paramedicTraining || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Defensive Driving Certificate:</label>
                      <span>{ambulanceData.defensiveDrivingCertificate || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Communication Skills:</label>
                      <span>{ambulanceData.communicationSkills || 'Not set'}</span>
                    </div>
                  </div>

                  <div className="documents-section" style={{ marginTop: '20px' }}>
                    <h3>Uploaded Certificates</h3>
                    <div className="documents-grid">
                      {ambulanceData.certificationCertificateFile && (
                        <div className="document-item">
                          <span>🎓 Certification Certificate</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.certificationCertificateFile, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.defensiveDrivingCertificateFile && (
                        <div className="document-item">
                          <span>🚗 Defensive Driving Certificate</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.defensiveDrivingCertificateFile, '_blank')}>View</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEditSection('qualifications')}>✏️ Edit Qualifications</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Years of Driving Experience *</label>
                      <input 
                        type="number" 
                        value={editFormData.drivingExperienceYears || ''}
                        onChange={(e) => handleInputChange('drivingExperienceYears', e.target.value)}
                        placeholder="Total years of driving experience" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Ambulance/Emergency Vehicle Experience</label>
                      <select
                        value={editFormData.emergencyVehicleExperience || ''}
                        onChange={(e) => handleInputChange('emergencyVehicleExperience', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>

                    {editFormData.emergencyVehicleExperience === 'yes' && (
                      <div className="form-group">
                        <label>Emergency Vehicle Experience (Years)</label>
                        <input 
                          type="number" 
                          value={editFormData.emergencyVehicleExperienceYears || ''}
                          onChange={(e) => handleInputChange('emergencyVehicleExperienceYears', e.target.value)}
                          placeholder="Years of ambulance driving" 
                        />
                      </div>
                    )}

                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '15px' }}>First Aid & Medical Certifications</h3>
                    </div>

                    <div className="form-group">
                      <label>First-aid / BLS / CPR Certification</label>
                      <select
                        value={editFormData.certificationType || ''}
                        onChange={(e) => handleInputChange('certificationType', e.target.value)}
                      >
                        <option value="">Select certification</option>
                        <option value="first-aid">First Aid</option>
                        <option value="bls">Basic Life Support (BLS)</option>
                        <option value="cpr">CPR Certified</option>
                        <option value="multiple">Multiple Certifications</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Certification Course Name</label>
                      <input 
                        type="text" 
                        value={editFormData.certificationCourseName || ''}
                        onChange={(e) => handleInputChange('certificationCourseName', e.target.value)}
                        placeholder="e.g., BLS Provider Course" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Issuing Organization</label>
                      <input 
                        type="text" 
                        value={editFormData.issuingOrganization || ''}
                        onChange={(e) => handleInputChange('issuingOrganization', e.target.value)}
                        placeholder="e.g., American Heart Association" 
                      />
                    </div>

                    <div className="form-group">
                      <label>Certificate Expiry Date</label>
                      <input 
                        type="date" 
                        value={editFormData.certificateExpiry || ''}
                        onChange={(e) => handleInputChange('certificateExpiry', e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="certificationCertificateFile">Upload Certification Certificate</label>
                      <input 
                        type="file" 
                        id="certificationCertificateFile"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'certificationCertificateFile')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="certificationCertificateFile" className="file-upload-button">
                        📁 Choose File
                      </label>
                      <small>Upload scanned copy of certificate</small>
                    </div>

                    <div className="form-group full-width">
                      <label>Paramedic / EMT / Nursing Training</label>
                      <select
                        value={editFormData.paramedicTraining || ''}
                        onChange={(e) => handleInputChange('paramedicTraining', e.target.value)}
                      >
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
                      <select
                        value={editFormData.defensiveDrivingCertificate || ''}
                        onChange={(e) => handleInputChange('defensiveDrivingCertificate', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes, Certified</option>
                        <option value="no">Not Available</option>
                      </select>
                    </div>

                    {editFormData.defensiveDrivingCertificate === 'yes' && (
                      <div className="form-group file-upload-wrapper">
                        <label htmlFor="defensiveDrivingCertificateFile">Upload Defensive Driving Certificate</label>
                        <input 
                          type="file" 
                          id="defensiveDrivingCertificateFile"
                          accept=".pdf,.jpg,.jpeg,.png" 
                          onChange={(e) => handleFileUpload(e, 'defensiveDrivingCertificateFile')}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="defensiveDrivingCertificateFile" className="file-upload-button">
                          📁 Choose File
                        </label>
                      </div>
                    )}

                    <div className="form-group full-width">
                      <label>Language / Communication Skills</label>
                      <textarea 
                        rows="3" 
                        value={editFormData.communicationSkills || ''}
                        onChange={(e) => handleInputChange('communicationSkills', e.target.value)}
                        placeholder="Describe language proficiency and communication skills for patient handling..."
                      ></textarea>
                      <small>Important for patient interaction and emergency communication</small>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveSection('qualifications')}>💾 Save Qualifications</button>
                    <button className="btn-secondary" onClick={() => setIsEditingQualifications(false)}>❌ Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Vehicle Details Section */}
          {/* Vehicle Management Section - MERGED WITH DOCUMENTS & EQUIPMENT */}
          {activeSection === 'vehicle' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🚑 Vehicle Management</h2>
               <p id='ph'>Vehicle profiles with complete information (Basic + Documents + Equipment)</p>
                {!isEditingVehicle && (
                  <button className="btn-primary" onClick={handleAddNewVehicle}>
                    ➕ Add New Vehicle
                  </button>
                )}
              </div>

              {!isEditingVehicle ? (
                <>
                  {vehicles.length === 0 ? (
                    <div className="empty-state">
                      <p>No vehicles added yet. Click "Add New Vehicle" to get started.</p>
                    </div>
                  ) : (
                    <div className="profiles-list">
                      {vehicles.map((vehicle, index) => (
                        <div key={vehicle._id} className="profile-card">
                          <div className="profile-header">
                            <h3>Vehicle #{index + 1}: {vehicle.vehicleRegistrationNumber}</h3>
                            <div className="profile-actions">
                              <button className="btn-view-details" onClick={() => toggleVehicleExpanded(vehicle._id)}>
                                {expandedVehicles[vehicle._id] ? '👁️ Hide Details' : '👁️ View Details'}
                              </button>
                              <button className="btn-edit" onClick={() => handleEditVehicle(vehicle)}>✏️ Edit</button>
                              <button className="btn-delete" onClick={() => handleDeleteVehicle(vehicle._id)}>🗑️ Delete</button>
                            </div>
                          </div>
                          
                          <div className="profile-body">
                            <div className="profile-section">
                              <h4>Basic Details</h4>
                              <div className="info-grid">
                                <div className="info-item">
                                  <span className="label">Type:</span>
                                  <span className="value">{vehicle.vehicleType?.toUpperCase() || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Make/Model:</span>
                                  <span className="value">{vehicle.vehicleMake} {vehicle.vehicleModel}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Year:</span>
                                  <span className="value">{vehicle.manufacturingYear || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Ownership:</span>
                                  <span className="value">{vehicle.ownershipType || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {expandedVehicles[vehicle._id] && (
                              <>
                                <div className="profile-section">
                                  <h4>Complete Vehicle Information</h4>
                                  <div className="info-grid">
                                    <div className="info-item">
                                      <span className="label">Color:</span>
                                      <span className="value">{vehicle.vehicleColor || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Engine No:</span>
                                      <span className="value">{vehicle.engineNumber || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Chassis No:</span>
                                      <span className="value">{vehicle.chassisNumber || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Seating Capacity:</span>
                                      <span className="value">{vehicle.seatingCapacity || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Stretcher Capacity:</span>
                                      <span className="value">{vehicle.stretcherCapacity || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Owner Name:</span>
                                      <span className="value">{vehicle.ownerName || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="profile-section">
                              <h4>Documents</h4>
                              <div className="info-grid">
                                <div className="info-item">
                                  <span className="label">Insurance:</span>
                                  <span className="value">{vehicle.insurancePolicyNumber || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Insurance Expiry:</span>
                                  <span className="value">{vehicle.insuranceExpiryDate ? new Date(vehicle.insuranceExpiryDate).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">PUC Valid:</span>
                                  <span className="value">{vehicle.pucValidUntil ? new Date(vehicle.pucValidUntil).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Permit:</span>
                                  <span className="value">{vehicle.commercialPermitNumber || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {expandedVehicles[vehicle._id] && (
                              <>
                                <div className="profile-section">
                                  <h4>Complete Document Information</h4>
                                  <div className="info-grid">
                                    <div className="info-item">
                                      <span className="label">Insurance Company:</span>
                                      <span className="value">{vehicle.insuranceCompany || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">PUC Number:</span>
                                      <span className="value">{vehicle.pucCertificateNumber || 'N/A'}</span>
                                    </div>
                                    <div className="info-item full-width">
                                      <span className="label">Documents:</span>
                                      <span className="value">
                                        {vehicle.rcFront && <button className="btn-view-doc" onClick={() => window.open(vehicle.rcFront, '_blank')}>RC Front</button>}
                                        {vehicle.rcBack && <button className="btn-view-doc" onClick={() => window.open(vehicle.rcBack, '_blank')}>RC Back</button>}
                                        {vehicle.insuranceCopy && <button className="btn-view-doc" onClick={() => window.open(vehicle.insuranceCopy, '_blank')}>Insurance</button>}
                                        {vehicle.pucCertificate && <button className="btn-view-doc" onClick={() => window.open(vehicle.pucCertificate, '_blank')}>PUC</button>}
                                        {vehicle.fitnessCertificate && <button className="btn-view-doc" onClick={() => window.open(vehicle.fitnessCertificate, '_blank')}>Fitness</button>}
                                        {vehicle.roadPermit && <button className="btn-view-doc" onClick={() => window.open(vehicle.roadPermit, '_blank')}>Permit</button>}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="profile-section">
                              <h4>Equipment</h4>
                              <div className="info-grid">
                                <div className="info-item">
                                  <span className="label">Stretcher:</span>
                                  <span className="value">{vehicle.hasStretcher ? '✅ Yes' : '❌ No'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Oxygen:</span>
                                  <span className="value">{vehicle.hasOxygenCylinder ? `✅ ${vehicle.oxygenQuantity || 0}` : '❌ No'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Suction:</span>
                                  <span className="value">{vehicle.hasSuctionMachine ? '✅ Yes' : '❌ No'}</span>
                                </div>
                                <div className="info-item">
                                  <span className="label">Monitoring:</span>
                                  <span className="value">
                                    {[vehicle.hasBPApparatus && 'BP', vehicle.hasPulseOximeter && 'SpO2', vehicle.hasGlucometer && 'Glucose'].filter(Boolean).join(', ') || 'None'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {expandedVehicles[vehicle._id] && (
                              <>
                                <div className="profile-section">
                                  <h4>Complete Equipment Details</h4>
                                  <div className="info-grid">
                                    {vehicle.hasStretcher && (
                                      <>
                                        <div className="info-item">
                                          <span className="label">Stretcher Type:</span>
                                          <span className="value">{vehicle.stretcherType || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                          <span className="label">Stretcher Qty:</span>
                                          <span className="value">{vehicle.stretcherQuantity || 'N/A'}</span>
                                        </div>
                                      </>
                                    )}
                                    {vehicle.hasOxygenCylinder && (
                                      <>
                                        <div className="info-item">
                                          <span className="label">Oxygen Capacity:</span>
                                          <span className="value">{vehicle.oxygenCapacity || 'N/A'}</span>
                                        </div>
                                      </>
                                    )}
                                    <div className="info-item">
                                      <span className="label">Ambu Bag:</span>
                                      <span className="value">{vehicle.hasAmbuBag ? '✅ Yes' : '❌ No'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Thermometer:</span>
                                      <span className="value">{vehicle.hasThermometer ? '✅ Yes' : '❌ No'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Fire Extinguisher:</span>
                                      <span className="value">{vehicle.hasFireExtinguisher ? '✅ Yes' : '❌ No'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">First Aid Box:</span>
                                      <span className="value">{vehicle.hasFirstAidBox ? '✅ Yes' : '❌ No'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="label">Safety Kit:</span>
                                      <span className="value">
                                        {[vehicle.hasGloves && 'Gloves', vehicle.hasHandSanitizer && 'Sanitizer'].filter(Boolean).join(', ') || 'None'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="edit-form">
                  <h3>{isAddingVehicle ? '➕ Add New Vehicle' : '✏️ Edit Vehicle Profile'}</h3>
                  
                  {/* Basic Details */}
                  <div className="form-section">
                    <h4>Basic Details</h4>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Vehicle Type *</label>
                        <select value={editFormData.vehicleType || ''} onChange={(e) => handleInputChange('vehicleType', e.target.value)} required>
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
                        <label>Registration Number (RC) *</label>
                        <input type="text" value={editFormData.vehicleRegistrationNumber || ''} onChange={(e) => handleInputChange('vehicleRegistrationNumber', e.target.value)} placeholder="e.g., DL-01-AB-1234" required />
                      </div>
                      <div className="form-group">
                        <label>Vehicle Make *</label>
                        <input type="text" value={editFormData.vehicleMake || ''} onChange={(e) => handleInputChange('vehicleMake', e.target.value)} placeholder="e.g., Maruti, Tata" required />
                      </div>
                      <div className="form-group">
                        <label>Vehicle Model *</label>
                        <input type="text" value={editFormData.vehicleModel || ''} onChange={(e) => handleInputChange('vehicleModel', e.target.value)} placeholder="e.g., Eeco, Winger" required />
                      </div>
                      <div className="form-group">
                        <label>Manufacturing Year *</label>
                        <input type="number" value={editFormData.manufacturingYear || ''} onChange={(e) => handleInputChange('manufacturingYear', e.target.value)} min="1990" max="2026" required />
                      </div>
                      <div className="form-group">
                        <label>Seating Capacity</label>
                        <input type="number" value={editFormData.seatingCapacity || ''} onChange={(e) => handleInputChange('seatingCapacity', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Stretcher Capacity</label>
                        <input type="number" value={editFormData.stretcherCapacity || ''} onChange={(e) => handleInputChange('stretcherCapacity', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Ownership Type *</label>
                        <select value={editFormData.ownershipType || ''} onChange={(e) => handleInputChange('ownershipType', e.target.value)} required>
                          <option value="">Select</option>
                          <option value="owned">Owned</option>
                          <option value="leased">Leased</option>
                          <option value="rented">Rented</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Vehicle Color</label>
                        <input type="text" value={editFormData.vehicleColor || ''} onChange={(e) => handleInputChange('vehicleColor', e.target.value)} placeholder="White with Red Cross" />
                      </div>
                      <div className="form-group">
                        <label>Engine Number</label>
                        <input type="text" value={editFormData.engineNumber || ''} onChange={(e) => handleInputChange('engineNumber', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Chassis Number</label>
                        <input type="text" value={editFormData.chassisNumber || ''} onChange={(e) => handleInputChange('chassisNumber', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Commercial Permit Number</label>
                        <input type="text" value={editFormData.commercialPermitNumber || ''} onChange={(e) => handleInputChange('commercialPermitNumber', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="form-section">
                    <h4>Vehicle Documents</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>RC Front *</label>
                        <div className="file-upload-wrapper">
                          <label className="file-upload-button">
                            {uploadingFile ? 'Uploading...' : 'Upload RC Front'}
                            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'rcFront')} disabled={uploadingFile} style={{ display: 'none' }} />
                          </label>
                          {editFormData.rcFront && <button type="button" className="btn-view" onClick={() => window.open(editFormData.rcFront, '_blank')}>View</button>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>RC Back</label>
                        <div className="file-upload-wrapper">
                          <label className="file-upload-button">
                            {uploadingFile ? 'Uploading...' : 'Upload RC Back'}
                            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'rcBack')} disabled={uploadingFile} style={{ display: 'none' }} />
                          </label>
                          {editFormData.rcBack && <button type="button" className="btn-view" onClick={() => window.open(editFormData.rcBack, '_blank')}>View</button>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Insurance Policy Number *</label>
                        <input type="text" value={editFormData.insurancePolicyNumber || ''} onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Insurance Company *</label>
                        <input type="text" value={editFormData.insuranceCompany || ''} onChange={(e) => handleInputChange('insuranceCompany', e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Insurance Expiry Date *</label>
                        <input type="date" value={editFormData.insuranceExpiryDate || ''} onChange={(e) => handleInputChange('insuranceExpiryDate', e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Insurance Copy *</label>
                        <div className="file-upload-wrapper">
                          <label className="file-upload-button">
                            {uploadingFile ? 'Uploading...' : 'Upload Insurance'}
                            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'insuranceCopy')} disabled={uploadingFile} style={{ display: 'none' }} />
                          </label>
                          {editFormData.insuranceCopy && <button type="button" className="btn-view" onClick={() => window.open(editFormData.insuranceCopy, '_blank')}>View</button>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>PUC Certificate Number</label>
                        <input type="text" value={editFormData.pucCertificateNumber || ''} onChange={(e) => handleInputChange('pucCertificateNumber', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>PUC Valid Until</label>
                        <input type="date" value={editFormData.pucValidUntil || ''} onChange={(e) => handleInputChange('pucValidUntil', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>PUC Certificate</label>
                        <div className="file-upload-wrapper">
                          <label className="file-upload-button">
                            {uploadingFile ? 'Uploading...' : 'Upload PUC'}
                            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'pucCertificate')} disabled={uploadingFile} style={{ display: 'none' }} />
                          </label>
                          {editFormData.pucCertificate && <button type="button" className="btn-view" onClick={() => window.open(editFormData.pucCertificate, '_blank')}>View</button>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Fitness Certificate</label>
                        <div className="file-upload-wrapper">
                          <label className="file-upload-button">
                            {uploadingFile ? 'Uploading...' : 'Upload Fitness'}
                            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'fitnessCertificate')} disabled={uploadingFile} style={{ display: 'none' }} />
                          </label>
                          {editFormData.fitnessCertificate && <button type="button" className="btn-view" onClick={() => window.open(editFormData.fitnessCertificate, '_blank')}>View</button>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Road Permit</label>
                        <div className="file-upload-wrapper">
                          <label className="file-upload-button">
                            {uploadingFile ? 'Uploading...' : 'Upload Permit'}
                            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'roadPermit')} disabled={uploadingFile} style={{ display: 'none' }} />
                          </label>
                          {editFormData.roadPermit && <button type="button" className="btn-view" onClick={() => window.open(editFormData.roadPermit, '_blank')}>View</button>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Conversion Certificate</label>
                        <div className="file-upload-wrapper">
                          <label className="file-upload-button">
                            {uploadingFile ? 'Uploading...' : 'Upload'}
                            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'ambulanceConversionCertificate')} disabled={uploadingFile} style={{ display: 'none' }} />
                          </label>
                          {editFormData.ambulanceConversionCertificate && <button type="button" className="btn-view" onClick={() => window.open(editFormData.ambulanceConversionCertificate, '_blank')}>View</button>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="form-section">
                    <h4>Essential Equipment</h4>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasStretcher || false} onChange={(e) => handleInputChange('hasStretcher', e.target.checked)} />
                          <strong>Stretcher</strong>
                        </label>
                      </div>
                      {editFormData.hasStretcher && (
                        <>
                          <div className="form-group">
                            <label>Type</label>
                            <select value={editFormData.stretcherType || ''} onChange={(e) => handleInputChange('stretcherType', e.target.value)}>
                              <option value="">Select</option>
                              <option value="standard">Standard</option>
                              <option value="hydraulic">Hydraulic</option>
                              <option value="electric">Electric</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Quantity</label>
                            <input type="number" value={editFormData.stretcherQuantity || ''} onChange={(e) => handleInputChange('stretcherQuantity', e.target.value)} />
                          </div>
                        </>
                      )}
                      
                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasOxygenCylinder || false} onChange={(e) => handleInputChange('hasOxygenCylinder', e.target.checked)} />
                          <strong>Oxygen Cylinder</strong>
                        </label>
                      </div>
                      {editFormData.hasOxygenCylinder && (
                        <>
                          <div className="form-group">
                            <label>Quantity</label>
                            <input type="number" value={editFormData.oxygenQuantity || ''} onChange={(e) => handleInputChange('oxygenQuantity', e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Capacity</label>
                            <input type="text" value={editFormData.oxygenCapacity || ''} onChange={(e) => handleInputChange('oxygenCapacity', e.target.value)} placeholder="e.g., 10L" />
                          </div>
                        </>
                      )}
                      
                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasSuctionMachine || false} onChange={(e) => handleInputChange('hasSuctionMachine', e.target.checked)} />
                          <strong>Suction Machine</strong>
                        </label>
                      </div>
                      
                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasAmbuBag || false} onChange={(e) => handleInputChange('hasAmbuBag', e.target.checked)} />
                          <strong>Ambu Bag</strong>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring Equipment */}
                  <div className="form-section">
                    <h4>Monitoring Equipment</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasBPApparatus || false} onChange={(e) => handleInputChange('hasBPApparatus', e.target.checked)} />
                          BP Apparatus
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasPulseOximeter || false} onChange={(e) => handleInputChange('hasPulseOximeter', e.target.checked)} />
                          Pulse Oximeter
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasGlucometer || false} onChange={(e) => handleInputChange('hasGlucometer', e.target.checked)} />
                          Glucometer
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasThermometer || false} onChange={(e) => handleInputChange('hasThermometer', e.target.checked)} />
                          Thermometer
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Safety Equipment */}
                  <div className="form-section">
                    <h4>Safety Equipment</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasFireExtinguisher || false} onChange={(e) => handleInputChange('hasFireExtinguisher', e.target.checked)} />
                          Fire Extinguisher
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasFirstAidBox || false} onChange={(e) => handleInputChange('hasFirstAidBox', e.target.checked)} />
                          First Aid Box
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasGloves || false} onChange={(e) => handleInputChange('hasGloves', e.target.checked)} />
                          Gloves
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasHandSanitizer || false} onChange={(e) => handleInputChange('hasHandSanitizer', e.target.checked)} />
                          Hand Sanitizer
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSaveVehicle}>
                      💾 {isAddingVehicle ? 'Add Vehicle' : 'Update Vehicle'}
                    </button>
                    <button className="btn-cancel" onClick={handleCancelEdit}>
                      ✖ Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Vehicle Documents Section - NOW MERGED INTO VEHICLE */}
          {activeSection === 'documents' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📄 Vehicle Documents</h2>
                <p className="merged-notice">✨ Vehicle documents are now part of Vehicle Management. Please go to Vehicle Details section.</p>
              </div>
              <div className="info-box">
                <h4>📌 Important Notice</h4>
                <p>Vehicle documents (RC, Insurance, PUC, Permits) have been merged into the <strong>Vehicle Details</strong> section for better organization. All your vehicle documentation can be managed there.</p>
                <button className="btn-primary" onClick={() => setActiveSection('vehicle')}>Go to Vehicle Management</button>
              </div>
            </section>
          )}

          {/* Vehicle Documents Section (OLD - KEEPING FOR REFERENCE) */}
          {activeSection === 'documents-old' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📄 Vehicle Documents</h2>
                <p>Registration certificate, insurance, permits, and other legal documents</p>
              </div>

              {!isEditingVehicleDocuments ? (
                <>
                  <div className="info-display">
                    <div className="info-row">
                      <label>Insurance Policy Number:</label>
                      <span>{ambulanceData.insurancePolicyNumber || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Insurance Company:</label>
                      <span>{ambulanceData.insuranceCompany || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Insurance Expiry:</label>
                      <span>{ambulanceData.insuranceExpiryDate ? new Date(ambulanceData.insuranceExpiryDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>PUC Certificate Number:</label>
                      <span>{ambulanceData.pucCertificateNumber || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>PUC Valid Until:</label>
                      <span>{ambulanceData.pucValidUntil ? new Date(ambulanceData.pucValidUntil).toLocaleDateString() : 'Not set'}</span>
                    </div>
                  </div>

                  <div className="documents-section" style={{ marginTop: '20px' }}>
                    <h3>Uploaded Documents</h3>
                    <div className="documents-grid">
                      {ambulanceData.rcFront && (
                        <div className="document-item">
                          <span>📄 RC Front</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.rcFront, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.rcBack && (
                        <div className="document-item">
                          <span>📄 RC Back</span>
                          <button className="btn-view v2 " onClick={() => window.open(ambulanceData.rcBack, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.insuranceCopy && (
                        <div className="document-item">
                          <span>🛡️ Insurance Copy</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.insuranceCopy, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.pucCertificate && (
                        <div className="document-item">
                          <span>🌱 PUC Certificate</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.pucCertificate, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.fitnessCertificate && (
                        <div className="document-item">
                          <span>✅ Fitness Certificate</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.fitnessCertificate, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.roadPermit && (
                        <div className="document-item">
                          <span>🛣️ Road Permit</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.roadPermit, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.ambulanceConversionCertificate && (
                        <div className="document-item">
                          <span>🚑 Conversion Certificate</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.ambulanceConversionCertificate, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.manufacturerFitmentCertificate && (
                        <div className="document-item">
                          <span>🏭 Fitment Certificate</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.manufacturerFitmentCertificate, '_blank')}>View</button>
                        </div>
                      )}
                      {ambulanceData.invoicePurchaseBill && (
                        <div className="document-item">
                          <span>🧾 Invoice/Bill</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.invoicePurchaseBill, '_blank')}>View</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEditSection('vehicleDocuments')}>✏️ Edit Documents</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="rcFront">Registration Certificate (RC) - Front *</label>
                      <input 
                        type="file" 
                        id="rcFront"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'rcFront')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="rcFront" className="file-upload-button">📁 Choose File</label>
                      <small>Upload front side of RC</small>
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="rcBack">Registration Certificate (RC) - Back</label>
                      <input 
                        type="file" 
                        id="rcBack"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'rcBack')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="rcBack" className="file-upload-button">📁 Choose File</label>
                      <small>Upload back side of RC (if applicable)</small>
                    </div>

                    <div className="form-group">
                      <label>Insurance Policy Number *</label>
                      <input 
                        type="text" 
                        value={editFormData.insurancePolicyNumber || ''}
                        onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                        placeholder="Policy number" 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Insurance Company *</label>
                      <input 
                        type="text" 
                        value={editFormData.insuranceCompany || ''}
                        onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                        placeholder="Insurer name" 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Insurance Expiry Date *</label>
                      <input 
                        type="date" 
                        value={editFormData.insuranceExpiryDate || ''}
                        onChange={(e) => handleInputChange('insuranceExpiryDate', e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="insuranceCopy">Upload Insurance Copy *</label>
                      <input 
                        type="file" 
                        id="insuranceCopy"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'insuranceCopy')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="insuranceCopy" className="file-upload-button">📁 Choose File</label>
                    </div>

                    <div className="form-group">
                      <label>PUC Certificate Number</label>
                      <input 
                        type="text" 
                        value={editFormData.pucCertificateNumber || ''}
                        onChange={(e) => handleInputChange('pucCertificateNumber', e.target.value)}
                        placeholder="Pollution certificate number" 
                      />
                    </div>

                    <div className="form-group">
                      <label>PUC Valid Until</label>
                      <input 
                        type="date" 
                        value={editFormData.pucValidUntil || ''}
                        onChange={(e) => handleInputChange('pucValidUntil', e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="pucCertificate">Upload PUC Certificate</label>
                      <input 
                        type="file" 
                        id="pucCertificate"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'pucCertificate')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="pucCertificate" className="file-upload-button">📁 Choose File</label>
                      <small>Pollution Under Control certificate</small>
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="fitnessCertificate">Fitness Certificate</label>
                      <input 
                        type="file" 
                        id="fitnessCertificate"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'fitnessCertificate')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="fitnessCertificate" className="file-upload-button">📁 Choose File</label>
                      <small>Required for commercial vehicles in some states</small>
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="roadPermit">Road Permit / Transport Permit</label>
                      <input 
                        type="file" 
                        id="roadPermit"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'roadPermit')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="roadPermit" className="file-upload-button">📁 Choose File</label>
                      <small>If applicable for your state/region</small>
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="ambulanceConversionCertificate">Ambulance Conversion Certificate</label>
                      <input 
                        type="file" 
                        id="ambulanceConversionCertificate"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'ambulanceConversionCertificate')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="ambulanceConversionCertificate" className="file-upload-button">📁 Choose File</label>
                      <small>If vehicle was modified to ambulance specifications</small>
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="manufacturerFitmentCertificate">Manufacturer Fitment Certificate</label>
                      <input 
                        type="file" 
                        id="manufacturerFitmentCertificate"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'manufacturerFitmentCertificate')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="manufacturerFitmentCertificate" className="file-upload-button">📁 Choose File</label>
                      <small>For factory-fitted ambulances</small>
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="invoicePurchaseBill">Invoice / Purchase Bill</label>
                      <input 
                        type="file" 
                        id="invoicePurchaseBill"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'invoicePurchaseBill')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="invoicePurchaseBill" className="file-upload-button">📁 Choose File</label>
                      <small>Proof of ownership if required</small>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveSection('vehicleDocuments')}>💾 Save Documents</button>
                    <button className="btn-secondary" onClick={() => setIsEditingVehicleDocuments(false)}>❌ Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Equipment Section - NOW MERGED INTO VEHICLE */}
          {activeSection === 'equipment' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>⚕️ Ambulance Equipment & Medical Supplies</h2>
                <p className="merged-notice">✨ Equipment inventory is now part of Vehicle Management. Please go to Vehicle Details section.</p>
              </div>
              <div className="info-box">
                <h4>📌 Important Notice</h4>
                <p>Ambulance equipment and medical supplies tracking have been merged into the <strong>Vehicle Details</strong> section for better organization. All your equipment information can be managed there.</p>
                <button className="btn-primary" onClick={() => setActiveSection('vehicle')}>Go to Vehicle Management</button>
              </div>
            </section>
          )}

          {/* Equipment Section (OLD - KEEPING FOR REFERENCE) */}
          {activeSection === 'equipment-old' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>⚕️ Ambulance Equipment & Medical Supplies</h2>
                <p>Medical equipment inventory, maintenance, and status tracking</p>
              </div>

              {!isEditingEquipment ? (
                <>
                  <div className="info-display">
                    <h3>Essential Equipment</h3>
                    <div className="info-row">
                      <label>Stretcher:</label>
                      <span>{ambulanceData.hasStretcher ? `✅ Yes (${ambulanceData.stretcherType || 'N/A'}, Qty: ${ambulanceData.stretcherQuantity || 0})` : '❌ No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Oxygen Cylinder:</label>
                      <span>{ambulanceData.hasOxygenCylinder ? `✅ Yes (Qty: ${ambulanceData.oxygenQuantity || 0}, ${ambulanceData.oxygenCapacity || 'N/A'})` : '❌ No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Ambu Bag:</label>
                      <span>{ambulanceData.hasAmbuBag ? `✅ Yes (Adult: ${ambulanceData.ambuBagAdultQty || 0}, Pediatric: ${ambulanceData.ambuBagPediatricQty || 0})` : '❌ No'}</span>
                    </div>
                    <div className="info-row">
                      <label>Suction Machine:</label>
                      <span>{ambulanceData.hasSuctionMachine ? `✅ Yes (Qty: ${ambulanceData.suctionQuantity || 0})` : '❌ No'}</span>
                    </div>
                    <br></br>
                    <h3 style={{ marginTop: '20px' }}>Monitoring Equipment</h3> 
                    <div className="info-row">
                      <label>Available:</label>
                      <span>
                        {[
                          ambulanceData.hasBPApparatus && 'BP Apparatus',
                          ambulanceData.hasPulseOximeter && 'Pulse Oximeter',
                          ambulanceData.hasGlucometer && 'Glucometer',
                          ambulanceData.hasThermometer && 'Thermometer'
                        ].filter(Boolean).join(', ') || 'None'}
                      </span>
                    </div>

                    <h3 style={{ marginTop: '20px' }}>Immobilization Equipment</h3>
                    <div className="info-row">
                      <label>Available:</label>
                      <span>
                        {[
                          ambulanceData.hasSplints && 'Splints',
                          ambulanceData.hasCervicalCollar && 'Cervical Collar',
                          ambulanceData.hasImmobilizationBoard && 'Immobilization Board'
                        ].filter(Boolean).join(', ') || 'None'}
                      </span>
                    </div>

                    <h3 style={{ marginTop: '20px' }}>Medical Supplies</h3>
                    <div className="info-row">
                      <label>Available:</label>
                      <span>
                        {[
                          ambulanceData.hasWoundDressings && 'Wound Dressings',
                          ambulanceData.hasIVSets && 'IV Sets',
                          ambulanceData.hasCannulas && 'Cannulas',
                          ambulanceData.hasSyringes && 'Syringes'
                        ].filter(Boolean).join(', ') || 'None'}
                      </span>
                    </div>
                    {ambulanceData.medicalSuppliesExpiryDate && (
                      <div className="info-row">
                        <label>Supplies Expiry Date:</label>
                        <span>{new Date(ambulanceData.medicalSuppliesExpiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                        <br />
                    <h3 style={{ marginTop: '20px' }}>Emergency Drugs Kit</h3>
                    <div className="info-row">
                      <label>Has Emergency Drugs:</label>
                      <span>{ambulanceData.hasEmergencyDrugsKit ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    {ambulanceData.hasEmergencyDrugsKit && ambulanceData.emergencyDrugsList && (
                      <div className="info-row">
                        <label>Drugs List:</label>
                        <span>{ambulanceData.emergencyDrugsList}</span>
                      </div>
                    )}
                    {ambulanceData.emergencyDrugsExpiry && (
                      <div className="info-row">
                        <label>Drugs Expiry Date:</label>
                        <span>{new Date(ambulanceData.emergencyDrugsExpiry).toLocaleDateString()}</span>
                      </div>
                    )}

                    <h3 style={{ marginTop: '20px' }}>Safety Equipment</h3>
                    <div className="info-row">
                      <label>Available:</label>
                      <span>
                        {[
                          ambulanceData.hasFireExtinguisher && 'Fire Extinguisher',
                          ambulanceData.hasFirstAidBox && 'First Aid Box',
                          ambulanceData.hasSurgicalMasks && 'Surgical Masks',
                          ambulanceData.hasGloves && 'Gloves',
                          ambulanceData.hasDisinfectant && 'Disinfectant',
                          ambulanceData.hasHandSanitizer && 'Hand Sanitizer'
                        ].filter(Boolean).join(', ') || 'None'}
                      </span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEditSection('equipment')}>✏️ Edit Equipment</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <h3>Essential Equipment</h3>
                    </div>

                    {/* Stretcher */}
                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={editFormData.hasStretcher || false}
                          onChange={(e) => handleInputChange('hasStretcher', e.target.checked)}
                        />
                        <strong>Stretcher</strong>
                      </label>
                    </div>
                    {editFormData.hasStretcher && (
                      <>
                        <div className="form-group">
                          <label>Type</label>
                          <select value={editFormData.stretcherType || ''} onChange={(e) => handleInputChange('stretcherType', e.target.value)}>
                            <option value="">Select</option>
                            <option value="standard">Standard</option>
                            <option value="hydraulic">Hydraulic</option>
                            <option value="electric">Electric</option>
                            <option value="scoop">Scoop</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Quantity</label>
                          <input type="number" value={editFormData.stretcherQuantity || ''} onChange={(e) => handleInputChange('stretcherQuantity', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Condition</label>
                          <select value={editFormData.stretcherCondition || ''} onChange={(e) => handleInputChange('stretcherCondition', e.target.value)}>
                            <option value="">Select</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="needs-service">Needs Service</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Last Maintenance</label>
                          <input type="date" value={editFormData.stretcherLastMaintenance || ''} onChange={(e) => handleInputChange('stretcherLastMaintenance', e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* Oxygen Cylinder */}
                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={editFormData.hasOxygenCylinder || false}
                          onChange={(e) => handleInputChange('hasOxygenCylinder', e.target.checked)}
                        />
                        <strong>Oxygen Cylinder</strong>
                      </label>
                    </div>
                    {editFormData.hasOxygenCylinder && (
                      <>
                        <div className="form-group">
                          <label>Quantity</label>
                          <input type="number" value={editFormData.oxygenQuantity || ''} onChange={(e) => handleInputChange('oxygenQuantity', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Capacity</label>
                          <input type="text" value={editFormData.oxygenCapacity || ''} onChange={(e) => handleInputChange('oxygenCapacity', e.target.value)} placeholder="e.g., 10L" />
                        </div>
                        <div className="form-group">
                          <label>Last Refill</label>
                          <input type="date" value={editFormData.oxygenLastRefill || ''} onChange={(e) => handleInputChange('oxygenLastRefill', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Regulator Condition</label>
                          <select value={editFormData.oxygenRegulatorCondition || ''} onChange={(e) => handleInputChange('oxygenRegulatorCondition', e.target.value)}>
                            <option value="">Select</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="needs-service">Needs Service</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Ambu Bag */}
                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={editFormData.hasAmbuBag || false}
                          onChange={(e) => handleInputChange('hasAmbuBag', e.target.checked)}
                        />
                        <strong>Ambu Bag</strong>
                      </label>
                    </div>
                    {editFormData.hasAmbuBag && (
                      <>
                        <div className="form-group">
                          <label>Adult Size Qty</label>
                          <input type="number" value={editFormData.ambuBagAdultQty || ''} onChange={(e) => handleInputChange('ambuBagAdultQty', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Pediatric Size Qty</label>
                          <input type="number" value={editFormData.ambuBagPediatricQty || ''} onChange={(e) => handleInputChange('ambuBagPediatricQty', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Condition</label>
                          <select value={editFormData.ambuBagCondition || ''} onChange={(e) => handleInputChange('ambuBagCondition', e.target.value)}>
                            <option value="">Select</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="needs-service">Needs Service</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Suction Machine */}
                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={editFormData.hasSuctionMachine || false}
                          onChange={(e) => handleInputChange('hasSuctionMachine', e.target.checked)}
                        />
                        <strong>Suction Machine</strong>
                      </label>
                    </div>
                    {editFormData.hasSuctionMachine && (
                      <>
                        <div className="form-group">
                          <label>Quantity</label>
                          <input type="number" value={editFormData.suctionQuantity || ''} onChange={(e) => handleInputChange('suctionQuantity', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <select value={editFormData.suctionStatus || ''} onChange={(e) => handleInputChange('suctionStatus', e.target.value)}>
                            <option value="">Select</option>
                            <option value="working">Working</option>
                            <option value="needs-repair">Needs Repair</option>
                            <option value="not-working">Not Working</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Last Maintenance</label>
                          <input type="date" value={editFormData.suctionLastMaintenance || ''} onChange={(e) => handleInputChange('suctionLastMaintenance', e.target.value)} />
                        </div>
                      </>
                    )}

                    <div className="form-group full-width">
                      <h3>Monitoring Equipment</h3>
                    </div>
                    <div className="form-group full-width">
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasBPApparatus || false} onChange={(e) => handleInputChange('hasBPApparatus', e.target.checked)} />
                          BP Apparatus
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasPulseOximeter || false} onChange={(e) => handleInputChange('hasPulseOximeter', e.target.checked)} />
                          Pulse Oximeter
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasGlucometer || false} onChange={(e) => handleInputChange('hasGlucometer', e.target.checked)} />
                          Glucometer
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasThermometer || false} onChange={(e) => handleInputChange('hasThermometer', e.target.checked)} />
                          Thermometer
                        </label>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <h3>Immobilization Equipment</h3>
                    </div>
                    <div className="form-group full-width">
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasSplints || false} onChange={(e) => handleInputChange('hasSplints', e.target.checked)} />
                          Splints
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasCervicalCollar || false} onChange={(e) => handleInputChange('hasCervicalCollar', e.target.checked)} />
                          Cervical Collar
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasImmobilizationBoard || false} onChange={(e) => handleInputChange('hasImmobilizationBoard', e.target.checked)} />
                          Immobilization Board
                        </label>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <h3>Medical Supplies</h3>
                    </div>
                    <div className="form-group full-width">
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasWoundDressings || false} onChange={(e) => handleInputChange('hasWoundDressings', e.target.checked)} />
                          Wound Dressings
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasIVSets || false} onChange={(e) => handleInputChange('hasIVSets', e.target.checked)} />
                          IV Sets
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasCannulas || false} onChange={(e) => handleInputChange('hasCannulas', e.target.checked)} />
                          Cannulas
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasSyringes || false} onChange={(e) => handleInputChange('hasSyringes', e.target.checked)} />
                          Syringes
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Supplies Expiry Date</label>
                      <input type="date" value={editFormData.medicalSuppliesExpiryDate || ''} onChange={(e) => handleInputChange('medicalSuppliesExpiryDate', e.target.value)} />
                    </div>

                    <div className="form-group full-width">
                      <h3>Emergency Drugs Kit</h3>
                    </div>
                    <div className="form-group full-width">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={editFormData.hasEmergencyDrugsKit || false} onChange={(e) => handleInputChange('hasEmergencyDrugsKit', e.target.checked)} />
                        <strong>Emergency Drugs Kit Available</strong>
                      </label>
                    </div>
                    {editFormData.hasEmergencyDrugsKit && (
                      <>
                        <div className="form-group full-width">
                          <label>Drug List</label>
                          <textarea rows="3" value={editFormData.emergencyDrugsList || ''} onChange={(e) => handleInputChange('emergencyDrugsList', e.target.value)} placeholder="List of drugs available..."></textarea>
                        </div>
                        <div className="form-group">
                          <label>Nearest Expiry Date</label>
                          <input type="date" value={editFormData.emergencyDrugsExpiry || ''} onChange={(e) => handleInputChange('emergencyDrugsExpiry', e.target.value)} />
                        </div>
                      </>
                    )}

                    <div className="form-group full-width">
                      <h3>Safety Equipment</h3>
                    </div>
                    <div className="form-group full-width">
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasFireExtinguisher || false} onChange={(e) => handleInputChange('hasFireExtinguisher', e.target.checked)} />
                          Fire Extinguisher
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasFirstAidBox || false} onChange={(e) => handleInputChange('hasFirstAidBox', e.target.checked)} />
                          First Aid Box
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasSurgicalMasks || false} onChange={(e) => handleInputChange('hasSurgicalMasks', e.target.checked)} />
                          Surgical Masks
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasGloves || false} onChange={(e) => handleInputChange('hasGloves', e.target.checked)} />
                          Gloves
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasDisinfectant || false} onChange={(e) => handleInputChange('hasDisinfectant', e.target.checked)} />
                          Disinfectant
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={editFormData.hasHandSanitizer || false} onChange={(e) => handleInputChange('hasHandSanitizer', e.target.checked)} />
                          Hand Sanitizer
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveSection('equipment')}>💾 Save Equipment List</button>
                    <button className="btn-secondary" onClick={() => setIsEditingEquipment(false)}>❌ Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Pricing & Payment Section */}
          {activeSection === 'pricing' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>💰 Pricing, Payment & Billing</h2>
                <p>Service charges, payment methods, and billing configuration</p>
              </div>

              {!isEditingPricing ? (
                <>
                  <div className="info-display">
                    <h3>Base Charges</h3>
                    <div className="info-row">
                      <label>Base Charge:</label>
                      <span>₹{ambulanceData.baseCharge || '0'}</span>
                    </div>
                    <div className="info-row">
                      <label>Base Distance Included:</label>
                      <span>{ambulanceData.baseDistanceIncluded || '0'} km</span>
                    </div>
                    <div className="info-row">
                      <label>Per Km Charge:</label>
                      <span>₹{ambulanceData.perKmCharge || '0'}</span>
                    </div>
                    <div className="info-row">
                      <label>Night Charges:</label>
                      <span>₹{ambulanceData.nightCharges || '0'}</span>
                    </div>
                    <div className="info-row">
                      <label>Waiting Charges:</label>
                      <span>₹{ambulanceData.waitingCharges || '0'}/hour</span>
                    </div>
                    <div className="info-row">
                      <label>Oxygen Charges:</label>
                      <span>₹{ambulanceData.oxygenCharges || '0'}</span>
                    </div>
                    <div className="info-row">
                      <label>Intercity Rates:</label>
                      <span>{ambulanceData.intercityTransferRates || 'Not set'}</span>
                    </div>
                    
                    <h3 style={{ marginTop: '20px' }}>Payment Methods</h3>
                    <div className="info-row">
                      <label>Accepted Methods:</label>
                      <span>
                        {[
                          ambulanceData.paymentCash && 'Cash',
                          ambulanceData.paymentCard && 'Card',
                          ambulanceData.paymentUPI && 'UPI',
                          ambulanceData.paymentWallet && 'Wallet',
                          ambulanceData.paymentCorporate && 'Corporate',
                          ambulanceData.paymentInsurance && 'Insurance'
                        ].filter(Boolean).join(', ') || 'Not set'}
                      </span>
                    </div>

                    <h3 style={{ marginTop: '20px' }}>Bank Details</h3>
                    <div className="info-row">
                      <label>Account Holder:</label>
                      <span>{ambulanceData.bankAccountHolderName || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Account Number:</label>
                      <span>{ambulanceData.bankAccountNumber || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>IFSC Code:</label>
                      <span>{ambulanceData.bankIFSC || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <label>Bank Name:</label>
                      <span>{ambulanceData.bankName || 'Not set'}</span>
                    </div>
                  </div>

                  {ambulanceData.cancelledChequeFile && (
                    <div className="documents-section" style={{ marginTop: '20px' }}>
                      <h3>Documents</h3>
                      <div className="documents-grid">
                        <div className="document-item">
                          <span>🏦 Cancelled Cheque</span>
                          <button className="btn-view v2" onClick={() => window.open(ambulanceData.cancelledChequeFile, '_blank')}>View</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => handleEditSection('pricing')}>✏️ Edit Pricing & Payment</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Base Charges</h3>
                    </div>

                    <div className="form-group">
                      <label>Base Charge (First X km) *</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={editFormData.baseCharge || ''}
                          onChange={(e) => handleInputChange('baseCharge', e.target.value)}
                          placeholder="Base amount" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Base Distance Included (km) *</label>
                      <input 
                        type="number" 
                        value={editFormData.baseDistanceIncluded || ''}
                        onChange={(e) => handleInputChange('baseDistanceIncluded', e.target.value)}
                        placeholder="e.g., 5, 10" 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Per Km Charge (Beyond Base) *</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={editFormData.perKmCharge || ''}
                          onChange={(e) => handleInputChange('perKmCharge', e.target.value)}
                          placeholder="Per km rate" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Night Charges (Additional) *</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={editFormData.nightCharges || ''}
                          onChange={(e) => handleInputChange('nightCharges', e.target.value)}
                          placeholder="Extra for night service" 
                        />
                      </div>
                      <small>9 PM to 6 AM surcharge</small>
                    </div>

                    <div className="form-group">
                      <label>Waiting Charges (Per Hour)</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={editFormData.waitingCharges || ''}
                          onChange={(e) => handleInputChange('waitingCharges', e.target.value)}
                          placeholder="Hourly waiting charge" 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Oxygen Charges (If Extra)</label>
                      <div className="input-with-icon">
                        <span className="icon">₹</span>
                        <input 
                          type="number" 
                          value={editFormData.oxygenCharges || ''}
                          onChange={(e) => handleInputChange('oxygenCharges', e.target.value)}
                          placeholder="Additional oxygen charge" 
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Intercity Transfer Rates</label>
                      <textarea 
                        rows="2" 
                        value={editFormData.intercityTransferRates || ''}
                        onChange={(e) => handleInputChange('intercityTransferRates', e.target.value)}
                        placeholder="Special rates for intercity transfers (if applicable)"
                      ></textarea>
                    </div>

                    <div className="form-group full-width">
                      <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>Payment Methods Accepted</h3>
                    </div>

                    <div className="form-group full-width">
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editFormData.paymentCash || false}
                            onChange={(e) => handleInputChange('paymentCash', e.target.checked)}
                          />
                          Cash
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editFormData.paymentCard || false}
                            onChange={(e) => handleInputChange('paymentCard', e.target.checked)}
                          />
                          Credit/Debit Card (POS)
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editFormData.paymentUPI || false}
                            onChange={(e) => handleInputChange('paymentUPI', e.target.checked)}
                          />
                          UPI
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editFormData.paymentWallet || false}
                            onChange={(e) => handleInputChange('paymentWallet', e.target.checked)}
                          />
                          Mobile Wallet
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editFormData.paymentCorporate || false}
                            onChange={(e) => handleInputChange('paymentCorporate', e.target.checked)}
                          />
                          Corporate Billing
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editFormData.paymentInsurance || false}
                            onChange={(e) => handleInputChange('paymentInsurance', e.target.checked)}
                          />
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
                      <input 
                        type="text" 
                        value={editFormData.bankAccountHolderName || ''}
                        onChange={(e) => handleInputChange('bankAccountHolderName', e.target.value)}
                        placeholder="As per bank records" 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Bank Account Number *</label>
                      <input 
                        type="text" 
                        value={editFormData.bankAccountNumber || ''}
                        onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                        placeholder="Account number" 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>IFSC Code *</label>
                      <input 
                        type="text" 
                        value={editFormData.bankIFSC || ''}
                        onChange={(e) => handleInputChange('bankIFSC', e.target.value)}
                        placeholder="Bank IFSC code" 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Bank Name</label>
                      <input 
                        type="text" 
                        value={editFormData.bankName || ''}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        placeholder="Name of bank" 
                      />
                    </div>

                    <div className="form-group full-width file-upload-wrapper">
                      <label htmlFor="cancelledChequeFile">Upload Cancelled Cheque</label>
                      <input 
                        type="file" 
                        id="cancelledChequeFile"
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => handleFileUpload(e, 'cancelledChequeFile')}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="cancelledChequeFile" className="file-upload-button">📁 Choose File</label>
                      <small>For bank account verification</small>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => handleSaveSection('pricing')}>💾 Save Pricing & Payment</button>
                    <button className="btn-secondary" onClick={() => setIsEditingPricing(false)}>❌ Cancel</button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Operations Section */}
          {activeSection === 'operations' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>📍 Operations & Service Area</h2>
                <p>Manage your service coverage and operational settings</p>
                {!isEditingOperations && (
                  <button className="btn-secondary" onClick={() => handleEditSection('operations')}>
                    ✏️ Edit Operations
                  </button>
                )}
              </div>

              {!isEditingOperations ? (
                <div className="info-display">
                  <div className="info-group">
                    <h3>Service Availability</h3> &nbsp;
                    <div className="info-row">
                      <span className="label">Availability Type:</span>
                      <span className="value">{ambulanceData.serviceAvailability || '24x7'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Current Status:</span>
                      <span className="value status-badge">{ambulanceData.currentStatus || 'offline'}</span>
                    </div>
                  </div>

                  <div className="info-group">
                    <h3>Operating Hours</h3>
                    {ambulanceData.operatingHours && (
                      <div className="operating-hours-display">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                          <div key={day} className="hours-row">
                            <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                            {ambulanceData.operatingHours[day]?.isAvailable ? (
                              <span className="hours-time">
                                {ambulanceData.operatingHours[day]?.startTime || '00:00'} - {ambulanceData.operatingHours[day]?.endTime || '23:59'}
                              </span>
                            ) : (
                              <span className="hours-closed">Closed</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="info-group">
                    <h3>Service Coverage</h3> &nbsp;
                    <div className="info-row">
                      <span className="label">Service Cities:</span>
                      <span className="value">{ambulanceData.serviceCities?.join(', ') || 'Not specified'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Service Radius:</span>
                      <span className="value">{ambulanceData.serviceRadius ? `${ambulanceData.serviceRadius} km` : 'Not specified'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Intercity Service:</span>
                      <span className="value">{ambulanceData.intercityService ? '✓ Yes' : '✗ No'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Interstate Service:</span>
                      <span className="value">{ambulanceData.interstateService ? '✓ Yes' : '✗ No'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Service Availability *</label> 
                    <select 
                      value={editFormData.serviceAvailability || '24x7'} 
                      onChange={(e) => handleInputChange('serviceAvailability', e.target.value)}
                      required
                    >
                      <option value="24x7">24x7 (Round the clock)</option>
                      <option value="day-only">Day Only</option>
                      <option value="night-only">Night Only</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Current Status *</label>
                    <select 
                      value={editFormData.currentStatus || 'offline'} 
                      onChange={(e) => handleInputChange('currentStatus', e.target.value)}
                      required
                    >
                      <option value="available">Available</option>
                      <option value="on-trip">On Trip</option>
                      <option value="offline">Offline</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>

                  <div className="form-section">
                    <h3>Operating Hours</h3>
                    <p className="help-text">Set your operating hours for each day of the week</p>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                      <div key={day} className="operating-hours-edit">
                        <div className="day-header">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={editFormData.operatingHours?.[day]?.isAvailable !== false}
                              onChange={(e) => {
                                const newHours = { ...editFormData.operatingHours };
                                if (!newHours[day]) newHours[day] = {};
                                newHours[day].isAvailable = e.target.checked;
                                handleInputChange('operatingHours', newHours);
                              }}
                            />
                            <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                          </label>
                        </div>
                        {editFormData.operatingHours?.[day]?.isAvailable !== false && (
                          <div className="time-inputs">
                            <input
                              type="time"
                              value={editFormData.operatingHours?.[day]?.startTime || '00:00'}
                              onChange={(e) => {
                                const newHours = { ...editFormData.operatingHours };
                                if (!newHours[day]) newHours[day] = { isAvailable: true };
                                newHours[day].startTime = e.target.value;
                                handleInputChange('operatingHours', newHours);
                              }}
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={editFormData.operatingHours?.[day]?.endTime || '23:59'}
                              onChange={(e) => {
                                const newHours = { ...editFormData.operatingHours };
                                if (!newHours[day]) newHours[day] = { isAvailable: true };
                                newHours[day].endTime = e.target.value;
                                handleInputChange('operatingHours', newHours);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Service Cities *</label>
                    <input 
                      type="text" 
                      value={Array.isArray(editFormData.serviceCities) ? editFormData.serviceCities.join(', ') : editFormData.serviceCities || ''} 
                      onChange={(e) => handleInputChange('serviceCities', e.target.value)}
                      onBlur={(e) => {
                        // Convert to array on blur
                        const cities = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                        handleInputChange('serviceCities', cities);
                      }}
                      placeholder="Enter cities separated by commas (e.g., Hyderabad, Secunderabad, Kukatpally)"
                      required
                    />
                    <small>Separate multiple cities with commas</small>
                  </div>

                  <div className="form-group">
                    <label>Service Radius (in km) *</label>
                    <input 
                      type="number" 
                      value={editFormData.serviceRadius || ''} 
                      onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
                      placeholder="Enter service radius"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editFormData.intercityService || false}
                        onChange={(e) => handleInputChange('intercityService', e.target.checked)}
                      />
                      <span>Intercity Service Available</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editFormData.interstateService || false}
                        onChange={(e) => handleInputChange('interstateService', e.target.checked)}
                      />
                      <span>Interstate Service Available</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button className="btn-save" onClick={() => handleSaveSection('operations')}>
                      💾 Save Operations
                    </button>
                    <button className="btn-cancel" onClick={handleCancelEdit}>
                      ✖ Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Bank Details Section */}
          {activeSection === 'bank' && (
            <section className="dashboard-section">
              <div className="section-header">
                <h2>🏦 Bank Details</h2>
                <p>Payment account information for receiving payouts</p>
                {!isEditingBank && (
                  <button className="btn-secondary" onClick={() => handleEditSection('bank')}>
                    ✏️ Edit Bank Details
                  </button>
                )}
              </div>

              {!isEditingBank ? (
                <div className="info-display">
                  <div className="info-group">
                    <h3>Bank Account Information</h3> &nbsp;
                    <div className="info-row">
                      <span className="label">Account Holder Name:</span>
                      <span className="value">{ambulanceData.bankDetails?.accountHolderName || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Account Number:</span>
                      <span className="value">{ambulanceData.bankDetails?.accountNumber ? `****${ambulanceData.bankDetails.accountNumber.slice(-4)}` : 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Account Type:</span>
                      <span className="value">{ambulanceData.bankDetails?.accountType ? ambulanceData.bankDetails.accountType.charAt(0).toUpperCase() + ambulanceData.bankDetails.accountType.slice(1) : 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">IFSC Code:</span>
                      <span className="value">{ambulanceData.bankDetails?.ifscCode || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Bank Name:</span>
                      <span className="value">{ambulanceData.bankDetails?.bankName || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Branch Name:</span>
                      <span className="value">{ambulanceData.bankDetails?.branchName || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Branch Address:</span>
                      <span className="value">{ambulanceData.bankDetails?.branchAddress || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="info-group">
                    <h3>UPI Payment</h3> &nbsp;
                    <div className="info-row">
                      <span className="label">UPI ID:</span>
                      <span className="value">{ambulanceData.upiId || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="edit-form">
                  <div className="form-section">
                    <h3>Bank Account Information</h3>
                    
                    <div className="form-group">
                      <label>Account Holder Name *</label>
                      <input 
                        type="text" 
                        value={editFormData.accountHolderName || ''} 
                        onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                        placeholder="Enter account holder name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Account Number *</label>
                      <input 
                        type="text" 
                        value={editFormData.accountNumber || ''} 
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        placeholder="Enter account number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Account Type *</label>
                      <select 
                        value={editFormData.accountType || ''} 
                        onChange={(e) => handleInputChange('accountType', e.target.value)}
                        required
                      >
                        <option value="">Select account type</option>
                        <option value="savings">Savings Account</option>
                        <option value="current">Current Account</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>IFSC Code *</label>
                      <input 
                        type="text" 
                        value={editFormData.ifscCode || ''} 
                        onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                        placeholder="Enter IFSC code"
                        maxLength="11"
                        required
                      />
                      <small>11-character alphanumeric code (e.g., SBIN0001234)</small>
                    </div>

                    <div className="form-group">
                      <label>Bank Name *</label>
                      <input 
                        type="text" 
                        value={editFormData.bankName || ''} 
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        placeholder="Enter bank name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Branch Name</label>
                      <input 
                        type="text" 
                        value={editFormData.branchName || ''} 
                        onChange={(e) => handleInputChange('branchName', e.target.value)}
                        placeholder="Enter branch name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Branch Address</label>
                      <textarea 
                        value={editFormData.branchAddress || ''} 
                        onChange={(e) => handleInputChange('branchAddress', e.target.value)}
                        placeholder="Enter complete branch address"
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>UPI Payment (Optional)</h3>
                    
                    <div className="form-group">
                      <label>UPI ID</label>
                      <input 
                        type="text" 
                        value={editFormData.upiId || ''} 
                        onChange={(e) => handleInputChange('upiId', e.target.value)}
                        placeholder="yourname@upi"
                      />
                      <small>Enter your UPI ID for instant payments</small>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-save" onClick={() => handleSaveSection('bank')}>
                      💾 Save Bank Details
                    </button>
                    <button className="btn-cancel" onClick={handleCancelEdit}>
                      ✖ Cancel
                    </button>
                  </div>
                </div>
              )}
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
