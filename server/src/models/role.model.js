const db = require('../config/database');

class RoleModel {
  static async findAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM roles ORDER BY id ASC');
      return rows;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM roles WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async findByName(name) {
    try {
      const [rows] = await db.execute('SELECT * FROM roles WHERE name = ?', [name]);
      return rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async create({ name, description }) {
    try {
      const [result] = await db.execute(
        'INSERT INTO roles (name, description) VALUES (?, ?)',
        [name, description]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Failed to create role: ' + error.message);
    }
  }

  static async update(id, { name, description }) {
    try {
      const [result] = await db.execute(
        'UPDATE roles SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to update role: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM roles WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to delete role: ' + error.message);
    }
  }

  static async countUsers(roleId) {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as count FROM users WHERE role_id = ?',
        [roleId]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error('Failed to count users: ' + error.message);
    }
  }
}

module.exports = RoleModel;
