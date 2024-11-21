const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const CustomError = require('../utils/customError');
const mongoose = require('mongoose');

exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    next(new CustomError('Araçlar alınırken bir hata oluştu.', 500));
  }
};

exports.getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new CustomError('Geçersiz ID formatı.', 400));
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      throw new CustomError('Araç bulunamadı.', 404);
    }

    if (req.user.role === 'driver') {
      const user = await User.findById(req.user.id);
      if (!user || user.assignedVehicleId.toString() !== vehicle._id.toString()) {
        return next(new CustomError('Bu araca erişim yetkiniz yok.', 403));
      }
    }

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return next(new CustomError('Araç bulunamadı.', 404));
    res.json(vehicle);
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return next(new CustomError('Araç bulunamadı.', 404));
    res.json({ message: 'Araç başarıyla silindi.' });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
