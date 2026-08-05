require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: 'admin' },
    { new: true }
  );
  if (!user) {
    console.log('No user found with that email');
  } else {
    console.log('Updated user:', user.email, '-> role:', user.role);
  }
  mongoose.disconnect();
});