const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Araç bilgisi gereklidir.'],
    validate: {
      validator: async function (value) {
        const vehicleExists = await mongoose.model('Vehicle').findById(value);
        return !!vehicleExists;
      },
      message: 'Belirtilen araç mevcut değil.',
    },
  },
  description: {
    type: String,
    required: [true, 'Bakım açıklaması gereklidir.'],
    minlength: [10, 'Açıklama en az 10 karakter olmalıdır.'],
    maxlength: [500, 'Açıklama en fazla 500 karakter olabilir.'],
  },
  maintenanceDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: 'Bakım tarihi gelecekte bir tarih olamaz.',
    },
  },
  nextMaintenanceDate: {
    type: Date,
    required: [true, 'Bir sonraki bakım tarihi gereklidir.'],
    validate: {
      validator: function (value) {
        return value > this.maintenanceDate;
      },
      message: 'Bir sonraki bakım tarihi, bakım tarihinden sonra olmalıdır.',
    },
  },
  mileageAtMaintenance: {
    type: Number,
    required: [true, 'Bakım sırasında kilometre bilgisi gereklidir.'],
    min: [0, 'Kilometre bilgisi negatif olamaz.'],
  },
  nextMaintenanceMileage: {
    type: Number,
    required: [true, 'Bir sonraki bakım kilometresi gereklidir.'],
    validate: {
      validator: function (value) {
        return value > this.mileageAtMaintenance;
      },
      message: 'Bir sonraki bakım kilometresi, mevcut kilometreden büyük olmalıdır.',
    },
  },
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
