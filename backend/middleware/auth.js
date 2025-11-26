const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

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

      // Get doctor from token
      req.doctor = await Doctor.findById(decoded.id).select('-password');

      if (!req.doctor) {
        return res.status(401).json({
          success: false,
          message: 'Doctor not found'
        });
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
    if (!roles.includes(req.doctor.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.doctor.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
