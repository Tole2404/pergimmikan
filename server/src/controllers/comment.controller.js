const Comment = require('../models/comment.model');
const Reaction = require('../models/reaction.model');
const ApiError = require('../utils/apiError');
const NotificationHelper = require('../utils/notificationHelper');

class CommentController {
  // Get comments for content
  async getComments(req, res, next) {
    try {
      const { content_type, content_id } = req.params;
      
      const comments = await Comment.getByContent(content_type, content_id);
      
      // Get replies for each comment
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await Comment.getReplies(comment.id);
          return { ...comment, replies };
        })
      );
      
      res.json(commentsWithReplies);
    } catch (error) {
      next(error);
    }
  }

  // Create comment
  async createComment(req, res, next) {
    try {
      const { content_type, content_id, comment, parent_id } = req.body;
      const user_id = req.user.id;

      if (!content_type || !content_id || !comment) {
        throw new ApiError(400, 'Content type, content ID, and comment are required');
      }

      const commentId = await Comment.create({
        content_type,
        content_id,
        user_id,
        parent_id,
        comment
      });

      const newComment = await Comment.findById(commentId);
      
      // Send notification (implement later)
      // NotificationHelper.notifyNewComment(...)
      
      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  }

  // Update comment
  async updateComment(req, res, next) {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      const user_id = req.user.id;

      if (!comment) {
        throw new ApiError(400, 'Comment text is required');
      }

      const existingComment = await Comment.findById(id);
      if (!existingComment) {
        throw new ApiError(404, 'Comment not found');
      }

      // Check if user owns the comment
      if (existingComment.user_id !== user_id) {
        throw new ApiError(403, 'You can only edit your own comments');
      }

      await Comment.update(id, comment);
      const updatedComment = await Comment.findById(id);
      
      res.json(updatedComment);
    } catch (error) {
      next(error);
    }
  }

  // Delete comment
  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const comment = await Comment.findById(id);
      if (!comment) {
        throw new ApiError(404, 'Comment not found');
      }

      // Check if user owns the comment or is admin
      if (comment.user_id !== user_id && req.user.role !== 'admin') {
        throw new ApiError(403, 'You can only delete your own comments');
      }

      await Comment.delete(id);
      
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Get comment count
  async getCommentCount(req, res, next) {
    try {
      const { content_type, content_id } = req.params;
      
      const count = await Comment.getCount(content_type, content_id);
      
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }

  // Add or update reaction
  async addReaction(req, res, next) {
    try {
      const { content_type, content_id, reaction_type } = req.body;
      const user_id = req.user.id;

      if (!content_type || !content_id || !reaction_type) {
        throw new ApiError(400, 'Content type, content ID, and reaction type are required');
      }

      // Validate reaction type
      const validReactions = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'];
      if (!validReactions.includes(reaction_type)) {
        throw new ApiError(400, 'Invalid reaction type');
      }

      await Reaction.addOrUpdate({
        content_type,
        content_id,
        user_id,
        reaction_type
      });

      const summary = await Reaction.getSummary(content_type, content_id);
      
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  // Remove reaction
  async removeReaction(req, res, next) {
    try {
      const { content_type, content_id } = req.params;
      const user_id = req.user.id;

      await Reaction.remove(content_type, content_id, user_id);

      const summary = await Reaction.getSummary(content_type, content_id);
      
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  // Get reaction summary
  async getReactionSummary(req, res, next) {
    try {
      const { content_type, content_id } = req.params;
      
      const summary = await Reaction.getSummary(content_type, content_id);
      const userReaction = req.user 
        ? await Reaction.getUserReaction(content_type, content_id, req.user.id)
        : null;
      
      res.json({ ...summary, userReaction });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
