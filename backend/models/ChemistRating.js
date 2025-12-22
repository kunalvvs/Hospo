const mongoose = require('mongoose');

const chemistRatingSchema = new mongoose.Schema({
  // References
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chemist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chemist',
    required: true
  },
  
  // Rating & Review
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Helpful Votes
  helpfulCount: {
    type: Number,
    default: 0
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one rating per user per chemist
chemistRatingSchema.index({ user: 1, chemist: 1 }, { unique: true });

module.exports = mongoose.model('ChemistRating', chemistRatingSchema);
