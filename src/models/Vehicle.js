const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: [true, 'Plaka numarası gereklidir.'],
    unique: true,
    trim: true,
    match: [/^[A-Z0-9-]{6,10}$/, 'Geçerli bir plaka numarası giriniz. (6-10 karakter, sadece harf, rakam ve tire)'],
  },
  model: {
    type: String,
    required: [true, 'Araç modeli gereklidir.'],
    trim: true,
    minlength: [2, 'Araç modeli en az 2 karakter olmalıdır.'],
    maxlength: [100, 'Araç modeli en fazla 100 karakter olabilir.'],
  },
  fuelType: {
    type: String,
    enum: {
      values: ['diesel', 'petrol', 'electric'],
      message: 'Geçersiz yakıt türü. Sadece "diesel", "petrol" veya "electric" olabilir.',
    },
    required: [true, 'Yakıt türü gereklidir.'],
  },
  mileage: {
    type: Number,
    required: [true, 'Kilometre bilgisi gereklidir.'],
    min: [0, 'Kilometre negatif olamaz.'],
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function (value) {
        if (!value) return true; // Eğer boşsa doğrulama atlanır.
        const userExists = await mongoose.model('User').findById(value);
        return !!userExists;
      },
      message: 'Atanan sürücü bulunamadı.',
    },
  },
  fuelLevel: {
    type: Number,
    required: [true, 'Yakıt seviyesi gereklidir.'],
    default: 100,
    min: [0, 'Yakıt seviyesi 0\'dan küçük olamaz.'],
    max: [100, 'Yakıt seviyesi 100\'den büyük olamaz.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: 'Oluşturulma tarihi gelecekte bir tarih olamaz.',
    },
  },
  updatedAt: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || value >= this.createdAt;
      },
      message: 'Güncelleme tarihi oluşturulma tarihinden önce olamaz.',
    },
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
