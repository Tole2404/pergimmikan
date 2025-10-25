const express = require('express');
const router = express.Router();
const tracksAdminController = require('../controllers/tracksAdmin.controller');
const auth = require('../middleware/auth');

// All routes require admin authentication
router.use(auth);

// Tracks CRUD
router.get('/tracks', tracksAdminController.getAllTracks);
router.post('/tracks', tracksAdminController.createTrack);
router.put('/tracks/:id', tracksAdminController.updateTrack);
router.delete('/tracks/:id', tracksAdminController.deleteTrack);

module.exports = router;
