const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Chemist = require('../models/Chemist');
const Ambulance = require('../models/Ambulance');
const Pathlab = require('../models/Pathlab');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Role to Model mapping
const roleModelMap = {
  doctor: Doctor,
  patient: User,
  hospital: Hospital,
  chemist: Chemist,
  ambulance: Ambulance,
  pathlab: Pathlab,
  admin: Admin
};

// @desc    Register a new user (all roles)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, password, and role'
      });
    }

    // Validate role
    const validRoles = ['doctor', 'patient', 'hospital', 'chemist', 'ambulance', 'pathlab', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Get the appropriate model
    const Model = roleModelMap[role];

    // Check if user already exists across all models
    let existingUser = null;
    for (const [roleName, RoleModel] of Object.entries(roleModelMap)) {
      const found = await RoleModel.findOne({ $or: [{ email }, { phone }] });
      if (found) {
        existingUser = { user: found, role: roleName };
        break;
      }
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.user.email === email 
          ? `Email already registered as ${existingUser.role}` 
          : `Phone number already registered as ${existingUser.role}`
      });
    }

    // Create user with appropriate model
    const newUser = await Model.create({
      name,
      email,
      phone,
      password,
      role
    });

    // Generate token
    const token = generateToken(newUser._id, role);

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        registrationComplete: newUser.registrationComplete || false
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user (all roles)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let user = null;
    let userRole = null;

    // If role is provided, search in specific model
    if (role && roleModelMap[role]) {
      const Model = roleModelMap[role];
      user = await Model.findOne({ email }).select('+password');
      userRole = role;
    } else {
      // Search across all models
      for (const [roleName, Model] of Object.entries(roleModelMap)) {
        const found = await Model.findOne({ email }).select('+password');
        if (found) {
          user = found;
          userRole = roleName;
          break;
        }
      }
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.isActive !== undefined && !user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if account is blocked
    if (user.isBlocked !== undefined && user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Account is blocked. Please contact support.'
      });
    }

    // Generate token
    const token = generateToken(user._id, userRole);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: userRole,
        isVerified: user.isVerified,
        registrationComplete: user.registrationComplete || false
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

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const { id, role } = req.user;

    // Get the appropriate model
    const Model = roleModelMap[role];
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role'
      });
    }

    const user = await Model.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};
