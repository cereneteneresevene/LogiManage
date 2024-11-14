const Notification = require('../models/Notification');

// Bildirim oluşturma
exports.createNotification = async (req, res) => {
  const { userId, message, type } = req.body;
  try {
    const notification = new Notification({ userId, message, type });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Bildirim oluşturulamadı.' });
  }
};

// Kullanıcı bildirimlerini listeleme
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Bildirimler alınamadı.' });
  }
};
