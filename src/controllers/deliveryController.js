const Delivery = require('../models/Delivery');

exports.createDelivery = async (req, res, next) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json({ message: 'Teslimat başarıyla oluşturuldu.', delivery });
  } catch (error) {
    next(error); 
  }
};

exports.getAllDeliveries = async (req, res, next) => {
  try {
    let deliveries;

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      deliveries = await Delivery.find();
    } else if (req.user.role === 'driver') {
      deliveries = await Delivery.find({ assignedDriver: req.user.id });
    } else {
      throw new CustomError('Bu işlemi yapmaya yetkiniz yok.', 403); 
    }

    res.json(deliveries);
  } catch (error) {
    next(error); 
  }
};

exports.updateDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!delivery) {
      throw new CustomError('Teslimat bulunamadı.', 404); 
    }
    res.json(delivery);
  } catch (error) {
    next(error); 
  }
};

exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      throw new CustomError('Teslimat bulunamadı.', 404); 
    }

    if (req.user.role === 'driver' && delivery.assignedDriver.toString() !== req.user.id) {
      throw new CustomError('Bu teslimatı güncelleme yetkiniz yok.', 403); 
    }

    delivery.status = req.body.status || delivery.status;
    await delivery.save();
    res.json({ message: 'Teslimat durumu güncellendi.', delivery });
  } catch (error) {
    next(error); 
  }
};
