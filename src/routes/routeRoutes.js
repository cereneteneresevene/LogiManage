const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const routeController = require('../controllers/routeController');

router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), routeController.createRoute);
router.get('/', authenticateToken, authorizeRole(['admin', 'manager']), routeController.getRoutes);
router.get('/:id', authenticateToken, routeController.getRouteById);

module.exports = router;
