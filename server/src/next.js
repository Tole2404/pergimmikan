/**
 * NEXT ADVENTURE MODULE
 * 
 * File ini berisi model, controller, dan routes untuk fitur Next Adventure
 * yang mencakup destinasi, transportasi, aktivitas, dan musim.
 */

const express = require('express');
const db = require('./config/database');
const ApiError = require('./utils/apiError');
const auth = require('./middleware/auth');
const upload = require('./config/multer');
const fs = require('fs');
const path = require('path');

// Pastikan direktori upload ada
const uploadDir = path.join(__dirname, '../public/images/next');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//=============================================================================
// MODEL
//=============================================================================

class NextModel {
  /**
   * DESTINATIONS
   */
  static async createDestination({ name, image_url, description, highlights, accommodation_budget, accommodation_standard, accommodation_luxury, transportation_public, transportation_private, transportation_luxury, food_budget, food_standard, food_luxury }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Insert destination data
      const [destResult] = await conn.execute(
        'INSERT INTO next_destinations (name, image, description) VALUES (?, ?, ?)',
        [name, image_url, description]
      );
      const destinationId = destResult.insertId;

      // Insert highlights
      if (highlights && Array.isArray(highlights)) {
        for (const highlight of highlights) {
          await conn.execute(
            'INSERT INTO next_destination_highlights (destination_id, highlight) VALUES (?, ?)',
            [destinationId, highlight]
          );
        }
      }

      // Insert costs
      await conn.execute(
        `INSERT INTO next_destination_costs (
          destination_id, 
          accommodation_budget, 
          accommodation_standard, 
          accommodation_luxury, 
          transportation_public, 
          transportation_private, 
          transportation_luxury, 
          food_budget, 
          food_standard, 
          food_luxury
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          destinationId,
          accommodation_budget,
          accommodation_standard,
          accommodation_luxury,
          transportation_public,
          transportation_private,
          transportation_luxury,
          food_budget,
          food_standard,
          food_luxury
        ]
      );

      await conn.commit();
      return destinationId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async findAllDestinations() {
    const [destinations] = await db.execute(`
      SELECT 
        d.id,
        d.name,
        d.image,
        d.description,
        d.created_at,
        d.updated_at
      FROM next_destinations d
      ORDER BY d.name ASC
    `);

    // Get highlights for each destination
    for (const destination of destinations) {
      const [highlights] = await db.execute(
        'SELECT highlight FROM next_destination_highlights WHERE destination_id = ?',
        [destination.id]
      );
      destination.highlights = highlights.map(h => h.highlight);

      // Get costs
      const [costs] = await db.execute(
        'SELECT * FROM next_destination_costs WHERE destination_id = ?',
        [destination.id]
      );
      
      if (costs.length > 0) {
        destination.costs = {
          accommodation: {
            BUDGET: costs[0].accommodation_budget,
            STANDARD: costs[0].accommodation_standard,
            LUXURY: costs[0].accommodation_luxury
          },
          transportation: {
            PUBLIC: costs[0].transportation_public,
            PRIVATE: costs[0].transportation_private,
            LUXURY: costs[0].transportation_luxury
          },
          food: {
            budget: costs[0].food_budget,
            standard: costs[0].food_standard,
            luxury: costs[0].food_luxury
          }
        };
      }

      // Get activities
      const [activities] = await db.execute(
        'SELECT * FROM next_activities WHERE destination_id = ?',
        [destination.id]
      );

      destination.costs.activities = {
        basic: activities.filter(a => a.type === 'basic').map(a => ({
          name: a.name,
          cost: a.cost
        })),
        premium: activities.filter(a => a.type === 'premium').map(a => ({
          name: a.name,
          cost: a.cost
        }))
      };

      // Get seasons
      const [seasons] = await db.execute(
        'SELECT * FROM next_seasons WHERE destination_id = ?',
        [destination.id]
      );

      destination.costs.seasons = {
        LOW: [],
        SHOULDER: [],
        PEAK: []
      };

      for (const season of seasons) {
        if (season.months) {
          destination.costs.seasons[season.season_type] = season.months.split(',').map(m => m.trim());
        }
      }
    }

    return destinations;
  }

  static async findDestinationById(id) {
    const [destinations] = await db.execute(`
      SELECT 
        d.id,
        d.name,
        d.image,
        d.description,
        d.created_at,
        d.updated_at
      FROM next_destinations d
      WHERE d.id = ?
    `, [id]);

    if (destinations.length === 0) {
      return null;
    }

    const destination = destinations[0];

    // Get highlights
    const [highlights] = await db.execute(
      'SELECT highlight FROM next_destination_highlights WHERE destination_id = ?',
      [destination.id]
    );
    destination.highlights = highlights.map(h => h.highlight);

    // Get costs
    const [costs] = await db.execute(
      'SELECT * FROM next_destination_costs WHERE destination_id = ?',
      [destination.id]
    );
    
    if (costs.length > 0) {
      destination.costs = {
        accommodation: {
          BUDGET: costs[0].accommodation_budget,
          STANDARD: costs[0].accommodation_standard,
          LUXURY: costs[0].accommodation_luxury
        },
        transportation: {
          PUBLIC: costs[0].transportation_public,
          PRIVATE: costs[0].transportation_private,
          LUXURY: costs[0].transportation_luxury
        },
        food: {
          budget: costs[0].food_budget,
          standard: costs[0].food_standard,
          luxury: costs[0].food_luxury
        }
      };
    }

    // Get activities
    const [activities] = await db.execute(
      'SELECT * FROM next_activities WHERE destination_id = ?',
      [destination.id]
    );

    destination.costs.activities = {
      basic: activities.filter(a => a.type === 'basic').map(a => ({
        name: a.name,
        cost: a.cost
      })),
      premium: activities.filter(a => a.type === 'premium').map(a => ({
        name: a.name,
        cost: a.cost
      }))
    };

    // Get seasons
    const [seasons] = await db.execute(
      'SELECT * FROM next_seasons WHERE destination_id = ?',
      [destination.id]
    );

    destination.costs.seasons = {
      LOW: [],
      SHOULDER: [],
      PEAK: []
    };

    for (const season of seasons) {
      if (season.months) {
        destination.costs.seasons[season.season_type] = season.months.split(',').map(m => m.trim());
      }
    }

    return destination;
  }

  static async updateDestination(id, { name, image_url, description, highlights, accommodation_budget, accommodation_standard, accommodation_luxury, transportation_public, transportation_private, transportation_luxury, food_budget, food_standard, food_luxury }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Update destination data
      const updateFields = [];
      const updateValues = [];

      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (image_url) {
        updateFields.push('image = ?');
        updateValues.push(image_url);
      }
      if (description) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }

      if (updateFields.length > 0) {
        await conn.execute(
          `UPDATE next_destinations SET ${updateFields.join(', ')} WHERE id = ?`,
          [...updateValues, id]
        );
      }

      // Update highlights
      if (highlights && Array.isArray(highlights)) {
        // Delete existing highlights
        await conn.execute('DELETE FROM next_destination_highlights WHERE destination_id = ?', [id]);
        
        // Insert new highlights
        for (const highlight of highlights) {
          await conn.execute(
            'INSERT INTO next_destination_highlights (destination_id, highlight) VALUES (?, ?)',
            [id, highlight]
          );
        }
      }

      // Update costs
      const [existingCosts] = await conn.execute(
        'SELECT * FROM next_destination_costs WHERE destination_id = ?',
        [id]
      );

      if (existingCosts.length > 0) {
        // Update existing costs
        await conn.execute(
          `UPDATE next_destination_costs SET 
            accommodation_budget = ?, 
            accommodation_standard = ?, 
            accommodation_luxury = ?, 
            transportation_public = ?, 
            transportation_private = ?, 
            transportation_luxury = ?, 
            food_budget = ?, 
            food_standard = ?, 
            food_luxury = ?
          WHERE destination_id = ?`,
          [
            accommodation_budget,
            accommodation_standard,
            accommodation_luxury,
            transportation_public,
            transportation_private,
            transportation_luxury,
            food_budget,
            food_standard,
            food_luxury,
            id
          ]
        );
      } else {
        // Insert new costs
        await conn.execute(
          `INSERT INTO next_destination_costs (
            destination_id, 
            accommodation_budget, 
            accommodation_standard, 
            accommodation_luxury, 
            transportation_public, 
            transportation_private, 
            transportation_luxury, 
            food_budget, 
            food_standard, 
            food_luxury
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            accommodation_budget,
            accommodation_standard,
            accommodation_luxury,
            transportation_public,
            transportation_private,
            transportation_luxury,
            food_budget,
            food_standard,
            food_luxury
          ]
        );
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async deleteDestination(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Delete related data first
      await conn.execute('DELETE FROM next_destination_highlights WHERE destination_id = ?', [id]);
      await conn.execute('DELETE FROM next_destination_costs WHERE destination_id = ?', [id]);
      await conn.execute('DELETE FROM next_activities WHERE destination_id = ?', [id]);
      await conn.execute('DELETE FROM next_seasons WHERE destination_id = ?', [id]);
      
      // Then delete the destination
      const [result] = await conn.execute('DELETE FROM next_destinations WHERE id = ?', [id]);
      
      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * TRANSPORT RATES
   */
  static async createTransport({ destination_name, flight_economy, flight_business, flight_first }) {
    const [result] = await db.execute(
      'INSERT INTO next_transport_from_jakarta (destination_name, flight_economy, flight_business, flight_first) VALUES (?, ?, ?, ?)',
      [destination_name.toUpperCase(), flight_economy, flight_business, flight_first]
    );
    return result.insertId;
  }

  static async findAllTransport() {
    const [rows] = await db.execute('SELECT * FROM next_transport_from_jakarta');
    return rows;
  }

  static async findTransportById(id) {
    const [rows] = await db.execute('SELECT * FROM next_transport_from_jakarta WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateTransport(id, { destination_name, flight_economy, flight_business, flight_first }) {
    const [result] = await db.execute(
      'UPDATE next_transport_from_jakarta SET destination_name = ?, flight_economy = ?, flight_business = ?, flight_first = ? WHERE id = ?',
      [destination_name.toUpperCase(), flight_economy, flight_business, flight_first, id]
    );
    return result.affectedRows > 0;
  }

  static async deleteTransport(id) {
    const [result] = await db.execute('DELETE FROM next_transport_from_jakarta WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * ACTIVITIES
   */
  static async createActivity({ destination_id, name, cost, type }) {
    const [result] = await db.execute(
      'INSERT INTO next_activities (destination_id, name, cost, type) VALUES (?, ?, ?, ?)',
      [destination_id, name, cost, type]
    );
    return result.insertId;
  }

  static async findAllActivities() {
    const [rows] = await db.execute(`
      SELECT a.*, d.name as destination_name 
      FROM next_activities a
      JOIN next_destinations d ON a.destination_id = d.id
    `);
    return rows;
  }

  static async findActivitiesByDestination(destinationId) {
    const [rows] = await db.execute(
      'SELECT * FROM next_activities WHERE destination_id = ?',
      [destinationId]
    );
    return rows;
  }

  static async findActivityById(id) {
    const [rows] = await db.execute('SELECT * FROM next_activities WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateActivity(id, { name, cost, type }) {
    const [result] = await db.execute(
      'UPDATE next_activities SET name = ?, cost = ?, type = ? WHERE id = ?',
      [name, cost, type, id]
    );
    return result.affectedRows > 0;
  }

  static async deleteActivity(id) {
    const [result] = await db.execute('DELETE FROM next_activities WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * SEASONS
   */
  static async createSeason({ destination_id, season_type, months }) {
    const [result] = await db.execute(
      'INSERT INTO next_seasons (destination_id, season_type, months) VALUES (?, ?, ?)',
      [destination_id, season_type, months]
    );
    return result.insertId;
  }

  static async findAllSeasons() {
    const [rows] = await db.execute(`
      SELECT s.*, d.name as destination_name 
      FROM next_seasons s
      JOIN next_destinations d ON s.destination_id = d.id
    `);
    return rows;
  }

  static async findSeasonsByDestination(destinationId) {
    const [rows] = await db.execute(
      'SELECT * FROM next_seasons WHERE destination_id = ?',
      [destinationId]
    );
    return rows;
  }

  static async findSeasonById(id) {
    const [rows] = await db.execute('SELECT * FROM next_seasons WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateSeason(id, { season_type, months }) {
    const [result] = await db.execute(
      'UPDATE next_seasons SET season_type = ?, months = ? WHERE id = ?',
      [season_type, months, id]
    );
    return result.affectedRows > 0;
  }

  static async deleteSeason(id) {
    const [result] = await db.execute('DELETE FROM next_seasons WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

//=============================================================================
// CONTROLLER
//=============================================================================

class NextController {
  /**
   * DESTINATIONS
   */
  async getAllDestinations(req, res, next) {
    try {
      const destinations = await NextModel.findAllDestinations();
      res.json(destinations);
    } catch (error) {
      next(error);
    }
  }

  async getDestinationById(req, res, next) {
    try {
      const destination = await NextModel.findDestinationById(req.params.id);
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

      const destinationId = await NextModel.createDestination({
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

      const newDestination = await NextModel.findDestinationById(destinationId);
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

      await NextModel.updateDestination(req.params.id, updates);
      const updatedDestination = await NextModel.findDestinationById(req.params.id);
      res.json(updatedDestination);
    } catch (error) {
      next(error);
    }
  }

  async deleteDestination(req, res, next) {
    try {
      const deleted = await NextModel.deleteDestination(req.params.id);
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
      const transport = await NextModel.findAllTransport();
      res.json(transport);
    } catch (error) {
      next(error);
    }
  }

  async getTransportById(req, res, next) {
    try {
      const transport = await NextModel.findTransportById(req.params.id);
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
      
      const transportId = await NextModel.createTransport({
        destination_name,
        flight_economy: parseFloat(flight_economy),
        flight_business: parseFloat(flight_business),
        flight_first: parseFloat(flight_first)
      });

      const newTransport = await NextModel.findTransportById(transportId);
      res.status(201).json(newTransport);
    } catch (error) {
      next(error);
    }
  }

  async updateTransport(req, res, next) {
    try {
      const { destination_name, flight_economy, flight_business, flight_first } = req.body;
      
      await NextModel.updateTransport(req.params.id, {
        destination_name,
        flight_economy: parseFloat(flight_economy),
        flight_business: parseFloat(flight_business),
        flight_first: parseFloat(flight_first)
      });

      const updatedTransport = await NextModel.findTransportById(req.params.id);
      res.json(updatedTransport);
    } catch (error) {
      next(error);
    }
  }

  async deleteTransport(req, res, next) {
    try {
      const deleted = await NextModel.deleteTransport(req.params.id);
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
      const activities = await NextModel.findAllActivities();
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  async getActivitiesByDestination(req, res, next) {
    try {
      const activities = await NextModel.findActivitiesByDestination(req.params.destinationId);
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  async getActivityById(req, res, next) {
    try {
      const activity = await NextModel.findActivityById(req.params.id);
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
      
      const activityId = await NextModel.createActivity({
        destination_id,
        name,
        cost: parseFloat(cost),
        type: type || 'basic'
      });

      const newActivity = await NextModel.findActivityById(activityId);
      res.status(201).json(newActivity);
    } catch (error) {
      next(error);
    }
  }

  async updateActivity(req, res, next) {
    try {
      const { name, cost, type } = req.body;
      
      await NextModel.updateActivity(req.params.id, {
        name,
        cost: parseFloat(cost),
        type: type || 'basic'
      });

      const updatedActivity = await NextModel.findActivityById(req.params.id);
      res.json(updatedActivity);
    } catch (error) {
      next(error);
    }
  }

  async deleteActivity(req, res, next) {
    try {
      const deleted = await NextModel.deleteActivity(req.params.id);
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
      const seasons = await NextModel.findAllSeasons();
      res.json(seasons);
    } catch (error) {
      next(error);
    }
  }

  async getSeasonsByDestination(req, res, next) {
    try {
      const seasons = await NextModel.findSeasonsByDestination(req.params.destinationId);
      res.json(seasons);
    } catch (error) {
      next(error);
    }
  }

  async getSeasonById(req, res, next) {
    try {
      const season = await NextModel.findSeasonById(req.params.id);
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
      
      const seasonId = await NextModel.createSeason({
        destination_id,
        season_type,
        months
      });

      const newSeason = await NextModel.findSeasonById(seasonId);
      res.status(201).json(newSeason);
    } catch (error) {
      next(error);
    }
  }

  async updateSeason(req, res, next) {
    try {
      const { season_type, months } = req.body;
      
      await NextModel.updateSeason(req.params.id, {
        season_type,
        months
      });

      const updatedSeason = await NextModel.findSeasonById(req.params.id);
      res.json(updatedSeason);
    } catch (error) {
      next(error);
    }
  }

  async deleteSeason(req, res, next) {
    try {
      const deleted = await NextModel.deleteSeason(req.params.id);
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
      const destinations = await NextModel.findAllDestinations();
      res.json(destinations);
    } catch (error) {
      next(error);
    }
  }

  async getPublicDestinationById(req, res, next) {
    try {
      const destination = await NextModel.findDestinationById(req.params.id);
      if (!destination) {
        throw new ApiError(404, 'Destination not found');
      }
      res.json(destination);
    } catch (error) {
      next(error);
    }
  }
}

//=============================================================================
// ROUTES
//=============================================================================

// Create router
const router = express.Router();
const nextController = new NextController();

// Admin routes
const adminRouter = express.Router();

// Destinations
adminRouter.get('/destinations', auth, nextController.getAllDestinations);
adminRouter.get('/destinations/:id', auth, nextController.getDestinationById);
adminRouter.post('/destinations', auth, upload.single('image'), nextController.createDestination);
adminRouter.put('/destinations/:id', auth, upload.single('image'), nextController.updateDestination);
adminRouter.delete('/destinations/:id', auth, nextController.deleteDestination);

// Transport
adminRouter.get('/transport', auth, nextController.getAllTransport);
adminRouter.get('/transport/:id', auth, nextController.getTransportById);
adminRouter.post('/transport', auth, nextController.createTransport);
adminRouter.put('/transport/:id', auth, nextController.updateTransport);
adminRouter.delete('/transport/:id', auth, nextController.deleteTransport);

// Activities
adminRouter.get('/activities', auth, nextController.getAllActivities);
adminRouter.get('/activities/destination/:destinationId', auth, nextController.getActivitiesByDestination);
adminRouter.get('/activities/:id', auth, nextController.getActivityById);
adminRouter.post('/activities', auth, nextController.createActivity);
adminRouter.put('/activities/:id', auth, nextController.updateActivity);
adminRouter.delete('/activities/:id', auth, nextController.deleteActivity);

// Seasons
adminRouter.get('/seasons', auth, nextController.getAllSeasons);
adminRouter.get('/seasons/destination/:destinationId', auth, nextController.getSeasonsByDestination);
adminRouter.get('/seasons/:id', auth, nextController.getSeasonById);
adminRouter.post('/seasons', auth, nextController.createSeason);
adminRouter.put('/seasons/:id', auth, nextController.updateSeason);
adminRouter.delete('/seasons/:id', auth, nextController.deleteSeason);

// Public routes
router.get('/destinations', nextController.getPublicDestinations);
router.get('/destinations/:id', nextController.getPublicDestinationById);

// Export routes
module.exports = {
  nextRoutes: router,
  nextAdminRoutes: adminRouter,
  NextModel
};
