const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const categoryController = require('../controllers/activity-category.controller');

// Public routes
router.get('/', activityController.getAllActivities);

// Categories routes (must come before :id routes)
router.get('/categories', categoryController.getAllCategories);

// Activity detail routes
router.get('/:id', activityController.getActivityById);
router.get('/:id/gallery', activityController.getActivityGallery);

module.exports = router;
