const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Araç bilgisi gereklidir.'],
    validate: {
      validator: async function (value) {
        const vehicleExists = await mongoose.model('Vehicle').findById(value);
        return !!vehicleExists;
      },
      message: 'Geçerli bir araç ID\'si giriniz.',
    },
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sürücü bilgisi gereklidir.'],
    validate: {
      validator: async function (value) {
        const driverExists = await mongoose.model('User').findById(value);
        return !!driverExists;
      },
      message: 'Geçerli bir sürücü ID\'si giriniz.',
    },
  },
  fuelAmount: {
    type: Number,
    required: [true, 'Yakıt miktarı gereklidir.'],
    min: [1, 'Yakıt miktarı en az 1 litre olmalıdır.'],
    max: [500, 'Yakıt miktarı 500 litreyi geçemez.'], 
  },
  mileage: {
    type: Number,
    required: [true, 'Kilometre bilgisi gereklidir.'],
    min: [0, 'Kilometre negatif olamaz.'],
    validate: {
      validator: function (value) {
        return value >= this.previousMileage;
      },
      message: 'Girilen kilometre önceki kilometreden düşük olamaz.',
    },
  },
  previousMileage: {
    type: Number,
    default: 0, 
  },
  cost: {
    type: Number,
    required: [true, 'Yakıt maliyeti gereklidir.'],
    min: [0, 'Yakıt maliyeti negatif olamaz.'],
  },
  date: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: 'Yakıt doldurma tarihi gelecekte bir tarih olamaz.',
    },
  },
});

fuelSchema.index({ vehicle: 1, driver: 1, date: -1 });

module.exports = mongoose.model('Fuel', fuelSchema);
