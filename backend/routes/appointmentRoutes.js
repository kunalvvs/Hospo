const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

// Book appointment (patient)
router.post('/', protect, bookAppointment);

// Patient routes
router.get('/patient', protect, getPatientAppointments);

// Doctor routes (must come before /:id to avoid conflicts)
router.get('/doctor', protect, getDoctorAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);

// General routes
router.get('/:id', protect, getAppointmentById);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
