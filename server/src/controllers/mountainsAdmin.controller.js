const db = require('../config/database');

class MountainsAdminController {
  /**
   * Get all mountains (admin)
   * GET /api/admin/mountains
   */
  async getAllMountains(req, res, next) {
    try {
      const [mountains] = await db.query(
        'SELECT * FROM mountains ORDER BY created_at DESC'
      );
      res.json(mountains);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new mountain
   * POST /api/admin/mountains
   */
  async createMountain(req, res, next) {
    try {
      const {
        name,
        province,
        elevation,
        difficulty,
        typical_duration_days,
        description,
        best_months,
        image_url,
        is_active
      } = req.body;

      const [result] = await db.query(
        `INSERT INTO mountains 
        (name, province, elevation, difficulty, typical_duration_days, description, best_months, image_url, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, province, elevation, difficulty, typical_duration_days, description, best_months, image_url, is_active ?? true
        ]
      );

      res.status(201).json({
        message: 'Mountain created successfully',
        id: result.insertId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update mountain
   * PUT /api/admin/mountains/:id
   */
  async updateMountain(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        province,
        elevation,
        difficulty,
        typical_duration_days,
        description,
        best_months,
        image_url,
        is_active
      } = req.body;

      await db.query(
        `UPDATE mountains SET 
        name = ?, province = ?, elevation = ?, difficulty = ?, typical_duration_days = ?,
        description = ?, best_months = ?, image_url = ?, is_active = ?
        WHERE id = ?`,
        [
          name, province, elevation, difficulty, typical_duration_days, description, best_months, image_url, is_active, id
        ]
      );

      res.json({ message: 'Mountain updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete mountain
   * DELETE /api/admin/mountains/:id
   */
  async deleteMountain(req, res, next) {
    try {
      const { id } = req.params;

      // Check if mountain has related data
      const [tracks] = await db.query('SELECT COUNT(*) as count FROM mountain_tracks WHERE mountain_id = ?', [id]);
      
      if (tracks[0].count > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete mountain with existing tracks. Delete tracks first.' 
        });
      }

      await db.query('DELETE FROM mountains WHERE id = ?', [id]);

      res.json({ message: 'Mountain deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MountainsAdminController();
