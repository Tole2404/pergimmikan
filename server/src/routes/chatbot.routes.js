const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

// Post user chat message to chatbot
router.post('/chat', chatbotController.chatWithNailong);

module.exports = router;
