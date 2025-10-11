const db = require('../config/database');

class Event {
  static async getAll() {
    // Update status of events before fetching - made more robust
    const updated = await this.updateEventStatuses();
    console.log(`Updated ${updated} events to completed status`);
    
    const query = `
      SELECT * FROM events 
      ORDER BY event_date DESC, event_time DESC
    `;
    const [events] = await db.query(query);
    return events;
  }

  static async search(searchTerm) {
    // Update status of events before searching
    await this.updateEventStatuses();
    
    const query = `
      SELECT * FROM events 
      WHERE 
        title LIKE ? OR 
        description LIKE ? OR
        location LIKE ?
      ORDER BY event_date DESC, event_time DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    const [events] = await db.query(query, [searchPattern, searchPattern, searchPattern]);
    return events;
  }

  static async filterByStatus(status) {
    // Update status of events before filtering
    await this.updateEventStatuses();
    
    const query = `
      SELECT * FROM events 
      WHERE status = ?
      ORDER BY event_date DESC, event_time DESC
    `;
    const [events] = await db.query(query, [status]);
    return events;
  }

  static async getById(id) {
    // Update status of events before fetching
    await this.updateEventStatuses();
    
    const query = `
      SELECT * FROM events 
      WHERE id = ?
    `;
    const [event] = await db.query(query, [id]);
    return event[0];
  }

  static async create(eventData) {
    const query = `
      INSERT INTO events (
        title, 
        description, 
        event_date, 
        event_time, 
        location, 
        max_participants, 
        registration_deadline,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Determine the initial status based on event date/time
    const status = this.calculateEventStatus(
      eventData.event_date, 
      eventData.event_time
    );
    
    console.log(`Creating event with calculated status: ${status}`);
    
    const [result] = await db.query(query, [
      eventData.title,
      eventData.description,
      eventData.event_date,
      eventData.event_time,
      eventData.location,
      eventData.max_participants,
      eventData.registration_deadline,
      status
    ]);

    return result.insertId;
  }

  static async update(id, eventData) {
    // Determine the status based on updated event date/time
    const status = this.calculateEventStatus(
      eventData.event_date, 
      eventData.event_time
    );
    
    console.log(`Updating event with calculated status: ${status}`);

    const query = `
      UPDATE events 
      SET 
        title = ?,
        description = ?,
        event_date = ?,
        event_time = ?,
        location = ?,
        max_participants = ?,
        registration_deadline = ?,
        status = ?
      WHERE id = ?
    `;

    const [result] = await db.query(query, [
      eventData.title,
      eventData.description,
      eventData.event_date,
      eventData.event_time,
      eventData.location,
      eventData.max_participants,
      eventData.registration_deadline,
      status,
      id
    ]);

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const query = `DELETE FROM events WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async getParticipants(eventId) {
    const query = `
      SELECT ep.*, u.name, u.email 
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.event_id = ?
      ORDER BY ep.registration_date DESC
    `;
    const [participants] = await db.query(query, [eventId]);
    return participants;
  }

  static async registerParticipant(eventId, userId) {
    // Update status before checking event
    await this.updateEventStatuses();
    
    // Check if event exists and is not full
    const event = await this.getById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if event is already completed or canceled
    if (event.status === 'completed' || event.status === 'canceled') {
      throw new Error(`Cannot register for ${event.status} event`);
    }

    const participants = await this.getParticipants(eventId);
    if (participants.length >= event.max_participants) {
      throw new Error('Event is already full');
    }

    // Check if user is already registered
    const [existing] = await db.query(
      'SELECT * FROM event_participants WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    );

    if (existing.length > 0) {
      throw new Error('User is already registered for this event');
    }

    // Check if registration deadline has passed
    const now = new Date();
    const deadline = new Date(event.registration_deadline);
    if (now > deadline) {
      throw new Error('Registration deadline has passed');
    }

    // Register user
    const query = `
      INSERT INTO event_participants (event_id, user_id, status)
      VALUES (?, ?, 'registered')
    `;
    const [result] = await db.query(query, [eventId, userId]);
    return result.insertId;
  }

  // New method to calculate event status based on date and time
  static calculateEventStatus(eventDate, eventTime) {
    const now = new Date();
    
    try {
      // Create a Date object combining the event date and time
      const eventDateStr = typeof eventDate === 'string' ? eventDate : eventDate.toISOString().split('T')[0];
      const eventDateTime = new Date(`${eventDateStr}T${eventTime}`);
      
      console.log(`Comparing dates - Now: ${now.toISOString()}, Event: ${eventDateTime.toISOString()}`);
      
      // Check if the date is valid
      if (isNaN(eventDateTime.getTime())) {
        console.error(`Invalid date/time: ${eventDateStr}T${eventTime}`);
        return 'upcoming'; // Default to upcoming if date is invalid
      }
      
      // Event has already passed
      if (eventDateTime < now) {
        console.log(`Event time has passed, setting status to completed`);
        return 'completed';
      }
      
      // Event is in the future
      console.log(`Event is in the future, setting status to upcoming`);
      return 'upcoming';
    } catch (error) {
      console.error('Error calculating event status:', error);
      return 'upcoming'; // Default to upcoming in case of error
    }
  }

  // New method to update all event statuses in the database - improved
  static async updateEventStatuses() {
    try {
      console.log('Running event status update check...');
      
      // First, fetch all events that need status updates (upcoming events only)
      const query = `
        SELECT id, event_date, event_time, status
        FROM events 
        WHERE status = 'upcoming'
      `;
      
      const [events] = await db.query(query);
      const now = new Date();
      console.log(`Found ${events.length} upcoming events to check`);
      
      // Check each event individually and update if needed
      let updatedCount = 0;
      
      for (const event of events) {
        try {
          // Format the date properly and create a combined date time
          const eventDate = new Date(event.event_date).toISOString().split('T')[0];
          const eventDateTime = new Date(`${eventDate}T${event.event_time}`);
          
          if (isNaN(eventDateTime.getTime())) {
            console.error(`Invalid event date/time for event ${event.id}: ${eventDate}T${event.event_time}`);
            continue;
          }
          
          console.log(`Event ${event.id}: Now=${now.toISOString()}, Event time=${eventDateTime.toISOString()}`);
          
          if (eventDateTime < now) {
            // Update this specific event
            const updateQuery = `
              UPDATE events 
              SET status = 'completed' 
              WHERE id = ?
            `;
            
            const [result] = await db.query(updateQuery, [event.id]);
            
            if (result.affectedRows > 0) {
              updatedCount++;
              console.log(`Updated event ${event.id} to completed status`);
            }
          }
        } catch (error) {
          console.error(`Error processing event ${event.id}:`, error);
        }
      }
      
      console.log(`Updated ${updatedCount} events to completed status`);
      return updatedCount;
    } catch (error) {
      console.error('Error updating event statuses:', error);
      return 0;
    }
  }
  
  // Force update all event statuses - can be called directly from controller
  static async forceUpdateEventStatuses() {
    return await this.updateEventStatuses();
  }
}

module.exports = Event;
