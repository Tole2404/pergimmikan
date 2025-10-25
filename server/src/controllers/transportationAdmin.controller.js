const db = require('../config/database');

class TransportationAdminController {
  /**
   * Get all transportation routes (admin)
   * GET /api/admin/transportation
   */
  async getAllRoutes(req, res, next) {
    try {
      const [routes] = await db.query(
        'SELECT * FROM transportation_routes ORDER BY mountain_id, from_city ASC'
      );
      res.json(routes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new route
   * POST /api/admin/transportation
   */
  async createRoute(req, res, next) {
    try {
      const {
        mountain_id,
        from_city,
        to_location,
        transport_type,
        distance_km,
        estimated_hours,
        base_price,
        is_roundtrip_available,
        description
      } = req.body;

      const [result] = await db.query(
        `INSERT INTO transportation_routes 
        (mountain_id, from_city, to_location, transport_type, distance_km, estimated_hours, 
         base_price, is_roundtrip_available, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mountain_id, from_city, to_location, transport_type, distance_km, estimated_hours,
          base_price, is_roundtrip_available ?? true, description
        ]
      );
      res.status(201).json({
        message: 'Transportation route created successfully',
        id: result.insertId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update route
{{ ... }}
   */
  async updateRoute(req, res, next) {
    try {
      const { id } = req.params;
      const {
        mountain_id,
        from_city,
        to_location,
        transport_type,
        distance_km,
        estimated_hours,
        base_price,
        is_roundtrip_available,
        description
      } = req.body;

      await db.query(
        `UPDATE transportation_routes SET 
        mountain_id = ?, from_city = ?, to_location = ?, transport_type = ?, distance_km = ?,
        estimated_hours = ?, base_price = ?, is_roundtrip_available = ?, description = ?
        WHERE id = ?`,
        [
          mountain_id, from_city, to_location, transport_type, distance_km, estimated_hours,
          base_price, is_roundtrip_available, description, id
        ]
      );

      res.json({ message: 'Transportation route updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete route
   * DELETE /api/admin/transportation/:id
   */
  async deleteRoute(req, res, next) {
    try {
      const { id } = req.params;

      await db.query('DELETE FROM transportation_routes WHERE id = ?', [id]);

      res.json({ message: 'Transportation route deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransportationAdminController();
