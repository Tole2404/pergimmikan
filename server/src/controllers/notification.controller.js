const Notification = require('../models/notification.model');
const ApiError = require('../utils/apiError');

class NotificationController {
  // Get all notifications for current user
  async getNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      
      const notifications = await Notification.findByUserId(userId, limit);
      const unreadCount = await Notification.getUnreadCount(userId);
      
      res.json({
        notifications,
        unreadCount
      });
    } catch (error) {
      next(error);
    }
  }

  // Get unread notifications
  async getUnreadNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      
      const notifications = await Notification.getUnread(userId, limit);
      
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  // Get unread count
  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.id;
      const count = await Notification.getUnreadCount(userId);
      
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }

  // Mark notification as read
  async markAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const notification = await Notification.findById(id, userId);
      if (!notification) {
        throw new ApiError(404, 'Notification not found');
      }
      
      await Notification.markAsRead(id, userId);
      
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  // Mark all notifications as read
  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      
      const count = await Notification.markAllAsRead(userId);
      
      res.json({ 
        message: 'All notifications marked as read',
        count 
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete notification
  async deleteNotification(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      const deleted = await Notification.delete(id, userId);
      if (!deleted) {
        throw new ApiError(404, 'Notification not found');
      }
      
      res.json({ message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  }

  // Delete all read notifications
  async deleteAllRead(req, res, next) {
    try {
      const userId = req.user.id;
      
      const count = await Notification.deleteAllRead(userId);
      
      res.json({ 
        message: 'All read notifications deleted',
        count 
      });
    } catch (error) {
      next(error);
    }
  }

  // Create notification (for testing or admin)
  async createNotification(req, res, next) {
    try {
      const { user_id, type, title, message, link } = req.body;
      
      if (!user_id || !type || !title || !message) {
        throw new ApiError(400, 'Missing required fields');
      }
      
      const notificationId = await Notification.create({
        user_id,
        type,
        title,
        message,
        link
      });
      
      res.status(201).json({ 
        message: 'Notification created',
        id: notificationId 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
