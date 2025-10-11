const db = require('../config/database');

class Legacy {
  static async findAll() {
    const [legacies] = await db.query('SELECT * FROM legacies ORDER BY year ASC');
    return legacies;
  }

  static async findById(id) {
    const [legacy] = await db.query('SELECT * FROM legacies WHERE id = ?', [id]);
    return legacy[0];
  }

  static async create(data) {
    const { year, title, description } = data;
    const [result] = await db.query(
      'INSERT INTO legacies (year, title, description) VALUES (?, ?, ?)',
      [year, title, description]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const { year, title, description } = data;
    await db.query(
      'UPDATE legacies SET year = ?, title = ?, description = ? WHERE id = ?',
      [year, title, description, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM legacies WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Legacy;
