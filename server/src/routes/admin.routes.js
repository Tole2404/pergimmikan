const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuthMiddleware = require('../middleware/adminAuth');

// Public routes
router.post('/login', adminController.login);

// Protected routes (require authentication)
router.use(adminAuthMiddleware);
router.put('/change-password', adminController.changePassword);
router.put('/profile', adminController.updateProfile);

module.exports = router;
