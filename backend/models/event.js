const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  location: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  title: { type: String, required: true }
});

module.exports = mongoose.model('Event', eventSchema);