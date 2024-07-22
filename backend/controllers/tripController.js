const  { Trip } = require('../models/trip'); 
const  User  = require('../models/user');

// Create a new trip
const createTrip = async (req, res) => {
  const { user, title, start, end, trip, days } = req.body;

  try {
    const userDoc = await User.findById(user);
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }
    const tripData = new Trip({
      title,
      datatype: 'Trip',
      start,
      end,
      user, // Link the trip to the MongoDB user ID
      trip, 
      days
    });
    const savedTrip = await tripData.save(); // Save the trip first

    // Link the trip to the user in the users collection
    const UpdatedUser = await User.findByIdAndUpdate(
      user,
      { $push: { trips: savedTrip._id } },
      { new: true }
    );
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error("error creating trip: ", error);
    res.status(400).json({ message: error.message });
  }
};

const fetchTripById = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    console.log("tripId: ", tripId);
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTripById = async (req, res) => {
  const { tripId } = req.params;
  const newTripData = req.body;
  console.log("tripId: ", tripId);
  console.log("updated trip data: ", newTripData);
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(tripId, newTripData, { new: true });
    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTripById = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findById(tripId);
    console.log("trip being deleted: ", trip);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    await Trip.findByIdAndDelete(tripId);
    await User.findByIdAndUpdate(trip.user, { $pull: { trips: tripId } });

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTrip, fetchTripById, updateTripById, deleteTripById };
