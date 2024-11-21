const Fuel = require('../models/Fuel');
const Vehicle = require('../models/Vehicle');
const CustomError = require('../utils/customError');

exports.addFuelRecord = async (req, res, next) => {
  try {
    const { vehicle, fuelAmount, mileage, cost } = req.body;

    const existingVehicle = await Vehicle.findById(vehicle);
    if (!existingVehicle) {
      throw new CustomError('Araç bulunamadı.', 404); 
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
    next(error); 
  }
};

exports.getFuelRecords = async (req, res, next) => {
  try {
    let fuelRecords;

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      fuelRecords = await Fuel.find().populate('vehicle driver');
    } else if (req.user.role === 'driver') {
      fuelRecords = await Fuel.find({ driver: req.user.id }).populate('vehicle');
    } else {
      throw new CustomError('Bu işlemi yapmaya yetkiniz yok.', 403); 
    }

    res.json(fuelRecords);
  } catch (error) {
    next(error); 
  }
};
