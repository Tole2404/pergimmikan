const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const adminAuthMiddleware = require('../../middleware/adminAuth');

// All routes require admin authentication
router.use(adminAuthMiddleware);

// Content management routes
router.get('/', adminController.getAllContent);
router.post('/', adminController.createContent);
router.get('/:id', adminController.getContentById);
router.put('/:id', adminController.updateContent);
router.delete('/:id', adminController.deleteContent);
router.put('/:id/status', adminController.updateContentStatus);

module.exports = router;
