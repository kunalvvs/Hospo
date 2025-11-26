const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DoctorSchema = new mongoose.Schema({
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
    default: 'doctor',
    enum: ['doctor']
  },
  
  // Profile Summary fields
  profilePhoto: String,
  profileTitle: String,
  bio: String,
  languages: [String],
  otherLanguages: String,
  experience: Number,
  primarySpecialization: String,
  secondarySpecialization: String,
  servicesOffered: [String],
  otherServices: String,
  
  // Medical Credentials fields
  registrationNumber: String,
  registrationCouncil: String,
  registrationCertificate: String,
  degrees: [{
    name: String,
    university: String,
    year: Number
  }],
  degreeCertificates: [String],
  
  // Identity Proof fields
  idType: String,
  idNumber: String,
  idDocument: String,
  signaturePhoto: String,
  
  // Clinic Details fields
  clinicName: String,
  clinicStreet: String,
  clinicLandmark: String,
  clinicCity: String,
  clinicState: String,
  clinicPincode: String,
  clinicLocation: {
    lat: String,
    lng: String
  },
  clinicLandline: String,
  clinicMobile: String,
  clinicTimings: [{
    days: String,
    startTime: String,
    endTime: String
  }],
  consultationTypes: [String],
  facilities: [String],
  clinicPhotos: [String],
  ownershipProof: String,
  
  // Online Consultation fields
  onlineConsultation: {
    type: Boolean,
    default: false
  },
  onlineConsultationFee: Number,
  consultationModes: [String],
  slotDuration: String,
  bufferTime: String,
  availableSchedule: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  cancellationPolicy: String,
  cancellationPolicyDetails: String,
  
  // Fees & Payment fields
  consultationFee: Number,
  accountHolderName: String,
  accountNumber: String,
  ifscCode: String,
  bankName: String,
  branchName: String,
  accountType: String,
  upiId: String,
  bankDocument: String,
  
  // Verification status
  isVerified: {
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
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
DoctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
DoctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Doctor', DoctorSchema);
