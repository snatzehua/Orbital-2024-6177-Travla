const mongoose = require('mongoose');
const { tripSchema } = require('./trip'); 
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  //trips: { type: Map, of: tripSchema, default: {} },
  trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
  settings: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} }
});

const User = mongoose.model('User', userSchema);

module.exports = User;