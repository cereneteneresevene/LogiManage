const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim gereklidir.'],
    trim: true,
    minlength: [2, 'İsim en az 2 karakter olmalıdır.'],
    maxlength: [100, 'İsim en fazla 100 karakter olabilir.'],
  },
  email: {
    type: String,
    required: [true, 'E-posta adresi gereklidir.'],
    unique: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Geçerli bir e-posta adresi giriniz.',
    },
  },
  password: {
    type: String,
    required: [true, 'Şifre gereklidir.'],
    minlength: [8, 'Şifre en az 8 karakter olmalıdır.'],
    validate: {
      validator: (value) => {
        // Şifrede en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter olmalı.
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message: 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.',
    },
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: (value) => {
        // Telefon numarası doğrulama (örneğin, +905555555555 formatında)
        return !value || validator.isMobilePhone(value, 'any');
      },
      message: 'Geçerli bir telefon numarası giriniz.',
    },
  },
  role: {
    type: String,
    enum: {
      values: ['driver', 'manager', 'admin'],
      message: 'Geçersiz rol. Sadece "driver", "manager" veya "admin" olabilir.',
    },
    default: 'driver',
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

module.exports = mongoose.model('User', userSchema);
