const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/deliveries', authenticateToken, authorizeRole(['admin', 'manager']), deliveryController.createDelivery);

router.get('/deliveries', authenticateToken, deliveryController.getAllDeliveries);

router.put('/deliveries/:id', authenticateToken, authorizeRole(['admin', 'manager']), deliveryController.updateDelivery);

router.patch('/deliveries/:id/status', authenticateToken, deliveryController.updateDeliveryStatus);

module.exports = router;
