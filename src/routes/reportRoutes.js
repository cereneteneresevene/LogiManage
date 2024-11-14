const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

router.get('/monthly', authenticateToken, authorizeRole(['admin', 'manager']), reportController.getMonthlyReport);

module.exports = router;
