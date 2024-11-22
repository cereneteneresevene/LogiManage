const mongoose = require('mongoose');
const validator = require('validator');

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Kullanıcı bilgisi gereklidir.'],
      validate: {
        validator: async function (value) {
          const userExists = await mongoose.model('User').findById(value);
          return !!userExists;
        },
        message: 'Geçerli bir kullanıcı ID\'si giriniz.',
      },
    },
    phone: {
      type: String,
      required: [true, 'Telefon numarası gereklidir.'],
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isMobilePhone(value, 'tr-TR');
        },
        message: 'Geçerli bir telefon numarası giriniz. (+905555555555 formatında olmalıdır).',
      },
    },
    licenseNumber: {
      type: String,
      required: [true, 'Ehliyet numarası gereklidir.'],
      unique: true,
      trim: true,
      match: [/^[A-Z0-9]{8,16}$/, 'Ehliyet numarası geçersiz.'],
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      validate: {
        validator: async function (value) {
          if (!value) return true; 
          const vehicleExists = await mongoose.model('Vehicle').findById(value);
          return !!vehicleExists;
        },
        message: 'Atanan araç geçerli değil.',
      },
    },
  },
  {
    timestamps: true,
  }
);

driverSchema.index({ phone: 1 });
driverSchema.index({ licenseNumber: 1 });

module.exports = mongoose.model('Driver', driverSchema);
