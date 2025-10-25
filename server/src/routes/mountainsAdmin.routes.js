const express = require('express');
const router = express.Router();
const mountainsAdminController = require('../controllers/mountainsAdmin.controller');
const auth = require('../middleware/auth');

// All routes require admin authentication
router.use(auth);

// Mountains CRUD
router.get('/mountains', mountainsAdminController.getAllMountains);
router.post('/mountains', mountainsAdminController.createMountain);
router.put('/mountains/:id', mountainsAdminController.updateMountain);
router.delete('/mountains/:id', mountainsAdminController.deleteMountain);

module.exports = router;
