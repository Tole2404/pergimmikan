const express = require('express');
const router = express.Router();
const userController = require('../../controllers/team/user.controller');
const authMiddleware = require('../../middleware/teamAuth');

// Public routes
router.post('/login', userController.login);

// Protected routes
router.use(authMiddleware);
router.get('/profile', userController.getUserById);
router.put('/profile', userController.updateUser);
router.post('/profile/image', userController.uploadProfileImage);
router.get('/profile/images', userController.getProfileImages);
router.get('/profile/stats', userController.getUserStats);
router.put('/change-password', userController.changePassword);

module.exports = router;
