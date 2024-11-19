const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

exports.createMaintenance = async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    await maintenance.save();
    res.status(201).json({ message: 'Bakım kaydı oluşturuldu.', maintenance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.find().populate('vehicle');
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaintenancesByVehicleId = async (req, res) => {
    try {
      const maintenances = await Maintenance.find({ vehicle: req.params.vehicleId }).populate('vehicle');
      if (maintenances.length === 0) {
        return res.status(404).json({ message: 'Bu araca ait bakım kaydı bulunamadı.' });
      }
      res.json(maintenances);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};  

exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!maintenance) return res.status(404).json({ message: 'Bakım kaydı bulunamadı.' });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Bakım kaydı bulunamadı.' });
    res.json({ message: 'Bakım kaydı silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaintenanceRemindersByVehicleId = async (req, res) => {
    try {
      const vehicleId = req.params.vehicleId;
  
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: 'Araç bulunamadı. Lütfen geçerli bir araç ID girin.' });
      }
  
      console.log('Aracın bilgileri:', vehicle);
  
      const maintenance = await Maintenance.findOne({ vehicle: vehicleId })
      .sort({ nextMaintenanceDate: 1 }); 
          if (!maintenance) {
        return res.status(404).json({ message: 'Bu araca ait bakım kaydı bulunamadı.' });
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
      res.status(500).json({ message: `Hata oluştu: ${error.message}` });
    }
  };
  
  
  
  
  
