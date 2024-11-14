const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const fuelController = require('../controllers/fuelController');

router.post('/', authenticateToken, authorizeRole(['admin', 'manager', 'driver']), fuelController.addFuelEntry);
router.get('/', authenticateToken, authorizeRole(['admin', 'manager']), fuelController.getFuelEntries);

module.exports = router;
