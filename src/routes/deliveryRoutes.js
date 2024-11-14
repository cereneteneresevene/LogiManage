const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const deliveryController = require('../controllers/deliveryController');

router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), deliveryController.createDelivery);
router.get('/', authenticateToken, authorizeRole(['admin', 'manager']), deliveryController.getDeliveries);
router.patch('/:id/status', authenticateToken, deliveryController.updateDeliveryStatus);

module.exports = router;
