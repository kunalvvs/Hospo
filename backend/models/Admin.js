const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin']
  },
  
  // Admin Profile
  profilePhoto: String,
  designation: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Moderator', 'Support Staff']
  },
  department: String,
  
  // Permissions
  permissions: {
    manageDoctors: {
      type: Boolean,
      default: true
    },
    manageHospitals: {
      type: Boolean,
      default: true
    },
    managePatients: {
      type: Boolean,
      default: true
    },
    manageChemists: {
      type: Boolean,
      default: true
    },
    manageAmbulances: {
      type: Boolean,
      default: true
    },
    managePathlabs: {
      type: Boolean,
      default: true
    },
    manageAdmins: {
      type: Boolean,
      default: false
    },
    approveRegistrations: {
      type: Boolean,
      default: true
    },
    handleComplaints: {
      type: Boolean,
      default: true
    },
    viewAnalytics: {
      type: Boolean,
      default: true
    },
    managePayments: {
      type: Boolean,
      default: true
    },
    sendNotifications: {
      type: Boolean,
      default: true
    },
    manageContent: {
      type: Boolean,
      default: true
    }
  },
  
  // Activity Tracking
  lastLogin: Date,
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    device: String
  }],
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  
  // Created By (for tracking who created this admin)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Encrypt password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
