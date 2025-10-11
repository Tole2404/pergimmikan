const db = require('../config/database');
const crypto = require('crypto');

class ApiKeyModel {
  // Membuat tabel api_keys jika belum ada
  static async createTable() {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS tbl_api_keys (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          api_key VARCHAR(255) NOT NULL UNIQUE,
          permissions JSON NOT NULL,
          expires_at DATETIME NULL,
          last_used DATETIME NULL,
          created_by INT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES tbl_loginadmin(id) ON DELETE CASCADE
        )
      `);
      console.log('API Keys table checked/created');
    } catch (error) {
      console.error('Error creating API Keys table:', error);
      throw new Error('Failed to create API Keys table: ' + error.message);
    }
  }

  // Mendapatkan semua API keys
  static async findAll() {
    try {
      const [rows] = await db.execute(`
        SELECT ak.*, la.username as creator_name 
        FROM tbl_api_keys ak
        LEFT JOIN tbl_loginadmin la ON ak.created_by = la.id
        ORDER BY ak.created_at DESC
      `);
      
      // Parse permissions JSON
      return rows.map(row => ({
        ...row,
        permissions: JSON.parse(row.permissions)
      }));
    } catch (error) {
      throw new Error('Failed to get API keys: ' + error.message);
    }
  }

  // Mendapatkan API key berdasarkan ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT ak.*, la.username as creator_name 
        FROM tbl_api_keys ak
        LEFT JOIN tbl_loginadmin la ON ak.created_by = la.id
        WHERE ak.id = ?
      `, [id]);
      
      if (rows.length === 0) return null;
      
      // Parse permissions JSON
      return {
        ...rows[0],
        permissions: JSON.parse(rows[0].permissions)
      };
    } catch (error) {
      throw new Error('Failed to get API key: ' + error.message);
    }
  }

  // Mendapatkan API key berdasarkan key value
  static async findByKey(key) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM tbl_api_keys WHERE api_key = ?',
        [key]
      );
      
      if (rows.length === 0) return null;
      
      // Parse permissions JSON
      return {
        ...rows[0],
        permissions: JSON.parse(rows[0].permissions)
      };
    } catch (error) {
      throw new Error('Failed to get API key: ' + error.message);
    }
  }

  // Membuat API key baru
  static async create(data) {
    const { name, permissions = ['read'], expiresAt, createdBy } = data;
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    try {
      const [result] = await db.execute(
        'INSERT INTO tbl_api_keys (name, api_key, permissions, expires_at, created_by) VALUES (?, ?, ?, ?, ?)',
        [name, apiKey, JSON.stringify(permissions), expiresAt, createdBy]
      );
      
      return {
        id: result.insertId,
        name,
        key: apiKey,
        permissions,
        expiresAt,
        createdBy
      };
    } catch (error) {
      throw new Error('Failed to create API key: ' + error.message);
    }
  }

  // Memperbarui API key
  static async update(id, data) {
    const { name, permissions, expiresAt } = data;
    
    try {
      // Dapatkan data API key yang ada
      const existingApiKey = await this.findById(id);
      if (!existingApiKey) {
        throw new Error('API key not found');
      }
      
      const updatedName = name || existingApiKey.name;
      const updatedPermissions = permissions || existingApiKey.permissions;
      const updatedExpiresAt = expiresAt !== undefined ? expiresAt : existingApiKey.expires_at;
      
      await db.execute(
        'UPDATE tbl_api_keys SET name = ?, permissions = ?, expires_at = ? WHERE id = ?',
        [updatedName, JSON.stringify(updatedPermissions), updatedExpiresAt, id]
      );
      
      return {
        id,
        name: updatedName,
        permissions: updatedPermissions,
        expiresAt: updatedExpiresAt
      };
    } catch (error) {
      throw new Error('Failed to update API key: ' + error.message);
    }
  }

  // Regenerasi API key
  static async regenerate(id) {
    const newKey = crypto.randomBytes(32).toString('hex');
    
    try {
      // Dapatkan data API key yang ada
      const existingApiKey = await this.findById(id);
      if (!existingApiKey) {
        throw new Error('API key not found');
      }
      
      await db.execute(
        'UPDATE tbl_api_keys SET api_key = ? WHERE id = ?',
        [newKey, id]
      );
      
      return {
        id,
        name: existingApiKey.name,
        key: newKey
      };
    } catch (error) {
      throw new Error('Failed to regenerate API key: ' + error.message);
    }
  }

  // Menghapus API key
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM tbl_api_keys WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Failed to delete API key: ' + error.message);
    }
  }

  // Update last used timestamp
  static async updateLastUsed(id) {
    try {
      await db.execute(
        'UPDATE tbl_api_keys SET last_used = NOW() WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Failed to update last used timestamp:', error);
      // Tidak throw error karena ini bukan operasi kritis
    }
  }
}

module.exports = ApiKeyModel;
