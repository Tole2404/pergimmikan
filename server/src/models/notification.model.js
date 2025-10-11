const db = require('../config/database');

class Notification {
  // Create notification
  static async create({ user_id, type, title, message, link = null }) {
    const [result] = await db.execute(
      'INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)',
      [user_id, type, title, message, link]
    );
    return result.insertId;
  }

  // Create notification for multiple users
  static async createForMultipleUsers(user_ids, { type, title, message, link = null }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const values = user_ids.map(user_id => [user_id, type, title, message, link]);
      const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();

      await conn.execute(
        `INSERT INTO notifications (user_id, type, title, message, link) VALUES ${placeholders}`,
        flatValues
      );

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // Get all notifications for a user
  static async findByUserId(user_id, limit = 50) {
    const [rows] = await db.execute(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [user_id, limit]
    );
    return rows;
  }

  // Get unread notifications count
  static async getUnreadCount(user_id) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [user_id]
    );
    return rows[0].count;
  }

  // Get unread notifications
  static async getUnread(user_id, limit = 50) {
    const [rows] = await db.execute(
      `SELECT * FROM notifications 
       WHERE user_id = ? AND is_read = FALSE 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [user_id, limit]
    );
    return rows;
  }

  // Mark notification as read
  static async markAsRead(id, user_id) {
    const [result] = await db.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    return result.affectedRows > 0;
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(user_id) {
    const [result] = await db.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [user_id]
    );
    return result.affectedRows;
  }

  // Delete notification
  static async delete(id, user_id) {
    const [result] = await db.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    return result.affectedRows > 0;
  }

  // Delete all read notifications for a user
  static async deleteAllRead(user_id) {
    const [result] = await db.execute(
      'DELETE FROM notifications WHERE user_id = ? AND is_read = TRUE',
      [user_id]
    );
    return result.affectedRows;
  }

  // Delete old notifications (older than X days)
  static async deleteOld(days = 30) {
    const [result] = await db.execute(
      'DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    );
    return result.affectedRows;
  }

  // Get notification by ID
  static async findById(id, user_id) {
    const [rows] = await db.execute(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    return rows[0];
  }
}

module.exports = Notification;
