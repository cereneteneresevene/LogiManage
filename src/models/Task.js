const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Görev için bir sürücü atanmalıdır.'],
    validate: {
      validator: async function (value) {
        const userExists = await mongoose.model('User').findById(value);
        return !!userExists;
      },
      message: 'Atanan sürücü mevcut değil.',
    },
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Görev için bir araç atanmalıdır.'],
    validate: {
      validator: async function (value) {
        const vehicleExists = await mongoose.model('Vehicle').findById(value);
        return !!vehicleExists;
      },
      message: 'Atanan araç mevcut değil.',
    },
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in_progress', 'completed'],
      message: 'Geçersiz görev durumu. Sadece "pending", "in_progress" veya "completed" olabilir.',
    },
    default: 'pending',
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

module.exports = mongoose.model('Task', taskSchema);
