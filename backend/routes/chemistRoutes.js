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
  getProfileCompletion
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

// Public routes
router.get('/', getAllChemists);
router.get('/:id', getChemistById);

module.exports = router;
