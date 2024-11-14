const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), notificationController.createNotification);
router.get('/my', authenticateToken, notificationController.getUserNotifications);

module.exports = router;
