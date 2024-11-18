// routes/routeRoutes.js

const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/routes', authenticateToken, authorizeRole(['admin', 'manager']), routeController.createRoute);
router.get('/routes', authenticateToken, authorizeRole(['admin', 'manager']), routeController.getAllRoutes);
router.get('/routes/my', authenticateToken, authorizeRole(['driver']), routeController.getRoutesByDriver);
router.put('/routes/:id', authenticateToken, authorizeRole(['admin', 'manager','driver']), routeController.updateRoute);
router.delete('/routes/:id', authenticateToken, authorizeRole(['admin', 'manager']), routeController.deleteRoutes);

module.exports = router;
