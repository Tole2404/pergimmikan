const express = require('express');
const router = express.Router();
const legacyController = require('../../controllers/legacy.controller');
const auth = require('../../middleware/auth');

// Routes
router.get('/', auth, legacyController.getAllLegacies);
router.get('/:id', auth, legacyController.getLegacy);
router.post('/', auth, legacyController.createLegacy);
router.put('/:id', auth, legacyController.updateLegacy);
router.delete('/:id', auth, legacyController.deleteLegacy);

module.exports = router;