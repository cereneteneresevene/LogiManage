const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Token Doğrulama Middleware
exports.authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token eksik.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Geçersiz token.' });
  }
};

// Rol Yetkilendirme Middleware
exports.authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Yetkiniz yok.' });
  }
  next();
};
