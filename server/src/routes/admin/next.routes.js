const express = require('express');
const router = express.Router();
const nextController = require('../../controllers/next.controller');
const auth = require('../../middleware/auth');
const upload = require('../../config/multer');

// Destinations
router.get('/destinations', auth, nextController.getAllDestinations);
router.get('/destinations/:id', auth, nextController.getDestinationById);
router.post('/destinations', auth, upload.single('image'), nextController.createDestination);
router.put('/destinations/:id', auth, upload.single('image'), nextController.updateDestination);
router.delete('/destinations/:id', auth, nextController.deleteDestination);

// Transport
router.get('/transport', auth, nextController.getAllTransport);
router.get('/transport/:id', auth, nextController.getTransportById);
router.post('/transport', auth, nextController.createTransport);
router.put('/transport/:id', auth, nextController.updateTransport);
router.delete('/transport/:id', auth, nextController.deleteTransport);

// Activities
router.get('/activities', auth, nextController.getAllActivities);
router.get('/activities/destination/:destinationId', auth, nextController.getActivitiesByDestination);
router.get('/activities/:id', auth, nextController.getActivityById);
router.post('/activities', auth, nextController.createActivity);
router.put('/activities/:id', auth, nextController.updateActivity);
router.delete('/activities/:id', auth, nextController.deleteActivity);

// Seasons
router.get('/seasons', auth, nextController.getAllSeasons);
router.get('/seasons/destination/:destinationId', auth, nextController.getSeasonsByDestination);
router.get('/seasons/:id', auth, nextController.getSeasonById);
router.post('/seasons', auth, nextController.createSeason);
router.put('/seasons/:id', auth, nextController.updateSeason);
router.delete('/seasons/:id', auth, nextController.deleteSeason);

module.exports = router;
