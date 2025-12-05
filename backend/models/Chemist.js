const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const chemistSchema = new mongoose.Schema({
  // Authentication Fields
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    trim: true
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

  // Pharmacy Identity (matching ChemistRegistration.jsx Step 1)
  pharmacyName: {
    type: String,
    trim: true,
    default: ''
  },
  businessType: {
    type: String,
    enum: ['', 'retail-pharmacy', 'wholesale', 'online-pharmacy', 'franchise'],
    default: ''
  },
  tagline: {
    type: String,
    trim: true,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },

  // Address & Location (matching ChemistRegistration.jsx Step 2)
  shopNumber: {
    type: String,
    trim: true,
    default: ''
  },
  building: {
    type: String,
    trim: true,
    default: ''
  },
  locality: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  state: {
    type: String,
    trim: true,
    default: ''
  },
  pin: {
    type: String,
    trim: true,
    default: ''
  },
  landmark: {
    type: String,
    trim: true,
    default: ''
  },
  latitude: {
    type: String,
    default: ''
  },
  longitude: {
    type: String,
    default: ''
  },
  branches: {
    type: String,
    default: ''
  },

  // Contact Details (matching ChemistRegistration.jsx Step 3)
  primaryPhone: {
    type: String,
    trim: true,
    default: ''
  },
  mobile: {
    type: String,
    trim: true,
    default: ''
  },
  whatsappNumber: {
    type: String,
    trim: true,
    default: ''
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  facebook: {
    type: String,
    trim: true,
    default: ''
  },
  instagram: {
    type: String,
    trim: true,
    default: ''
  },
  twitter: {
    type: String,
    trim: true,
    default: ''
  },

  // License & KYC
  drugLicenseNumber: {
    type: String,
    trim: true,
    default: ''
  },
  drugLicenseCertificate: {
    type: String,
    default: ''
  },
  drugLicenseExpiry: {
    type: Date
  },
  gstNumber: {
    type: String,
    trim: true,
    default: ''
  },
  gstCertificate: {
    type: String,
    default: ''
  },
  panNumber: {
    type: String,
    trim: true,
    default: ''
  },
  panCard: {
    type: String,
    default: ''
  },
  shopLicense: {
    type: String,
    default: ''
  },
  ownerIdentityProof: {
    type: String,
    default: ''
  },
  pharmacistRegistrationNumber: {
    type: String,
    trim: true,
    default: ''
  },
  pharmacistCertificate: {
    type: String,
    default: ''
  },
  
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
  deliveryStartTime: {
    type: String,
    default: ''
  },
  deliveryEndTime: {
    type: String,
    default: ''
  },
  nightServiceAvailable: {
    type: Boolean,
    default: false
  },

  // Inventory Management
  inventory: [{
    productId: {
      type: String,
      trim: true,
      default: ''
    },
    medicineName: {
      type: String,
      required: true,
      trim: true
    },
    genericName: {
      type: String,
      trim: true,
      default: ''
    },
    manufacturer: {
      type: String,
      trim: true,
      default: ''
    },
    formulation: {
      type: String,
      enum: ['', 'tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler', 'other'],
      default: ''
    },
    strength: {
      type: String,
      trim: true,
      default: ''
    },
    packDescription: {
      type: String,
      trim: true,
      default: ''
    },
    batchNumber: {
      type: String,
      trim: true,
      default: ''
    },
    expiryDate: {
      type: Date
    },
    quantity: {
      type: Number,
      default: 0
    },
    mrp: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    costPrice: {
      type: Number,
      default: 0
    },
    gstSlab: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    offerTag: {
      type: String,
      trim: true,
      default: ''
    },
    supplier: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: ['prescription', 'otc', 'ayurvedic', 'surgical', 'wellness', 'other'],
      default: 'other'
    },
    addedDate: {
      type: Date,
      default: Date.now
    }
  }],

  // Services Offered
  services: {
    prescriptionFulfilment: {
      type: Boolean,
      default: true
    },
    homeDelivery: {
      type: Boolean,
      default: false
    },
    sameDayDelivery: {
      type: Boolean,
      default: false
    },
    scheduledDelivery: {
      type: Boolean,
      default: false
    },
    onlineOrdering: {
      type: Boolean,
      default: false
    },
    prepaidOrders: {
      type: Boolean,
      default: false
    },
    cashOnDelivery: {
      type: Boolean,
      default: false
    },
    twentyFourSeven: {
      type: Boolean,
      default: false
    },
    surgicalItems: {
      type: Boolean,
      default: false
    },
    ayurvedic: {
      type: Boolean,
      default: false
    }
  },
  
  // Service Settings
  serviceSettings: {
    substitutionAllowed: {
      type: String,
      default: ''
    },
    onlineOrderAccept: {
      type: String,
      default: ''
    },
    orderCutoffTime: {
      type: String,
      default: ''
    },
    maxDeliveryRadius: {
      type: Number,
      default: 0
    },
    minimumOrderValue: {
      type: Number,
      default: 0
    },
    refundPolicy: {
      type: String,
      default: ''
    },
    prescriptionVerificationPolicy: {
      type: String,
      default: ''
    }
  },
  
  // Payment Settings
  paymentSettings: {
    paymentMethods: {
      cash: { type: Boolean, default: true },
      card: { type: Boolean, default: false },
      upi: { type: Boolean, default: false },
      wallet: { type: Boolean, default: false }
    },
    gstBilling: {
      gstin: { type: String, default: '' },
      legalName: { type: String, default: '' }
    },
    cancelledCheque: {
      type: String,
      default: ''
    }
  },

  // Bank Details
  accountDetails: {
    accountNumber: {
      type: String,
      trim: true,
      default: ''
    },
    ifscCode: {
      type: String,
      trim: true,
      default: ''
    },
    bankName: {
      type: String,
      trim: true,
      default: ''
    },
    branchName: {
      type: String,
      trim: true,
      default: ''
    },
    accountHolderName: {
      type: String,
      trim: true,
      default: ''
    },
    accountType: {
      type: String,
      enum: ['', 'savings', 'current'],
      default: ''
    },
    bankProof: {
      type: String,
      default: ''
    },
    upiId: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Orders & Stats
  totalOrders: {
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

  // Verification & Status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'in-review', 'verified', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  profileCompletion: {
    type: Number,
    default: 0
  },

  // Additional Information
  description: {
    type: String,
    default: ''
  },
  establishedYear: {
    type: String,
    trim: true,
    default: ''
  },
  
  // System Fields
  lastActive: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
chemistSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
chemistSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Calculate profile completion percentage
chemistSchema.methods.calculateProfileCompletion = function() {
  let completed = 0;
  const totalFields = 15;

  // Basic fields (5)
  if (this.pharmacyName) completed++;
  if (this.businessType) completed++;
  if (this.logo) completed++;
  if (this.tagline) completed++;
  if (this.description) completed++;

  // Address fields (3)
  if (this.locality && this.city && this.pin) completed++;
  if (this.latitude && this.longitude) completed++;
  if (this.landmark) completed++;

  // Contact fields (2)
  if (this.primaryPhone && this.mobile) completed++;
  if (this.contactEmail) completed++;

  // License fields (3)
  if (this.drugLicenseNumber && this.drugLicenseCertificate) completed++;
  if (this.gstNumber && this.gstCertificate) completed++;
  if (this.panNumber && this.panCard) completed++;

  // Bank details (1)
  if (this.accountDetails.accountNumber && this.accountDetails.ifscCode) completed++;

  // Inventory (1)
  if (this.inventory && this.inventory.length > 0) completed++;

  const percentage = Math.round((completed / totalFields) * 100);
  this.profileCompletion = percentage;
  return percentage;
};

module.exports = mongoose.model('Chemist', chemistSchema);
