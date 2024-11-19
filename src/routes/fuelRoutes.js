const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { checkFuelAlerts } = require('../controllers/notificationController');

router.post('/', authenticateToken, authorizeRole(['driver']), fuelController.addFuelRecord);

router.get('/', authenticateToken, fuelController.getFuelRecords);

router.get('/fuel-alerts', authenticateToken, checkFuelAlerts);

module.exports = router;
