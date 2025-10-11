const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/api_key.controller');
const adminAuthMiddleware = require('../middleware/adminAuth');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Protected routes (require authentication)
router.use(adminAuthMiddleware);
router.get('/', apiKeyController.getAllApiKeys);
router.post('/', apiKeyController.createApiKey);
router.get('/:id', apiKeyController.getApiKeyById);
router.put('/:id', apiKeyController.updateApiKey);
router.delete('/:id', apiKeyController.deleteApiKey);
router.post('/:id/regenerate', apiKeyController.regenerateApiKey);

module.exports = router;
