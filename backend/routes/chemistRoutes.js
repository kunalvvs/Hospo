const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateSection,
  getAllChemists,
  getChemistById,
  deleteProfile,
  uploadFile,
  getProfileCompletion,
  getNearbyChemists,
  searchMedicines,
  checkAvailability,
  placeOrder,
  getMyOrders,
  getChemistOrders,
  addRating,
  getChemistRatings
} = require('../controllers/chemistController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected routes (require authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/:section', protect, updateSection);
router.delete('/profile', protect, deleteProfile);
router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/profile-completion', protect, getProfileCompletion);

// Order routes (protected)
router.post('/orders', protect, placeOrder);
router.get('/orders/my-orders', protect, getMyOrders);
router.get('/orders/chemist-orders', protect, getChemistOrders);

// Rating routes
router.post('/:id/rating', protect, addRating);

// Public routes
router.get('/', getAllChemists);
router.get('/nearby', getNearbyChemists);
router.get('/medicines/search', searchMedicines);
router.get('/:id', getChemistById);
router.get('/:id/availability', checkAvailability);
router.get('/:id/ratings', getChemistRatings);

module.exports = router;
