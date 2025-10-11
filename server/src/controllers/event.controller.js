const Event = require('../models/event.model');
const ApiError = require('../utils/apiError');
const NotificationHelper = require('../utils/notificationHelper');

class EventController {
  // Get all events with optional search and filter
  async getAllEvents(req, res, next) {
    try {
      // Force update event statuses first
      const updatedCount = await Event.forceUpdateEventStatuses();
      console.log(`Controller: Updated ${updatedCount} events to completed status`);
      
      let events;
      if (req.query.search) {
        events = await Event.search(req.query.search);
      } else if (req.query.status && req.query.status !== 'all') {
        events = await Event.filterByStatus(req.query.status);
      } else {
        events = await Event.getAll();
      }
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  // Get event by ID
  async getEventById(req, res, next) {
    try {
      // Update statuses before getting the specific event
      await Event.forceUpdateEventStatuses();
      
      const event = await Event.getById(req.params.id);
      if (!event) {
        throw new ApiError(404, 'Event not found');
      }
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  // Create new event
  async createEvent(req, res, next) {
    try {
      const { 
        title, 
        description, 
        event_date, 
        event_time, 
        location, 
        max_participants, 
        registration_deadline,
        status 
      } = req.body;

      const eventId = await Event.create({
        title,
        description,
        event_date,
        event_time,
        location,
        max_participants,
        registration_deadline,
        status
      });

      const newEvent = await Event.getById(eventId);
      
      // Send notification to all users
      const eventDateFormatted = new Date(event_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      NotificationHelper.notifyNewEvent(title, eventDateFormatted)
        .catch(err => console.error('Failed to send notification:', err));
      
      res.status(201).json(newEvent);
    } catch (error) {
      next(error);
    }
  }

  // Update event
  async updateEvent(req, res, next) {
    try {
      const { 
        title, 
        description, 
        event_date, 
        event_time, 
        location, 
        max_participants, 
        registration_deadline,
        status 
      } = req.body;

      const updates = {
        title,
        description,
        event_date,
        event_time,
        location,
        max_participants,
        registration_deadline,
        status
      };

      const success = await Event.update(req.params.id, updates);
      if (!success) {
        throw new ApiError(404, 'Event not found');
      }

      const updatedEvent = await Event.getById(req.params.id);
      res.json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }

  // Delete event
  async deleteEvent(req, res, next) {
    try {
      const deleted = await Event.delete(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Event not found');
      }
      res.status(200).json({
        success: true,
        message: 'Event successfully deleted'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get event participants
  async getEventParticipants(req, res, next) {
    try {
      const participants = await Event.getParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      next(error);
    }
  }

  // Register for event
  async registerForEvent(req, res, next) {
    try {
      const { userId } = req.body;
      if (!userId) {
        throw new ApiError(400, 'User ID is required');
      }

      await Event.registerParticipant(req.params.id, userId);
      res.status(201).json({ message: 'Successfully registered for event' });
    } catch (error) {
      if (error.message === 'Event is already full' || 
          error.message === 'User is already registered for this event' ||
          error.message === 'Registration deadline has passed' ||
          error.message.includes('Cannot register for')) {
        throw new ApiError(400, error.message);
      }
      next(error);
    }
  }

  // Force update event statuses (admin only endpoint)
  async forceUpdateEventStatuses(req, res, next) {
    try {
      const updatedCount = await Event.forceUpdateEventStatuses();
      res.json({ 
        success: true, 
        message: `Successfully updated ${updatedCount} events to completed status` 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();
