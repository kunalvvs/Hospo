import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalAPI } from '../services/api';
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
  const [uploading, setUploading] = useState(false);

  // Expense Modal States
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseModalMode, setExpenseModalMode] = useState('add');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [currentExpenseData, setCurrentExpenseData] = useState(null);

  // Expense data states
  const [rooms, setRooms] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [doctorFees, setDoctorFees] = useState([]);
  const [nursingCharges, setNursingCharges] = useState([]);
  const [miscServices, setMiscServices] = useState([]);

  // Section-specific editing states
  const [isEditingServices, setIsEditingServices] = useState(false);
  const [isEditingSpecialities, setIsEditingSpecialities] = useState(false);
  const [isEditingAppointments, setIsEditingAppointments] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingOperational, setIsEditingOperational] = useState(false);

  // Section data states
  const [services, setServices] = useState({});
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentSettings, setAppointmentSettings] = useState({});
  const [billingDetails, setBillingDetails] = useState({});
  const [operationalDetails, setOperationalDetails] = useState({});

  // Mock appointments data
  const [appointments] = useState([
    { id: 1, patient: 'Rajesh Kumar', doctor: 'Dr. Sharma', department: 'Cardiology', date: '2025-11-14', time: '10:00 AM', status: 'confirmed' },
    { id: 2, patient: 'Priya Singh', doctor: 'Dr. Mehta', department: 'Orthopaedics', date: '2025-11-14', time: '02:30 PM', status: 'pending' },
    { id: 3, patient: 'Amit Patel', doctor: 'Dr. Verma', department: 'General Medicine', date: '2025-11-15', time: '11:00 AM', status: 'confirmed' },
  ]);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    
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

      setCurrentUser(userData);
      
      // Fetch hospital data from backend
      fetchHospitalData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      const response = await hospitalAPI.getProfile();
      
      console.log('=== FETCH HOSPITAL DATA RESPONSE ===');
      console.log('Full response:', response);
      console.log('Hospital data:', response.hospital);
      console.log('Doctors array:', response.hospital?.doctors);
      console.log('Appointment settings:', {
        acceptOnlineBooking: response.hospital?.acceptOnlineBooking,
        bookingType: response.hospital?.bookingType,
        slotDuration: response.hospital?.slotDuration
      });
      
      if (response.success) {
        setHospitalData(response.hospital);
        
        // Set expense data from hospital profile
        setRooms(response.hospital.rooms || []);
        setProcedures(response.hospital.procedures || []);
        setDoctorFees(response.hospital.doctorFees || []);
        setNursingCharges(response.hospital.nursingCharges || []);
        setMiscServices(response.hospital.miscServices || []);
        
        // Set doctors from hospital profile
        setDoctors(response.hospital.doctors || []);
        console.log('Doctors set to state:', response.hospital.doctors || []);
        
        // Update local storage
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        
        // Check if registration is complete
        if (!response.hospital.registrationComplete) {
          navigate('/hospital-registration');
        }
      }
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      
      // Check if it's a 404 or user doesn't have profile yet
      if (error.response?.status === 404) {
        navigate('/hospital-registration');
      } else {
        alert('Error loading hospital data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('hospitalData');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleBottomNavClick = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      const response = await hospitalAPI.uploadFile(file);
      return response.fileUrl;
    } catch (error) {
      console.error('File upload error:', error);
      alert('Error uploading file. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
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
    setEditFormData({ 
      ...hospitalData,
      'workingHours.mondayHours': hospitalData.workingHours?.mondayHours || '',
      'workingHours.tuesdayHours': hospitalData.workingHours?.tuesdayHours || '',
      'workingHours.wednesdayHours': hospitalData.workingHours?.wednesdayHours || '',
      'workingHours.thursdayHours': hospitalData.workingHours?.thursdayHours || '',
      'workingHours.fridayHours': hospitalData.workingHours?.fridayHours || '',
      'workingHours.saturdayHours': hospitalData.workingHours?.saturdayHours || '',
      'workingHours.sundayHours': hospitalData.workingHours?.sundayHours || '',
      'workingHours.opdHours': hospitalData.workingHours?.opdHours || '',
      'workingHours.emergencyHours': hospitalData.workingHours?.emergencyHours || '24×7'
    });
    setIsEditingContact(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      setEditFormData({ 
        ...editFormData, 
        [name]: files[0],
        [`${name}Preview`]: URL.createObjectURL(files[0])
      });
    } else if (type === 'checkbox') {
      setEditFormData({ ...editFormData, [name]: checked });
    } else {
      // Handle nested objects
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setEditFormData({
          ...editFormData,
          [parent]: {
            ...(editFormData[parent] || {}),
            [child]: value
          }
        });
      } else {
        setEditFormData({ ...editFormData, [name]: value });
      }
    }
  };

  const handleSaveIdentity = async () => {
    try {
      setUploading(true);
      
      // Upload logo if changed
      let logoUrl = editFormData.logo;
      if (editFormData.logo && typeof editFormData.logo !== 'string') {
        logoUrl = await uploadFile(editFormData.logo);
      }
      
      const updateData = {
        hospitalName: editFormData.hospitalName,
        practiceType: editFormData.practiceType,
        tagline: editFormData.tagline,
        logo: logoUrl
      };
      
      const response = await hospitalAPI.updateSection('identity', updateData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setIsEditingIdentity(false);
        alert('Hospital identity updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Error updating hospital identity');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      setUploading(true);
      
      const updateData = {
        streetAddress: editFormData.streetAddress,
        locality: editFormData.locality,
        city: editFormData.city,
        pincode: editFormData.pincode,
        landmark: editFormData.landmark,
        location: {
          latitude: editFormData['location.latitude'] || editFormData.location?.latitude || '',
          longitude: editFormData['location.longitude'] || editFormData.location?.longitude || ''
        }
      };
      
      const response = await hospitalAPI.updateSection('address', updateData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setIsEditingAddress(false);
        alert('Address details updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Error updating address');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveContact = async () => {
    try {
      setUploading(true);
      
      const updateData = {
        mainPhone: editFormData.mainPhone,
        alternatePhone: editFormData.alternatePhone,
        contactEmail: editFormData.contactEmail || editFormData.email,
        website: editFormData.website,
        socialMedia: {
          facebook: editFormData['socialMedia.facebook'] || editFormData.socialMedia?.facebook || '',
          instagram: editFormData['socialMedia.instagram'] || editFormData.socialMedia?.instagram || '',
          twitter: editFormData['socialMedia.twitter'] || editFormData.socialMedia?.twitter || ''
        },
        workingHours: {
          mondayHours: editFormData['workingHours.mondayHours'] || editFormData.workingHours?.mondayHours || '',
          tuesdayHours: editFormData['workingHours.tuesdayHours'] || editFormData.workingHours?.tuesdayHours || '',
          wednesdayHours: editFormData['workingHours.wednesdayHours'] || editFormData.workingHours?.wednesdayHours || '',
          thursdayHours: editFormData['workingHours.thursdayHours'] || editFormData.workingHours?.thursdayHours || '',
          fridayHours: editFormData['workingHours.fridayHours'] || editFormData.workingHours?.fridayHours || '',
          saturdayHours: editFormData['workingHours.saturdayHours'] || editFormData.workingHours?.saturdayHours || '',
          sundayHours: editFormData['workingHours.sundayHours'] || editFormData.workingHours?.sundayHours || '',
          opdHours: editFormData['workingHours.opdHours'] || editFormData.workingHours?.opdHours || '',
          emergencyHours: editFormData['workingHours.emergencyHours'] || editFormData.workingHours?.emergencyHours || '24×7'
        }
      };
      
      const response = await hospitalAPI.updateSection('contact', updateData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setIsEditingContact(false);
        alert('Contact details updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Error updating contact details');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingIdentity(false);
    setIsEditingAddress(false);
    setIsEditingContact(false);
    setIsEditingServices(false);
    setIsEditingAppointments(false);
    setIsEditingBilling(false);
    setIsEditingOperational(false);
    setEditFormData({});
  };

  // Services & Facilities handlers
  const handleEditServices = () => {
    setEditFormData({
      ...hospitalData,
      facilities: hospitalData.facilities || [],
      specializations: hospitalData.specializations || [],
      emergencyServices: hospitalData.emergencyServices || false,
      ambulanceAvailable: hospitalData.ambulanceAvailable || false,
      insuranceAccepted: hospitalData.insuranceAccepted || false,
      insuranceProviders: hospitalData.insuranceProviders ? hospitalData.insuranceProviders.join(', ') : ''
    });
    setIsEditingServices(true);
  };

  const handleServiceCheckbox = (service) => {
    const currentFacilities = editFormData.facilities || [];
    const updated = currentFacilities.includes(service)
      ? currentFacilities.filter(f => f !== service)
      : [...currentFacilities, service];
    setEditFormData({ ...editFormData, facilities: updated });
  };

  const handleSaveServices = async () => {
    try {
      setUploading(true);
      
      const updateData = {
        facilities: editFormData.facilities || [],
        specializations: editFormData.specializations || [],
        emergencyServices: editFormData.emergencyServices || false,
        ambulanceAvailable: editFormData.ambulanceAvailable || false,
        insuranceAccepted: editFormData.insuranceAccepted || false,
        insuranceProviders: editFormData.insuranceProviders 
          ? editFormData.insuranceProviders.split(',').map(p => p.trim()).filter(p => p)
          : []
      };
      
      const response = await hospitalAPI.updateProfile(updateData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setIsEditingServices(false);
        alert('Services & Facilities updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Error updating services');
    } finally {
      setUploading(false);
    }
  };

  // Specialities handlers
  const [newSpeciality, setNewSpeciality] = useState({
    name: '',
    subSpeciality: '',
    beds: ''
  });

  const handleAddSpeciality = async () => {
    if (!newSpeciality.name) {
      alert('Please select a speciality');
      return;
    }

    try {
      setUploading(true);
      const currentSpecialities = hospitalData.specializations || [];
      const updated = [...currentSpecialities, newSpeciality.name];
      
      const response = await hospitalAPI.updateProfile({ specializations: updated });
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setNewSpeciality({ name: '', subSpeciality: '', beds: '' });
        alert('Speciality added successfully!');
      }
    } catch (error) {
      console.error('Add speciality error:', error);
      alert('Error adding speciality');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSpeciality = async (speciality) => {
    if (!window.confirm(`Remove ${speciality} speciality?`)) return;

    try {
      setUploading(true);
      const updated = hospitalData.specializations.filter(s => s !== speciality);
      const response = await hospitalAPI.updateProfile({ specializations: updated });
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        alert('Speciality removed successfully!');
      }
    } catch (error) {
      console.error('Delete speciality error:', error);
      alert('Error removing speciality');
    } finally {
      setUploading(false);
    }
  };

  // Doctor Profile handlers
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    qualification: '',
    registration: '',
    speciality: '',
    experience: '',
    languages: '',
    opdDays: '',
    opdTimings: '',
    consultFeeInPerson: '',
    consultFeeOnline: '',
    photo: null
  });

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    
    if (!newDoctor.name || !newDoctor.qualification || !newDoctor.speciality) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setUploading(true);
      
      // Upload doctor photo if provided
      let photoUrl = '';
      if (newDoctor.photo) {
        photoUrl = await uploadFile(newDoctor.photo);
      }

      const doctorData = {
        ...newDoctor,
        photo: photoUrl,
        languages: newDoctor.languages.split(',').map(l => l.trim()),
        opdDays: newDoctor.opdDays.split(',').map(d => d.trim())
      };

      const currentDoctors = doctors.length > 0 ? doctors : [];
      const response = await hospitalAPI.updateProfile({ 
        doctors: [...currentDoctors, doctorData] 
      });
      
      console.log('=== ADD DOCTOR RESPONSE ===', response);
      
      if (response.success) {
        console.log('Updated doctors:', response.hospital.doctors);
        setHospitalData(response.hospital);
        setDoctors(response.hospital.doctors || []);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setNewDoctor({
          name: '',
          qualification: '',
          registration: '',
          speciality: '',
          experience: '',
          languages: '',
          opdDays: '',
          opdTimings: '',
          consultFeeInPerson: '',
          consultFeeOnline: '',
          photo: null
        });
        alert('Doctor profile added successfully!');
      }
    } catch (error) {
      console.error('Add doctor error:', error);
      alert('Error adding doctor profile');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoctor = async (doctorIndex) => {
    if (!window.confirm('Remove this doctor profile?')) return;

    try {
      setUploading(true);
      const updated = doctors.filter((_, idx) => idx !== doctorIndex);
      const response = await hospitalAPI.updateProfile({ doctors: updated });
      
      if (response.success) {
        setHospitalData(response.hospital);
        setDoctors(response.hospital.doctors || []);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        alert('Doctor profile removed successfully!');
      }
    } catch (error) {
      console.error('Delete doctor error:', error);
      alert('Error removing doctor profile');
    } finally {
      setUploading(false);
    }
  };

  // Appointment Settings handlers
  const handleEditAppointments = () => {
    setEditFormData({ 
      ...hospitalData,
      acceptOnlineBooking: hospitalData.acceptOnlineBooking || 'yes',
      bookingType: hospitalData.bookingType || 'appointment',
      slotDuration: hospitalData.slotDuration || '30',
      advanceBookingDays: hospitalData.advanceBookingDays || '7',
      cancellationPolicy: hospitalData.cancellationPolicy || 'free',
      prepaymentRequired: hospitalData.prepaymentRequired || 'no',
      patientInstructions: hospitalData.patientInstructions || ''
    });
    setIsEditingAppointments(true);
  };

  const handleSaveAppointments = async () => {
    try {
      setUploading(true);
      const response = await hospitalAPI.updateProfile(editFormData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setIsEditingAppointments(false);
        alert('Appointment settings updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Error updating appointment settings');
    } finally {
      setUploading(false);
    }
  };

  // Billing & Bank handlers
  const handleEditBilling = () => {
    setEditFormData({
      ...hospitalData,
      ...hospitalData.accountDetails
    });
    setIsEditingBilling(true);
  };

  const handleSaveBilling = async () => {
    try {
      setUploading(true);
      
      // Upload cancelled cheque if provided
      let bankProofUrl = editFormData.bankProof;
      if (editFormData.cancelledCheque && typeof editFormData.cancelledCheque !== 'string') {
        bankProofUrl = await uploadFile(editFormData.cancelledCheque);
      }
      
      const updateData = {
        gstNumber: editFormData.gstNumber,
        accountDetails: {
          accountHolderName: editFormData.accountHolderName,
          accountNumber: editFormData.accountNumber,
          ifscCode: editFormData.ifscCode,
          bankName: editFormData.bankName,
          branchName: editFormData.branchName,
          accountType: editFormData.accountType,
          upiId: editFormData.upiId,
          bankProof: bankProofUrl
        }
      };
      
      const response = await hospitalAPI.updateSection('bank', updateData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setIsEditingBilling(false);
        alert('Billing & Bank details updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Error updating billing details');
    } finally {
      setUploading(false);
    }
  };

  // Document upload handler
  const handleDocumentUpload = async (docType, file) => {
    try {
      setUploading(true);
      const fileUrl = await uploadFile(file);
      
      const updateData = { [docType]: fileUrl };
      const response = await hospitalAPI.updateProfile(updateData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        alert('Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  // Media upload handler
  const handleMediaUpload = async (category, files) => {
    try {
      setUploading(true);
      const uploadPromises = Array.from(files).map(file => uploadFile(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const currentPhotos = hospitalData.hospitalPhotos || [];
      const updateData = {
        hospitalPhotos: [...currentPhotos, ...uploadedUrls]
      };
      
      const response = await hospitalAPI.updateProfile(updateData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        alert(`${files.length} photo(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading photos');
    } finally {
      setUploading(false);
    }
  };

  // Operational Details handlers
  const handleEditOperational = () => {
    setEditFormData({ ...hospitalData });
    setIsEditingOperational(true);
  };

  const handleSaveOperational = async () => {
    try {
      setUploading(true);
      const response = await hospitalAPI.updateProfile(editFormData);
      
      if (response.success) {
        setHospitalData(response.hospital);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        setIsEditingOperational(false);
        alert('Operational details updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Error updating operational details');
    } finally {
      setUploading(false);
    }
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

  const handleExpenseSave = async (category, data) => {
    try {
      setUploading(true);
      let response;

      if (expenseModalMode === 'add') {
        // Add new entry
        if (category === 'rooms') {
          data.room_id = `room_${Date.now()}`;
          response = await hospitalAPI.addRoom(data);
        } else if (category === 'procedures') {
          data.procedure_id = `proc_${Date.now()}`;
          response = await hospitalAPI.addProcedure(data);
        } else if (category === 'doctorFees') {
          data.doctor_id = `doc_${Date.now()}`;
          const updatedData = {
            doctorFees: [...doctorFees, data]
          };
          response = await hospitalAPI.updateProfile(updatedData);
        } else if (category === 'nursing') {
          data.service_id = `nurs_${Date.now()}`;
          const updatedData = {
            nursingCharges: [...nursingCharges, data]
          };
          response = await hospitalAPI.updateProfile(updatedData);
        } else if (category === 'miscellaneous') {
          data.service_id = `misc_${Date.now()}`;
          const updatedData = {
            miscServices: [...miscServices, data]
          };
          response = await hospitalAPI.updateProfile(updatedData);
        }
      } else {
        // Edit existing entry
        if (category === 'rooms') {
          response = await hospitalAPI.updateRoom(currentExpenseData._id, data);
        } else if (category === 'procedures') {
          response = await hospitalAPI.updateProcedure(currentExpenseData._id, data);
        } else {
          // For doctorFees, nursing, misc - update full array
          const field = category === 'doctorFees' ? 'doctorFees' : 
                       category === 'nursing' ? 'nursingCharges' : 'miscServices';
          const currentArray = category === 'doctorFees' ? doctorFees :
                              category === 'nursing' ? nursingCharges : miscServices;
          
          const updatedArray = currentArray.map(item => 
            item._id === currentExpenseData._id ? { ...item, ...data } : item
          );
          
          response = await hospitalAPI.updateProfile({ [field]: updatedArray });
        }
      }

      if (response.success) {
        // Update local state
        setHospitalData(response.hospital);
        setRooms(response.hospital.rooms || []);
        setProcedures(response.hospital.procedures || []);
        setDoctorFees(response.hospital.doctorFees || []);
        setNursingCharges(response.hospital.nursingCharges || []);
        setMiscServices(response.hospital.miscServices || []);
        
        alert(`${category} ${expenseModalMode === 'add' ? 'added' : 'updated'} successfully!`);
        closeExpenseModal();
      }
    } catch (error) {
      console.error('Save expense error:', error);
      alert(error.response?.data?.message || `Error saving ${category}`);
    } finally {
      setUploading(false);
    }
  };

  const handleExpenseDelete = async (category, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${category} entry?`)) {
      return;
    }

    try {
      setUploading(true);
      let response;

      if (category === 'rooms') {
        response = await hospitalAPI.deleteRoom(id);
      } else if (category === 'procedures') {
        response = await hospitalAPI.deleteProcedure(id);
      } else {
        // For doctorFees, nursing, miscellaneous - update full array
        const field = category === 'doctorFees' ? 'doctorFees' : 
                     category === 'nursing' ? 'nursingCharges' : 'miscServices';
        const currentArray = category === 'doctorFees' ? doctorFees :
                            category === 'nursing' ? nursingCharges : miscServices;
        
        const updatedArray = currentArray.filter(item => 
          (item._id || item.doctor_id || item.service_id) !== id
        );
        
        response = await hospitalAPI.updateProfile({ [field]: updatedArray });
      }

      if (response.success) {
        // Update local state
        setHospitalData(response.hospital);
        setRooms(response.hospital.rooms || []);
        setProcedures(response.hospital.procedures || []);
        setDoctorFees(response.hospital.doctorFees || []);
        setNursingCharges(response.hospital.nursingCharges || []);
        setMiscServices(response.hospital.miscServices || []);
        localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
        
        alert(`${category} entry deleted successfully!`);
      }
    } catch (error) {
      console.error('Delete expense error:', error);
      alert(error.response?.data?.message || `Error deleting ${category}`);
    } finally {
      setUploading(false);
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
        width: '100vw',
        background: '#234f83',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <div style={{
          fontSize: '18px',
          color: '#fff',
          fontWeight: '600'
        }}>Loading...</div>
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
                    {hospitalData.logo && (
                      <div style={{marginBottom: '20px', textAlign: 'center'}}>
                        <img 
                          src={hospitalData.logo} 
                          alt="Hospital Logo" 
                          style={{maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', border: '2px solid #e5e7eb'}}
                        />
                      </div>
                    )}
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
                  </div>
                </>
              ) : (
                <>
                  <div className="hosp-dash-form-grid">
                    <div className="hosp-dash-form-group full-width">
                      <label>Hospital Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files[0]) {
                            try {
                              setUploading(true);
                              const logoUrl = await uploadFile(e.target.files[0]);
                              setEditFormData({...editFormData, logo: logoUrl});
                              alert('Logo uploaded successfully!');
                            } catch (error) {
                              alert('Error uploading logo');
                            } finally {
                              setUploading(false);
                            }
                          }
                        }}
                        disabled={uploading}
                      />
                      {(editFormData.logo || hospitalData.logo) && (
                        <div style={{marginTop: '10px'}}>
                          <img 
                            src={editFormData.logo || hospitalData.logo} 
                            alt="Logo Preview" 
                            style={{maxWidth: '150px', maxHeight: '100px', borderRadius: '8px'}}
                          />
                        </div>
                      )}
                    </div>
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
                      <span>{hospitalData.workingHours?.opdHours || 'Not specified'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Emergency Hours:</label>
                      <span>{hospitalData.workingHours?.emergencyHours || '24×7'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Monday-Friday:</label>
                      <span>{hospitalData.workingHours?.mondayHours || 'Not specified'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Saturday Hours:</label>
                      <span>{hospitalData.workingHours?.saturdayHours || 'Not specified'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Sunday Hours:</label>
                      <span>{hospitalData.workingHours?.sundayHours || 'Not specified'}</span>
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
                        name="workingHours.opdHours"
                        value={editFormData['workingHours.opdHours'] || editFormData.workingHours?.opdHours || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 9:00 AM - 5:00 PM"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Emergency Hours</label>
                      <input
                        type="text"
                        name="workingHours.emergencyHours"
                        value={editFormData['workingHours.emergencyHours'] || editFormData.workingHours?.emergencyHours || '24×7'}
                        onChange={handleInputChange}
                        placeholder="24×7"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Monday-Friday Hours</label>
                      <input
                        type="text"
                        name="workingHours.mondayHours"
                        value={editFormData['workingHours.mondayHours'] || editFormData.workingHours?.mondayHours || ''}
                        onChange={handleInputChange}
                        placeholder="Monday-Friday hours"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Saturday Hours</label>
                      <input
                        type="text"
                        name="workingHours.saturdayHours"
                        value={editFormData['workingHours.saturdayHours'] || editFormData.workingHours?.saturdayHours || ''}
                        onChange={handleInputChange}
                        placeholder="Saturday hours"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Sunday Hours</label>
                      <input
                        type="text"
                        name="workingHours.sundayHours"
                        value={editFormData['workingHours.sundayHours'] || editFormData.workingHours?.sundayHours || ''}
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

              {!isEditingServices ? (
                <>
                  <div className="hosp-info-display">
                    <h3 className="hosp-info-section-title">Medical Services</h3>
                    <div className="hosp-info-row full-width">
                      <label>Facilities:</label>
                      <span>{hospitalData.facilities?.length > 0 ? hospitalData.facilities.join(', ') : 'None selected'}</span>
                    </div>
                    
                    <h3 className="hosp-info-section-title">Emergency & Ambulance</h3>
                    <div className="hosp-info-row">
                      <label>Emergency Services:</label>
                      <span>{hospitalData.emergencyServices ? '✅ Available' : '❌ Not Available'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Ambulance Service:</label>
                      <span>{hospitalData.ambulanceAvailable ? '✅ Available' : '❌ Not Available'}</span>
                    </div>
                    
                    <h3 className="hosp-info-section-title">Insurance</h3>
                    <div className="hosp-info-row">
                      <label>Insurance Accepted:</label>
                      <span>{hospitalData.insuranceAccepted ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className="hosp-info-row full-width">
                      <label>Insurance Providers:</label>
                      <span>{hospitalData.insuranceProviders?.length > 0 ? hospitalData.insuranceProviders.join(', ') : 'None listed'}</span>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleEditServices}>Edit Services & Facilities</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="hosp-services-grid">
                    <div className="hosp-service-category">
                      <h3>🏥 Medical Services & Facilities</h3>
                      <div className="hosp-checkbox-group">
                        {['OPD (Outpatient)', 'IPD (Inpatient)', 'Emergency Services', 'Surgeries', 'Lab Tests', 'Radiology & Imaging', 'Physiotherapy', 'Pharmacy', 'Teleconsultation', 'ICU', 'Operation Theatre (OT)', 'NICU', 'Dialysis', 'Ambulance', 'Parking', 'Wheelchair Access', 'Blood Bank', 'Cafeteria'].map(service => (
                          <label key={service} className="hosp-checkbox-label">
                            <input 
                              type="checkbox" 
                              checked={editFormData.facilities?.includes(service)}
                              onChange={() => handleServiceCheckbox(service)}
                            /> {service}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="hosp-service-category full-width">
                      <h3>🚑 Emergency Services</h3>
                      <div className="hosp-dash-form-group">
                        <label className="hosp-checkbox-label">
                          <input 
                            type="checkbox"
                            name="emergencyServices"
                            checked={editFormData.emergencyServices || false}
                            onChange={handleInputChange}
                          /> Emergency Services Available
                        </label>
                      </div>
                      <div className="hosp-dash-form-group">
                        <label className="hosp-checkbox-label">
                          <input 
                            type="checkbox"
                            name="ambulanceAvailable"
                            checked={editFormData.ambulanceAvailable || false}
                            onChange={handleInputChange}
                          /> Ambulance Service Available
                        </label>
                      </div>
                    </div>

                    <div className="hosp-service-category full-width">
                      <h3>💼 Insurance & Corporate</h3>
                      <div className="hosp-dash-form-group">
                        <label className="hosp-checkbox-label">
                          <input 
                            type="checkbox"
                            name="insuranceAccepted"
                            checked={editFormData.insuranceAccepted || false}
                            onChange={handleInputChange}
                          /> Insurance Accepted
                        </label>
                      </div>
                      <div className="hosp-dash-form-group">
                        <label>List of Insurers (comma separated)</label>
                        <textarea 
                          rows="3" 
                          name="insuranceProviders"
                          value={editFormData.insuranceProviders || ''}
                          onChange={handleInputChange}
                          placeholder="e.g., Star Health, HDFC Ergo, ICICI Lombard"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    <button className="hosp-dash-btn-primary" onClick={handleSaveServices} disabled={uploading}>
                      {uploading ? 'Saving...' : 'Save Services & Facilities'}
                    </button>
                  </div>
                </>
              )}
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
                      <select 
                        value={newSpeciality.name}
                        onChange={(e) => setNewSpeciality({...newSpeciality, name: e.target.value})}
                      >
                        <option value="">Select speciality</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Orthopaedics">Orthopaedics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Gynecology">Gynecology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="ENT">ENT</option>
                        <option value="Ophthalmology">Ophthalmology</option>
                        <option value="General Medicine">General Medicine</option>
                        <option value="General Surgery">General Surgery</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group">
                      <button 
                        className="hosp-dash-btn-primary" 
                        onClick={handleAddSpeciality}
                        disabled={uploading}
                      >
                        {uploading ? 'Adding...' : 'Add Speciality'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hosp-specialities-list">
                  <h3>Current Specialities</h3>
                  {hospitalData.specializations?.length > 0 ? (
                    <div style={{display: 'grid', gap: '10px', marginTop: '15px'}}>
                      {hospitalData.specializations.map((spec, idx) => (
                        <div key={idx} style={{
                          padding: '15px',
                          background: '#f9fafb',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{fontSize: '16px', fontWeight: '500'}}>🩺 {spec}</span>
                          <button 
                            onClick={() => handleDeleteSpeciality(spec)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '5px 15px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            disabled={uploading}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="hosp-info-placeholder">No specialities added yet. Add your first speciality above.</p>
                  )}
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

              <form onSubmit={handleAddDoctor} className="hosp-doctor-form">
                <h3>Add New Doctor</h3>
                <div className="hosp-dash-form-grid">
                  <div className="hosp-dash-form-group">
                    <label>Doctor Name *</label>
                    <input 
                      type="text" 
                      placeholder="Dr. Full Name"
                      value={newDoctor.name}
                      onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Qualification *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., MBBS, MD"
                      value={newDoctor.qualification}
                      onChange={(e) => setNewDoctor({...newDoctor, qualification: e.target.value})}
                      required
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Medical Registration Number</label>
                    <input 
                      type="text" 
                      placeholder="Medical council registration"
                      value={newDoctor.registration}
                      onChange={(e) => setNewDoctor({...newDoctor, registration: e.target.value})}
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Speciality *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Cardiology"
                      value={newDoctor.speciality}
                      onChange={(e) => setNewDoctor({...newDoctor, speciality: e.target.value})}
                      required
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Years of Experience</label>
                    <input 
                      type="number" 
                      placeholder="Total experience"
                      value={newDoctor.experience}
                      onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Languages Spoken (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., English, Hindi, Tamil"
                      value={newDoctor.languages}
                      onChange={(e) => setNewDoctor({...newDoctor, languages: e.target.value})}
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>OPD Days (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Mon, Wed, Fri"
                      value={newDoctor.opdDays}
                      onChange={(e) => setNewDoctor({...newDoctor, opdDays: e.target.value})}
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>OPD Timings</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 10:00 AM - 2:00 PM"
                      value={newDoctor.opdTimings}
                      onChange={(e) => setNewDoctor({...newDoctor, opdTimings: e.target.value})}
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Consultation Fee (In-person)</label>
                    <input 
                      type="number" 
                      placeholder="Fee in ₹"
                      value={newDoctor.consultFeeInPerson}
                      onChange={(e) => setNewDoctor({...newDoctor, consultFeeInPerson: e.target.value})}
                    />
                  </div>
                  <div className="hosp-dash-form-group">
                    <label>Online Consultation Fee</label>
                    <input 
                      type="number" 
                      placeholder="Fee in ₹"
                      value={newDoctor.consultFeeOnline}
                      onChange={(e) => setNewDoctor({...newDoctor, consultFeeOnline: e.target.value})}
                    />
                  </div>
                  <div className="hosp-dash-form-group full-width">
                    <label>Doctor Photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNewDoctor({...newDoctor, photo: e.target.files[0]})}
                    />
                  </div>
                </div>
                <div className="hosp-form-actions">
                  <button type="submit" className="hosp-dash-btn-primary" disabled={uploading}>
                    {uploading ? 'Adding...' : 'Add Doctor Profile'}
                  </button>
                </div>
              </form>

              {/* Display Added Doctors */}
              {console.log('=== RENDERING DOCTORS SECTION ===', 'Doctors array:', doctors, 'Length:', doctors.length)}
              <div style={{marginTop: '30px'}}>
                <h3>Added Doctors ({doctors.length})</h3>
                {doctors.length > 0 ? (
                  <div style={{display: 'grid', gap: '15px', marginTop: '15px'}}>
                    {doctors.map((doc, idx) => (
                      <div key={idx} style={{
                        padding: '20px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                          <div>
                            <h4 style={{margin: '0 0 10px 0'}}>👨‍⚕️ {doc.name}</h4>
                            <p style={{margin: '5px 0'}}><strong>Qualification:</strong> {doc.qualification}</p>
                            <p style={{margin: '5px 0'}}><strong>Speciality:</strong> {doc.speciality}</p>
                            {doc.opdDays && <p style={{margin: '5px 0'}}><strong>OPD Days:</strong> {Array.isArray(doc.opdDays) ? doc.opdDays.join(', ') : doc.opdDays}</p>}
                            {doc.consultFeeInPerson && <p style={{margin: '5px 0'}}><strong>Fee:</strong> ₹{doc.consultFeeInPerson}</p>}
                          </div>
                          <button 
                            onClick={() => handleDeleteDoctor(idx)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '8px 15px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            disabled={uploading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '2px dashed #e5e7eb',
                    marginTop: '15px'
                  }}>
                    <p style={{fontSize: '16px', color: '#6b7280', margin: 0}}>📝 No doctors added yet. Add your first doctor profile above.</p>
                  </div>
                )}
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

              {console.log('=== RENDERING APPOINTMENT SECTION ===', {
                acceptOnlineBooking: hospitalData.acceptOnlineBooking,
                bookingType: hospitalData.bookingType,
                slotDuration: hospitalData.slotDuration,
                allData: hospitalData
              })}
              {!isEditingAppointments ? (
                <>
                  <div className="hosp-info-display">
                    <div className="hosp-info-row">
                      <label>Accept Online Booking:</label>
                      <span>{hospitalData.acceptOnlineBooking === 'yes' ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Booking Type:</label>
                      <span style={{textTransform: 'capitalize'}}>{hospitalData.bookingType || 'Not set'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Slot Duration:</label>
                      <span>{hospitalData.slotDuration ? `${hospitalData.slotDuration} minutes` : 'Not set'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Advance Booking:</label>
                      <span>{hospitalData.advanceBookingDays ? `${hospitalData.advanceBookingDays} days` : 'Not set'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Cancellation Policy:</label>
                      <span style={{textTransform: 'capitalize'}}>{hospitalData.cancellationPolicy || 'Not set'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Prepayment Required:</label>
                      <span style={{textTransform: 'capitalize'}}>{hospitalData.prepaymentRequired || 'No'}</span>
                    </div>
                    <div className="hosp-info-row full-width">
                      <label>Patient Instructions:</label>
                      <span style={{whiteSpace: 'pre-wrap'}}>{hospitalData.patientInstructions || 'None specified'}</span>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleEditAppointments}>Edit Appointment Settings</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="hosp-dash-form-grid">
                    <div className="hosp-dash-form-group">
                      <label>Accept Online Booking?</label>
                      <select
                        name="acceptOnlineBooking"
                        value={editFormData.acceptOnlineBooking || 'yes'}
                        onChange={handleInputChange}
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Booking Type</label>
                      <select
                        name="bookingType"
                        value={editFormData.bookingType || 'appointment'}
                        onChange={handleInputChange}
                      >
                        <option value="appointment">Appointment Slots</option>
                        <option value="walk-in">Walk-in Only</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Slot Duration (minutes)</label>
                      <input 
                        type="number" 
                        name="slotDuration"
                        value={editFormData.slotDuration || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 15, 30" 
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Advance Booking (days)</label>
                      <input 
                        type="number" 
                        name="advanceBookingDays"
                        value={editFormData.advanceBookingDays || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 7, 14, 30" 
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Cancellation Policy</label>
                      <select
                        name="cancellationPolicy"
                        value={editFormData.cancellationPolicy || 'free'}
                        onChange={handleInputChange}
                      >
                        <option value="free">Free Cancellation</option>
                        <option value="24hrs">24 Hours Notice</option>
                        <option value="no-refund">No Refund</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Prepayment Required?</label>
                      <select
                        name="prepaymentRequired"
                        value={editFormData.prepaymentRequired || 'no'}
                        onChange={handleInputChange}
                      >
                        <option value="no">No</option>
                        <option value="partial">Partial</option>
                        <option value="full">Full Payment</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group full-width">
                      <label>Special Instructions for Patients</label>
                      <textarea 
                        rows="3" 
                        name="patientInstructions"
                        value={editFormData.patientInstructions || ''}
                        onChange={handleInputChange}
                        placeholder="Any special instructions or guidelines..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    <button className="hosp-dash-btn-primary" onClick={handleSaveAppointments} disabled={uploading}>
                      {uploading ? 'Saving...' : 'Save Appointment Settings'}
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Billing & Bank Section */}
          {activeSection === 'billing' && (
            <section className="hosp-dash-section">
              <div className="section-header">
                <h2>💰 Billing & Bank Details</h2>
                <p>Payment and banking information</p>
              </div>

              {!isEditingBilling ? (
                <>
                  <div className="hosp-info-display">
                    <h3 className="hosp-info-section-title">Billing Information</h3>
                    <div className="hosp-info-row">
                      <label>GST Number:</label>
                      <span>{hospitalData.gstNumber || 'Not provided'}</span>
                    </div>

                    <h3 className="hosp-info-section-title">Bank Account Details</h3>
                    <div className="hosp-info-row">
                      <label>Account Holder:</label>
                      <span>{hospitalData.accountDetails?.accountHolderName || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Account Number:</label>
                      <span>{hospitalData.accountDetails?.accountNumber || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>IFSC Code:</label>
                      <span>{hospitalData.accountDetails?.ifscCode || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Bank Name:</label>
                      <span>{hospitalData.accountDetails?.bankName || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Branch Name:</label>
                      <span>{hospitalData.accountDetails?.branchName || 'Not provided'}</span>
                    </div>
                    <div className="hosp-info-row">
                      <label>Cancelled Cheque:</label>
                      <span>{hospitalData.accountDetails?.bankProof ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleEditBilling}>Edit Billing & Bank Details</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="hosp-dash-form-grid">
                    <h3 className="hosp-dash-section-title">Billing Information</h3>
                    <div className="hosp-dash-form-group">
                      <label>GSTIN (if applicable)</label>
                      <input 
                        type="text" 
                        name="gstNumber"
                        value={editFormData.gstNumber || ''}
                        onChange={handleInputChange}
                        placeholder="GST Identification Number" 
                      />
                    </div>

                    <h3 className="hosp-dash-section-title">Bank Account Details</h3>
                    <div className="hosp-dash-form-group">
                      <label>Account Holder Name *</label>
                      <input 
                        type="text" 
                        name="accountHolderName"
                        value={editFormData.accountHolderName || ''}
                        onChange={handleInputChange}
                        placeholder="As per bank records" 
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Account Type *</label>
                      <select
                        name="accountType"
                        value={editFormData.accountType || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select type</option>
                        <option value="current">Current Account</option>
                        <option value="savings">Savings Account</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group full-width">
                      <label>Bank Account Number *</label>
                      <input 
                        type="text" 
                        name="accountNumber"
                        value={editFormData.accountNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Account number" 
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>IFSC Code *</label>
                      <input 
                        type="text" 
                        name="ifscCode"
                        value={editFormData.ifscCode || ''}
                        onChange={handleInputChange}
                        placeholder="Bank IFSC code" 
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Bank Name *</label>
                      <input 
                        type="text" 
                        name="bankName"
                        value={editFormData.bankName || ''}
                        onChange={handleInputChange}
                        placeholder="Name of bank" 
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Branch Name</label>
                      <input 
                        type="text" 
                        name="branchName"
                        value={editFormData.branchName || ''}
                        onChange={handleInputChange}
                        placeholder="Branch location" 
                      />
                    </div>
                    <div className="hosp-dash-form-group full-width">
                      <label>Upload Cancelled Cheque</label>
                      <input 
                        type="file" 
                        name="cancelledCheque"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png" 
                      />
                      {hospitalData.accountDetails?.bankProof && <small style={{color: '#10b981'}}>✅ Current file uploaded</small>}
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    <button className="hosp-dash-btn-primary" onClick={handleSaveBilling} disabled={uploading}>
                      {uploading ? 'Saving...' : 'Save Billing & Bank Details'}
                    </button>
                  </div>
                </>
              )}
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
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleDocumentUpload('registrationCertificate', e.target.files[0])}
                    disabled={uploading}
                  />
                  <small>Required: Registration proof</small>
                  {hospitalData.registrationCertificate && (
                    <>
                      <p style={{color: '#10b981', fontSize: '12px'}}>✅ Uploaded</p>
                      <button 
                        onClick={() => window.open(hospitalData.registrationCertificate, '_blank')}
                        className="hosp-dash-btn-secondary"
                        style={{marginTop: '10px', fontSize: '12px', padding: '5px 10px'}}
                      >
                        View Document
                      </button>
                    </>
                  )}
                </div>

                <div className="hosp-document-item">
                  <h4>📋 Municipal/Utility Documents</h4>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleDocumentUpload('ownershipProof', e.target.files[0])}
                    disabled={uploading}
                  />
                  <small>Optional: Additional proof</small>
                  {hospitalData.ownershipProof && (
                    <>
                      <p style={{color: '#10b981', fontSize: '12px'}}>✅ Uploaded</p>
                      <button 
                        onClick={() => window.open(hospitalData.ownershipProof, '_blank')}
                        className="hosp-dash-btn-secondary"
                        style={{marginTop: '10px', fontSize: '12px', padding: '5px 10px'}}
                      >
                        View Document
                      </button>
                    </>
                  )}
                </div>

                <div className="hosp-document-item">
                  <h4>💳 PAN Card *</h4>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleDocumentUpload('panCard', e.target.files[0])}
                    disabled={uploading}
                  />
                  <small>PAN card copy</small>
                  {hospitalData.panCard && (
                    <>
                      <p style={{color: '#10b981', fontSize: '12px'}}>✅ Uploaded</p>
                      <button 
                        onClick={() => window.open(hospitalData.panCard, '_blank')}
                        className="hosp-dash-btn-secondary"
                        style={{marginTop: '10px', fontSize: '12px', padding: '5px 10px'}}
                      >
                        View Document
                      </button>
                    </>
                  )}
                </div>

                <div className="hosp-document-item">
                  <h4>💼 GST Certificate</h4>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleDocumentUpload('gstCertificate', e.target.files[0])}
                    disabled={uploading}
                  />
                  <small>If applicable</small>
                  {hospitalData.gstCertificate && (
                    <>
                      <p style={{color: '#10b981', fontSize: '12px'}}>✅ Uploaded</p>
                      <button 
                        onClick={() => window.open(hospitalData.gstCertificate, '_blank')}
                        className="hosp-dash-btn-secondary"
                        style={{marginTop: '10px', fontSize: '12px', padding: '5px 10px'}}
                      >
                        View Document
                      </button>
                    </>
                  )}
                </div>
              </div>

              {uploading && (
                <div style={{textAlign: 'center', padding: '20px', color: '#234f83'}}>
                  <p>Uploading document... Please wait.</p>
                </div>
              )}
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
                  <h3>🏢 Hospital Photos</h3>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={(e) => e.target.files.length > 0 && handleMediaUpload('hospital', e.target.files)}
                    disabled={uploading}
                  />
                  <small>Exterior, interior, OPD, labs, facilities</small>
                  {hospitalData.hospitalPhotos?.length > 0 && (
                    <p style={{color: '#10b981', fontSize: '12px'}}>
                      ✅ {hospitalData.hospitalPhotos.length} photo(s) uploaded
                    </p>
                  )}
                </div>
              </div>

              {uploading && (
                <div style={{textAlign: 'center', padding: '20px', color: '#234f83'}}>
                  <p>Uploading photos... Please wait.</p>
                </div>
              )}

              {hospitalData.hospitalPhotos?.length > 0 && (
                <div style={{marginTop: '30px'}}>
                  <h3>Uploaded Photos</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '15px'}}>
                    {hospitalData.hospitalPhotos.map((photo, idx) => (
                      <div key={idx} style={{position: 'relative'}}>
                        <img 
                          src={photo} 
                          alt={`Hospital ${idx + 1}`}
                          style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px'}}
                        />
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this image?')) {
                              try {
                                setUploading(true);
                                const updatedPhotos = hospitalData.hospitalPhotos.filter((_, i) => i !== idx);
                                const response = await hospitalAPI.updateProfile({ hospitalPhotos: updatedPhotos });
                                if (response.success) {
                                  setHospitalData(response.hospital);
                                  localStorage.setItem('hospitalData', JSON.stringify(response.hospital));
                                  alert('Image deleted successfully!');
                                }
                              } catch (error) {
                                alert('Error deleting image');
                              } finally {
                                setUploading(false);
                              }
                            }
                          }}
                          disabled={uploading}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                          title="Delete image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    <span className="hosp-field-label">Certificate:</span>
                    <span className="hosp-field-value">{hospitalData.gstCertificate ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                  </div>
                  <input 
                    type="file" 
                    id="gstCert" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    style={{display: 'none'}}
                    onChange={(e) => e.target.files[0] && handleDocumentUpload('gstCertificate', e.target.files[0])}
                  />
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '10px'}}
                    onClick={() => document.getElementById('gstCert').click()}
                    disabled={uploading}
                  >
                    Upload GST Certificate
                  </button>
                  {hospitalData.gstCertificate && (
                    <button 
                      onClick={() => window.open(hospitalData.gstCertificate, '_blank')}
                      className="hosp-dash-btn-secondary"
                      style={{marginTop: '10px', marginLeft: '10px'}}
                    >
                      View Certificate
                    </button>
                  )}
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
                  <input 
                    type="file" 
                    id="regCert" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    style={{display: 'none'}}
                    onChange={(e) => e.target.files[0] && handleDocumentUpload('registrationCertificate', e.target.files[0])}
                  />
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '10px'}}
                    onClick={() => document.getElementById('regCert').click()}
                    disabled={uploading}
                  >
                    Upload Certificate
                  </button>
                  {hospitalData.registrationCertificate && (
                    <button 
                      onClick={() => window.open(hospitalData.registrationCertificate, '_blank')}
                      className="hosp-dash-btn-secondary"
                      style={{marginTop: '10px', marginLeft: '10px'}}
                    >
                      View Certificate
                    </button>
                  )}
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
                  <input 
                    type="file" 
                    id="panCard" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    style={{display: 'none'}}
                    onChange={(e) => e.target.files[0] && handleDocumentUpload('panCard', e.target.files[0])}
                  />
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '10px'}}
                    onClick={() => document.getElementById('panCard').click()}
                    disabled={uploading}
                  >
                    Upload PAN Card
                  </button>
                  {hospitalData.panCard && (
                    <button 
                      onClick={() => window.open(hospitalData.panCard, '_blank')}
                      className="hosp-dash-btn-secondary"
                      style={{marginTop: '10px', marginLeft: '10px'}}
                    >
                      View PAN Card
                    </button>
                  )}
                </div>

                <div className="hosp-info-card">
                  <h3>🏦 Bank Account Verification</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Account No:</span>
                    <span className="hosp-field-value">{hospitalData.accountDetails?.accountNumber || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Proof:</span>
                    <span className="hosp-field-value">{hospitalData.accountDetails?.bankProof ? '✅ Uploaded' : '❌ Not uploaded'}</span>
                  </div>
                  <input 
                    type="file" 
                    id="bankProof" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    style={{display: 'none'}}
                    onChange={(e) => e.target.files[0] && handleDocumentUpload('accountDetails.bankProof', e.target.files[0])}
                  />
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '10px'}}
                    onClick={() => document.getElementById('bankProof').click()}
                    disabled={uploading}
                  >
                    Upload Passbook/Cancelled Cheque
                  </button>
                  {hospitalData.accountDetails?.bankProof && (
                    <button 
                      onClick={() => window.open(hospitalData.accountDetails.bankProof, '_blank')}
                      className="hosp-dash-btn-secondary"
                      style={{marginTop: '10px', marginLeft: '10px'}}
                    >
                      View Bank Proof
                    </button>
                  )}
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

              {!isEditingOperational ? (
                <>
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
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={handleEditOperational}>Edit Hours</button>
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
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={handleEditOperational}>Update Fees</button>
                </div>

                <div className="hosp-info-card">
                  <h3>🏥 Available Services</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Total Services:</span>
                    <span className="hosp-field-value">{hospitalData.facilities?.length || 0}</span>
                  </div>
                  <div style={{marginTop: '10px'}}>
                    {hospitalData.facilities?.slice(0, 5).map((service, idx) => (
                      <div key={idx} style={{padding: '5px 0', fontSize: '14px'}}>✅ {service}</div>
                    ))}
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={() => setActiveSection('services')}>Manage Services</button>
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
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={() => setActiveSection('services')}>Manage Facilities</button>
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
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={handleEditOperational}>Update Capacity</button>
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
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={handleEditOperational}>Update Services</button>
                </div>
              </div>
              </>
              ) : (
                <>
                  <div className="hosp-dash-form-grid">
                    <div className="hosp-dash-form-group">
                      <label>24x7 Status</label>
                      <select
                        name="is24x7"
                        value={editFormData.is24x7 || false}
                        onChange={(e) => setEditFormData({...editFormData, is24x7: e.target.value === 'true'})}
                      >
                        <option value="true">24x7 Open</option>
                        <option value="false">Limited Hours</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Opening Time</label>
                      <input 
                        type="time" 
                        name="openingTime"
                        value={editFormData.openingTime || ''}
                        onChange={(e) => setEditFormData({...editFormData, openingTime: e.target.value})}
                        disabled={editFormData.is24x7 === true || editFormData.is24x7 === 'true'}
                        style={{cursor: (editFormData.is24x7 === true || editFormData.is24x7 === 'true') ? 'not-allowed' : 'pointer'}}
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Closing Time</label>
                      <input 
                        type="time" 
                        name="closingTime"
                        value={editFormData.closingTime || ''}
                        onChange={(e) => setEditFormData({...editFormData, closingTime: e.target.value})}
                        disabled={editFormData.is24x7 === true || editFormData.is24x7 === 'true'}
                        style={{cursor: (editFormData.is24x7 === true || editFormData.is24x7 === 'true') ? 'not-allowed' : 'pointer'}}
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Min Consultation Fee (₹)</label>
                      <input 
                        type="number" 
                        name="minConsultFee"
                        value={editFormData.minConsultFee || ''}
                        onChange={handleInputChange}
                        placeholder="Minimum fee"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Max Consultation Fee (₹)</label>
                      <input 
                        type="number" 
                        name="maxConsultFee"
                        value={editFormData.maxConsultFee || ''}
                        onChange={handleInputChange}
                        placeholder="Maximum fee"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Emergency Fee (₹)</label>
                      <input 
                        type="number" 
                        name="emergencyFee"
                        value={editFormData.emergencyFee || ''}
                        onChange={handleInputChange}
                        placeholder="Emergency consultation fee"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Total Beds</label>
                      <input 
                        type="number" 
                        name="totalBeds"
                        value={editFormData.totalBeds || ''}
                        onChange={handleInputChange}
                        placeholder="Total bed capacity"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>ICU Beds</label>
                      <input 
                        type="number" 
                        name="icuBeds"
                        value={editFormData.icuBeds || ''}
                        onChange={handleInputChange}
                        placeholder="ICU bed count"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Ventilators</label>
                      <input 
                        type="number" 
                        name="ventilators"
                        value={editFormData.ventilators || ''}
                        onChange={handleInputChange}
                        placeholder="Number of ventilators"
                      />
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Emergency Services Available</label>
                      <select
                        name="emergencyAvailable"
                        value={editFormData.emergencyAvailable || false}
                        onChange={(e) => setEditFormData({...editFormData, emergencyAvailable: e.target.value === 'true'})}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="hosp-dash-form-group">
                      <label>Ambulance Service</label>
                      <select
                        name="ambulanceService"
                        value={editFormData.ambulanceService || false}
                        onChange={(e) => setEditFormData({...editFormData, ambulanceService: e.target.value === 'true'})}
                      >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                      </select>
                    </div>
                  </div>

                  <div className="hosp-form-actions">
                    <button className="hosp-dash-btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    <button className="hosp-dash-btn-primary" onClick={handleSaveOperational} disabled={uploading}>
                      {uploading ? 'Saving...' : 'Save Operational Details'}
                    </button>
                  </div>
                </>
              )}
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
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={() => alert('Commission details:\n\nType: ' + (hospitalData.commissionType || 'Not Set') + '\nValue: ' + (hospitalData.commissionType === 'percentage' ? hospitalData.commissionValue + '%' : '₹' + (hospitalData.commissionValue || 0)) + '\n\nContact admin for modifications.')}>View Details</button>
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
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={() => alert('Settlement History:\n\nFrequency: ' + (hospitalData.settlementCycle || 'Not Set') + '\nPayment Mode: ' + (hospitalData.paymentMode || 'Not Set') + '\nLast Settlement: ' + (hospitalData.lastSettlement || 'N/A') + '\n\nNo transaction history available yet.')}>View History</button>
                </div>

                <div className="hosp-info-card">
                  <h3>💳 Payout Account</h3>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Account Number:</span>
                    <span className="hosp-field-value">{hospitalData.accountDetails?.accountNumber || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">Bank Name:</span>
                    <span className="hosp-field-value">{hospitalData.accountDetails?.bankName || 'Not provided'}</span>
                  </div>
                  <div className="hosp-field-row">
                    <span className="hosp-field-label">IFSC Code:</span>
                    <span className="hosp-field-value">{hospitalData.accountDetails?.ifscCode || 'Not provided'}</span>
                  </div>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={() => setActiveSection('billing')}>Update Account</button>
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
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '10px'}} onClick={() => alert('Commission Report (This Month):\n\nTotal Bookings: 0\nCommission Earned: ₹0\nPending Settlement: ₹0\n\nNo transactions recorded yet.')}>View Report</button>
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
                <div className="hosp-info-card" style={{backgroundColor :'#234f83', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>🛏️ Rooms & Boards</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{rooms.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Room types configured</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#234f83'}}
                    onClick={() => openExpenseModal('rooms', 'add')}
                  >
                    + Add Room Type
                  </button>
                </div>

                <div className="hosp-info-card" style={{backgroundColor :'#234f83', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>🏥 Medical Procedures</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{procedures.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Procedures listed</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#234f83'}}
                    onClick={() => openExpenseModal('procedures', 'add')}
                  >
                    + Add Procedure
                  </button>
                </div>

                <div className="hosp-info-card" style={{backgroundColor :'#234f83', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>👨‍⚕️ Doctor Fees</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{doctorFees.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Doctor fee structures</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#234f83'}}
                    onClick={() => openExpenseModal('doctorFees', 'add')}
                  >
                    + Add Doctor Fee
                  </button>
                </div>

                <div className="hosp-info-card" style={{backgroundColor :'#234f83', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>👩‍⚕️ Nursing & Staff</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{nursingCharges.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Nursing charges</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#234f83'}}
                    onClick={() => openExpenseModal('nursing', 'add')}
                  >
                    + Add Service
                  </button>
                </div>

                <div className="hosp-info-card" style={{backgroundColor :'#234f83', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>🔧 Miscellaneous</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>{miscServices.length}</div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Other services</p>
                  <button 
                    className="hosp-dash-btn-secondary" 
                    style={{marginTop: '15px', background: '#fff', color: '#234f83'}}
                    onClick={() => openExpenseModal('miscellaneous', 'add')}
                  >
                    + Add Service
                  </button>
                </div>

                <div className="hosp-info-card" style={{backgroundColor :'#234f83', color: '#fff'}}>
                  <h3 style={{color: '#fff'}}>📊 Total Entries</h3>
                  <div style={{fontSize: '32px', fontWeight: 'bold', margin: '15px 0'}}>
                    {rooms.length + procedures.length + doctorFees.length + nursingCharges.length + miscServices.length}
                  </div>
                  <p style={{fontSize: '14px', opacity: 0.9}}>Total expense entries</p>
                  <button className="hosp-dash-btn-secondary" style={{marginTop: '15px', background: '#fff', color: '#234f83'}}>View All</button>
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

              {/* Nursing Charges Table */}
              <div style={{marginTop: '30px'}}>
                <h3 style={{color: '#234f83', marginBottom: '20px'}}>👩‍⚕️ Nursing & Staff Charges</h3>
                <div style={{background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Service ID</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Service Name</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Charge Type</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Amount</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Status</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nursingCharges.length > 0 ? nursingCharges.map(charge => (
                        <tr key={charge.service_id} style={{borderBottom: '1px solid #f3f4f6'}}>
                          <td style={{padding: '12px'}}>{charge.service_id}</td>
                          <td style={{padding: '12px'}}>{charge.service_name}</td>
                          <td style={{padding: '12px'}}>{charge.charge_type}</td>
                          <td style={{padding: '12px', fontWeight: '600'}}>₹{charge.charge_amount}</td>
                          <td style={{padding: '12px'}}>
                            <span className={`hosp-status-badge ${charge.status?.toLowerCase() || 'active'}`}>{charge.status || 'Active'}</span>
                          </td>
                          <td style={{padding: '12px'}}>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginRight: '8px'}}
                              onClick={() => openExpenseModal('nursing', 'edit', charge)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'}}
                              onClick={() => handleExpenseDelete('nursing', charge.service_id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" style={{padding: '20px', textAlign: 'center', color: '#6b7280'}}>No nursing charges added yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Miscellaneous Services Table */}
              <div style={{marginTop: '30px'}}>
                <h3 style={{color: '#234f83', marginBottom: '20px'}}>🔧 Miscellaneous Services</h3>
                <div style={{background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Service ID</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Service</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Charge</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Status</th>
                        <th style={{padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {miscServices.length > 0 ? miscServices.map(service => (
                        <tr key={service.service_id} style={{borderBottom: '1px solid #f3f4f6'}}>
                          <td style={{padding: '12px'}}>{service.service_id}</td>
                          <td style={{padding: '12px'}}>{service.service}</td>
                          <td style={{padding: '12px', fontWeight: '600'}}>₹{service.charge}</td>
                          <td style={{padding: '12px'}}>
                            <span className={`hosp-status-badge ${service.status?.toLowerCase() || 'active'}`}>{service.status || 'Active'}</span>
                          </td>
                          <td style={{padding: '12px'}}>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginRight: '8px'}}
                              onClick={() => openExpenseModal('miscellaneous', 'edit', service)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px'}}
                              onClick={() => handleExpenseDelete('miscellaneous', service.service_id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" style={{padding: '20px', textAlign: 'center', color: '#6b7280'}}>No miscellaneous services added yet</td>
                        </tr>
                      )}
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
                  <button className="hosp-dash-btn-secondary" onClick={() => {
                    const data = {
                      rooms,
                      procedures,
                      doctorFees,
                      nursingCharges,
                      miscServices
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${hospitalData.hospitalName || 'hospital'}-expenses-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>📤 Export Data</button>
                  <button className="hosp-dash-btn-secondary" onClick={() => {
                    const reportData = `
=== HOSPITAL EXPENSE REPORT ===
Hospital: ${hospitalData.hospitalName || 'N/A'}
Generated: ${new Date().toLocaleString()}

ROOMS & BOARDS: ${rooms.length} entries
PROCEDURES: ${procedures.length} entries  
DOCTOR FEES: ${doctorFees.length} entries
NURSING CHARGES: ${nursingCharges.length} entries
MISC SERVICES: ${miscServices.length} entries

TOTAL ENTRIES: ${rooms.length + procedures.length + doctorFees.length + nursingCharges.length + miscServices.length}
                    `;
                    const blob = new Blob([reportData], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${hospitalData.hospitalName || 'hospital'}-report-${new Date().toISOString().split('T')[0]}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>📊 Generate Report</button>
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
