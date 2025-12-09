const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateSection,
  getAllPathlabs,
  getPathlabById,
  deleteProfile,
  uploadFile,
  getProfileCompletion,
  addTest,
  updateTest,
  deleteTest,
  getDocuments,
  deleteDocument
} = require('../controllers/pathlabController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected routes (require authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/:section', protect, updateSection);
router.delete('/profile', protect, deleteProfile);
router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/profile-completion', protect, getProfileCompletion);

// Test CRUD routes
router.post('/tests', protect, addTest);
router.put('/tests/:testId', protect, updateTest);
router.delete('/tests/:testId', protect, deleteTest);

// Document management routes
router.get('/documents', protect, getDocuments);
router.delete('/documents/:docId', protect, deleteDocument);

// Public routes
router.get('/', getAllPathlabs);
router.get('/:id', getPathlabById);

module.exports = router;
