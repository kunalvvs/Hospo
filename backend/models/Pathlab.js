const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pathlabSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide lab name'],
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
    default: 'pathlab',
    enum: ['pathlab']
  },
  
  // Registration & License
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  registrationCertificate: String,
  licenseNumber: String,
  licenseDocument: String,
  nabLAccreditation: {
    type: Boolean,
    default: false
  },
  nabLCertificate: String,
  
  // Lab Details
  labType: {
    type: String,
    enum: ['Diagnostic Center', 'Pathology Lab', 'Radiology Center', 'Multi-Specialty Lab', 'Collection Center']
  },
  labPhoto: String,
  establishedYear: Number,
  
  // Owner/Director Information
  directorName: String,
  directorQualification: String,
  directorPhoto: String,
  directorIdType: {
    type: String,
    enum: ['Aadhaar', 'PAN', 'Voter ID', 'Driving License', 'Passport']
  },
  directorIdNumber: String,
  directorIdDocument: String,
  
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
  emergencyContact: String,
  website: String,
  
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
  
  // Services & Tests
  services: [{
    type: String,
    enum: [
      'Blood Test',
      'Urine Test',
      'X-Ray',
      'CT Scan',
      'MRI',
      'Ultrasound',
      'ECG',
      'Echo',
      'Endoscopy',
      'Biopsy',
      'COVID-19 Test',
      'Thyroid Profile',
      'Diabetes Panel',
      'Liver Function Test',
      'Kidney Function Test',
      'Lipid Profile',
      'Complete Blood Count',
      'Vitamin Profile',
      'Hormone Tests',
      'Cancer Markers',
      'Allergy Tests',
      'Genetic Tests',
      'Home Collection',
      'Online Reports'
    ]
  }],
  
  // Test Categories
  testCategories: [{
    category: String,
    tests: [{
      testName: String,
      price: Number,
      duration: String,
      sampleType: String
    }]
  }],
  
  // Facilities
  facilities: [{
    type: String,
    enum: [
      'Home Sample Collection',
      'Online Reports',
      'Digital X-Ray',
      'Color Doppler',
      'Advanced Machines',
      'NABL Certified',
      'CAP Certified',
      'ISO Certified',
      'Emergency Services',
      'Parking Available',
      'Wheelchair Accessible',
      'AC Waiting Room',
      'Separate Collection Rooms'
    ]
  }],
  
  // Equipment
  equipment: [{
    name: String,
    manufacturer: String,
    yearOfPurchase: Number
  }],
  
  // Staff
  totalStaff: Number,
  pathologists: [{
    name: String,
    qualification: String,
    registrationNumber: String,
    specialization: String
  }],
  technicians: Number,
  
  // Payment Options
  paymentMethods: [{
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet', 'Insurance', 'Corporate Tie-ups']
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
  
  // Pricing
  homeCollectionCharges: Number,
  urgentReportCharges: Number,
  discounts: {
    seniorCitizen: Number,
    packages: Boolean,
    corporateDiscount: Number
  },
  
  // Performance Metrics
  totalTests: {
    type: Number,
    default: 0
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  
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
  
  // Partnerships
  hospitalTieups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  }],
  doctorReferrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  
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
  specializations: [String],
  
  // Timestamps
  lastLogin: Date
}, {
  timestamps: true
});

// Encrypt password before saving
pathlabSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
pathlabSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Pathlab', pathlabSchema);
