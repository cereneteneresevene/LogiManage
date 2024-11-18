const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticateToken } = require('../middleware/auth');

router.post('/locations', authenticateToken, locationController.updateLocation);
router.get('/locations', authenticateToken, locationController.getAllLocations);

module.exports = router;
