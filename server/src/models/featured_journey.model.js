const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

class FeaturedJourney {
  // Get all featured journeys
  static async findAll() {
    try {
      const [journeys] = await db.query(`
        SELECT * FROM featured_journeys
        ORDER BY year DESC, month DESC
      `);
      
      return journeys;
    } catch (error) {
      throw error;
    }
  }

  // Get featured journeys for homepage (where featured = true)
  static async findFeatured() {
    try {
      const [journeys] = await db.query(`
        SELECT * FROM featured_journeys
        WHERE featured = true
        ORDER BY year DESC, month DESC
      `);
      
      return journeys;
    } catch (error) {
      throw error;
    }
  }

  // Get featured journey by ID
  static async findById(id) {
    try {
      const [journeys] = await db.query(`
        SELECT * FROM featured_journeys
        WHERE id = ?
      `, [id]);

      if (journeys.length === 0) {
        return null;
      }

      return journeys[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new featured journey
  static async create(data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Ensure required fields are present
      if (!data.title || !data.description || !data.image_path || !data.link) {
        throw new Error('Title, description, image path, and link are required');
      }

      // Insert featured journey
      const query = `
        INSERT INTO featured_journeys (
          title, description, image_path, link, year, month, 
          location, latitude, longitude, duration, difficulty, 
          category, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await connection.query(query, [
        data.title,
        data.description,
        data.image_path,
        data.link,
        data.year,
        data.month,
        data.location,
        data.latitude || null,
        data.longitude || null,
        data.duration || 1,
        data.difficulty || 'Moderate',
        data.category || 'Mountain',
        data.featured !== undefined ? data.featured : true
      ]);

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update featured journey
  static async update(id, data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if journey exists
      const [journeys] = await connection.query(
        'SELECT * FROM featured_journeys WHERE id = ?',
        [id]
      );

      if (journeys.length === 0) {
        return false;
      }

      // Update journey
      const query = `
        UPDATE featured_journeys SET
          title = ?,
          description = ?,
          image_path = ?,
          link = ?,
          year = ?,
          month = ?,
          location = ?,
          latitude = ?,
          longitude = ?,
          duration = ?,
          difficulty = ?,
          category = ?,
          featured = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await connection.query(query, [
        data.title,
        data.description,
        data.image_path,
        data.link,
        data.year,
        data.month,
        data.location,
        data.latitude || null,
        data.longitude || null,
        data.duration || 1,
        data.difficulty || 'Moderate',
        data.category || 'Mountain',
        data.featured !== undefined ? data.featured : true,
        id
      ]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete featured journey
  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if journey exists
      const [journeys] = await connection.query(
        'SELECT * FROM featured_journeys WHERE id = ?',
        [id]
      );

      if (journeys.length === 0) {
        return false;
      }

      // Get image path to delete file
      const journey = journeys[0];
      if (journey.image_path && !journey.image_path.includes('http')) {
        const filePath = path.join(__dirname, '../../public', journey.image_path);
        await fs.unlink(filePath).catch(() => {
          // Ignore errors if file doesn't exist
          console.log(`File ${filePath} not found or cannot be deleted`);
        });
      }

      // Delete journey
      await connection.query('DELETE FROM featured_journeys WHERE id = ?', [id]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Toggle featured status
  static async toggleFeatured(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get current featured status
      const [journeys] = await connection.query(
        'SELECT featured FROM featured_journeys WHERE id = ?',
        [id]
      );

      if (journeys.length === 0) {
        return false;
      }

      const currentStatus = journeys[0].featured;

      // Toggle status
      await connection.query(
        'UPDATE featured_journeys SET featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [!currentStatus, id]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = FeaturedJourney;
