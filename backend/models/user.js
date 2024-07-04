const mongoose = require('mongoose');
const { tripSchema } = require('./trip'); 

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  trips: { type: Map, of: tripSchema, default: {} },
  settings: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} }
});

const User = mongoose.model('User', userSchema);

module.exports = User;