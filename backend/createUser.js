const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User'); // make sure this path is correct

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const createUser = async () => {
  const hashedPassword = await bcrypt.hash('kavi@123', 10);

  const user = new User({
    name: 'Test Student',
    email: 'kavi123@srishakthi.ac.in',
    password: hashedPassword
  });

  await user.save();
  console.log('Test user created!');
  mongoose.disconnect();
};

createUser();
