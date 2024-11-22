const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bildirim için bir kullanıcı belirtilmelidir.'],
    validate: {
      validator: async function (value) {
        const userExists = await mongoose.model('User').findById(value);
        return !!userExists;
      },
      message: 'Belirtilen kullanıcı mevcut değil.',
    },
  },
  message: {
    type: String,
    required: [true, 'Bildirim mesajı gereklidir.'],
    minlength: [10, 'Mesaj en az 10 karakter olmalıdır.'],
    maxlength: [500, 'Mesaj en fazla 500 karakter olabilir.'],
  },
  type: {
    type: String,
    enum: {
      values: ['routeChange', 'urgent', 'maintenance', 'fuel'],
      message: 'Bildirim türü geçersiz. Sadece "routeChange", "urgent", "maintenance", veya "fuel" olabilir.',
    },
    required: [true, 'Bildirim türü belirtilmelidir.'],
  },
  isRead: {
    type: Boolean,
    default: false,
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
});

module.exports = mongoose.model('Notification', notificationSchema);
