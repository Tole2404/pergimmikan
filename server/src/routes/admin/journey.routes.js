const express = require('express');
const router = express.Router();
const journeyController = require('../../controllers/journey.controller');
const auth = require('../../middleware/auth');
const journeyUpload = require('../../config/journeyUpload');
const Journey = require('../../models/journey.model');

// Get journey by year
router.get('/year/:year', auth, async (req, res) => {
  try {
    console.log('Fetching journey for year:', req.params.year);
    const journey = await Journey.findByYear(parseInt(req.params.year));
    console.log('Found journey:', journey);
    
    if (!journey) {
      return res.json(null);
    }
    res.json(journey);
  } catch (error) {
    console.error('Error fetching journey by year:', error);
    res.status(500).json({ message: 'Failed to fetch journey: ' + error.message });
  }
});

// Get all journeys
router.get('/', auth, async (req, res) => {
  try {
    const journeys = await Journey.findAll();
    res.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({ message: 'Failed to fetch journeys' });
  }
});

// Get journey by ID
router.get('/:id', auth, journeyController.getJourneyById);

// Create journey info only (without photos) - NEW ENDPOINT
router.post('/info', auth, journeyController.createJourneyInfo);

// Add a single photo to a journey - NEW ENDPOINT
router.post('/photo', auth, journeyUpload.single('photo'), journeyController.addJourneyPhoto);

// Delete a journey photo - NEW ENDPOINT
router.delete('/photos/:photoId', auth, journeyController.deleteJourneyPhoto);

// Create new journey (original endpoint - still supported)
router.post('/', auth, journeyUpload.array('photos'), journeyController.createJourney);

// Update journey
router.put('/:id', auth, journeyUpload.array('newPhotos'), journeyController.updateJourney);

// Delete journey
router.delete('/:id', auth, journeyController.deleteJourney);

module.exports = router;
