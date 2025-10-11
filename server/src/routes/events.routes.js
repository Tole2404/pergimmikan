const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// Public routes
router.get('/', eventController.getAllEvents);
router.post('/:id/register', eventController.registerForEvent);

module.exports = router;
