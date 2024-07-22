const express = require('express');
const { createEvent } = require('../controllers/eventController');
const router = express.Router();

// POST create a new event
router.post('/events', createEvent);

module.exports = router;