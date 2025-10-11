const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const adminAuthMiddleware = require('../../middleware/auth');
const profileUpload = require('../../config/profileUpload');

// Protected routes - all routes require admin authentication
router.use(adminAuthMiddleware);

// User management routes
router.get('/', userController.getAllUsers);
router.post('/', profileUpload.single('profile_image'), userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', profileUpload.single('profile_image'), userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/change-password', userController.changePassword);

// Role routes
router.get('/roles', userController.getRoles);

module.exports = router;
