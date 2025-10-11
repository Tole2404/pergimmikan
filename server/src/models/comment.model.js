const db = require('../config/database');

class Comment {
  // Create comment
  static async create({ content_type, content_id, user_id, parent_id = null, comment }) {
    const [result] = await db.execute(
      'INSERT INTO comments (content_type, content_id, user_id, parent_id, comment) VALUES (?, ?, ?, ?, ?)',
      [content_type, content_id, user_id, parent_id, comment]
    );
    return result.insertId;
  }

  // Get comments for content (with user info)
  static async getByContent(content_type, content_id) {
    const [rows] = await db.execute(
      `SELECT c.*, u.username, u.image_url as user_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.content_type = ? AND c.content_id = ?
       ORDER BY c.created_at DESC`,
      [content_type, content_id]
    );
    return rows;
  }

  // Get comment by ID
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT c.*, u.username, u.image_url as user_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Get replies for a comment
  static async getReplies(parent_id) {
    const [rows] = await db.execute(
      `SELECT c.*, u.username, u.image_url as user_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.parent_id = ?
       ORDER BY c.created_at ASC`,
      [parent_id]
    );
    return rows;
  }

  // Update comment
  static async update(id, comment) {
    const [result] = await db.execute(
      'UPDATE comments SET comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [comment, id]
    );
    return result.affectedRows > 0;
  }

  // Delete comment
  static async delete(id) {
    // Delete replies first
    await db.execute('DELETE FROM comments WHERE parent_id = ?', [id]);
    
    // Delete the comment
    const [result] = await db.execute('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get comment count for content
  static async getCount(content_type, content_id) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM comments WHERE content_type = ? AND content_id = ?',
      [content_type, content_id]
    );
    return rows[0].count;
  }

  // Get user's comments
  static async getByUser(user_id, limit = 50) {
    const [rows] = await db.execute(
      `SELECT c.*, u.username, u.image_url as user_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC
       LIMIT ?`,
      [user_id, limit]
    );
    return rows;
  }
}

module.exports = Comment;
