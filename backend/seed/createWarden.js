const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');
const connectDB = require('../config/db');

const createWarden = async () => {
  try {
    await connectDB();
    const email = "warden@hostel.com";
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Warden already exists");
      process.exit(0);
    }
    const hashedPassword = await bcrypt.hash("warden123", 10);
    const warden = new User({ name: "Warden", email, password: hashedPassword, role: "warden" });
    await warden.save();
    console.log("Warden created: warden@hostel.com / warden123");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createWarden();
