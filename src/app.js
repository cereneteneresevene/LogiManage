require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const routeRoutes = require('./routes/routeRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch(err => {
  console.error('MongoDB bağlantı hatası:', err);
});

app.get('/', (req, res) => {
  res.send('Merhaba, API çalışıyor!');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', routeRoutes);
app.use('/api', deliveryRoutes);

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
