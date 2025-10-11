const Journey = require('../models/journey.model');
const ApiError = require('../utils/apiError');
const NotificationHelper = require('../utils/notificationHelper');

class JourneyController {
  // Get all journeys
  async getAllJourneys(req, res, next) {
    try {
      const journeys = await Journey.findAll();
      res.json(journeys);
    } catch (error) {
      next(error);
    }
  }

  // Get journey by ID
  async getJourneyById(req, res, next) {
    try {
      const journey = await Journey.findById(req.params.id);
      if (!journey) {
        throw new ApiError(404, 'Journey not found');
      }
      res.json(journey);
    } catch (error) {
      next(error);
    }
  }

  // Create journey info only (without photos)
  async createJourneyInfo(req, res, next) {
    try {
      const { year, title, description, location, latitude, longitude, destination_type, existingPhotos, photosToDelete } = req.body;
      
      // Validate required fields
      if (!year || !title || !description) {
        throw new ApiError(400, 'Year, title, and description are required');
      }

      // Validate year format
      const yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum.toString().length !== 4) {
        throw new ApiError(400, 'Year must be a valid 4-digit number');
      }

      const journeyData = {
        year: yearNum,
        title: title.trim(),
        description: description.trim(),
        location: location ? location.trim() : null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        destination_type: destination_type ? destination_type.trim() : null
      };

      // Check if journey for this year already exists
      const existingJourney = await Journey.findByYear(yearNum);
      let journeyId;

      if (existingJourney) {
        // Update existing journey
        journeyId = existingJourney.id;
        await Journey.update(journeyId, journeyData);
        
        // Delete photos if specified
        if (photosToDelete && Array.isArray(photosToDelete) && photosToDelete.length > 0) {
          console.log('Deleting photos with IDs:', photosToDelete);
          for (const photoId of photosToDelete) {
            try {
              await Journey.deletePhoto(photoId);
            } catch (err) {
              console.error(`Error deleting photo ${photoId}:`, err);
              // Continue with other photos even if one fails
            }
          }
        }
        
        // Update captions for existing photos if provided
        if (existingPhotos && Array.isArray(existingPhotos)) {
          await Promise.all(existingPhotos.map(photo => 
            Journey.updatePhotoCaption(photo.src, photo.caption)
          ));
        }
      } else {
        // Create new journey
        journeyId = await Journey.create(journeyData, []);
        
        // Send notification to all users for NEW journey
        NotificationHelper.notifyNewJourney(
          journeyId, 
          title.trim(), 
          req.user?.username || 'Admin'
        ).catch(err => console.error('Failed to send notification:', err));
      }

      // Return the journey with its ID
      const journey = await Journey.findById(journeyId);
      res.status(201).json(journey);
    } catch (error) {
      next(error);
    }
  }

  // Add a single photo to a journey
  async addJourneyPhoto(req, res, next) {
    try {
      const { journeyId, year, caption } = req.body;
      
      if (!journeyId) {
        throw new ApiError(400, 'Journey ID is required');
      }
      
      if (!req.file) {
        throw new ApiError(400, 'No photo provided');
      }
      
      // Get the journey to make sure it exists
      const journey = await Journey.findById(journeyId);
      if (!journey) {
        throw new ApiError(404, 'Journey not found');
      }
      
      // Add the photo to the journey
      const yearNum = parseInt(year || journey.year);
      const photoData = {
        file: req.file,
        caption: caption || '',
        year: yearNum
      };
      
      const photoId = await Journey.addPhoto(journeyId, photoData);
      
      res.status(201).json({
        success: true,
        message: 'Photo added successfully',
        photoId,
        photoUrl: `/images/journey/${yearNum}/${req.file.filename}`
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new journey
  async createJourney(req, res, next) {
    try {
      const { year, title, description } = req.body;
      
      // Validate required fields
      if (!year || !title || !description) {
        throw new ApiError(400, 'Year, title, and description are required');
      }

      // Validate year format
      const yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum.toString().length !== 4) {
        throw new ApiError(400, 'Year must be a valid 4-digit number');
      }

      const journeyData = {
        year: yearNum,
        title: title.trim(),
        description: description.trim(),
        captions: req.body.captions
      };

      const journeyId = await Journey.create(journeyData, req.files);
      const newJourney = await Journey.findById(journeyId);
      
      // Send notification to all users
      NotificationHelper.notifyNewJourney(
        journeyId, 
        title.trim(), 
        'Admin'
      ).catch(err => console.error('Failed to send notification:', err));
      
      res.status(201).json(newJourney);
    } catch (error) {
      next(error);
    }
  }

  // Update journey
  async updateJourney(req, res, next) {
    try {
      console.log('📝 UPDATE REQUEST BODY:', req.body);
      const { year, title, description, location, latitude, longitude, destination_type } = req.body;
      
      // Validate required fields if they are provided
      if (year || title || description) {
        if (year && (isNaN(parseInt(year)) || year.toString().length !== 4)) {
          throw new ApiError(400, 'Year must be a valid 4-digit number');
        }
      }

      const journeyData = {
        existingPhotos: req.body.existingPhotos,
        newCaptions: req.body.newCaptions
      };

      // Only add fields that are provided (not undefined/null/empty)
      if (year) journeyData.year = parseInt(year);
      if (title) journeyData.title = title.trim();
      if (description) journeyData.description = description.trim();
      
      // For location fields, only update if they have actual values (not empty string)
      if (location !== undefined && location !== null && location.trim() !== '') {
        journeyData.location = location.trim();
      }
      if (latitude !== undefined && latitude !== null && latitude !== '') {
        journeyData.latitude = parseFloat(latitude);
      }
      if (longitude !== undefined && longitude !== null && longitude !== '') {
        journeyData.longitude = parseFloat(longitude);
      }
      if (destination_type !== undefined && destination_type !== null && destination_type.trim() !== '') {
        journeyData.destination_type = destination_type.trim();
      }

      console.log('📦 JOURNEY DATA TO UPDATE:', journeyData);

      const updated = await Journey.update(req.params.id, journeyData, req.files);
      if (!updated) {
        throw new ApiError(404, 'Journey not found');
      }
      const updatedJourney = await Journey.findById(req.params.id);
      res.json(updatedJourney);
    } catch (error) {
      next(error);
    }
  }

  // Delete journey
  async deleteJourney(req, res, next) {
    try {
      const deleted = await Journey.delete(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Journey not found');
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting journey:', error);
      next(error);
    }
  }

  // Delete journey photo
  async deleteJourneyPhoto(req, res, next) {
    try {
      const { photoId } = req.params;
      
      if (!photoId) {
        throw new ApiError(400, 'Photo ID is required');
      }
      
      // Delete the photo
      const deleted = await Journey.deletePhoto(photoId);
      
      if (!deleted) {
        throw new ApiError(404, 'Photo not found or could not be deleted');
      }
      
      res.json({
        success: true,
        message: 'Photo deleted successfully',
        photoId
      });
    } catch (error) {
      console.error('Error deleting journey photo:', error);
      next(error);
    }
  }

  // Get journeys for map (with coordinates)
  async getJourneysForMap(req, res, next) {
    try {
      const journeys = await Journey.findAllWithCoordinates();
      res.json(journeys);
    } catch (error) {
      next(error);
    }
  }

  // Get map statistics
  async getMapStatistics(req, res, next) {
    try {
      const stats = await Journey.getMapStatistics();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JourneyController();
