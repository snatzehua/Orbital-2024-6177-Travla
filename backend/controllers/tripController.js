const { Trip } = require('../models/trip'); 
const { User } = require('../models/user'); 

// Create a new trip
const createTrip = async (req, res) => {
  const { user, title, start, end, trip, days } = req.body; // Destructure days if it's part of the request
  console.log('Request body:', req.body);

  try {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tripData = new Trip({
      title,
      datatype: 'Trip',
      start,
      end,
      user,
      trip, 
      days 
    });

    const newTrip = await tripData.save();
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTrips = async (req, res) => {
  const uid = req.user.uid; // Assuming the user is authenticated and uid is available in req.user

  try {
    const user = await User.findOne({ uid }); //getting user from firebase uid
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const trips = await Trip.find({ user: user._id }); //getting all trips that have the objectId of the user
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTripById = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTrip, getTrips, getTripById, deleteTripById };
