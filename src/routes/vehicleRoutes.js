const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Admin ve Manager için araç ekleme
router.post('/vehicles', authenticateToken, authorizeRole(['admin', 'manager']), vehicleController.createVehicle);

// Tüm araçları listeleme - Sadece Admin ve Manager erişebilir
router.get('/vehicles', authenticateToken, authorizeRole(['admin', 'manager']), vehicleController.getAllVehicles);

// Belirli bir aracı görüntüleme - Admin ve Manager her aracı görüntüleyebilir, Driver yalnızca kendine atanmış olanı
router.get('/vehicles/:id', authenticateToken, vehicleController.getVehicleById);

// Admin ve Manager için araç güncelleme
router.put('/vehicles/:id', authenticateToken, authorizeRole(['admin', 'manager']), vehicleController.updateVehicle);

// Admin ve Manager için araç silme
router.delete('/vehicles/:id', authenticateToken, authorizeRole(['admin', 'manager']), vehicleController.deleteVehicle);

module.exports = router;
