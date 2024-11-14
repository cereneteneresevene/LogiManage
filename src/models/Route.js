const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  startPoint: {
    type: String,
    required: true
  },
  endPoint: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Route', routeSchema);
