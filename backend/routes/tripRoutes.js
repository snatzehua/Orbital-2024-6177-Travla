const express = require('express');
const { createTrip, getTrips, fetchTripById, deleteTripById } = require('../controllers/tripController');
const router = express.Router();

//CREATE trip for that user
router.post('/trips', createTrip);

//GET all trips tied to user
router.get('/trips', getTrips);

//GET a specific trip by id
router.get('/trips/:tripId', fetchTripById);

//DELETE a specific trip by id
router.delete('/trips/:tripId', deleteTripById);

module.exports = router;