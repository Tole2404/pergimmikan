const db = require('../config/database');

class TracksAdminController {
  /**
   * Get all tracks (admin)
   * GET /api/admin/tracks
   */
  async getAllTracks(req, res, next) {
    try {
      const [tracks] = await db.query(
        'SELECT * FROM mountain_tracks ORDER BY mountain_id, popularity_rank ASC'
      );
      res.json(tracks);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new track
   * POST /api/admin/tracks
   */
  async createTrack(req, res, next) {
    try {
      const {
        mountain_id,
        track_name,
        basecamp_name,
        basecamp_accommodation_fee,
        difficulty,
        distance_km,
        estimated_hours,
        entrance_fee,
        guide_fee_per_day,
        porter_fee_per_day,
        description,
        is_open,
        popularity_rank
      } = req.body;

      const [result] = await db.query(
        `INSERT INTO mountain_tracks 
        (mountain_id, track_name, basecamp_name, basecamp_accommodation_fee, difficulty, distance_km, 
         estimated_hours, entrance_fee, guide_fee_per_day, porter_fee_per_day, description, is_open, popularity_rank) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mountain_id, track_name, basecamp_name, basecamp_accommodation_fee || 10000, difficulty, distance_km,
          estimated_hours, entrance_fee, guide_fee_per_day || 0, porter_fee_per_day || 0, description, is_open ?? true, popularity_rank || 1
        ]
      );

      res.status(201).json({
        message: 'Track created successfully',
        id: result.insertId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update track
   * PUT /api/admin/tracks/:id
   */
  async updateTrack(req, res, next) {
    try {
      const { id } = req.params;
      const {
        mountain_id,
        track_name,
        basecamp_name,
        basecamp_accommodation_fee,
        difficulty,
        distance_km,
        estimated_hours,
        entrance_fee,
        guide_fee_per_day,
        porter_fee_per_day,
        description,
        is_open,
        popularity_rank
      } = req.body;

      await db.query(
        `UPDATE mountain_tracks SET 
        mountain_id = ?, track_name = ?, basecamp_name = ?, basecamp_accommodation_fee = ?, difficulty = ?, 
        distance_km = ?, estimated_hours = ?, entrance_fee = ?, guide_fee_per_day = ?, porter_fee_per_day = ?, 
        description = ?, is_open = ?, popularity_rank = ?
        WHERE id = ?`,
        [
          mountain_id, track_name, basecamp_name, basecamp_accommodation_fee || 10000, difficulty, distance_km,
          estimated_hours, entrance_fee, guide_fee_per_day || 0, porter_fee_per_day || 0, description, is_open, popularity_rank || 1, id
        ]
      );

      res.json({ message: 'Track updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete track
   * DELETE /api/admin/tracks/:id
   */
  async deleteTrack(req, res, next) {
    try {
      const { id } = req.params;

      await db.query('DELETE FROM mountain_tracks WHERE id = ?', [id]);

      res.json({ message: 'Track deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TracksAdminController();
