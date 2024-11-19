const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const maintenanceController = require('../controllers/maintenanceController');

router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), maintenanceController.createMaintenance);
router.get('/', authenticateToken, authorizeRole(['admin', 'manager']), maintenanceController.getAllMaintenances);
router.get('/vehicle/:vehicleId', authenticateToken, authorizeRole(['admin', 'manager', 'driver']), maintenanceController.getMaintenancesByVehicleId);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'manager']), maintenanceController.updateMaintenance);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'manager']), maintenanceController.deleteMaintenance);
router.get('/reminders/vehicle/:vehicleId', authenticateToken, authorizeRole(['admin', 'manager', 'driver']), maintenanceController.getMaintenanceRemindersByVehicleId);

module.exports = router;
