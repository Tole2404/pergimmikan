const db = require('../config/database');

class Team {
  static async create({ name, short_name, role, image_url, description, status, social_media }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Insert team data
      const [teamResult] = await conn.execute(
        'INSERT INTO teams (name, short_name, role, image_url, description, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, short_name || null, role, image_url, description, status]
      );
      const teamId = teamResult.insertId;

      // Insert social media links
      if (social_media) {
        const platforms = ['linkedin', 'github', 'instagram'];
        for (const platform of platforms) {
          if (social_media[platform]) {
            await conn.execute(
              'INSERT INTO social_media (team_id, platform, url) VALUES (?, ?, ?)',
              [teamId, platform, social_media[platform]]
            );
          }
        }
      }

      await conn.commit();
      return teamId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT 
        t.*,
        MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) as linkedin,
        MAX(CASE WHEN sm.platform = 'github' THEN sm.url END) as github,
        MAX(CASE WHEN sm.platform = 'instagram' THEN sm.url END) as instagram
      FROM teams t
      LEFT JOIN social_media sm ON t.id = sm.team_id
      GROUP BY t.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT 
        t.*,
        MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) as linkedin,
        MAX(CASE WHEN sm.platform = 'github' THEN sm.url END) as github,
        MAX(CASE WHEN sm.platform = 'instagram' THEN sm.url END) as instagram
      FROM teams t
      LEFT JOIN social_media sm ON t.id = sm.team_id
      WHERE t.id = ?
      GROUP BY t.id
    `, [id]);
    return rows[0];
  }

  static async update(id, { name, short_name, role, image_url, description, status, social_media }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Update team data
      const updateFields = [];
      const updateValues = [];

      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (short_name !== undefined) {
        updateFields.push('short_name = ?');
        updateValues.push(short_name || null);
      }
      if (role) {
        updateFields.push('role = ?');
        updateValues.push(role);
      }
      if (image_url) {
        updateFields.push('image_url = ?');
        updateValues.push(image_url);
      }
      if (description) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (status) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }

      if (updateFields.length > 0) {
        await conn.execute(
          `UPDATE teams SET ${updateFields.join(', ')} WHERE id = ?`,
          [...updateValues, id]
        );
      }

      // Update social media links
      if (social_media && typeof social_media === 'object') {
        try {
          // Delete existing social media links
          await conn.execute('DELETE FROM social_media WHERE team_id = ?', [id]);

          // Insert new social media links
          const platforms = ['linkedin', 'github', 'instagram'];
          for (const platform of platforms) {
            const url = social_media[platform];
            // Only insert if URL exists and is not empty
            if (url && typeof url === 'string' && url.trim() !== '' && url.toLowerCase() !== 'null') {
              await conn.execute(
                'INSERT INTO social_media (team_id, platform, url) VALUES (?, ?, ?)',
                [parseInt(id), platform, url.trim()]
              );
            }
          }
        } catch (socialError) {
          console.error('Error updating social media:', socialError);
          console.error('Social media data:', social_media);
          console.error('Team ID:', id);
          throw socialError;
        }
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
      
      // Delete social media links first (due to foreign key)
      await conn.execute('DELETE FROM social_media WHERE team_id = ?', [id]);
      
      // Then delete the team
      const [result] = await conn.execute('DELETE FROM teams WHERE id = ?', [id]);
      
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
      SELECT 
        t.*,
        MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) as linkedin,
        MAX(CASE WHEN sm.platform = 'github' THEN sm.url END) as github,
        MAX(CASE WHEN sm.platform = 'instagram' THEN sm.url END) as instagram
      FROM teams t
      LEFT JOIN social_media sm ON t.id = sm.team_id
      WHERE t.name LIKE ? OR t.role LIKE ? OR t.description LIKE ?
      GROUP BY t.id
    `, [searchTerm, searchTerm, searchTerm]);
    return rows;
  }

  static async filterByStatus(status) {
    const [rows] = await db.execute(`
      SELECT 
        t.*,
        MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) as linkedin,
        MAX(CASE WHEN sm.platform = 'github' THEN sm.url END) as github,
        MAX(CASE WHEN sm.platform = 'instagram' THEN sm.url END) as instagram
      FROM teams t
      LEFT JOIN social_media sm ON t.id = sm.team_id
      WHERE t.status = ?
      GROUP BY t.id
    `, [status]);
    return rows;
  }
}

module.exports = Team;
