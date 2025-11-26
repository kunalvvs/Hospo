const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { sendOTP, verifyOTP, resendOTP } = require('../controllers/otpController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// OTP routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
