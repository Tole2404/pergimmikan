const Quote = require('../models/quote.model');
const ApiError = require('../utils/apiError');

class QuoteController {
  // Get all quotes with optional search
  async getAllQuotes(req, res, next) {
    try {
      let quotes;
      if (req.query.search) {
        quotes = await Quote.search(req.query.search);
      } else {
        quotes = await Quote.findAll();
      }
      res.json(quotes);
    } catch (error) {
      next(error);
    }
  }

  // Get featured quote
  async getFeaturedQuote(req, res, next) {
    try {
      const quote = await Quote.getFeatured();
      if (!quote) {
        throw new ApiError(404, 'No featured quote found');
      }
      res.json(quote);
    } catch (error) {
      next(error);
    }
  }

  // Get quote by ID
  async getQuoteById(req, res, next) {
    try {
      const quote = await Quote.findById(req.params.id);
      if (!quote) {
        throw new ApiError(404, 'Quote not found');
      }
      res.json(quote);
    } catch (error) {
      next(error);
    }
  }

  // Create new quote
  async createQuote(req, res, next) {
    try {
      const { text, author_name, author_title, is_featured } = req.body;

      if (!text || !author_name) {
        throw new ApiError(400, 'Text and author name are required');
      }

      const quoteId = await Quote.create({
        text,
        author_name,
        author_title,
        is_featured: is_featured || false
      });

      const newQuote = await Quote.findById(quoteId);
      res.status(201).json(newQuote);
    } catch (error) {
      next(error);
    }
  }

  // Update quote
  async updateQuote(req, res, next) {
    try {
      const { text, author_name, author_title, is_featured } = req.body;

      if (!text || !author_name) {
        throw new ApiError(400, 'Text and author name are required');
      }

      const quote = await Quote.findById(req.params.id);
      if (!quote) {
        throw new ApiError(404, 'Quote not found');
      }

      await Quote.update(req.params.id, {
        text,
        author_name,
        author_title,
        is_featured: is_featured || false
      });

      const updatedQuote = await Quote.findById(req.params.id);
      res.json(updatedQuote);
    } catch (error) {
      next(error);
    }
  }

  // Delete quote
  async deleteQuote(req, res, next) {
    try {
      const deleted = await Quote.delete(req.params.id);
      if (!deleted) {
        throw new ApiError(404, 'Quote not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuoteController();
