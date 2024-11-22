const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const userLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 50,
    message: {
      success: false,
      message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.',
    },
});

router.use(userLimiter);

router.get('/users', authenticateToken, authorizeRole(['admin']), userController.getAllUsers);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.put('/users/:id', authenticateToken, authorizeRole(['admin']), userController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);

module.exports = router;
