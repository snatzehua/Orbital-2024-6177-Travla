const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]
});

module.exports = mongoose.model('User', userSchema);