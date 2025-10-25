const db = require('../config/database');

class EquipmentAdminController {
  /**
   * Get all equipment (admin)
   * GET /api/admin/equipment
   */
  async getAllEquipment(req, res, next) {
    try {
      const [equipment] = await db.query(
        'SELECT * FROM equipment_rental ORDER BY mountain_id, category ASC'
      );
      res.json(equipment);
    } catch (error) {
      console.error('❌ ERROR getting equipment:', error);
      next(error);
    }
  }

  /**
   * Create new equipment
   * POST /api/admin/equipment
   */
  async createEquipment(req, res, next) {
    try {
      const {
        mountain_id,
        equipment_name,
        category,
        price_per_day,
        stock_quantity,
        description,
        is_available
      } = req.body;

      const [result] = await db.query(
        `INSERT INTO equipment_rental 
        (mountain_id, equipment_name, category, price_per_day, stock_quantity, description, is_available) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          mountain_id, equipment_name, category, price_per_day || 0, stock_quantity || 0,
          description, is_available ?? true
        ]
      );

      res.status(201).json({
        message: 'Equipment created successfully',
        id: result.insertId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update equipment
   * PUT /api/admin/equipment/:id
   */
  async updateEquipment(req, res, next) {
    try {
      const { id } = req.params;
      const {
        mountain_id,
        equipment_name,
        category,
        price_per_day,
        stock_quantity,
        description,
        is_available
      } = req.body;

      await db.query(
        `UPDATE equipment_rental SET 
        mountain_id = ?, equipment_name = ?, category = ?, price_per_day = ?,
        stock_quantity = ?, description = ?, is_available = ?
        WHERE id = ?`,
        [
          mountain_id, equipment_name, category, price_per_day || 0,
          stock_quantity || 0, description, is_available, id
        ]
      );

      res.json({ message: 'Equipment updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete equipment
   * DELETE /api/admin/equipment/:id
   */
  async deleteEquipment(req, res, next) {
    try {
      const { id } = req.params;

      await db.query('DELETE FROM equipment_rental WHERE id = ?', [id]);

      res.json({ message: 'Equipment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EquipmentAdminController();
