const Delivery = require('../models/Delivery');

exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json({ message: 'Teslimat başarıyla oluşturuldu.', delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    let deliveries;

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      deliveries = await Delivery.find();
    } else if (req.user.role === 'driver') {
      deliveries = await Delivery.find({ assignedDriver: req.user.id });
    } else {
      return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
    }

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!delivery) return res.status(404).json({ message: 'Teslimat bulunamadı.' });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Teslimat bulunamadı.' });

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
