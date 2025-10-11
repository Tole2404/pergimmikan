const db = require('../config/database');
const bcrypt = require('bcryptjs');

class AdminModel {
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM tbl_loginadmin WHERE id = ?',
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
        'SELECT * FROM tbl_loginadmin WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }

  static async validatePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  static async createAdmin(adminData) {
    const { username, password, nama_lengkap, email, role = 'admin' } = adminData;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [result] = await db.execute(
        'INSERT INTO tbl_loginadmin (username, password, nama_lengkap, email, role) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, nama_lengkap, email, role]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Failed to create admin: ' + error.message);
    }
  }

  static async updateAdmin(id, adminData) {
    const { nama_lengkap, email, status } = adminData;
    try {
      const [result] = await db.execute(
        'UPDATE tbl_loginadmin SET nama_lengkap = ?, email = ?, status = ? WHERE id = ?',
        [nama_lengkap, email, status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to update admin: ' + error.message);
    }
  }

  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
      const [result] = await db.execute(
        'UPDATE tbl_loginadmin SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to change password: ' + error.message);
    }
  }
}

module.exports = AdminModel;
