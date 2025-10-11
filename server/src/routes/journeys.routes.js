const express = require('express');
const router = express.Router();
const journeyController = require('../controllers/journey.controller');

// Map routes (MUST be before /:id to avoid conflict)
router.get('/map/data', journeyController.getJourneysForMap.bind(journeyController));
router.get('/map/statistics', journeyController.getMapStatistics.bind(journeyController));

// Public journey routes
router.get('/', journeyController.getAllJourneys.bind(journeyController));
router.get('/:id', journeyController.getJourneyById.bind(journeyController));

module.exports = router;
