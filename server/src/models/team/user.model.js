const db = require('../../config/database');
const bcrypt = require('bcryptjs');

class TeamUserModel {
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

  static async validatePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  static async update(id, userData) {
    try {
      // Ambil data user saat ini dulu
      const [currentUser] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (currentUser.length === 0) {
        return false;
      }
      
      // Siapkan data untuk update, gunakan data saat ini sebagai default
      const dataToUpdate = {
        email: userData.email || currentUser[0].email,
        full_name: userData.full_name || currentUser[0].full_name,
        bio: userData.bio !== undefined ? userData.bio : currentUser[0].bio
      };
      
      // Bangun query update
      const [result] = await db.execute(
        'UPDATE users SET email = ?, full_name = ?, bio = ? WHERE id = ?',
        [dataToUpdate.email, dataToUpdate.full_name, dataToUpdate.bio, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to update user: ' + error.message);
    }
  }

  static async updateProfileImage(id, imageUrl) {
    try {
      // Update users table directly for now
      const [result] = await db.execute(
        'UPDATE users SET image_url = ? WHERE id = ?',
        [imageUrl, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to update profile image: ' + error.message);
    }
  }

  static async getProfileImages(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM profile_images WHERE user_id = ? ORDER BY created_at DESC',
        [id]
      );
      return rows;
    } catch (error) {
      throw new Error('Failed to get profile images: ' + error.message);
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

  static async logLogin({ user_id, ip_address, user_agent, status }) {
    try {
      await db.execute(
        'INSERT INTO login_history (user_id, ip_address, user_agent, login_status) VALUES (?, ?, ?, ?)',
        [user_id, ip_address, user_agent, status]
      );
    } catch (error) {
      console.error('Failed to log login:', error);
      // Don't throw error as this is not critical
    }
  }
}

module.exports = TeamUserModel;
