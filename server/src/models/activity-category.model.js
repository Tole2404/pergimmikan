const db = require('../config/database');

class ActivityCategory {
  static async create({ name }) {
    const [result] = await db.execute(
      'INSERT INTO activity_categories (name) VALUES (?)',
      [name]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM activity_categories ORDER BY name');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM activity_categories WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, { name }) {
    const [result] = await db.execute(
      'UPDATE activity_categories SET name = ? WHERE id = ?',
      [name, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM activity_categories WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ActivityCategory;
