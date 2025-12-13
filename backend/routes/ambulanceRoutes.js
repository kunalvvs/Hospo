const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateSection,
  uploadFile,
  getProfileCompletion,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  getDocuments,
  deleteDocument,
  updateLocation,
  updateStatus,
  getAllAmbulances,
  getAmbulanceById,
  deleteProfile
} = require('../controllers/ambulanceController');
const {
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  migrateLegacyDriver,
  migrateLegacyVehicle
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ==================== PROTECTED ROUTES (require authentication) ====================
// Profile management
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

// Section-based updates
router.put('/profile/:section', protect, updateSection);

// File upload
router.post('/upload', protect, upload.single('file'), uploadFile);

// Profile completion
router.get('/profile-completion', protect, getProfileCompletion);

// ==================== DRIVER PROFILES CRUD ====================
router.get('/drivers', protect, getDrivers);
router.post('/drivers', protect, addDriver);
router.put('/drivers/:driverId', protect, updateDriver);
router.delete('/drivers/:driverId', protect, deleteDriver);

// ==================== VEHICLE PROFILES CRUD ====================
router.get('/vehicles', protect, getVehicles);
router.post('/vehicles', protect, addVehicle);
router.put('/vehicles/:vehicleId', protect, updateVehicle);
router.delete('/vehicles/:vehicleId', protect, deleteVehicle);

// ==================== MIGRATION ENDPOINTS ====================
router.post('/migrate-driver', protect, migrateLegacyDriver);
router.post('/migrate-vehicle', protect, migrateLegacyVehicle);

// Equipment management (legacy)
router.post('/equipment', protect, addEquipment);
router.put('/equipment/:equipmentId', protect, updateEquipment);
router.delete('/equipment/:equipmentId', protect, deleteEquipment);

// Document management
router.get('/documents', protect, getDocuments);
router.delete('/documents/:docId', protect, deleteDocument);

// Location and status updates
router.put('/location', protect, updateLocation);
router.put('/status', protect, updateStatus);

// ==================== PUBLIC ROUTES ====================
// Get all ambulances (for users/admin)
router.get('/', getAllAmbulances);

// Get specific ambulance by ID
router.get('/:id', getAmbulanceById);

module.exports = router;
