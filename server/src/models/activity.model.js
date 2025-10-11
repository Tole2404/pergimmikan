const db = require('../config/database');

class Activity {
  static async create({ title, date, time, location, description, category_id, image_url, status }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.execute(
        'INSERT INTO activities (title, date, time, location, description, category_id, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, date, time, location, description, category_id, image_url, status]
      );

      await conn.commit();
      return result.insertId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT a.*, 
             ac.name as category_name,
             (SELECT COUNT(*) FROM activity_gallery WHERE activity_id = a.id) as gallery_count 
      FROM activities a 
      LEFT JOIN activity_categories ac ON a.category_id = ac.id
      ORDER BY a.date DESC, a.time DESC
    `);
    
    return rows.map(row => ({
      ...row,
      category: {
        id: row.category_id,
        name: row.category_name
      }
    }));
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT a.*, 
             ac.name as category_name
      FROM activities a
      LEFT JOIN activity_categories ac ON a.category_id = ac.id
      WHERE a.id = ?
    `, [id]);

    if (rows[0]) {
      // Ambil foto galeri untuk aktivitas ini
      const [photos] = await db.execute(`
        SELECT id, image_url as src, caption
        FROM activity_gallery
        WHERE activity_id = ?
        ORDER BY id ASC
      `, [id]);
      
      return {
        ...rows[0],
        category: {
          id: rows[0].category_id,
          name: rows[0].category_name
        },
        photos: photos // Tambahkan foto galeri ke objek aktivitas
      };
    }
    return null;
  }

  static async update(id, { title, date, time, location, description, category_id, image_url, status }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const updateFields = [];
      const updateValues = [];

      if (title) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }
      if (date) {
        updateFields.push('date = ?');
        updateValues.push(date);
      }
      if (time) {
        updateFields.push('time = ?');
        updateValues.push(time);
      }
      if (location) {
        updateFields.push('location = ?');
        updateValues.push(location);
      }
      if (description) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (category_id) {
        updateFields.push('category_id = ?');
        updateValues.push(category_id);
      }
      if (image_url) {
        updateFields.push('image_url = ?');
        updateValues.push(image_url);
      }
      if (status) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }

      if (updateFields.length > 0) {
        await conn.execute(
          `UPDATE activities SET ${updateFields.join(', ')} WHERE id = ?`,
          [...updateValues, id]
        );
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Delete gallery images first (due to foreign key)
      await conn.execute('DELETE FROM activity_gallery WHERE activity_id = ?', [id]);
      
      // Then delete the activity
      const [result] = await conn.execute('DELETE FROM activities WHERE id = ?', [id]);
      
      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async search(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await db.execute(`
      SELECT a.*, 
             ac.name as category_name,
             (SELECT COUNT(*) FROM activity_gallery WHERE activity_id = a.id) as gallery_count 
      FROM activities a 
      LEFT JOIN activity_categories ac ON a.category_id = ac.id
      WHERE a.title LIKE ? OR a.description LIKE ? OR a.location LIKE ? OR ac.name LIKE ?
      ORDER BY a.date DESC, a.time DESC
    `, [searchTerm, searchTerm, searchTerm, searchTerm]);
    
    return rows.map(row => ({
      ...row,
      category: {
        id: row.category_id,
        name: row.category_name
      }
    }));
  }

  static async filterByStatus(status) {
    const [rows] = await db.execute(`
      SELECT a.*, 
             ac.name as category_name,
             (SELECT COUNT(*) FROM activity_gallery WHERE activity_id = a.id) as gallery_count 
      FROM activities a 
      LEFT JOIN activity_categories ac ON a.category_id = ac.id
      WHERE a.status = ?
      ORDER BY a.date DESC, a.time DESC
    `, [status]);
    
    return rows.map(row => ({
      ...row,
      category: {
        id: row.category_id,
        name: row.category_name
      }
    }));
  }

  // Gallery methods
  static async addToGallery(activityId, images) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      for (const image of images) {
        await conn.execute(
          'INSERT INTO activity_gallery (activity_id, image_url, caption) VALUES (?, ?, ?)',
          [activityId, image.url, image.caption || null]
        );
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async getGallery(activityId) {
    const [rows] = await db.execute(
      'SELECT * FROM activity_gallery WHERE activity_id = ?',
      [activityId]
    );
    return rows;
  }

  static async deleteFromGallery(imageId) {
    const [result] = await db.execute(
      'DELETE FROM activity_gallery WHERE id = ?',
      [imageId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Activity;
