const mongoose = require('mongoose');
const User = require('./user');

// Define the BannerData schema (base for both Event and Trip)
const bannerDataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  datatype: { type: String, enum: ["Event", "Trip"], required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  user: { type: String, required: true } 
}, { _id: false });

// Define the Event schema, extending BannerData
const eventSchema = new mongoose.Schema({
  ...bannerDataSchema.obj, // Spread the properties from bannerDataSchema
  trip: { type: String, required: true },
  day: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  cost: {
    currency: { type: String },
    amount: { type: Number }
  },
  items: [String],
  remarks: String,
  additional_information: String
});

// Define the Trip schema, extending BannerData
const tripSchema = new mongoose.Schema({
  ...bannerDataSchema.obj, // Spread the properties from bannerDataSchema
  trip: { type: String, required: true },
  days: { type: Map, of: [eventSchema], default: {} }
});

const Trip = mongoose.model('Trip', tripSchema);
const Event = mongoose.model('Event', eventSchema);

module.exports = { Trip, Event, tripSchema };