const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  destination: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  numPeople: { type: Number, required: true },
  packageType: { type: String, enum: ['standard', 'premium', 'luxury'], default: 'standard' },
  specialRequests: { type: String },
  paymentMethod: { type: String, enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cash'], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  qrCode: { type: String }, // Base64 encoded QR code
  confirmationNumber: { type: String }, // Unique confirmation ID
  createdAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date }
});

module.exports = mongoose.model('Booking', bookingSchema);