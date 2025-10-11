const express = require('express');
const router = express.Router();
const galleryController = require('../../controllers/gallery.controller');
const auth = require('../../middleware/auth');
const galleryUpload = require('../../config/multer/gallery.multer');

// Gallery routes
router.get('/', auth, galleryController.getAllGalleries.bind(galleryController));
router.get('/:id', auth, galleryController.getGalleryById.bind(galleryController));
router.post('/', auth, galleryUpload.array('images', 10), galleryController.createGallery.bind(galleryController));
router.put('/:id', auth, galleryUpload.array('images', 10), galleryController.updateGallery.bind(galleryController));
router.delete('/:id', auth, galleryController.deleteGallery.bind(galleryController));

// Tag routes
router.get('/tags/all', auth, galleryController.getAllTags.bind(galleryController));
router.post('/tags', auth, galleryController.createTag.bind(galleryController));
router.delete('/tags/:id', auth, galleryController.deleteTag.bind(galleryController));

module.exports = router;
