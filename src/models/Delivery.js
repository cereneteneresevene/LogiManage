const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  product: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['Yolda', 'Teslim Edildi', 'Gecikti'], default: 'Yolda' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Delivery', deliverySchema);
