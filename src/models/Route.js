const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  startPoint: {
    type: String,
    required: [true, 'Başlangıç noktası gereklidir.'],
    minlength: [3, 'Başlangıç noktası en az 3 karakter olmalıdır.'],
    maxlength: [100, 'Başlangıç noktası en fazla 100 karakter olabilir.'],
    trim: true,
  },
  endPoint: {
    type: String,
    required: [true, 'Bitiş noktası gereklidir.'],
    minlength: [3, 'Bitiş noktası en az 3 karakter olmalıdır.'],
    maxlength: [100, 'Bitiş noktası en fazla 100 karakter olabilir.'],
    trim: true,
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Atanmış sürücü gereklidir.'],
    validate: {
      validator: async function (value) {
        const userExists = await mongoose.model('User').findById(value);
        return !!userExists;
      },
      message: 'Atanan sürücü mevcut değil.',
    },
  },
  status: {
    type: String,
    enum: {
      values: ['not_started', 'in_progress', 'completed'],
      message: 'Geçersiz rota durumu. Sadece "not_started", "in_progress", veya "completed" olabilir.',
    },
    default: 'not_started',
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

module.exports = mongoose.model('Route', routeSchema);
