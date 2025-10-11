const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/event.controller');
const auth = require('../../middleware/auth');

// Event CRUD routes
router.get('/', auth, eventController.getAllEvents);
router.get('/:id', auth, eventController.getEventById);
router.post('/', auth, eventController.createEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

// Event participant routes
router.get('/:id/participants', auth, eventController.getEventParticipants);
router.post('/:id/register', auth, eventController.registerForEvent);

// Admin special operations
router.post('/update-statuses', auth, eventController.forceUpdateEventStatuses);

module.exports = router;
