const Delivery = require('../models/Delivery');
const Fuel = require('../models/Fuel');
const Maintenance = require('../models/Maintenance');

exports.prepareMonthlyReportData = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Teslimat Performansı
    const deliveries = await Delivery.find({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });
    const completedDeliveries = deliveries.filter(delivery => delivery.status === 'completed').length;
    const delayedDeliveries = deliveries.filter(delivery => delivery.status === 'delayed').length;

    // Yakıt Tüketimi
    const fuelRecords = await Fuel.find({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });
    const totalFuel = fuelRecords.reduce((sum, record) => sum + record.amount, 0);

    // Bakım Geçmişi
    const maintenanceRecords = await Maintenance.find({
      maintenanceDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });
    const totalMaintenances = maintenanceRecords.length;

    // Rapor Verisi
    req.reportData = {
      deliveries: {
        total: deliveries.length,
        completed: completedDeliveries,
        delayed: delayedDeliveries,
      },
      fuel: {
        totalFuelConsumed: totalFuel,
      },
      maintenance: {
        totalMaintenances,
      },
    };

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
