const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/login', userController.login);

// Protected routes
router.use(authMiddleware);
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUser);
router.put('/change-password', userController.changePassword);
router.put('/update-telegram', userController.updateTelegram);

module.exports = router;
