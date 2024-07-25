const express = require('express');
const { createTrip, getTrips, fetchTripById, deleteTripById, updateTripById } = require('../controllers/tripController');
const router = express.Router();

//CREATE trip for that user
router.post('/trips', createTrip);

//GET a specific trip by id
router.get('/trips/:tripId', fetchTripById);

//UPDATE a specific trip with new data
router.put('/trips/:tripId', updateTripById);

//DELETE a specific trip by id
router.delete('/trips/:tripId', deleteTripById);

module.exports = router;