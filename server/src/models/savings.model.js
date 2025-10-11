const db = require('../config/database');

class Savings {
  // Create new savings transaction (deposit or withdrawal)
  static async create({ user_id, amount, description, receipt_url, transaction_date, status = 'pending', jenis_transaksi = 'setoran' }) {
    const [result] = await db.execute(
      'INSERT INTO savings (user_id, amount, description, receipt_url, transaction_date, status, jenis_transaksi) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, amount, description, receipt_url, transaction_date, status, jenis_transaksi]
    );
    return result.insertId;
  }

  // Find all savings with optional filters
  static async findAll({ status, limit, offset, sortBy, sortOrder } = {}) {
    let query = `
      SELECT 
        s.*,
        u.username as user_name,
        u.full_name as user_full_name,
        a.username as admin_name
      FROM 
        savings s
      LEFT JOIN 
        users u ON s.user_id = u.id
      LEFT JOIN 
        users a ON s.admin_id = a.id
    `;

    const queryParams = [];
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query += ' WHERE s.status = ?';
      queryParams.push(status);
    }

    // Add sorting
    query += ` ORDER BY s.${sortBy || 'created_at'} ${sortOrder || 'DESC'}`;
    
    // Add pagination
    if (limit) {
      query += ' LIMIT ?';
      queryParams.push(parseInt(limit));
      
      if (offset) {
        query += ' OFFSET ?';
        queryParams.push(parseInt(offset));
      }
    }

    const [rows] = await db.execute(query, queryParams);
    return rows;
  }

  // Find savings by ID
  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT 
        s.*,
        u.username as user_name,
        u.full_name as user_full_name,
        a.username as admin_name
      FROM 
        savings s
      LEFT JOIN 
        users u ON s.user_id = u.id
      LEFT JOIN 
        users a ON s.admin_id = a.id
      WHERE 
        s.id = ?
    `, [id]);
    return rows[0];
  }

  // Get savings by user ID
  static async findByUserId(userId, { status, limit } = {}) {
    let query = `
      SELECT 
        s.*,
        u.username as user_name,
        u.full_name as user_full_name,
        a.username as admin_name
      FROM 
        savings s
      LEFT JOIN 
        users u ON s.user_id = u.id
      LEFT JOIN 
        users a ON s.admin_id = a.id
      WHERE 
        s.user_id = ?
    `;

    const queryParams = [userId];
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query += ' AND s.status = ?';
      queryParams.push(status);
    }

    // Add sorting and limit
    query += ' ORDER BY s.created_at DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      queryParams.push(parseInt(limit));
    }

    const [rows] = await db.execute(query, queryParams);
    return rows;
  }

  // Update savings status and notes
  static async updateStatus(id, { status, admin_id, admin_notes, receipt_url }) {
    let query = 'UPDATE savings SET status = ?, admin_id = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP';
    const params = [status, admin_id, admin_notes];
    
    // Jika ada receipt_url, tambahkan ke query update
    if (receipt_url) {
      query += ', receipt_url = ?';
      params.push(receipt_url);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  // Delete savings entry
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM savings WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Search savings by user name or description
  static async search(searchTerm) {
    const term = `%${searchTerm}%`;
    const [rows] = await db.execute(`
      SELECT 
        s.*,
        u.username as user_name,
        u.full_name as user_full_name,
        a.username as admin_name
      FROM 
        savings s
      LEFT JOIN 
        users u ON s.user_id = u.id
      LEFT JOIN 
        users a ON s.admin_id = a.id
      WHERE 
        u.username LIKE ? OR 
        u.full_name LIKE ? OR 
        s.description LIKE ?
      ORDER BY s.created_at DESC
    `, [term, term, term]);
    return rows;
  }

  // Get summary statistics
  static async getSummary() {
    const [rows] = await db.execute(`
      SELECT 
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_approved,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
        SUM(CASE WHEN status = 'rejected' THEN amount ELSE 0 END) as total_rejected,
        COUNT(DISTINCT user_id) as member_count
      FROM 
        savings
    `);
    return rows[0];
  }

  // Get user savings summary using the stored procedure
  static async getUserSavingsSummary(userId) {
    try {
      const [rows] = await db.execute('CALL GetMemberSavings(?)', [userId]);
      return rows[0][0];
    } catch (error) {
      console.error('[Savings Model] Stored procedure error, using fallback query:', error.message);
      // Fallback: use simple query
      const [rows] = await db.execute(`
        SELECT 
          COALESCE(SUM(CASE WHEN status IN ('approved', 'verified') THEN amount ELSE 0 END), 0) as total_approved,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as total_pending,
          COALESCE(SUM(CASE WHEN status = 'rejected' THEN amount ELSE 0 END), 0) as total_rejected,
          COALESCE(SUM(CASE WHEN status IN ('approved', 'verified') THEN amount ELSE 0 END), 0) as saldo_tersedia
        FROM savings
        WHERE user_id = ?
      `, [userId]);
      return rows[0];
    }
  }

  // Menghitung saldo tersedia pengguna tanpa stored procedure
  static async hitungSaldoTersedia(userId) {
    const [rows] = await db.execute(`
      SELECT 
        SUM(CASE WHEN status = 'approved' OR status = 'verified' THEN amount ELSE 0 END) as saldo_tersedia
      FROM 
        savings
      WHERE 
        user_id = ?
    `, [userId]);
    
    return parseFloat(rows[0].saldo_tersedia || 0);
  }

  // Get user savings history using the stored procedure
  static async getUserSavingsHistory(userId, limit = 10) {
    try {
      const [rows] = await db.execute('CALL GetMemberSavingsHistory(?, ?)', [userId, limit]);
      return rows[0];
    } catch (error) {
      console.error('[Savings Model] Stored procedure error, using fallback query:', error.message);
      // Fallback: use simple query
      return await this.findByUserId(userId, { limit });
    }
  }
}

module.exports = Savings;
