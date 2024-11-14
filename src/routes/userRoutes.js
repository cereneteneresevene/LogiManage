const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const User = require('../models/User');

router.get('/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
  }
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.put('/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

router.delete('/users/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Kullanıcı silindi.' });
});

module.exports = router;
