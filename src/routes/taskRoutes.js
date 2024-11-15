// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Görev oluşturma - Sadece Admin ve Manager
router.post('/tasks', authenticateToken, authorizeRole(['admin', 'manager']), taskController.createTask);

// Tüm görevleri listeleme - Sadece Admin ve Manager
router.get('/tasks', authenticateToken, authorizeRole(['admin', 'manager']), taskController.getAllTasks);

// Görev güncelleme - Sadece Admin ve Manager
router.put('/tasks/:id', authenticateToken, authorizeRole(['admin', 'manager']), taskController.updateTask);

// Driver için atanmış görevleri listeleme
router.get('/tasks/driver', authenticateToken, authorizeRole(['driver']), taskController.getTasksByDriver);

module.exports = router;
