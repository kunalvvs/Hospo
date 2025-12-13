const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ==================== SUB-SCHEMAS FOR MULTIPLE PROFILES ====================

// Driver Profile Sub-Schema (combines Driver + KYC + Qualifications)
const DriverProfileSchema = new mongoose.Schema({
  // Basic Driver Details
  driverName: { type: String, trim: true, required: true },
  driverDOB: Date,
  driverAge: Number,
  driverGender: { type: String, enum: ['Male', 'Female', 'Other'] },
  driverMobile: { type: String, trim: true, required: true },
  driverAlternateMobile: { type: String, trim: true },
  driverPermanentAddress: { type: String, trim: true },
  driverCurrentAddress: { type: String, trim: true },
  driverPhoto: String,
  driverLanguages: [String],
  driverExperience: Number,
  driverQualification: String,
  
  // Emergency Contact
  emergencyContactName: { type: String, trim: true },
  emergencyContactRelation: { type: String, trim: true },
  emergencyContactPhone: { type: String, trim: true },
  
  // KYC Documents
  governmentIdType: { type: String, enum: ['', 'aadhaar', 'passport', 'driving-licence', 'voter-id'] },
  governmentIdNumber: String,
  governmentIdFile: String,
  
  drivingLicenceNumber: { type: String, required: true },
  drivingLicenceIssue: Date,
  drivingLicenceExpiry: Date,
  drivingLicenceFile: String,
  licenseType: String,
  
  panCard: String,
  panCardFile: String,
  
  policeVerification: String,
  medicalCertificate: String,
  driverPassportPhoto: String,
  backgroundCheck: String,
  addressProof: String,
  
  // Qualifications
  drivingExperienceYears: Number,
  emergencyVehicleExperience: { type: String, enum: ['', 'yes', 'no'] },
  emergencyVehicleExperienceYears: Number,
  
  certificationType: { type: String, enum: ['', 'first-aid', 'bls', 'cpr', 'multiple'] },
  certificationCourseName: String,
  issuingOrganization: String,
  certificateExpiry: Date,
  certificationCertificateFile: String,
  
  paramedicTraining: { type: String, enum: ['', 'none', 'basic-emt', 'advanced-emt', 'paramedic', 'nursing'] },
  defensiveDrivingCertificate: { type: String, enum: ['', 'yes', 'no'] },
  defensiveDrivingCertificateFile: String,
  communicationSkills: String,
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

// Vehicle Profile Sub-Schema (combines Vehicle + Documents + Equipment)
const VehicleProfileSchema = new mongoose.Schema({
  // Basic Vehicle Details
  vehicleType: { type: String, enum: ['bls', 'als', 'patient-transport', 'neonatal', 'hearse', 'other'], required: true },
  vehicleRegistrationNumber: { type: String, trim: true, uppercase: true, required: true },
  vehicleMake: String,
  vehicleModel: String,
  manufacturingYear: Number,
  vehicleColor: String,
  chassisNumber: String,
  engineNumber: String,
  
  ownershipType: { type: String, enum: ['owned', 'leased', 'rented'] },
  commercialPermitNumber: String,
  ownerName: String,
  
  seatingCapacity: Number,
  stretcherCapacity: Number,
  
  acAvailable: { type: Boolean, default: false },
  oxygenCylinder: { type: Boolean, default: false },
  ventilatorAvailable: { type: Boolean, default: false },
  
  // Vehicle Documents
  rcFront: String,
  rcBack: String,
  
  insurancePolicyNumber: String,
  insuranceCompany: String,
  insuranceExpiryDate: Date,
  insuranceCopy: String,
  
  pucCertificateNumber: String,
  pucValidUntil: Date,
  pucCertificate: String,
  
  fitnessCertificate: String,
  roadPermit: String,
  ambulanceConversionCertificate: String,
  manufacturerFitmentCertificate: String,
  invoicePurchaseBill: String,
  
  vehiclePhotos: [String],
  
  // Equipment & Facilities
  hasStretcher: Boolean,
  stretcherType: { type: String, enum: ['standard', 'hydraulic', 'electric', 'scoop'] },
  stretcherQuantity: Number,
  stretcherCondition: { type: String, enum: ['excellent', 'good', 'fair', 'needs-service', ''] },
  stretcherLastMaintenance: Date,
  
  hasOxygenCylinder: Boolean,
  oxygenQuantity: Number,
  oxygenCapacity: String,
  oxygenLastRefill: Date,
  oxygenRegulatorCondition: { type: String, enum: ['excellent', 'good', 'fair', 'needs-service', ''] },
  
  hasAmbuBag: Boolean,
  ambuBagAdultQty: Number,
  ambuBagPediatricQty: Number,
  ambuBagCondition: { type: String, enum: ['excellent', 'good', 'fair', 'needs-service', ''] },
  
  hasSuctionMachine: Boolean,
  suctionQuantity: Number,
  suctionStatus: { type: String, enum: ['working', 'needs-repair', 'not-working', ''] },
  suctionLastMaintenance: Date,
  
  hasBPApparatus: Boolean,
  hasPulseOximeter: Boolean,
  hasGlucometer: Boolean,
  hasThermometer: Boolean,
  
  hasSplints: Boolean,
  hasCervicalCollar: Boolean,
  hasImmobilizationBoard: Boolean,
  
  hasWoundDressings: Boolean,
  hasIVSets: Boolean,
  hasCannulas: Boolean,
  hasSyringes: Boolean,
  medicalSuppliesExpiryDate: Date,
  
  hasEmergencyDrugsKit: Boolean,
  emergencyDrugsList: String,
  emergencyDrugsExpiry: Date,
  
  hasFireExtinguisher: Boolean,
  hasFirstAidBox: Boolean,
  hasSurgicalMasks: Boolean,
  hasGloves: Boolean,
  hasDisinfectant: Boolean,
  hasHandSanitizer: Boolean,
  
  equipmentNotes: String,
  lastEquipmentCheck: Date,
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

// ==================== MAIN AMBULANCE SCHEMA ====================

const AmbulanceSchema = new mongoose.Schema({
  // ==================== AUTHENTICATION FIELDS ====================
  // Basic auth (matches registration form Step 1)
  serviceName: {
    type: String,
    required: [true, 'Please provide a service name'],
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
  mobile: {
    type: String,
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
    default: 'ambulance',
    enum: ['ambulance']
  },

  // ==================== ACCOUNT DETAILS SECTION ====================
  contactPerson: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['proprietorship', 'pvt-ltd', 'ngo', 'hospital-owned', 'Private', 'Government', 'NGO']
  },
  serviceArea: {
    type: String,
    trim: true
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },

  // ==================== MULTIPLE PROFILES (NEW STRUCTURE) ====================
  // Array of driver profiles (Driver + KYC + Qualifications combined)
  drivers: [DriverProfileSchema],
  
  // Array of vehicle profiles (Vehicle + Documents + Equipment combined)
  vehicles: [VehicleProfileSchema],

  // ==================== DRIVER DETAILS SECTION (LEGACY - kept for backward compatibility) ====================
  driverName: {
    type: String,
    trim: true
  },
  driverDOB: Date,
  driverAge: Number,
  driverGender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  driverMobile: {
    type: String,
    trim: true
  },
  driverAlternateMobile: {
    type: String,
    trim: true
  },
  driverPermanentAddress: {
    type: String,
    trim: true
  },
  driverCurrentAddress: {
    type: String,
    trim: true
  },
  driverPhoto: String, // Cloudinary URL
  driverLanguages: [String],
  driverExperience: Number, // Years of experience
  driverQualification: String,

  // Emergency Contact for Driver
  emergencyContactName: {
    type: String,
    trim: true
  },
  emergencyContactRelation: {
    type: String,
    trim: true
  },
  emergencyContactPhone: {
    type: String,
    trim: true
  },

  // ==================== KYC DOCUMENTS SECTION ====================
  // Government ID
  governmentIdType: {
    type: String,
    enum: ['aadhaar', 'passport', 'driving-licence', 'voter-id']
  },
  governmentIdNumber: String,
  governmentIdFile: String, // Cloudinary URL

  // Driving License
  drivingLicenceNumber: String,
  drivingLicenceIssue: Date,
  drivingLicenceExpiry: Date,
  drivingLicenceFile: String, // Cloudinary URL
  licenseType: String, // Light/Heavy vehicle

  // PAN Card
  panCard: String,
  panCardFile: String, // Cloudinary URL

  // Other KYC Documents
  policeVerification: String, // Cloudinary URL
  medicalCertificate: String, // Cloudinary URL
  driverPassportPhoto: String, // Cloudinary URL
  backgroundCheck: String, // Cloudinary URL
  addressProof: String, // Cloudinary URL

  // ==================== QUALIFICATIONS SECTION ====================
  // Driving Experience
  drivingExperienceYears: Number,
  emergencyVehicleExperience: {
    type: String,
    enum: ['yes', 'no']
  },
  emergencyVehicleExperienceYears: Number,
  
  // Certifications
  certificationType: {
    type: String,
    enum: ['first-aid', 'bls', 'cpr', 'multiple']
  },
  certificationCourseName: String,
  issuingOrganization: String,
  certificateExpiry: Date,
  certificationCertificateFile: String, // Cloudinary URL
  
  // Training
  paramedicTraining: {
    type: String,
    enum: ['none', 'basic-emt', 'advanced-emt', 'paramedic', 'nursing']
  },
  
  // Defensive Driving
  defensiveDrivingCertificate: {
    type: String,
    enum: ['yes', 'no']
  },
  defensiveDrivingCertificateFile: String, // Cloudinary URL
  
  // Communication
  communicationSkills: String, // textarea
  
  // ==================== VEHICLE DETAILS SECTION ====================
  vehicleType: {
    type: String,
    enum: ['bls', 'als', 'patient-transport', 'neonatal', 'hearse', 'other']
  },
  vehicleRegistrationNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  vehicleMake: String, // Toyota, Force, etc.
  vehicleModel: String,
  manufacturingYear: Number,
  vehicleColor: String,
  chassisNumber: String,
  engineNumber: String,
  
  ownershipType: {
    type: String,
    enum: ['owned', 'leased', 'rented']
  },
  commercialPermitNumber: String,
  ownerName: String,
  
  // Vehicle Capacity
  seatingCapacity: Number,
  stretcherCapacity: Number,
  
  // Vehicle Features
  acAvailable: {
    type: Boolean,
    default: false
  },
  oxygenCylinder: {
    type: Boolean,
    default: false
  },
  ventilatorAvailable: {
    type: Boolean,
    default: false
  },
  
  // ==================== VEHICLE DOCUMENTS SECTION ====================
  // Registration Certificate
  rcFront: String, // Cloudinary URL
  rcBack: String, // Cloudinary URL
  
  // Insurance
  insurancePolicyNumber: String,
  insuranceCompany: String,
  insuranceExpiryDate: Date,
  insuranceCopy: String, // Cloudinary URL
  
  // PUC Certificate
  pucCertificateNumber: String,
  pucValidUntil: Date,
  pucCertificate: String, // Cloudinary URL
  
  // Other Certificates
  fitnessCertificate: String, // Cloudinary URL
  roadPermit: String, // Cloudinary URL
  ambulanceConversionCertificate: String, // Cloudinary URL
  manufacturerFitmentCertificate: String, // Cloudinary URL
  invoicePurchaseBill: String, // Cloudinary URL
  
  vehiclePhotos: [String], // Array of Cloudinary URLs (front, back, side, interior)
  
  // ==================== EQUIPMENT & FACILITIES SECTION ====================
  // Stretcher
  hasStretcher: Boolean,
  stretcherType: {
    type: String,
    enum: ['standard', 'hydraulic', 'electric', 'scoop']
  },
  stretcherQuantity: Number,
  stretcherCondition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'needs-service', '']
  },
  stretcherLastMaintenance: Date,
  
  // Oxygen Cylinder
  hasOxygenCylinder: Boolean,
  oxygenQuantity: Number,
  oxygenCapacity: String,
  oxygenLastRefill: Date,
  oxygenRegulatorCondition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'needs-service', '']
  },
  
  // Ambu Bag
  hasAmbuBag: Boolean,
  ambuBagAdultQty: Number,
  ambuBagPediatricQty: Number,
  ambuBagCondition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'needs-service', '']
  },
  
  // Suction Machine
  hasSuctionMachine: Boolean,
  suctionQuantity: Number,
  suctionStatus: {
    type: String,
    enum: ['working', 'needs-repair', 'not-working', '']
  },
  suctionLastMaintenance: Date,
  
  // Basic Monitoring Equipment
  hasBPApparatus: Boolean,
  hasPulseOximeter: Boolean,
  hasGlucometer: Boolean,
  hasThermometer: Boolean,
  
  // Immobilization Equipment
  hasSplints: Boolean,
  hasCervicalCollar: Boolean,
  hasImmobilizationBoard: Boolean,
  
  // Medical Supplies
  hasWoundDressings: Boolean,
  hasIVSets: Boolean,
  hasCannulas: Boolean,
  hasSyringes: Boolean,
  medicalSuppliesExpiryDate: Date,
  
  // Emergency Drugs Kit
  hasEmergencyDrugsKit: Boolean,
  emergencyDrugsList: String, // textarea
  emergencyDrugsExpiry: Date,
  
  // Safety Equipment
  hasFireExtinguisher: Boolean,
  hasFirstAidBox: Boolean,
  hasSurgicalMasks: Boolean,
  hasGloves: Boolean,
  hasDisinfectant: Boolean,
  hasHandSanitizer: Boolean,
  
  equipmentNotes: String,
  lastEquipmentCheck: Date,
  
  // ==================== PRICING & PAYMENT SECTION ====================
  // Base Rates
  baseCharge: {
    type: Number,
    default: 0
  },
  baseDistanceIncluded: {
    type: Number,
    default: 0
  },
  perKmCharge: {
    type: Number,
    default: 0
  },
  
  // Additional Charges
  nightCharges: Number, // Additional charge
  waitingCharges: Number, // Per hour
  oxygenCharges: Number,
  intercityTransferRates: String, // textarea
  
  // Payment Methods Accepted (Individual Booleans for UI checkboxes)
  paymentCash: Boolean,
  paymentCard: Boolean,
  paymentUPI: Boolean,
  paymentWallet: Boolean,
  paymentCorporate: Boolean,
  paymentInsurance: Boolean,
  
  // Embedded Bank Details (from Pricing section UI)
  bankAccountHolderName: String,
  bankAccountNumber: String,
  bankIFSC: String,
  bankName: String,
  cancelledChequeFile: String, // Cloudinary URL
  
  // Cancellation Policy
  cancellationCharges: Number, // Percentage
  cancellationPolicy: String, // Text description
  refundPolicy: String,
  
  // GST Details
  gstNumber: String,
  gstRegistered: {
    type: Boolean,
    default: false
  },
  
  // ==================== BANK DETAILS SECTION ====================
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    accountType: {
      type: String,
      enum: ['savings', 'current']
    },
    ifscCode: String,
    bankName: String,
    branchName: String,
    branchAddress: String
  },
  
  upiId: String,
  
  // ==================== OPERATIONS SECTION ====================
  // Availability
  serviceAvailability: {
    type: String,
    enum: ['24x7', 'day-only', 'night-only', 'scheduled'],
    default: '24x7'
  },
  
  operatingHours: {
    monday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      startTime: String,
      endTime: String
    },
    tuesday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      startTime: String,
      endTime: String
    },
    wednesday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      startTime: String,
      endTime: String
    },
    thursday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      startTime: String,
      endTime: String
    },
    friday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      startTime: String,
      endTime: String
    },
    saturday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      startTime: String,
      endTime: String
    },
    sunday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      startTime: String,
      endTime: String
    }
  },
  
  // Service Coverage
  serviceCities: [String],
  serviceRadius: Number, // In kilometers
  intercityService: {
    type: Boolean,
    default: false
  },
  interstateService: {
    type: Boolean,
    default: false
  },
  
  // Current Status
  currentStatus: {
    type: String,
    enum: ['available', 'on-trip', 'offline', 'maintenance'],
    default: 'offline'
  },
  
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    lastUpdated: Date
  },
  
  // ==================== STATISTICS & TRACKING ====================
  totalTrips: {
    type: Number,
    default: 0
  },
  completedTrips: {
    type: Number,
    default: 0
  },
  cancelledTrips: {
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
  totalDistance: {
    type: Number,
    default: 0
  }, // In kilometers
  totalRevenue: {
    type: Number,
    default: 0
  },
  
  // ==================== VERIFICATION & STATUS ====================
  verificationStatus: {
    type: String,
    enum: ['pending', 'under-review', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: String,
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockReason: String,
  
  // Profile Completion
  profileCompletion: {
    type: Number,
    default: 0
  },
  
  // ==================== DOCUMENTS ARRAY (for additional docs) ====================
  documents: [{
    docType: String,
    docName: String,
    docUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // ==================== TIMESTAMPS ====================
  lastActive: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ==================== PRE-SAVE MIDDLEWARE ====================
// Hash password before saving
AmbulanceSchema.pre('save', async function(next) {
  // Only hash password if it's modified
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

// Sync mobile with phone if not provided
AmbulanceSchema.pre('save', function(next) {
  if (!this.mobile && this.phone) {
    this.mobile = this.phone;
  }
  if (!this.phone && this.mobile) {
    this.phone = this.mobile;
  }
  next();
});

// Calculate driver age from DOB
AmbulanceSchema.pre('save', function(next) {
  if (this.driverDOB && !this.driverAge) {
    const today = new Date();
    const birthDate = new Date(this.driverDOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.driverAge = age;
  }
  next();
});

// Update updatedAt timestamp
AmbulanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// ==================== METHODS ====================
// Compare password for login
AmbulanceSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion percentage
AmbulanceSchema.methods.calculateProfileCompletion = function() {
  let completed = 0;
  const total = 50; // Total fields to check
  
  // Account Details (6 fields)
  if (this.serviceName) completed++;
  if (this.contactPerson) completed++;
  if (this.mobile) completed++;
  if (this.email) completed++;
  if (this.businessType) completed++;
  if (this.serviceArea) completed++;
  
  // Driver Details (8 fields)
  if (this.driverName) completed++;
  if (this.driverDOB) completed++;
  if (this.driverGender) completed++;
  if (this.driverMobile) completed++;
  if (this.driverPermanentAddress) completed++;
  if (this.driverPhoto) completed++;
  if (this.driverLanguages && this.driverLanguages.length > 0) completed++;
  if (this.emergencyContactName) completed++;
  
  // KYC Documents (6 fields)
  if (this.governmentIdType) completed++;
  if (this.governmentIdFile) completed++;
  if (this.drivingLicenceNumber) completed++;
  if (this.drivingLicenceFile) completed++;
  if (this.policeVerification) completed++;
  if (this.medicalCertificate) completed++;
  
  // Qualifications (3 fields)
  if (this.certificationType) completed++;
  if (this.certificationCertificateFile) completed++;
  if (this.paramedicTraining) completed++;
  
  // Vehicle Details (8 fields)
  if (this.vehicleType) completed++;
  if (this.vehicleRegistrationNumber) completed++;
  if (this.vehicleMake) completed++;
  if (this.vehicleModel) completed++;
  if (this.manufacturingYear) completed++;
  if (this.seatingCapacity) completed++;
  if (this.stretcherCapacity) completed++;
  if (this.ownershipType) completed++;
  
  // Vehicle Documents (5 fields)
  if (this.rcFront) completed++;
  if (this.insuranceCopy) completed++;
  if (this.fitnessCertificate) completed++;
  if (this.pucCertificate) completed++;
  if (this.roadPermit) completed++;
  
  // Equipment (4 fields)
  if (this.hasStretcher) completed++;
  if (this.hasOxygenCylinder) completed++;
  if (this.hasFirstAidBox) completed++;
  if (this.hasSuctionMachine) completed++;
  
  // Pricing (4 fields)
  if (this.baseCharge) completed++;
  if (this.perKmCharge) completed++;
  if (this.paymentCash || this.paymentCard || this.paymentUPI) completed++;
  if (this.bankAccountNumber) completed++;
  
  // Operations (2 fields)
  if (this.serviceAvailability) completed++;
  if (this.serviceCities && this.serviceCities.length > 0) completed++;
  
  const percentage = Math.round((completed / total) * 100);
  this.profileCompletion = percentage;
  return percentage;
};

module.exports = mongoose.model('Ambulance', AmbulanceSchema);
