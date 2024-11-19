const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

exports.createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    // Kullanıcı ID kontrolü
    if (!userId) {
      return res.status(400).json({ message: 'Kullanıcı ID\'si eksik.' });
    }

    // Bildirimi oluştur
    const notification = new Notification({
      user: userId,
      message,
      type,
    });

    await notification.save();

    // Kullanıcıya e-posta gönder
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendEmail(
        user.email,
        'Yeni Bildiriminiz Var!',
        `Merhaba ${user.name},\n\n${message}`
      );
    }

    res.status(201).json({ message: 'Bildirim ve e-posta başarıyla oluşturuldu.', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Bildirim bulunamadı.' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
