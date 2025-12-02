const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Chemist = require('../models/Chemist');
const Ambulance = require('../models/Ambulance');
const Pathlab = require('../models/Pathlab');
const Admin = require('../models/Admin');

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

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get the appropriate model based on role
      const Model = roleModelMap[decoded.role];
      if (!Model) {
        return res.status(401).json({
          success: false,
          message: 'Invalid user role'
        });
      }

      // Get user from token
      const user = await Model.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Attach user and role to request
      req.user = {
        id: user._id,
        role: decoded.role,
        data: user
      };

      // For backward compatibility with doctor routes
      if (decoded.role === 'doctor') {
        req.doctor = user;
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this route`
      });
    }
    next();
  };
};
