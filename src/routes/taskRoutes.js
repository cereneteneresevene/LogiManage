// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/tasks', authenticateToken, authorizeRole(['admin', 'manager']), taskController.createTask);

router.get('/tasks', authenticateToken, authorizeRole(['admin', 'manager']), taskController.getAllTasks);

router.put('/tasks/:id', authenticateToken, authorizeRole(['admin', 'manager']), taskController.updateTask);

router.get('/tasks/driver', authenticateToken, authorizeRole(['driver']), taskController.getTasksByDriver);

module.exports = router;
