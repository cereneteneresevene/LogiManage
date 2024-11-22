const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sürücü bilgisi gereklidir.'],
    validate: {
      validator: async function (value) {
        const userExists = await mongoose.model('User').findById(value);
        return !!userExists;
      },
      message: 'Geçerli bir sürücü ID\'si giriniz.',
    },
  },
  latitude: {
    type: Number,
    required: [true, 'Enlem bilgisi gereklidir.'],
    min: [-90, 'Enlem -90 ile 90 arasında olmalıdır.'],
    max: [90, 'Enlem -90 ile 90 arasında olmalıdır.'],
  },
  longitude: {
    type: Number,
    required: [true, 'Boylam bilgisi gereklidir.'],
    min: [-180, 'Boylam -180 ile 180 arasında olmalıdır.'],
    max: [180, 'Boylam -180 ile 180 arasında olmalıdır.'],
  },
  accuracy: {
    type: Number,
    required: false,
    min: [0, 'Konum doğruluğu negatif olamaz.'],
    max: [100, 'Konum doğruluğu 100\'den büyük olamaz.'], 
    default: 10, 
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: 'Güncelleme tarihi gelecekte bir tarih olamaz.',
    },
  },
});

locationSchema.index({ driver: 1, updatedAt: -1 });

module.exports = mongoose.model('Location', locationSchema);
