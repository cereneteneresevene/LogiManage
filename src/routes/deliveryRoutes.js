// routes/deliveryRoutes.js
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Teslimat oluşturma - Sadece Admin ve Manager
router.post('/deliveries', authenticateToken, authorizeRole(['admin', 'manager']), deliveryController.createDelivery);

// Tüm teslimatları listeleme - Sadece Admin ve Manager
router.get('/deliveries', authenticateToken, authorizeRole(['admin', 'manager']), deliveryController.getAllDeliveries);

// Teslimat güncelleme - Sadece Admin ve Manager
router.put('/deliveries/:id', authenticateToken, authorizeRole(['admin', 'manager']), deliveryController.updateDelivery);

// Teslimat durumunu güncelleme - Driver yalnızca kendi atanmış teslimatlarını güncelleyebilir
router.patch('/deliveries/:id/status', authenticateToken, deliveryController.updateDeliveryStatus);

module.exports = router;
