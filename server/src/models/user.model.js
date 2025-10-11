const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async findByUsername(username) {
    try {
      const [rows] = await db.execute(
        'SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async findByTelegramId(telegramId) {
    try {
      const [rows] = await db.execute(
        'SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.telegram_id = ?',
        [telegramId]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async updateTelegramId(userId, telegramId, telegramUsername) {
    try {
      const [result] = await db.execute(
        'UPDATE users SET telegram_id = ?, telegram_username = ? WHERE id = ?',
        [telegramId, telegramUsername, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.execute(
        'SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.id DESC'
      );
      return rows.map(user => {
        delete user.password;
        return user;
      });
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async validatePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  static async create(userData) {
    const { username, password, email, full_name, role_id, status = 'active', image_url } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [result] = await db.execute(
        'INSERT INTO users (username, password, email, full_name, role_id, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, hashedPassword, email, full_name, role_id, status, image_url]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Failed to create user: ' + error.message);
    }
  }

  static async update(id, userData) {
    const { username, email, full_name, role_id, status, image_url } = userData;
    try {
      let query, params;
      
      if (image_url) {
        query = 'UPDATE users SET username = ?, email = ?, full_name = ?, role_id = ?, status = ?, image_url = ? WHERE id = ?';
        params = [username, email, full_name, role_id, status, image_url, id];
      } else {
        query = 'UPDATE users SET username = ?, email = ?, full_name = ?, role_id = ?, status = ? WHERE id = ?';
        params = [username, email, full_name, role_id, status, id];
      }
      
      const [result] = await db.execute(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to update user: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to delete user: ' + error.message);
    }
  }

  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
      const [result] = await db.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to change password: ' + error.message);
    }
  }

  static async getAllRoles() {
    try {
      const [rows] = await db.execute('SELECT * FROM roles ORDER BY id ASC');
      return rows;
    } catch (error) {
      throw new Error('Failed to fetch roles: ' + error.message);
    }
  }
}

module.exports = UserModel;
