const Fuel = require('../models/Fuel');
const Vehicle = require('../models/Vehicle');

exports.addFuelRecord = async (req, res) => {
  try {
    const { vehicle, fuelAmount, mileage, cost } = req.body;

    const existingVehicle = await Vehicle.findById(vehicle);
    if (!existingVehicle) {
      return res.status(404).json({ message: 'Araç bulunamadı.' });
    }

    const fuelRecord = new Fuel({
      vehicle,
      driver: req.user.id, 
      fuelAmount,
      mileage,
      cost,
    });

    await fuelRecord.save();
    res.status(201).json({ message: 'Yakıt kaydı başarıyla oluşturuldu.', fuelRecord });
  } catch (error) {
    res.status(500).json({ message: 'Yakıt kaydı eklenirken hata oluştu.', error: error.message });
  }
};

exports.getFuelRecords = async (req, res) => {
  try {
    let fuelRecords;

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      fuelRecords = await Fuel.find().populate('vehicle driver');
    } else if (req.user.role === 'driver') {
      fuelRecords = await Fuel.find({ driver: req.user.id }).populate('vehicle');
    } else {
      return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
    }

    res.json(fuelRecords);
  } catch (error) {
    res.status(500).json({ message: 'Yakıt kayıtları alınırken hata oluştu.', error: error.message });
  }
};
