const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function createAdmin() {
  console.log('Starting admin creation...');
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wanderindia');
    console.log('Connected to MongoDB successfully');

    console.log('Checking for existing admin...');
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Password: admin123 (change this after first login)');
      return;
    }

    console.log('Creating new admin user...');
    const admin = new User({
      name: 'Admin User',
      email: 'admin@wanderindia.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@wanderindia.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

  } catch (error) {
    console.error('Error creating admin:', error.message);
    console.error('Full error:', error);
  } finally {
    console.log('Closing database connection...');
    mongoose.connection.close();
  }
}

createAdmin();