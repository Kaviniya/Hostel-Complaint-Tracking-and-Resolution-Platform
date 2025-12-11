const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const createWarden = async () => {
  const hashedPassword = await bcrypt.hash('warden@123', 10);

  const warden = new User({
    name: 'Hostel Warden',
    email: 'warden@srishakthi.ac.in',
    password: hashedPassword,
    role: 'warden'
  });

  await warden.save();
  console.log('Warden created!');
  mongoose.disconnect();
};

createWarden();
