const express = require('express');
const router = express.Router();
const quoteController = require('../../controllers/quote.controller');
const auth = require('../../middleware/auth');

// Routes
router.get('/', auth, quoteController.getAllQuotes);
router.get('/featured', auth, quoteController.getFeaturedQuote);
router.get('/:id', auth, quoteController.getQuoteById);
router.post('/', auth, quoteController.createQuote);
router.put('/:id', auth, quoteController.updateQuote);
router.delete('/:id', auth, quoteController.deleteQuote);

module.exports = router;
