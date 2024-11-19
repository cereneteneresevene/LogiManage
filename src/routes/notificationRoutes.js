const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, notificationController.createNotification);

router.get('/', authenticateToken, notificationController.getNotificationsByUser);

router.put('/:id', authenticateToken, notificationController.markAsRead);

module.exports = router;
