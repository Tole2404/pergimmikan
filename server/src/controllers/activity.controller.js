const Activity = require('../models/activity.model');
const ApiError = require('../utils/apiError');
const path = require('path');
const NotificationHelper = require('../utils/notificationHelper');

class ActivityController {
  // Get all activities with optional search and filter
  async getAllActivities(req, res, next) {
    try {
      let activities;
      if (req.query.search) {
        activities = await Activity.search(req.query.search);
      } else if (req.query.status && req.query.status !== 'all') {
        activities = await Activity.filterByStatus(req.query.status);
      } else {
        activities = await Activity.findAll();
      }
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  // Get activity by ID
  async getActivityById(req, res, next) {
    try {
      const activity = await Activity.findById(req.params.id);
      if (!activity) {
        throw new ApiError(404, 'Activity not found');
      }
      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  // Create new activity
  async createActivity(req, res, next) {
    try {
      const { title, date, time, location, description, category_id, status } = req.body;
      const image_url = req.file ? `/images/activities/${req.file.filename}` : '/images/activities/default.jpg';

      if (!title || !date || !time || !location || !description || !category_id) {
        throw new ApiError(400, 'All fields are required');
      }

      const activityId = await Activity.create({
        title,
        date,
        time,
        location,
        description,
        category_id,
        image_url,
        status: status || 'upcoming'
      });

      const newActivity = await Activity.findById(activityId);
      
      // Send notification to all users
      NotificationHelper.notifyNewActivity(title)
        .catch(err => console.error('Failed to send notification:', err));
      
      res.status(201).json(newActivity);
    } catch (error) {
      next(error);
    }
  }

  // Update activity
  async updateActivity(req, res, next) {
    try {
      const { title, date, time, location, description, category_id, status, image_url } = req.body;

      if (!title || !date || !time || !location || !description || !category_id) {
        throw new ApiError(400, 'All fields are required');
      }

      const activity = await Activity.findById(req.params.id);
      if (!activity) {
        throw new ApiError(404, 'Activity not found');
      }

      const updates = {
        title,
        date,
        time,
        location,
        description,
        category_id,
        status: status || 'upcoming'
      };

      // Handle image update:
      // 1. If there's a new file uploaded, use that
      // 2. If image_url is provided in body (existing image), use that
      // 3. Otherwise, keep the current image_url
      if (req.file) {
        updates.image_url = `/images/activities/${req.file.filename}`;
      } else if (image_url) {
        updates.image_url = image_url;
      }
      // If neither req.file nor image_url exists, keep the existing image_url

      await Activity.update(req.params.id, updates);
      const updatedActivity = await Activity.findById(req.params.id);
      res.json(updatedActivity);
    } catch (error) {
      next(error);
    }
  }

  // Delete activity
  async deleteActivity(req, res, next) {
    try {
      const deleted = await Activity.delete(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Activity not found');
      }
      res.status(200).json({
        success: true,
        message: 'Activity successfully deleted'
      });
    } catch (error) {
      next(error);
    }
  }

  // Gallery methods
  async getActivityGallery(req, res, next) {
    try {
      const gallery = await Activity.getGallery(req.params.id);
      res.json(gallery);
    } catch (error) {
      next(error);
    }
  }

  async addToGallery(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new ApiError(400, 'No images uploaded');
      }

      const images = req.files.map(file => ({
        url: `/images/activities/gallery/${file.filename}`,
        caption: null
      }));

      await Activity.addToGallery(req.params.id, images);
      const gallery = await Activity.getGallery(req.params.id);
      res.status(201).json(gallery);
    } catch (error) {
      next(error);
    }
  }

  async deleteFromGallery(req, res, next) {
    try {
      const deleted = await Activity.deleteFromGallery(req.params.imageId);
      if (!deleted) {
        throw new ApiError(404, 'Gallery image not found');
      }
      res.status(200).json({
        success: true,
        message: 'Gallery image successfully deleted'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActivityController();
