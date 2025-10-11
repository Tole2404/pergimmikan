const FeaturedJourney = require('../models/featured_journey.model');
const ApiError = require('../utils/apiError');

class FeaturedJourneyController {
  // Get all featured journeys (admin)
  async getAllFeaturedJourneys(req, res, next) {
    try {
      const journeys = await FeaturedJourney.findAll();
      res.json(journeys);
    } catch (error) {
      next(error);
    }
  }

  // Get featured journeys for homepage (public)
  async getFeaturedJourneys(req, res, next) {
    try {
      const journeys = await FeaturedJourney.findFeatured();
      res.json(journeys);
    } catch (error) {
      next(error);
    }
  }

  // Get featured journey by ID
  async getFeaturedJourneyById(req, res, next) {
    try {
      const journey = await FeaturedJourney.findById(req.params.id);
      if (!journey) {
        throw new ApiError(404, 'Featured journey not found');
      }
      res.json(journey);
    } catch (error) {
      next(error);
    }
  }

  // Create new featured journey
  async createFeaturedJourney(req, res, next) {
    try {
      const { 
        title, description, image_path, link, year, month, 
        location, latitude, longitude, duration, difficulty, 
        category, featured 
      } = req.body;
      
      // Validate required fields
      if (!title || !description || !image_path || !link) {
        throw new ApiError(400, 'Title, description, image path, and link are required');
      }

      // Validate year and month format
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      if (isNaN(yearNum) || yearNum <= 0) {
        throw new ApiError(400, 'Year must be a valid number');
      }
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        throw new ApiError(400, 'Month must be a valid number between 1 and 12');
      }

      const journeyData = {
        title: title.trim(),
        description: description.trim(),
        image_path: image_path.trim(),
        link: link.trim(),
        year: yearNum,
        month: monthNum,
        location: location ? location.trim() : '',
        latitude: latitude || null,
        longitude: longitude || null,
        duration: parseInt(duration) || 1,
        difficulty: difficulty || 'Moderate',
        category: category || 'Mountain',
        featured: featured !== undefined ? featured : true
      };

      const journeyId = await FeaturedJourney.create(journeyData);
      const newJourney = await FeaturedJourney.findById(journeyId);
      res.status(201).json(newJourney);
    } catch (error) {
      next(error);
    }
  }

  // Update featured journey
  async updateFeaturedJourney(req, res, next) {
    try {
      const { 
        title, description, image_path, link, year, month, 
        location, latitude, longitude, duration, difficulty, 
        category, featured 
      } = req.body;
      
      // Validate required fields if they are provided
      if (!title || !description || !image_path || !link) {
        throw new ApiError(400, 'Title, description, image path, and link are required');
      }

      // Validate year and month format if provided
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      if (year && (isNaN(yearNum) || yearNum <= 0)) {
        throw new ApiError(400, 'Year must be a valid number');
      }
      if (month && (isNaN(monthNum) || monthNum < 1 || monthNum > 12)) {
        throw new ApiError(400, 'Month must be a valid number between 1 and 12');
      }

      const journeyData = {
        title: title.trim(),
        description: description.trim(),
        image_path: image_path.trim(),
        link: link.trim(),
        year: yearNum,
        month: monthNum,
        location: location ? location.trim() : '',
        latitude: latitude || null,
        longitude: longitude || null,
        duration: parseInt(duration) || 1,
        difficulty: difficulty || 'Moderate',
        category: category || 'Mountain',
        featured: featured !== undefined ? featured : true
      };

      const updated = await FeaturedJourney.update(req.params.id, journeyData);
      if (!updated) {
        throw new ApiError(404, 'Featured journey not found');
      }
      const updatedJourney = await FeaturedJourney.findById(req.params.id);
      res.json(updatedJourney);
    } catch (error) {
      next(error);
    }
  }

  // Delete featured journey
  async deleteFeaturedJourney(req, res, next) {
    try {
      const deleted = await FeaturedJourney.delete(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Featured journey not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Toggle featured status
  async toggleFeatured(req, res, next) {
    try {
      const updated = await FeaturedJourney.toggleFeatured(req.params.id);
      if (!updated) {
        throw new ApiError(404, 'Featured journey not found');
      }
      const updatedJourney = await FeaturedJourney.findById(req.params.id);
      res.json(updatedJourney);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FeaturedJourneyController();
