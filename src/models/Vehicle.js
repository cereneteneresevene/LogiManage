const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['diesel', 'petrol', 'electric'],
    required: true
  },
  mileage: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
