const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  image: { type: String, required: true },
  inclusions: [{ type: String }],
  itinerary: [{ day: Number, description: String }]
});

module.exports = mongoose.model('Package', packageSchema);