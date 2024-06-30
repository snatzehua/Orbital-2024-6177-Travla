const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  title: { type: String, required: true },
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = mongoose.model('Trip', tripSchema);