const express = require('express');
const router = express.Router();
const legacyController = require('../controllers/legacy.controller');

// Public routes
router.get('/', legacyController.getAllLegacies);

module.exports = router;
