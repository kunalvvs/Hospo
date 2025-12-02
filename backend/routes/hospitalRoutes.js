const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  updateSection,
  addDoctor,
  removeDoctor,
  getAllHospitals,
  uploadFile,
  addRoom,
  updateRoom,
  deleteRoom,
  addProcedure,
  updateProcedure,
  deleteProcedure
} = require('../controllers/hospitalController');

// Public routes
router.get('/', getAllHospitals);

// Protected routes - require authentication as hospital
router.use(protect);
router.use(authorize('hospital'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/:section', updateSection);
router.post('/upload', upload.single('file'), uploadFile);

router.post('/doctors/:doctorId', addDoctor);
router.delete('/doctors/:doctorId', removeDoctor);

router.post('/rooms', addRoom);
router.put('/rooms/:roomId', updateRoom);
router.delete('/rooms/:roomId', deleteRoom);

router.post('/procedures', addProcedure);
router.put('/procedures/:procedureId', updateProcedure);
router.delete('/procedures/:procedureId', deleteProcedure);

module.exports = router;
