const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  maintenanceDate: {
    type: Date,
    default: Date.now,
  },
  nextMaintenanceDate: {
    type: Date,
    required: true,
  },
  mileageAtMaintenance: {
    type: Number,
    required: true,
  },
  nextMaintenanceMileage: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
