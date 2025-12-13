const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Driver Sub-Schema (includes KYC + Qualifications)
const DriverSchema = new mongoose.Schema({
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
  governmentIdType: { type: String, enum: ['aadhaar', 'passport', 'driving-licence', 'voter-id'] },
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
  emergencyVehicleExperience: { type: String, enum: ['yes', 'no'] },
  emergencyVehicleExperienceYears: Number,
  
  certificationType: { type: String, enum: ['first-aid', 'bls', 'cpr', 'multiple'] },
  certificationCourseName: String,
  issuingOrganization: String,
  certificateExpiry: Date,
  certificationCertificateFile: String,
  
  paramedicTraining: { type: String, enum: ['none', 'basic-emt', 'advanced-emt', 'paramedic', 'nursing'] },
  defensiveDrivingCertificate: { type: String, enum: ['yes', 'no'] },
  defensiveDrivingCertificateFile: String,
  communicationSkills: String,
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Vehicle Sub-Schema (includes Documents + Equipment)
const VehicleSchema = new mongoose.Schema({
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
  
  // Equipment
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
});

// Main Ambulance Schema
const AmbulanceRestructuredSchema = new mongoose.Schema({
  // Authentication
  serviceName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  mobile: String,
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, default: 'ambulance', enum: ['ambulance'] },
  
  // Account Details
  contactPerson: String,
  businessType: { type: String, enum: ['proprietorship', 'pvt-ltd', 'ngo', 'hospital-owned', 'Private', 'Government', 'NGO'] },
  serviceArea: String,
  registrationComplete: { type: Boolean, default: false },
  
  // MULTIPLE DRIVERS ARRAY
  drivers: [DriverSchema],
  
  // MULTIPLE VEHICLES ARRAY
  vehicles: [VehicleSchema],
  
  // Pricing & Payment (shared across all vehicles)
  baseCharge: Number,
  baseDistanceIncluded: Number,
  perKmCharge: Number,
  nightCharges: Number,
  waitingCharges: Number,
  oxygenCharges: Number,
  intercityTransferRates: Number,
  
  paymentCash: Boolean,
  paymentCard: Boolean,
  paymentUPI: Boolean,
  paymentWallet: Boolean,
  paymentCorporate: Boolean,
  paymentInsurance: Boolean,
  
  bankAccountHolderName: String,
  bankAccountNumber: String,
  bankIFSC: String,
  bankName: String,
  cancelledChequeFile: String,
  
  cancellationCharges: Number,
  cancellationPolicy: String,
  refundPolicy: String,
  
  gstNumber: String,
  gstRegistered: { type: Boolean, default: false },
  
  // Bank Details
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    accountType: { type: String, enum: ['savings', 'current'] },
    ifscCode: String,
    bankName: String,
    branchName: String,
    branchAddress: String
  },
  upiId: String,
  
  // Operations
  serviceAvailability: { type: String, enum: ['24x7', 'day-only', 'night-only', 'scheduled'], default: '24x7' },
  operatingHours: {
    monday: { isAvailable: Boolean, startTime: String, endTime: String },
    tuesday: { isAvailable: Boolean, startTime: String, endTime: String },
    wednesday: { isAvailable: Boolean, startTime: String, endTime: String },
    thursday: { isAvailable: Boolean, startTime: String, endTime: String },
    friday: { isAvailable: Boolean, startTime: String, endTime: String },
    saturday: { isAvailable: Boolean, startTime: String, endTime: String },
    sunday: { isAvailable: Boolean, startTime: String, endTime: String }
  },
  
  serviceCities: [String],
  serviceRadius: Number,
  intercityService: { type: Boolean, default: false },
  interstateService: { type: Boolean, default: false },
  currentStatus: { type: String, enum: ['available', 'on-trip', 'offline', 'maintenance'], default: 'offline' },
  
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    lastUpdated: Date
  },
  
  // Statistics
  totalTrips: { type: Number, default: 0 },
  completedTrips: { type: Number, default: 0 },
  cancelledTrips: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalDistance: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  
  // Verification
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verificationNotes: String,
  verifiedBy: String,
  verifiedAt: Date,
  
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  
  profileCompletion: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
AmbulanceRestructuredSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
AmbulanceRestructuredSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion
AmbulanceRestructuredSchema.methods.calculateProfileCompletion = function() {
  let completed = 0;
  const total = 30;
  
  // Account (3)
  if (this.serviceName) completed++;
  if (this.contactPerson) completed++;
  if (this.mobile) completed++;
  
  // Drivers (4) - check if at least one driver exists with minimal info
  if (this.drivers && this.drivers.length > 0) {
    const driver = this.drivers[0];
    if (driver.driverName) completed++;
    if (driver.driverMobile) completed++;
    if (driver.drivingLicenceNumber) completed++;
    if (driver.drivingExperienceYears) completed++;
  }
  
  // Vehicles (4) - check if at least one vehicle exists with minimal info
  if (this.vehicles && this.vehicles.length > 0) {
    const vehicle = this.vehicles[0];
    if (vehicle.vehicleRegistrationNumber) completed++;
    if (vehicle.vehicleType) completed++;
    if (vehicle.hasStretcher !== undefined) completed++;
    if (vehicle.rcFront || vehicle.insuranceCopy) completed++;
  }
  
  // Pricing (4)
  if (this.baseCharge) completed++;
  if (this.perKmCharge) completed++;
  if (this.paymentCash || this.paymentCard || this.paymentUPI) completed++;
  if (this.bankAccountNumber) completed++;
  
  // Operations (2)
  if (this.serviceAvailability) completed++;
  if (this.serviceCities && this.serviceCities.length > 0) completed++;
  
  // Bank (2)
  if (this.bankDetails && this.bankDetails.accountNumber) completed++;
  if (this.upiId) completed++;
  
  const percentage = Math.round((completed / total) * 100);
  this.profileCompletion = percentage;
  return percentage;
};

module.exports = mongoose.model('AmbulanceRestructured', AmbulanceRestructuredSchema);
