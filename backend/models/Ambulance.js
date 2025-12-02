const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ambulanceSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide provider/company name'],
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
    default: 'ambulance',
    enum: ['ambulance']
  },
  
  // Provider Type
  providerType: {
    type: String,
    enum: ['Individual', 'Company', 'Hospital Ambulance', 'Government', 'NGO'],
    required: true
  },
  
  // Registration & License
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  registrationCertificate: String,
  vehiclePermit: String,
  
  // Owner Information
  ownerName: String,
  ownerPhoto: String,
  ownerIdType: {
    type: String,
    enum: ['Aadhaar', 'PAN', 'Voter ID', 'Driving License', 'Passport']
  },
  ownerIdNumber: String,
  ownerIdDocument: String,
  
  // Base Address
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
  emergencyNumber: {
    type: String,
    required: true
  },
  alternatePhone: String,
  whatsappNumber: String,
  controlRoomNumber: String,
  
  // Service Coverage
  serviceCities: [String],
  serviceRadius: {
    type: Number, // in kilometers
    default: 50
  },
  
  // Fleet Details
  fleet: [{
    vehicleNumber: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      enum: ['Basic Ambulance', 'Advanced Life Support (ALS)', 'Basic Life Support (BLS)', 'Neonatal Ambulance', 'Air Ambulance', 'Patient Transport'],
      required: true
    },
    vehicleModel: String,
    yearOfManufacture: Number,
    insuranceNumber: String,
    insuranceExpiry: Date,
    rcDocument: String,
    insuranceDocument: String,
    fitnessDocument: String,
    polutionCertificate: String,
    
    // Vehicle Status
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    onTrip: {
      type: Boolean,
      default: false
    },
    
    // Equipment in Vehicle
    equipment: [{
      type: String,
      enum: [
        'Oxygen Cylinder',
        'Stretcher',
        'Ventilator',
        'Defibrillator',
        'ECG Machine',
        'Suction Machine',
        'First Aid Kit',
        'IV Setup',
        'Patient Monitor',
        'Nebulizer',
        'Wheelchair',
        'Spine Board',
        'Fire Extinguisher',
        'Emergency Lights',
        'Siren'
      ]
    }],
    
    // Driver Details
    driverName: String,
    driverPhone: String,
    driverLicense: String,
    driverPhoto: String,
    
    // Paramedic Details
    paramedicName: String,
    paramedicPhone: String,
    paramedicCertification: String,
    paramedicPhoto: String
  }],
  
  // Services Offered
  services: [{
    type: String,
    enum: [
      'Emergency Response',
      'Patient Transport',
      'Inter-Hospital Transfer',
      'Event Medical Cover',
      'Corporate Ambulance',
      'Air Ambulance',
      'Dead Body Transport',
      'Medical Equipment',
      'ICU on Wheels',
      'Oxygen Support',
      'Cardiac Care',
      'Trauma Care',
      '24x7 Service',
      'Trained Paramedics',
      'Doctor on Call'
    ]
  }],
  
  // Pricing
  pricing: {
    basicAmbulance: {
      baseCharge: Number,
      perKmCharge: Number
    },
    alsAmbulance: {
      baseCharge: Number,
      perKmCharge: Number
    },
    blsAmbulance: {
      baseCharge: Number,
      perKmCharge: Number
    },
    airAmbulance: {
      baseCharge: Number,
      perKmCharge: Number
    },
    deadBodyTransport: {
      baseCharge: Number,
      perKmCharge: Number
    },
    waitingCharges: Number, // per hour
    nightCharges: Number, // additional percentage
    tollCharges: String // 'Included' or 'Extra'
  },
  
  // Payment Options
  paymentMethods: [{
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet', 'Insurance', 'Corporate Billing']
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
  
  // Certifications & Compliance
  certifications: [String],
  hospitalTieups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  }],
  
  // Operational
  operatingHours: {
    type: String,
    default: '24x7'
  },
  responseTime: {
    type: String, // Average response time in minutes
    default: '15-20 minutes'
  },
  
  // Performance Metrics
  totalTrips: {
    type: Number,
    default: 0
  },
  completedTrips: {
    type: Number,
    default: 0
  },
  canceledTrips: {
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
  
  // Wallet & Earnings
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    pendingPayments: {
      type: Number,
      default: 0
    },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }]
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
  companyLogo: String,
  gstNumber: String,
  
  // Timestamps
  lastLogin: Date
}, {
  timestamps: true
});

// Index for geospatial queries on fleet locations
ambulanceSchema.index({ 'fleet.currentLocation': '2dsphere' });

// Encrypt password before saving
ambulanceSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
ambulanceSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Ambulance', ambulanceSchema);
