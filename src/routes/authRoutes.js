const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 5, 
    message: {
      success: false,
      message: 'Çok fazla başarısız giriş denemesi. Lütfen 5 dakika sonra tekrar deneyin.',
    },
});

router.post('/register', authController.register);
router.post('/login',loginLimiter, authController.login);

module.exports = router;
