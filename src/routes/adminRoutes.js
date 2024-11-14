const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/users', authenticateToken, authorizeRole(['admin']), userController.getAllUsers);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.put('/users/:id', authenticateToken, authorizeRole(['admin']), userController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);

module.exports = router;
