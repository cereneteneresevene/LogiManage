const Task = require('../models/Task');
const Delivery = require('../models/Delivery');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

exports.getMonthlyPerformanceReportData = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1; // Geçerli ay
    const currentYear = new Date().getFullYear(); // Geçerli yıl

    // Görevler
    const tasks = await Task.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-${currentMonth}-01`),
            $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Teslimatlar
    const deliveries = await Delivery.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-${currentMonth}-01`),
            $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Bakımlar
    const maintenanceCount = await Maintenance.countDocuments({
      maintenanceDate: {
        $gte: new Date(`${currentYear}-${currentMonth}-01`),
        $lt: new Date(`${currentYear}-${currentMonth + 1}-01`)
      }
    });

    // Yakıt Tüketimi
    const vehicles = await Vehicle.find();
    const fuelConsumption = vehicles.map(vehicle => ({
      vehicle: vehicle.plateNumber,
      fuelType: vehicle.fuelType,
      mileage: vehicle.mileage
    }));

    // Verileri birleştirip döndür
    return {
      tasks,
      deliveries,
      maintenanceCount,
      fuelConsumption
    };
  } catch (error) {
    console.error('Rapor verisi oluşturulurken hata:', error.message);
    throw new Error('Rapor verisi oluşturulamadı.');
  }
};
