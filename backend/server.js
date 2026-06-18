const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const destinationRoutes = require('./routes/destinations');
const packageRoutes = require('./routes/packages');
const bookingRoutes = require('./routes/bookings');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');
const User = require('./models/user');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wanderindia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@wanderindia.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Default admin created: admin@wanderindia.com / admin123');
    } else {
      console.log('Admin user exists:', adminExists.email);
    }
  } catch (error) {
    console.error('Failed to bootstrap admin user:', error.message);
  }
}).catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));