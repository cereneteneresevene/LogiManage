const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// Bildirim oluşturma (Admin ve Manager için)
router.post('/', authenticateToken, notificationController.createNotification);

// Kullanıcının bildirimlerini görüntüleme
router.get('/', authenticateToken, notificationController.getNotificationsByUser);

// Bildirimi okundu olarak işaretleme
router.put('/:id', authenticateToken, notificationController.markAsRead);

module.exports = router;
