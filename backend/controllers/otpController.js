const Doctor = require('../models/Doctor');
const { sendOTPEmail } = require('../config/email');

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to email or phone
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const { email, phone, type } = req.body; // type: 'email' or 'phone'

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone number'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const identifier = email || phone;

    // Store OTP with 10 minutes expiry
    otpStore.set(identifier, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0
    });

    // Send OTP via email (non-blocking)
    if (email) {
      // Get doctor's name if exists
      const doctor = await Doctor.findOne({ email });
      const name = doctor ? doctor.fullName : '';
      
      // Don't wait for email - send in background
      sendOTPEmail(email, otp, name).then(result => {
        if (result.success) {
          console.log('✅ Email sent successfully');
        } else {
          console.error('⚠️ Email failed (but registration continues):', result.error);
        }
      }).catch(err => {
        console.error('⚠️ Email error (but registration continues):', err.message);
      });
    }

    // TODO: Integrate SMS service for phone OTP
    console.log(`📱 OTP for ${identifier}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${type === 'email' ? 'email' : 'phone'}`,
      // In demo/development mode, send OTP in response for testing
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const identifier = email || phone;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and OTP'
      });
    }

    // Get stored OTP
    const storedData = otpStore.get(identifier);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.'
      });
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(identifier);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(identifier);
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStore.set(identifier, storedData);
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`
      });
    }

    // OTP verified successfully
    otpStore.delete(identifier);

    // Mark user as verified in database
    if (email) {
      await Doctor.findOneAndUpdate(
        { email },
        { isVerified: true, emailVerified: true }
      );
    } else if (phone) {
      await Doctor.findOneAndUpdate(
        { phone },
        { isVerified: true, phoneVerified: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { email, phone, type } = req.body;
    const identifier = email || phone;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone number'
      });
    }

    // Delete old OTP
    otpStore.delete(identifier);

    // Generate new OTP
    const otp = generateOTP();

    // Store OTP
    otpStore.set(identifier, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });

    // Send OTP via email (non-blocking)
    if (email) {
      const doctor = await Doctor.findOne({ email });
      const name = doctor ? doctor.fullName : '';
      
      // Don't wait for email - send in background
      sendOTPEmail(email, otp, name).then(result => {
        if (result.success) {
          console.log('✅ Email resent successfully');
        } else {
          console.error('⚠️ Email failed (but registration continues):', result.error);
        }
      }).catch(err => {
        console.error('⚠️ Email error (but registration continues):', err.message);
      });
    }

    console.log(`📱 Resent OTP for ${identifier}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending OTP',
      error: error.message
    });
  }
};
