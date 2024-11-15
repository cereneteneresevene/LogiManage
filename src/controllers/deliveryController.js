// controllers/deliveryController.js
const Delivery = require('../models/Delivery');

// Teslimat oluşturma - Sadece Admin ve Manager
exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json({ message: 'Teslimat başarıyla oluşturuldu.', delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tüm teslimatları listeleme - Sadece Admin ve Manager
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('assignedDriver', 'name');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir teslimatı güncelleme - Sadece Admin ve Manager
exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!delivery) return res.status(404).json({ message: 'Teslimat bulunamadı.' });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teslimat durumunu güncelleme - Driver yalnızca kendine atanmış teslimatları güncelleyebilir
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Teslimat bulunamadı.' });

    // Yalnızca atanmış driver teslimat durumunu güncelleyebilir
    if (req.user.role === 'driver' && delivery.assignedDriver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bu teslimatı güncelleme yetkiniz yok.' });
    }

    delivery.status = req.body.status || delivery.status;
    await delivery.save();
    res.json({ message: 'Teslimat durumu güncellendi.', delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
