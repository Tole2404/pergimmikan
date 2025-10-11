const express = require('express');
const router = express.Router();
const activityController = require('../../controllers/activity.controller');
const categoryController = require('../../controllers/activity-category.controller');
const auth = require('../../middleware/auth');
const activityUpload = require('../../config/multer/activity.multer');

// Main activity routes
router.get('/', auth, activityController.getAllActivities);
router.get('/:id', auth, activityController.getActivityById);
router.post('/', auth, activityUpload.single('image'), activityController.createActivity);
router.put('/:id', auth, activityUpload.single('image'), activityController.updateActivity);
router.delete('/:id', auth, activityController.deleteActivity);

// Gallery routes
router.get('/:id/gallery', auth, activityController.getActivityGallery);
router.post('/:id/gallery', auth, activityUpload.array('images', 10), activityController.addToGallery);
router.delete('/gallery/:imageId', auth, activityController.deleteFromGallery);

// Category routes
router.get('/categories/all', auth, categoryController.getAllCategories);
router.get('/categories/:id', auth, categoryController.getCategoryById);
router.post('/categories', auth, categoryController.createCategory);
router.put('/categories/:id', auth, categoryController.updateCategory);
router.delete('/categories/:id', auth, categoryController.deleteCategory);

module.exports = router;
