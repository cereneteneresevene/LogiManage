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
const mongoose = require('mongoose');
const apiLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(apiLogger);
app.use('/api/', apiLimiter);

app.get('/', (req, res) => {
  res.send('Merhaba, API çalışıyor!');
});

connectDB();

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

app.use((req, res, next) => {
  const error = new Error('API bulunamadı!');
  error.status = 404;
  next(error);
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Sunucu ${PORT} portunda çalışıyor.`);
});

process.on('SIGINT', async () => {
  logger.info('Sunucu kapatılıyor...');
  try {
    await mongoose.connection.close(); 
    server.close(() => {
      logger.info('Sunucu başarıyla kapatıldı.');
      process.exit(0);
    });
  } catch (err) {
    logger.error(`Kapatma sırasında hata: ${err.message}`);
    process.exit(1);
  }
});

process.on('unhandledRejection', (err) => {
  logger.error(`[UNHANDLED REJECTION] - ${err.message}`, { stack: err.stack });
  process.exit(1);
});
