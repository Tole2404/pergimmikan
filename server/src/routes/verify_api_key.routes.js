const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/api_key.controller');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Route untuk verifikasi API key
router.get('/', apiKeyAuth, apiKeyController.verifyApiKey);

module.exports = router;
