const Fuel = require('../models/Fuel');

// Yakıt bilgisi ekleme
exports.addFuelEntry = async (req, res) => {
  const { vehicleId, amount, cost } = req.body;
  try {
    const fuelEntry = new Fuel({ vehicleId, amount, cost });
    await fuelEntry.save();
    res.status(201).json(fuelEntry);
  } catch (error) {
    res.status(500).json({ message: 'Yakıt bilgisi eklenemedi.' });
  }
};

// Tüm yakıt verilerini görüntüleme
exports.getFuelEntries = async (req, res) => {
  try {
    const fuelEntries = await Fuel.find();
    res.json(fuelEntries);
  } catch (error) {
    res.status(500).json({ message: 'Yakıt verileri alınamadı.' });
  }
};
