const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/users', authenticateToken, authorizeRole('admin'), adminController.getAllUsers);

module.exports = router;
