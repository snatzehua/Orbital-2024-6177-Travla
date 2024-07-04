const express = require('express');
const { createTrip, getTrips, getTripById, deleteTripById } = require('../controllers/tripController');
const router = express.Router();

//CREATE trip for that user
router.post('/trips', createTrip);

//GET all trips tied to user
router.get('/trips', getTrips);

//GET a specific trip by id
router.get('/trips/:id', getTripById);

//DELETE a specific trip by id
router.delete('/trips/:id', deleteTripById);

module.exports = router;