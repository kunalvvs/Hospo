const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const chemistSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide shop name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
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
    default: 'chemist',
    enum: ['chemist']
  },
  
  // License & Registration
  licenseNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  licenseDocument: String,
  gstNumber: String,
  drugLicense: String,
  
  // Owner Information
  ownerName: String,
  ownerPhoto: String,
  ownerIdType: {
    type: String,
    enum: ['Aadhaar', 'PAN', 'Voter ID', 'Driving License', 'Passport']
  },
  ownerIdNumber: String,
  ownerIdDocument: String,
  
  // Shop Details
  shopPhoto: String,
  shopType: {
    type: String,
    enum: ['Medical Store', 'Pharmacy', 'Chain Store', 'Hospital Pharmacy']
  },
  establishedYear: Number,
  
  // Address
  address: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    landmark: String,
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // Contact Details
  alternatePhone: String,
  whatsappNumber: String,
  
  // Operating Hours
  operatingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  is24x7: {
    type: Boolean,
    default: false
  },
  
  // Services
  services: [{
    type: String,
    enum: [
      'Prescription Medicines',
      'OTC Medicines',
      'Ayurvedic',
      'Homeopathic',
      'Health Supplements',
      'Medical Devices',
      'Surgical Items',
      'Baby Care',
      'Personal Care',
      'Home Delivery',
      'Online Consultation'
    ]
  }],
  
  // Payment Options
  paymentMethods: [{
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet', 'Insurance']
  }],
  
  // Bank Details
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branchName: String,
    upiId: String
  },
  
  // Certifications
  certifications: [String],
  
  // Orders & Inventory
  totalOrders: {
    type: Number,
    default: 0
  },
  inventorySize: Number,
  
  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  
  // Additional Info
  description: String,
  facilities: [String],
  
  // Timestamps
  lastLogin: Date
}, {
  timestamps: true
});

// Encrypt password before saving
chemistSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
chemistSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Chemist', chemistSchema);
