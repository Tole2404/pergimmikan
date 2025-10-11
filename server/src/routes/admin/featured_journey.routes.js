const express = require('express');
const router = express.Router();
const featuredJourneyController = require('../../controllers/featured_journey.controller');
const auth = require('../../middleware/auth');
const upload = require('../../config/upload');

// Get all featured journeys (admin)
router.get('/', auth, featuredJourneyController.getAllFeaturedJourneys);

// Get featured journey by ID
router.get('/:id', auth, featuredJourneyController.getFeaturedJourneyById);

// Create new featured journey
router.post('/', auth, featuredJourneyController.createFeaturedJourney);

// Update featured journey
router.put('/:id', auth, featuredJourneyController.updateFeaturedJourney);

// Delete featured journey
router.delete('/:id', auth, featuredJourneyController.deleteFeaturedJourney);

// Toggle featured status
router.patch('/:id/toggle-featured', auth, featuredJourneyController.toggleFeatured);

module.exports = router;
