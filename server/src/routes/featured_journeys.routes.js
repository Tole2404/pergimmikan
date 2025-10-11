const express = require('express');
const router = express.Router();
const featuredJourneyController = require('../controllers/featured_journey.controller');

// Public featured journey routes
router.get('/', featuredJourneyController.getFeaturedJourneys);
router.get('/:id', featuredJourneyController.getFeaturedJourneyById);

module.exports = router;
