const express = require('express');
const router = express.Router();
const nextController = require('../controllers/next.controller');

// Public routes
router.get('/destinations', nextController.getPublicDestinations);
router.get('/destinations/:id', nextController.getPublicDestinationById);

module.exports = router;
