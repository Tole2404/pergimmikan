const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const adminAuthMiddleware = require('../../middleware/adminAuth');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.use(adminAuthMiddleware);
router.post('/logout', adminController.logout);
router.put('/change-password', adminController.changePassword);
router.get('/profile', adminController.getProfile);
router.put('/profile', adminController.updateProfile);

module.exports = router;
