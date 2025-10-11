const ActivityCategory = require('../models/activity-category.model');
const ApiError = require('../utils/apiError');

class ActivityCategoryController {
  async getAllCategories(req, res, next) {
    try {
      const categories = await ActivityCategory.findAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const category = await ActivityCategory.findById(req.params.id);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        throw new ApiError(400, 'Category name is required');
      }

      const categoryId = await ActivityCategory.create({ name });
      const newCategory = await ActivityCategory.findById(categoryId);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        throw new ApiError(400, 'Category name is required');
      }

      const updated = await ActivityCategory.update(req.params.id, { name });
      if (!updated) {
        throw new ApiError(404, 'Category not found');
      }

      const category = await ActivityCategory.findById(req.params.id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const deleted = await ActivityCategory.delete(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Category not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActivityCategoryController();
