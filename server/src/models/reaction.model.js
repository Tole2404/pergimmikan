const db = require('../config/database');

class Reaction {
  // Add or update reaction
  static async addOrUpdate({ content_type, content_id, user_id, reaction_type }) {
    const [result] = await db.execute(
      `INSERT INTO reactions (content_type, content_id, user_id, reaction_type) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE reaction_type = VALUES(reaction_type)`,
      [content_type, content_id, user_id, reaction_type]
    );
    return result.insertId || result.affectedRows;
  }

  // Remove reaction
  static async remove(content_type, content_id, user_id) {
    const [result] = await db.execute(
      'DELETE FROM reactions WHERE content_type = ? AND content_id = ? AND user_id = ?',
      [content_type, content_id, user_id]
    );
    return result.affectedRows > 0;
  }

  // Get reactions for content
  static async getByContent(content_type, content_id) {
    const [rows] = await db.execute(
      `SELECT r.*, u.username
       FROM reactions r
       JOIN users u ON r.user_id = u.id
       WHERE r.content_type = ? AND r.content_id = ?`,
      [content_type, content_id]
    );
    return rows;
  }

  // Get reaction summary (count by type)
  static async getSummary(content_type, content_id) {
    const [rows] = await db.execute(
      `SELECT reaction_type, COUNT(*) as count
       FROM reactions
       WHERE content_type = ? AND content_id = ?
       GROUP BY reaction_type`,
      [content_type, content_id]
    );
    
    // Convert to object format
    const summary = {
      like: 0,
      love: 0,
      laugh: 0,
      wow: 0,
      sad: 0,
      angry: 0,
      total: 0
    };
    
    rows.forEach(row => {
      summary[row.reaction_type] = row.count;
      summary.total += row.count;
    });
    
    return summary;
  }

  // Get user's reaction for content
  static async getUserReaction(content_type, content_id, user_id) {
    const [rows] = await db.execute(
      'SELECT reaction_type FROM reactions WHERE content_type = ? AND content_id = ? AND user_id = ?',
      [content_type, content_id, user_id]
    );
    return rows[0]?.reaction_type || null;
  }

  // Check if user has reacted
  static async hasReacted(content_type, content_id, user_id) {
    const [rows] = await db.execute(
      'SELECT 1 FROM reactions WHERE content_type = ? AND content_id = ? AND user_id = ?',
      [content_type, content_id, user_id]
    );
    return rows.length > 0;
  }
}

module.exports = Reaction;
