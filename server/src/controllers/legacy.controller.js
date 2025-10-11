const Legacy = require('../models/legacy.model');
const ApiError = require('../utils/apiError');

class LegacyController {
  // Get all legacies
  async getAllLegacies(req, res, next) {
    try {
      const legacies = await Legacy.findAll();
      res.json(legacies);
    } catch (error) {
      next(error);
    }
  }

  // Get single legacy
  async getLegacy(req, res, next) {
    try {
      const legacy = await Legacy.findById(req.params.id);
      
      if (!legacy) {
        throw new ApiError(404, 'Legacy not found');
      }

      res.json(legacy);
    } catch (error) {
      next(error);
    }
  }

  // Create new legacy
  async createLegacy(req, res, next) {
    try {
      const { year, title, description } = req.body;

      if (!year || !title || !description) {
        throw new ApiError(400, 'All fields are required');
      }

      const newLegacy = await Legacy.create({ year, title, description });
      res.status(201).json(newLegacy);
    } catch (error) {
      next(error);
    }
  }

  // Update legacy
  async updateLegacy(req, res, next) {
    try {
      const { year, title, description } = req.body;

      if (!year || !title || !description) {
        throw new ApiError(400, 'All fields are required');
      }

      const legacy = await Legacy.findById(req.params.id);
      
      if (!legacy) {
        throw new ApiError(404, 'Legacy not found');
      }

      const updatedLegacy = await Legacy.update(req.params.id, { 
        year, 
        title, 
        description 
      });

      res.json(updatedLegacy);
    } catch (error) {
      next(error);
    }
  }

  // Delete legacy
  async deleteLegacy(req, res, next) {
    try {
      const legacy = await Legacy.findById(req.params.id);
      
      if (!legacy) {
        throw new ApiError(404, 'Legacy not found');
      }

      await Legacy.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LegacyController();
