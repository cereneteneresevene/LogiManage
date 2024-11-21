const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const Vehicle = require('../models/Vehicle');
const CustomError = require('../utils/customError');

exports.createNotification = async (req, res, next) => {
  try {
    const { userId, message, type } = req.body;
    if (!userId) {
      throw new CustomError('Kullanıcı ID\'si eksik.', 400);
    }
    const notification = new Notification({
      user: userId,
      message,
      type,
    });

    await notification.save();

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
    next(error); 
  }
};

exports.getNotificationsByUser = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new CustomError('Bildirim bulunamadı.', 404);
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

exports.checkFuelAlerts = async (req, res, next) => {
  try {
    const lowFuelThreshold = 15; 
    const vehicles = await Vehicle.find();

    const reminders = [];

    for (const vehicle of vehicles) {
      if (vehicle.fuelLevel <= lowFuelThreshold) {
        const message = `Araç (${vehicle.plateNumber}) yakıt seviyesi kritik! Lütfen yakıt ekleyin.`;
        reminders.push({ vehicle: vehicle._id, message });

        await Notification.create({
          user: vehicle.assignedDriver,
          message,
          type: 'Fuel Alert',
          isRead: false,
        });

        const driver = await User.findById(vehicle.assignedDriver);
        if (driver && driver.email) {
          await sendEmail(driver.email, 'Yakıt Uyarısı', message);
        }
      }
    }

    res.json({ reminders });
  } catch (error) {
    next(error);
  }
};
