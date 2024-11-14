const Delivery = require('../models/Delivery');

// Teslimat oluşturma
exports.createDelivery = async (req, res) => {
  const { taskId, product, destination } = req.body;
  try {
    const delivery = new Delivery({ taskId, product, destination });
    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Teslimat oluşturulamadı.' });
  }
};

// Teslimatları görüntüleme
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Teslimatlar alınamadı.' });
  }
};

// Teslimat durumunu güncelleme
exports.updateDeliveryStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!delivery) return res.status(404).json({ message: 'Teslimat bulunamadı.' });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Teslimat durumu güncellenemedi.' });
  }
};
