const Vehicle = require('../models/Vehicle');
const User = require('../models/User'); 
const CustomError = require('../utils/customError');

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      throw new CustomError('Araç bulunamadı.', 404); 
    }

    if (req.user.role === 'driver') {
      const user = await User.findById(req.user.id);
      if (!user || user.assignedVehicleId.toString() !== vehicle._id.toString()) {
        return res.status(403).json({ message: 'Bu araca erişim yetkiniz yok.' });
      }
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Araç bulunamadı.' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Araç bulunamadı.' });
    res.json({ message: 'Araç başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
