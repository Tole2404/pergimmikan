const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote.controller');

// Public routes
router.get('/', quoteController.getAllQuotes);
router.get('/featured', quoteController.getFeaturedQuote);

module.exports = router;
