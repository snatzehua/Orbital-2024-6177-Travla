const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Ensure password is either removed or not required
  // password: { type: String }
});

const User = mongoose.model('User', userSchema);

module.exports = User;