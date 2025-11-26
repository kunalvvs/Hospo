const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register a new doctor
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and password'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ $or: [{ email }, { phone }] });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: existingDoctor.email === email ? 'Email already registered' : 'Phone number already registered'
      });
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      phone,
      password,
      role: 'doctor'
    });

    // Generate token
    const token = generateToken(doctor._id);

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        role: doctor.role
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering doctor',
      error: error.message
    });
  }
};

// @desc    Login doctor
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find doctor and include password field
    const doctor = await Doctor.findOne({ email }).select('+password');
    
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await doctor.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!doctor.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Generate token
    const token = generateToken(doctor._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        role: doctor.role,
        isVerified: doctor.isVerified
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current logged in doctor
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id);
    
    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor profile',
      error: error.message
    });
  }
};
