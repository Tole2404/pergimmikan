const db = require('../config/database');

class Quote {
  static async create({ text, author_name, author_title, is_featured }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // If this quote is set as featured, unfeatured all other quotes
      if (is_featured) {
        await conn.execute('UPDATE quotes SET is_featured = false');
      }

      // Insert quote data
      const [result] = await conn.execute(
        'INSERT INTO quotes (text, author_name, author_title, is_featured) VALUES (?, ?, ?, ?)',
        [text, author_name, author_title, is_featured]
      );

      await conn.commit();
      return result.insertId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM quotes ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM quotes WHERE id = ?', [id]);
    return rows[0];
  }

  static async getFeatured() {
    const [rows] = await db.execute('SELECT * FROM quotes WHERE is_featured = true LIMIT 1');
    return rows[0];
  }

  static async update(id, { text, author_name, author_title, is_featured }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // If this quote is set as featured, unfeatured all other quotes
      if (is_featured) {
        await conn.execute('UPDATE quotes SET is_featured = false');
      }

      // Update quote data
      const [result] = await conn.execute(
        'UPDATE quotes SET text = ?, author_name = ?, author_title = ?, is_featured = ? WHERE id = ?',
        [text, author_name, author_title, is_featured, id]
      );

      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM quotes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await db.execute(
      'SELECT * FROM quotes WHERE text LIKE ? OR author_name LIKE ? OR author_title LIKE ? ORDER BY created_at DESC',
      [searchTerm, searchTerm, searchTerm]
    );
    return rows;
  }
}

module.exports = Quote;
