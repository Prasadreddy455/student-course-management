require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log('Usage: node resetPassword.js <email> <newPassword>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.log('No user found with that email');
  } else {
    user.password = newPassword; // will be hashed automatically by the pre-save hook
    await user.save();
    console.log('Password reset for:', user.email);
  }
  mongoose.disconnect();
});