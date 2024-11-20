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
    const reportData = req.reportData; 

    const doc = new PDFDocument();
    const fileName = `monthly_report_${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    doc.pipe(res);

    doc.fontSize(18).text('Aylik Performans Raporu', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text('Teslimat Performansi');
    doc.text(`Toplam Teslimatlar: ${reportData.deliveries.total}`);
    doc.text(`Tamamlanan Teslimatlar: ${reportData.deliveries.completed}`);
    doc.text(`Geciken Teslimatlar: ${reportData.deliveries.delayed}`);
    doc.moveDown();

    doc.text('Yakit Tüketimi');
    doc.text(`Toplam Yakit Tüketimi: ${reportData.fuel.totalFuelConsumed} litre`);
    doc.moveDown();

    doc.text('Bakim Kayitlari');
    doc.text(`Toplam Bakim Sayisi: ${reportData.maintenance.totalMaintenances}`);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyReportExcel = async (req, res) => {
  try {
    const reportData = req.reportData; 

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Aylik Performans Raporu');

    worksheet.columns = [
      { header: 'Kategori', key: 'category', width: 25 },
      { header: 'Değer', key: 'value', width: 25 },
    ];

    worksheet.addRow({ category: 'Toplam Teslimatlar', value: reportData.deliveries.total });
    worksheet.addRow({ category: 'Tamamlanan Teslimatlar', value: reportData.deliveries.completed });
    worksheet.addRow({ category: 'Geciken Teslimatlar', value: reportData.deliveries.delayed });
    worksheet.addRow({ category: 'Toplam Yakit Tüketimi', value: `${reportData.fuel.totalFuelConsumed} litre` });
    worksheet.addRow({ category: 'Toplam Bakim Sayisi', value: reportData.maintenance.totalMaintenances });

    const fileName = `monthly_report_${Date.now()}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};