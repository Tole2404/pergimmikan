const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth');

// Comment routes (require authentication)
router.get('/:content_type/:content_id', commentController.getComments);
router.get('/:content_type/:content_id/count', commentController.getCommentCount);
router.post('/', authMiddleware, commentController.createComment);
router.put('/:id', authMiddleware, commentController.updateComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

// Reaction routes
router.get('/reactions/:content_type/:content_id', commentController.getReactionSummary);
router.post('/reactions', authMiddleware, commentController.addReaction);
router.delete('/reactions/:content_type/:content_id', authMiddleware, commentController.removeReaction);

module.exports = router;
