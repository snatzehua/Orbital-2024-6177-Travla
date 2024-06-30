const express = require('express');
const { createTrip, getTripsByUser } = require('../controllers/tripController');
const router = express.Router();

// POST create a new trip for a specific user
router.post('/users/:userId/trips', createTrip);

// GET all trips for a specific user
router.get('/users/:userId/trips', getTripsByUser);

module.exports = router;