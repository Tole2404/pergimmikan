const express = require('express');
const router = express.Router();
const tripCalculatorController = require('../controllers/tripCalculator.controller');

// Master Data
// Mountains
router.get('/mountains', tripCalculatorController.getMountains);
router.get('/mountains/:id', tripCalculatorController.getMountainDetail);

// Tracks
router.get('/tracks', tripCalculatorController.getAllTracks);
router.get('/tracks/:mountainId', tripCalculatorController.getMountainTracks);
router.get('/cities', tripCalculatorController.getCities);
router.get('/provinces', tripCalculatorController.getProvinces);

// Trip Planning Data
router.get('/transportation', tripCalculatorController.getAllTransportation);
router.get('/transportation/:mountainId', tripCalculatorController.getTransportation);
router.get('/local-transport/:mountainId', tripCalculatorController.getLocalTransportation);
router.get('/operators/:routeId', tripCalculatorController.getTransportOperators);
router.get('/equipment', tripCalculatorController.getAllEquipment);
router.get('/equipment/:mountainId', tripCalculatorController.getEquipmentRental);
router.get('/food/:mountainId/:days', tripCalculatorController.getFoodEstimates);
router.get('/accommodations/:mountainId', tripCalculatorController.getAccommodations);
router.get('/checklist', tripCalculatorController.getEquipmentChecklist);

// Calculate
router.post('/calculate', tripCalculatorController.calculateTrip);

module.exports = router;
