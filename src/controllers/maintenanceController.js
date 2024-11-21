const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const CustomError = require('../utils/customError');

exports.createMaintenance = async (req, res, next) => {
  try {
    const maintenance = new Maintenance(req.body);
    await maintenance.save();
    res.status(201).json({ message: 'Bakım kaydı oluşturuldu.', maintenance });
  } catch (error) {
    next(error); 
  }
};

exports.getAllMaintenances = async (req, res, next) => {
  try {
    const maintenances = await Maintenance.find().populate('vehicle');
    res.json(maintenances);
  } catch (error) {
    next(error);
  }
};

exports.getMaintenancesByVehicleId = async (req, res, next) => {
  try {
    const maintenances = await Maintenance.find({ vehicle: req.params.vehicleId }).populate('vehicle');
    if (maintenances.length === 0) {
      throw new CustomError('Bu araca ait bakım kaydı bulunamadı.', 404); 
    }
    res.json(maintenances);
  } catch (error) {
    next(error);
  }
};

exports.updateMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!maintenance) {
      throw new CustomError('Bakım kaydı bulunamadı.', 404);
    }
    res.json(maintenance);
  } catch (error) {
    next(error);
  }
};

exports.deleteMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) {
      throw new CustomError('Bakım kaydı bulunamadı.', 404);
    }
    res.json({ message: 'Bakım kaydı silindi.' });
  } catch (error) {
    next(error);
  }
};

exports.getMaintenanceRemindersByVehicleId = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new CustomError('Araç bulunamadı. Lütfen geçerli bir araç ID girin.', 404);
    }

    console.log('Aracın bilgileri:', vehicle);

    const maintenance = await Maintenance.findOne({ vehicle: vehicleId }).sort({ nextMaintenanceDate: 1 });
    if (!maintenance) {
      throw new CustomError('Bu araca ait bakım kaydı bulunamadı.', 404);
    }

    console.log('Bakım kaydı:', maintenance);

    const currentDate = new Date();
    const mileageThreshold = 500;
    const dateThreshold = 7;

    const reminders = [];

    if (vehicle.mileage >= maintenance.nextMaintenanceMileage - mileageThreshold) {
      reminders.push({
        vehicle: vehicleId,
        message: `Araç (${vehicle.plateNumber}) bakım kilometre sınırına yaklaşıyor!`,
      });
    }

    console.log('Kilometre hatırlatması kontrol edildi.');

    const nextMaintenanceDate = new Date(maintenance.nextMaintenanceDate);
    const daysToMaintenance = (nextMaintenanceDate - currentDate) / (1000 * 60 * 60 * 24);

    console.log('Günler kalan bakım:', daysToMaintenance);

    if (daysToMaintenance <= dateThreshold) {
      reminders.push({
        vehicle: vehicleId,
        message: `Araç (${vehicle.plateNumber}) bakım tarihi yaklaşıyor!`,
      });
    }

    console.log('Tarih hatırlatması kontrol edildi.');

    res.json({ reminders });
  } catch (error) {
    next(error);
  }
};
