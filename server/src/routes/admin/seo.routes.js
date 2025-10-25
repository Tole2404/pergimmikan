const express = require('express');
const router = express.Router();
const seoController = require('../../controllers/seo.controller');

// SEO Settings Management
router.get('/', seoController.getAllSEO);
router.post('/', seoController.createSEO);
router.put('/:id', seoController.updateSEO);
router.delete('/:id', seoController.deleteSEO);

// SEO Templates Management
router.get('/templates', seoController.getAllTemplates);
router.put('/templates/:id', seoController.updateTemplate);

module.exports = router;
