const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  product: {
    type: String,
    required: [true, 'Ürün adı zorunludur.'],
    minlength: [2, 'Ürün adı en az 2 karakter uzunluğunda olmalıdır.'],
    maxlength: [100, 'Ürün adı en fazla 100 karakter uzunluğunda olabilir.'],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, 'Teslimat adresi zorunludur.'],
    minlength: [5, 'Teslimat adresi en az 5 karakter uzunluğunda olmalıdır.'],
    maxlength: [200, 'Teslimat adresi en fazla 200 karakter uzunluğunda olabilir.'],
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ['Yolda', 'Teslim Edildi', 'Gecikti'],
      message: 'Durum yalnızca "Yolda", "Teslim Edildi" veya "Gecikti" olabilir.',
    },
    default: 'Yolda',
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function (value) {
        if (!value) return true; // Sürücü atanmadıysa doğrulama atlanır.
        const userExists = await mongoose.model('User').findById(value);
        return !!userExists;
      },
      message: 'Geçerli bir sürücü ID\'si giriniz.',
    },
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
      message: 'Güncelleme tarihi, oluşturulma tarihinden önce olamaz.',
    },
  },
  deliveryDate: {
    type: Date,
    required: [true, 'Teslim tarihi zorunludur.'],
    validate: {
      validator: function (value) {
        return value > this.createdAt;
      },
      message: 'Teslim tarihi, oluşturulma tarihinden sonra olmalıdır.',
    },
  },
});

module.exports = mongoose.model('Delivery', deliverySchema);
