const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/', authenticateToken, authorizeRole(['driver']), fuelController.addFuelRecord);

router.get('/', authenticateToken, fuelController.getFuelRecords);

module.exports = router;
