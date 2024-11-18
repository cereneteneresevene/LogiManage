const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fuelAmount: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number, 
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Fuel', fuelSchema);
