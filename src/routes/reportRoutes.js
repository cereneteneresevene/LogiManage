const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { getMonthlyPerformanceReport, getMonthlyReportPDF, getMonthlyReportExcel } = require('../controllers/reportController');
const {prepareMonthlyReportData} =require ('../middleware/reportMiddleware')

router.get('/monthly/json', authenticateToken, authorizeRole(['admin', 'manager']), prepareMonthlyReportData, getMonthlyPerformanceReport);
router.get('/monthly/pdf', authenticateToken, authorizeRole(['admin', 'manager']),prepareMonthlyReportData, getMonthlyReportPDF);
router.get('/monthly/excel', authenticateToken, authorizeRole(['admin', 'manager']), prepareMonthlyReportData,getMonthlyReportExcel);

module.exports = router;
