const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PathlabSchema = new mongoose.Schema({
  // Authentication fields (from registration)
  name: {
    type: String,
    required: [true, 'Please provide a lab name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
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
    default: 'pathlab',
    enum: ['pathlab']
  },

  // Identity fields (Lab Identity section from Dashboard)
  labName: String, // Alias for name field
  businessType: String, // proprietorship, partnership, pvt-ltd, llp
  authorizedPerson: String, // Contact person name
  description: String, // Additional description
  photo: String, // Lab photo URL
  labType: {
    type: String,
    enum: ['diagnostic', 'pathology', 'clinical', 'reference', 'mobile', 'full-service']
  },
  establishedYear: Number,

  // Registration & License fields (Legal Licenses section)
  registrationNumber: String,
  licenseNumber: String,
  clinicalEstablishmentCert: String, // URL
  drugsDiagnosticLicense: String, // URL
  labRegistrationCert: String, // URL
  NABLAccreditation: String,
  NABLCertificate: String, // URL
  ISOCertificate: String, // URL
  otherCertifications: [String], // Array of URLs
  accreditationExpiryDate: Date,
  gstNumber: String,
  panNumber: String,
  gstDocument: String, // URL
  panDocument: String, // URL

  // Director/Owner Information
  directorName: String,
  directorQualification: String,
  directorExperience: Number,
  directorIdType: String, // Aadhar, Passport, etc.
  directorIdNumber: String,
  directorIdProof: String, // URL
  directorPhoto: String, // URL
  ownerIdProof: String, // URL

  // Address fields (Address Details section)
  doorNo: String, // Building/House number
  street: String, // Street name
  locality: String, // Area/Locality
  landmark: String, // Nearby landmark
  city: String,
  state: String,
  pincode: String,
  country: {
    type: String,
    default: 'India'
  },
  // Nested address object for compatibility
  address: {
    street: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },

  // Contact fields (Contact Info section)
  primaryEmail: String, // For display (same as email)
  primaryMobile: String, // For display (same as phone)
  phoneNumber: String, // Alternate phone for bookings
  alternatePhone: String, // Another alternate
  landline: String, // Landline number
  whatsappNumber: String, // WhatsApp contact
  emergencyContact: String,
  website: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },

  // Working Hours (Contact Info section)
  workingHours: String, // e.g., "Mon-Sat: 8:00 AM - 6:00 PM"
  sampleCollectionHours: String, // e.g., "Morning/Evening shifts"
  operatingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    openTime: String,
    closeTime: String,
    closed: {
      type: Boolean,
      default: false
    }
  }],
  is24x7: {
    type: Boolean,
    default: false
  },

  // Tests Catalog (Tests Catalog section)
  testsCatalog: [{
    testCode: String,
    testName: String,
    category: String, // Hematology, Biochemistry, etc.
    specimen: String, // Blood, Urine, etc.
    homeCollection: {
      type: Boolean,
      default: true
    },
    price: Number,
    description: String,
    duration: String, // Report delivery time
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Services Offered
  services: [{
    type: String,
    enum: [
      'Blood Tests', 'Urine Tests', 'Stool Tests', 'X-Ray', 'Ultrasound', 'ECG', 'CT Scan', 'MRI',
      'Biopsy', 'Pathology', 'Microbiology', 'Biochemistry', 'Hematology', 'Serology',
      'Immunology', 'Molecular Diagnostics', 'Cytology', 'Histopathology', 'Clinical Pathology',
      'Home Sample Collection', 'Health Checkup Packages', 'COVID-19 Testing', 'Genetic Testing', 'Other'
    ]
  }],

  // Test Categories
  testCategories: [{
    categoryName: String,
    tests: [{
      testName: String,
      price: Number,
      duration: String,
      description: String
    }]
  }],

  // Facilities
  facilities: [{
    type: String,
    enum: [
      'NABL Accredited', 'CAP Accredited', 'ISO Certified', 'Home Collection', 'Online Reports',
      'Emergency Services', 'Parking Available', 'Wheelchair Accessible', 'Air Conditioned',
      'WiFi', 'Waiting Room', 'Pharmacy', 'Other'
    ]
  }],

  // Equipment
  equipment: [{
    name: String,
    manufacturer: String,
    model: String,
    quantity: Number
  }],

  // Staff Details
  totalStaff: Number,
  pathologists: [{
    name: String,
    qualification: String,
    experience: Number,
    specialization: String,
    registrationNumber: String
  }],
  technicians: Number,
  supportStaff: Number,

  // Payment & Billing (Payments section)
  paymentModes: {
    cash: { type: Boolean, default: true },
    card: { type: Boolean, default: true },
    upi: { type: Boolean, default: true },
    netBanking: { type: Boolean, default: true },
    wallet: { type: Boolean, default: true }
  },
  paymentOptions: {
    prepaid: { type: Boolean, default: true },
    cod: { type: Boolean, default: true },
    emi: { type: Boolean, default: false }
  },
  reportDelivery: {
    email: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    physical: { type: Boolean, default: false }
  },
  invoicePrefix: String, // e.g., "PL/2024/"
  gstEnabled: {
    type: Boolean,
    default: false
  },

  // Payment Methods (Legacy)
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
    accountType: {
      type: String,
      enum: ['Savings', 'Current']
    }
  },
  upiId: String,

  // Sample Collection (Collection section)
  homeCollectionAvailable: {
    type: Boolean,
    default: true
  },
  serviceRadius: Number, // in km
  coveredPinCodes: [String], // Array of PIN codes
  homeCollectionCharges: Number,
  freeCollectionMinOrder: Number, // Minimum order value for free collection
  collectionTimeSlots: {
    morning: { type: Boolean, default: true }, // 6 AM - 12 PM
    afternoon: { type: Boolean, default: true }, // 12 PM - 4 PM
    evening: { type: Boolean, default: true } // 4 PM - 8 PM
  },

  // Pricing Details
  urgentReportCharges: Number,
  discounts: {
    senior: Number,
    student: Number,
    bulk: Number
  },

  // Health Packages
  healthPackages: [{
    packageName: String,
    description: String,
    testsIncluded: [String],
    price: Number,
    duration: String
  }],

  // Tie-ups & Partnerships
  hospitalTieups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  }],
  doctorReferrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  insuranceAccepted: [String],

  // Statistics & Metrics
  totalTests: {
    type: Number,
    default: 0
  },
  totalPatients: {
    type: Number,
    default: 0
  },
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
  reviews: [{
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Verification & Status
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
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: String,

  // Additional Documents
  documents: [{
    docType: String, // Type of document
    docName: String, // Name of document
    url: String, // Cloudinary URL
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Pre-save middleware to sync fields
PathlabSchema.pre('save', async function(next) {
  // Sync name fields
  if (this.isModified('name') && !this.labName) {
    this.labName = this.name;
  }
  if (this.isModified('labName') && !this.name) {
    this.name = this.labName;
  }

  // Sync email/phone fields
  if (this.isModified('email') && !this.primaryEmail) {
    this.primaryEmail = this.email;
  }
  if (this.isModified('phone') && !this.primaryMobile) {
    this.primaryMobile = this.phone;
  }

  // Sync address fields - flat to nested
  if (this.isModified('doorNo') || this.isModified('street') || this.isModified('city')) {
    if (!this.address) {
      this.address = {};
    }
    if (this.doorNo || this.street) {
      this.address.street = `${this.doorNo || ''}, ${this.street || ''}`.trim();
    }
    if (this.locality) {
      this.address.landmark = this.locality;
    }
    if (this.city) {
      this.address.city = this.city;
    }
    if (this.state) {
      this.address.state = this.state;
    }
    if (this.pincode) {
      this.address.pincode = this.pincode;
    }
  }

  // Sync address fields - nested to flat
  if (this.isModified('address')) {
    if (this.address.street && !this.street) {
      const parts = this.address.street.split(',');
      this.doorNo = parts[0]?.trim() || '';
      this.street = parts.slice(1).join(',').trim() || this.address.street;
    }
    if (this.address.landmark && !this.locality) {
      this.locality = this.address.landmark;
      this.landmark = this.address.landmark;
    }
    if (this.address.city && !this.city) {
      this.city = this.address.city;
    }
    if (this.address.state && !this.state) {
      this.state = this.address.state;
    }
    if (this.address.pincode && !this.pincode) {
      this.pincode = this.address.pincode;
    }
  }

  // Hash password before saving
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Compare password method
PathlabSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Pathlab', PathlabSchema);
