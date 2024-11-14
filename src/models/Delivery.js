const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  product: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  deliveryStatus: {
    type: String,
    enum: ['in_transit', 'delivered', 'delayed'],
    default: 'in_transit'
  }
});

module.exports = mongoose.model('Delivery', deliverySchema);
