const Next = require('../models/next.model');
const ApiError = require('../utils/apiError');

class NextController {
  /**
   * DESTINATIONS
   */
  async getAllDestinations(req, res, next) {
    try {
      const destinations = await Next.findAllDestinations();
      res.json(destinations);
    } catch (error) {
      next(error);
    }
  }

  async getDestinationById(req, res, next) {
    try {
      const destination = await Next.findDestinationById(req.params.id);
      if (!destination) {
        throw new ApiError(404, 'Destination not found');
      }
      res.json(destination);
    } catch (error) {
      next(error);
    }
  }

  async createDestination(req, res, next) {
    try {
      const { 
        name, 
        description, 
        highlights,
        accommodation_budget,
        accommodation_standard,
        accommodation_luxury,
        transportation_public,
        transportation_private,
        transportation_luxury,
        food_budget,
        food_standard,
        food_luxury
      } = req.body;

      const image_url = req.file ? `/images/next/${req.file.filename}` : null;

      // Parse highlights if it's a string
      let parsedHighlights = highlights;
      if (typeof highlights === 'string') {
        try {
          parsedHighlights = JSON.parse(highlights);
        } catch (e) {
          parsedHighlights = highlights.split(',').map(h => h.trim());
        }
      }

      const destinationId = await Next.createDestination({
        name,
        image_url,
        description,
        highlights: parsedHighlights,
        accommodation_budget: parseFloat(accommodation_budget),
        accommodation_standard: parseFloat(accommodation_standard),
        accommodation_luxury: parseFloat(accommodation_luxury),
        transportation_public: parseFloat(transportation_public),
        transportation_private: parseFloat(transportation_private),
        transportation_luxury: parseFloat(transportation_luxury),
        food_budget: parseFloat(food_budget),
        food_standard: parseFloat(food_standard),
        food_luxury: parseFloat(food_luxury)
      });

      const newDestination = await Next.findDestinationById(destinationId);
      res.status(201).json(newDestination);
    } catch (error) {
      next(error);
    }
  }

  async updateDestination(req, res, next) {
    try {
      const { 
        name, 
        description, 
        highlights,
        accommodation_budget,
        accommodation_standard,
        accommodation_luxury,
        transportation_public,
        transportation_private,
        transportation_luxury,
        food_budget,
        food_standard,
        food_luxury
      } = req.body;

      // Parse highlights if it's a string
      let parsedHighlights = highlights;
      if (typeof highlights === 'string') {
        try {
          parsedHighlights = JSON.parse(highlights);
        } catch (e) {
          parsedHighlights = highlights.split(',').map(h => h.trim());
        }
      }

      const updates = {
        name,
        description,
        highlights: parsedHighlights,
        accommodation_budget: parseFloat(accommodation_budget),
        accommodation_standard: parseFloat(accommodation_standard),
        accommodation_luxury: parseFloat(accommodation_luxury),
        transportation_public: parseFloat(transportation_public),
        transportation_private: parseFloat(transportation_private),
        transportation_luxury: parseFloat(transportation_luxury),
        food_budget: parseFloat(food_budget),
        food_standard: parseFloat(food_standard),
        food_luxury: parseFloat(food_luxury)
      };

      if (req.file) {
        updates.image_url = `/images/next/${req.file.filename}`;
      }

      await Next.updateDestination(req.params.id, updates);
      const updatedDestination = await Next.findDestinationById(req.params.id);
      res.json(updatedDestination);
    } catch (error) {
      next(error);
    }
  }

  async deleteDestination(req, res, next) {
    try {
      const deleted = await Next.deleteDestination(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Destination not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * TRANSPORT RATES
   */
  async getAllTransport(req, res, next) {
    try {
      const transport = await Next.findAllTransport();
      res.json(transport);
    } catch (error) {
      next(error);
    }
  }

  async getTransportById(req, res, next) {
    try {
      const transport = await Next.findTransportById(req.params.id);
      if (!transport) {
        throw new ApiError(404, 'Transport rate not found');
      }
      res.json(transport);
    } catch (error) {
      next(error);
    }
  }

  async createTransport(req, res, next) {
    try {
      const { destination_name, flight_economy, flight_business, flight_first } = req.body;
      
      const transportId = await Next.createTransport({
        destination_name,
        flight_economy: parseFloat(flight_economy),
        flight_business: parseFloat(flight_business),
        flight_first: parseFloat(flight_first)
      });

      const newTransport = await Next.findTransportById(transportId);
      res.status(201).json(newTransport);
    } catch (error) {
      next(error);
    }
  }

  async updateTransport(req, res, next) {
    try {
      const { destination_name, flight_economy, flight_business, flight_first } = req.body;
      
      await Next.updateTransport(req.params.id, {
        destination_name,
        flight_economy: parseFloat(flight_economy),
        flight_business: parseFloat(flight_business),
        flight_first: parseFloat(flight_first)
      });

      const updatedTransport = await Next.findTransportById(req.params.id);
      res.json(updatedTransport);
    } catch (error) {
      next(error);
    }
  }

  async deleteTransport(req, res, next) {
    try {
      const deleted = await Next.deleteTransport(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Transport rate not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * ACTIVITIES
   */
  async getAllActivities(req, res, next) {
    try {
      const activities = await Next.findAllActivities();
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  async getActivitiesByDestination(req, res, next) {
    try {
      const activities = await Next.findActivitiesByDestination(req.params.destinationId);
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  async getActivityById(req, res, next) {
    try {
      const activity = await Next.findActivityById(req.params.id);
      if (!activity) {
        throw new ApiError(404, 'Activity not found');
      }
      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  async createActivity(req, res, next) {
    try {
      const { destination_id, name, cost, type } = req.body;
      
      const activityId = await Next.createActivity({
        destination_id,
        name,
        cost: parseFloat(cost),
        type: type || 'basic'
      });

      const newActivity = await Next.findActivityById(activityId);
      res.status(201).json(newActivity);
    } catch (error) {
      next(error);
    }
  }

  async updateActivity(req, res, next) {
    try {
      const { name, cost, type } = req.body;
      
      await Next.updateActivity(req.params.id, {
        name,
        cost: parseFloat(cost),
        type: type || 'basic'
      });

      const updatedActivity = await Next.findActivityById(req.params.id);
      res.json(updatedActivity);
    } catch (error) {
      next(error);
    }
  }

  async deleteActivity(req, res, next) {
    try {
      const deleted = await Next.deleteActivity(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Activity not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * SEASONS
   */
  async getAllSeasons(req, res, next) {
    try {
      const seasons = await Next.findAllSeasons();
      res.json(seasons);
    } catch (error) {
      next(error);
    }
  }

  async getSeasonsByDestination(req, res, next) {
    try {
      const seasons = await Next.findSeasonsByDestination(req.params.destinationId);
      res.json(seasons);
    } catch (error) {
      next(error);
    }
  }

  async getSeasonById(req, res, next) {
    try {
      const season = await Next.findSeasonById(req.params.id);
      if (!season) {
        throw new ApiError(404, 'Season not found');
      }
      res.json(season);
    } catch (error) {
      next(error);
    }
  }

  async createSeason(req, res, next) {
    try {
      const { destination_id, season_type, months } = req.body;
      
      const seasonId = await Next.createSeason({
        destination_id,
        season_type,
        months
      });

      const newSeason = await Next.findSeasonById(seasonId);
      res.status(201).json(newSeason);
    } catch (error) {
      next(error);
    }
  }

  async updateSeason(req, res, next) {
    try {
      const { season_type, months } = req.body;
      
      await Next.updateSeason(req.params.id, {
        season_type,
        months
      });

      const updatedSeason = await Next.findSeasonById(req.params.id);
      res.json(updatedSeason);
    } catch (error) {
      next(error);
    }
  }

  async deleteSeason(req, res, next) {
    try {
      const deleted = await Next.deleteSeason(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Season not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUBLIC API
   */
  async getPublicDestinations(req, res, next) {
    try {
      const destinations = await Next.findAllDestinations();
      res.json(destinations);
    } catch (error) {
      next(error);
    }
  }

  async getPublicDestinationById(req, res, next) {
    try {
      const destination = await Next.findDestinationById(req.params.id);
      if (!destination) {
        throw new ApiError(404, 'Destination not found');
      }
      res.json(destination);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NextController();
