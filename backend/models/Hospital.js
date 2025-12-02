const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HospitalSchema = new mongoose.Schema({
  // Authentication fields
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
    default: 'hospital',
    enum: ['hospital']
  },
  
  // Step 1: Basic Identity
  hospitalName: String,
  practiceType: {
    type: String,
    enum: ['hospital', 'multi-speciality', 'clinic', 'diagnostic-centre', 'nursing-home', '']
  },
  tagline: String,
  logo: String,
  
  // Step 2: Address & Location
  streetAddress: String,
  locality: String,
  city: String,
  pincode: String,
  landmark: String,
  location: {
    latitude: String,
    longitude: String
  },
  branches: [String],
  
  // Step 3: Contact Details
  mainPhone: String,
  alternatePhone: String,
  contactEmail: String,
  website: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  
  // Working Hours
  workingHours: {
    mondayHours: String,
    tuesdayHours: String,
    wednesdayHours: String,
    thursdayHours: String,
    fridayHours: String,
    saturdayHours: String,
    sundayHours: String,
    opdHours: String,
    emergencyHours: String,
    holidayDates: String
  },
  
  // KYC & Documents
  registrationNumber: String,
  registrationCertificate: String,
  panNumber: String,
  panCard: String,
  gstNumber: String,
  gstCertificate: String,
  ownershipProof: String,
  
  // Facilities & Services
  yearEstablished: Number,
  numberOfBeds: Number,
  facilities: [String],
  specializations: [String],
  departments: [String],
  emergencyServices: {
    type: Boolean,
    default: false
  },
  ambulanceAvailable: {
    type: Boolean,
    default: false
  },
  
  // Operational Details
  is24x7: {
    type: Boolean,
    default: false
  },
  openingTime: String,
  closingTime: String,
  minConsultFee: Number,
  maxConsultFee: Number,
  emergencyFee: Number,
  totalBeds: Number,
  icuBeds: Number,
  ventilators: Number,
  emergencyAvailable: {
    type: Boolean,
    default: false
  },
  ambulanceService: {
    type: Boolean,
    default: false
  },
  
  // Insurance
  insuranceAccepted: {
    type: Boolean,
    default: false
  },
  insuranceProviders: [String],
  
  // Linked Doctors
  linkedDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  
  // Doctor Profiles (added from hospital dashboard)
  doctors: [{
    name: String,
    qualification: String,
    registration: String,
    speciality: String,
    experience: String,
    languages: [String],
    opdDays: [String],
    opdTimings: String,
    consultFeeInPerson: Number,
    consultFeeOnline: Number,
    photo: String
  }],
  
  // Appointment Settings
  acceptOnlineBooking: {
    type: String,
    enum: ['yes', 'no'],
    default: 'yes'
  },
  bookingType: {
    type: String,
    enum: ['appointment', 'walk-in', 'both'],
    default: 'appointment'
  },
  slotDuration: {
    type: Number,
    default: 30
  },
  advanceBookingDays: {
    type: Number,
    default: 7
  },
  cancellationPolicy: {
    type: String,
    enum: ['free', '24hrs', 'no-refund'],
    default: 'free'
  },
  prepaymentRequired: {
    type: String,
    enum: ['no', 'partial', 'full'],
    default: 'no'
  },
  patientInstructions: String,
  
  // Photos
  hospitalPhotos: [String],
  
  // Commission & Payment Settings
  commissionSettings: {
    consultationCommission: Number,
    procedureCommission: Number,
    diagnosticCommission: Number,
    pharmacyCommission: Number
  },
  
  // Bank Details
  accountDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branchName: String,
    accountType: String,
    upiId: String,
    bankProof: String
  },
  
  // Rooms & Procedures (From Dashboard)
  rooms: [{
    room_id: String,
    room_type: String,
    room_name: String,
    floor: String,
    charge_per_day: Number,
    max_patients: Number,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  }],
  
  procedures: [{
    procedure_id: String,
    procedure_name: String,
    procedure_type: String,
    base_charge: Number,
    ot_charges: Number,
    anesthesia_charge: Number,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  }],
  
  doctorFees: [{
    doctor_id: String,
    name: String,
    specialization: String,
    visit_fee_opd: Number,
    visit_fee_ipd_per_visit: Number,
    consultation_fee_emergency: Number,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  }],
  
  nursingCharges: [{
    service_id: String,
    service_name: String,
    charge_type: String,
    charge_amount: Number,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  }],
  
  miscServices: [{
    service_id: String,
    service: String,
    charge: Number,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  }],
  
  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  
  // Profile completion
  registrationComplete: {
    type: Boolean,
    default: false
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
HospitalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
HospitalSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Hospital', HospitalSchema);
