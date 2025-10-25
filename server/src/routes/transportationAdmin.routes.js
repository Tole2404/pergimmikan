const express = require('express');
const router = express.Router();
const transportationAdminController = require('../controllers/transportationAdmin.controller');
const auth = require('../middleware/auth');

// All routes require admin authentication
router.use(auth);

// Transportation CRUD
router.get('/transportation', transportationAdminController.getAllRoutes);
router.post('/transportation', transportationAdminController.createRoute);
router.put('/transportation/:id', transportationAdminController.updateRoute);
router.delete('/transportation/:id', transportationAdminController.deleteRoute);

module.exports = router;
