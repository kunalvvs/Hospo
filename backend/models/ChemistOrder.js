const mongoose = require('mongoose');

const chemistOrderSchema = new mongoose.Schema({
  // Order Reference
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // User & Chemist Reference
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
  
  // Medicines Ordered
  medicines: [{
    productId: String,
    medicineName: {
      type: String,
      required: true
    },
    genericName: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    mrp: Number,
    discount: Number,
    prescriptionRequired: Boolean
  }],
  
  // Prescription (if required)
  prescriptionImage: {
    type: String,
    default: ''
  },
  
  // Order Amount
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'processing', 'ready', 'out-for-delivery', 'delivered', 'rejected', 'cancelled'],
    default: 'pending'
  },
  
  // Delivery Details
  deliveryAddress: {
    street: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String
  },
  deliveryType: {
    type: String,
    enum: ['home-delivery', 'pickup'],
    default: 'home-delivery'
  },
  
  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'wallet', 'online'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    default: ''
  },
  
  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  rejectedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  
  // Notes
  customerNotes: {
    type: String,
    default: ''
  },
  chemistNotes: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate order number before saving
chemistOrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('ChemistOrder').countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('ChemistOrder', chemistOrderSchema);
