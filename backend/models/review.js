const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  helpful: { type: Number, default: 0 },
  notHelpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure at least one of destinationId or packageId is provided
reviewSchema.pre('save', function(next) {
  if (!this.destinationId && !this.packageId) {
    next(new Error('Either destinationId or packageId must be provided'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Review', reviewSchema);
