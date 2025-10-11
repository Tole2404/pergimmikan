const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');

// Public gallery routes
router.get('/', galleryController.getAllGalleries.bind(galleryController));
router.get('/:id', galleryController.getGalleryById.bind(galleryController));

module.exports = router;
