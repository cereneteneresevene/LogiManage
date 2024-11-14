exports.getMonthlyReport = async (req, res) => {
    try {
      // Aylık performans analizi örneği
      const reportData = {
        deliveriesOnTime: 120,
        lateDeliveries: 15,
        fuelConsumption: 5000,
      };
      res.json(reportData);
    } catch (error) {
      res.status(500).json({ message: 'Rapor oluşturulamadı.' });
    }
  };
  