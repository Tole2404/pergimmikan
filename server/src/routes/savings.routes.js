const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savings.controller');
const auth = require('../middleware/auth');
const receiptUpload = require('../config/receiptUpload');

// Routes - all routes protected by auth middleware
router.get('/', auth, savingsController.getUserSavings);
router.get('/history', auth, savingsController.getSavingsHistory);
router.post('/', auth, receiptUpload.single('receipt'), savingsController.submitDeposit);
router.post('/penarikan', auth, savingsController.submitPenarikan);

module.exports = router;
