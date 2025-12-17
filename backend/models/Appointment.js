const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  // Patient Information
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  patientEmail: String,

  // Doctor Information
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },

  // Appointment Details
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  consultationType: {
    type: String,
    enum: ['In-Person', 'Video Consultation'],
    default: 'In-Person'
  },
  bookingFor: {
    type: String,
    enum: ['Self', 'Family Member', 'Other'],
    default: 'Self'
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },

  // Payment
  consultationFee: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['Online', 'Cash', 'Card'],
    default: 'Online'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },

  // Additional Information
  symptoms: String,
  notes: String,
  
  // Hospital/Clinic Location (if in-person)
  location: {
    hospital: String,
    address: String
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
AppointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
