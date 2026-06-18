const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Beach', 'Mountain', 'Heritage', 'Adventure', 'City', 'Spiritual'], required: true },
  description: { type: String, required: true },
  bestTimeToVisit: { type: String, required: true },
  thingsToDo: [{ type: String }],
  rating: { type: Number, min: 1, max: 5, required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model('Destination', destinationSchema);