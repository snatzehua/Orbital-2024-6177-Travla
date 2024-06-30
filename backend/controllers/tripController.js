// backend/controllers/tripController.js
const Trip = require('../models/trip');
const User = require('../models/user');

// Create a new trip
const createTrip = async (req, res) => {
  const userId = req.params.userId;
  const { title, startDate, endDate } = req.body;

  try {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the trip and associate it with the user
    const trip = new Trip({
      userId,
      title,
      startDate,
      endDate
    });

    const savedTrip = await trip.save();

    // Add the trip to the user's list of trips
    user.trips.push(savedTrip._id);
    await user.save();

    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all trips for a specific user
const getTripsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find all trips associated with the userId
    const trips = await Trip.find({ userId });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTrip, getTripsByUser };