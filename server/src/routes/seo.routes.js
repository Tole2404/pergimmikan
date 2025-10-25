const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seo.controller');

// Public routes - Get SEO for specific page
router.get('/:pageType', seoController.getSEO);
router.get('/:pageType/:pageId', seoController.getSEO);

// Generate SEO from template
router.post('/generate', seoController.generateSEO);

module.exports = router;
