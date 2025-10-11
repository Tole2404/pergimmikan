const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/admin/role.controller');
const adminAuthMiddleware = require('../../middleware/adminAuth');

// Protected routes - all routes require admin authentication
router.use(adminAuthMiddleware);

// Role management routes
router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
