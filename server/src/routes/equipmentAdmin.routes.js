const express = require('express');
const router = express.Router();
const equipmentAdminController = require('../controllers/equipmentAdmin.controller');
const auth = require('../middleware/auth');

// All routes require admin authentication
router.use(auth);

// Equipment CRUD
router.get('/equipment', equipmentAdminController.getAllEquipment);
router.post('/equipment', equipmentAdminController.createEquipment);
router.put('/equipment/:id', equipmentAdminController.updateEquipment);
router.delete('/equipment/:id', equipmentAdminController.deleteEquipment);

module.exports = router;
