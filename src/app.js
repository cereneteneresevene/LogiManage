require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const taskRoutes = require('./routes/taskRoutes');
const routeRoutes = require('./routes/routeRoutes');
const locationRoutes = require('./routes/locationRoutes');
const fuelRoutes = require('./routes/fuelRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const apiLogger = require('./middleware/loggerMiddleware');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Merhaba, API çalışıyor!');
});

connectDB();

app.use(apiLogger);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', deliveryRoutes);
app.use('/api', taskRoutes);
app.use('/api', routeRoutes);
app.use('/api', locationRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

const server = app.listen(PORT, () => {
  logger.info(`Sunucu ${PORT} portunda çalışıyor.`);
});

process.on('SIGINT', () => {
  logger.info('Sunucu kapatılıyor...');
  server.close(() => {
    logger.info('Sunucu başarıyla kapatıldı.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
