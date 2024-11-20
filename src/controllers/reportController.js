const Delivery = require('../models/Delivery');
const Fuel = require('../models/Fuel');
const Maintenance = require('../models/Maintenance');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

exports.getMonthlyPerformanceReport = async (req, res) => {
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

    // Performans Raporu
    const report = {
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

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyReportPDF = async (req, res) => {
  try {
    const reportData = req.reportData; // Önceden oluşturulan aylık rapor verileri

    const doc = new PDFDocument();
    const fileName = `monthly_report_${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    doc.pipe(res);

    doc.fontSize(18).text('Aylık Performans Raporu', { align: 'center' });
    doc.moveDown();

    // Teslimat Verileri
    doc.fontSize(14).text('Teslimat Performansı');
    doc.text(`Toplam Teslimatlar: ${reportData.deliveries.total}`);
    doc.text(`Tamamlanan Teslimatlar: ${reportData.deliveries.completed}`);
    doc.text(`Geciken Teslimatlar: ${reportData.deliveries.delayed}`);
    doc.moveDown();

    // Yakıt Verileri
    doc.text('Yakıt Tüketimi');
    doc.text(`Toplam Yakıt Tüketimi: ${reportData.fuel.totalFuelConsumed} litre`);
    doc.moveDown();

    // Bakım Verileri
    doc.text('Bakım Kayıtları');
    doc.text(`Toplam Bakım Sayısı: ${reportData.maintenance.totalMaintenances}`);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyReportExcel = async (req, res) => {
  try {
    const reportData = req.reportData; // Önceden oluşturulan aylık rapor verileri

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Aylık Performans Raporu');

    worksheet.columns = [
      { header: 'Kategori', key: 'category', width: 25 },
      { header: 'Değer', key: 'value', width: 25 },
    ];

    worksheet.addRow({ category: 'Toplam Teslimatlar', value: reportData.deliveries.total });
    worksheet.addRow({ category: 'Tamamlanan Teslimatlar', value: reportData.deliveries.completed });
    worksheet.addRow({ category: 'Geciken Teslimatlar', value: reportData.deliveries.delayed });
    worksheet.addRow({ category: 'Toplam Yakıt Tüketimi', value: `${reportData.fuel.totalFuelConsumed} litre` });
    worksheet.addRow({ category: 'Toplam Bakım Sayısı', value: reportData.maintenance.totalMaintenances });

    const fileName = `monthly_report_${Date.now()}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};