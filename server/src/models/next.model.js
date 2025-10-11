const db = require('../config/database');
const fs = require('fs');
const path = require('path');

class Next {
  /**
   * MIGRATIONS
   */
  static async runMigrations() {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const migrationPath = path.join(__dirname, '..', 'migrations', 'next_tables.sql');
      const sql = fs.readFileSync(migrationPath, 'utf8');
      const statements = sql.split(';').filter(stmt => stmt.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          await conn.execute(statement);
        }
      }

      await conn.commit();
      console.log('Next Adventure tables created successfully');
    } catch (error) {
      await conn.rollback();
      console.error('Error creating Next Adventure tables:', error);
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * DESTINATIONS
   */
  static async createDestination({ name, image_url, description, highlights, accommodation_budget, accommodation_standard, accommodation_luxury, transportation_public, transportation_private, transportation_luxury, food_budget, food_standard, food_luxury }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Insert destination data
      const [destResult] = await conn.execute(
        'INSERT INTO next_destinations (name, image, description) VALUES (?, ?, ?)',
        [name, image_url, description]
      );
      const destinationId = destResult.insertId;

      // Insert highlights
      if (highlights && Array.isArray(highlights)) {
        for (const highlight of highlights) {
          await conn.execute(
            'INSERT INTO next_destination_highlights (destination_id, highlight) VALUES (?, ?)',
            [destinationId, highlight]
          );
        }
      }

      // Insert costs
      await conn.execute(
        `INSERT INTO next_destination_costs (
          destination_id, 
          accommodation_budget, 
          accommodation_standard, 
          accommodation_luxury, 
          transportation_public, 
          transportation_private, 
          transportation_luxury, 
          food_budget, 
          food_standard, 
          food_luxury
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          destinationId,
          accommodation_budget,
          accommodation_standard,
          accommodation_luxury,
          transportation_public,
          transportation_private,
          transportation_luxury,
          food_budget,
          food_standard,
          food_luxury
        ]
      );

      await conn.commit();
      return destinationId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async findAllDestinations() {
    const [destinations] = await db.execute(`
      SELECT 
        d.*,
        GROUP_CONCAT(h.highlight) as highlights,
        c.accommodation_budget,
        c.accommodation_standard,
        c.accommodation_luxury,
        c.transportation_public,
        c.transportation_private,
        c.transportation_luxury,
        c.food_budget,
        c.food_standard,
        c.food_luxury
      FROM next_destinations d
      LEFT JOIN next_destination_highlights h ON d.id = h.destination_id
      LEFT JOIN next_destination_costs c ON d.id = c.destination_id
      GROUP BY d.id
      ORDER BY d.name ASC
    `);

    // Format the data
    return destinations.map(d => ({
      id: d.id,
      name: d.name,
      image: d.image,
      description: d.description,
      created_at: d.created_at,
      updated_at: d.updated_at,
      highlights: d.highlights ? d.highlights.split(',') : [],
      costs: {
        accommodation: {
          BUDGET: d.accommodation_budget,
          STANDARD: d.accommodation_standard,
          LUXURY: d.accommodation_luxury
        },
        transportation: {
          PUBLIC: d.transportation_public,
          PRIVATE: d.transportation_private,
          LUXURY: d.transportation_luxury
        },
        food: {
          budget: d.food_budget,
          standard: d.food_standard,
          luxury: d.food_luxury
        }
      }
    }));
  }

  static async findDestinationById(id) {
    const [destinations] = await db.execute(`
      SELECT 
        d.*,
        GROUP_CONCAT(h.highlight) as highlights,
        c.accommodation_budget,
        c.accommodation_standard,
        c.accommodation_luxury,
        c.transportation_public,
        c.transportation_private,
        c.transportation_luxury,
        c.food_budget,
        c.food_standard,
        c.food_luxury
      FROM next_destinations d
      LEFT JOIN next_destination_highlights h ON d.id = h.destination_id
      LEFT JOIN next_destination_costs c ON d.id = c.destination_id
      WHERE d.id = ?
      GROUP BY d.id
    `, [id]);

    if (!destinations.length) {
      return null;
    }

    const d = destinations[0];
    return {
      id: d.id,
      name: d.name,
      image: d.image,
      description: d.description,
      created_at: d.created_at,
      updated_at: d.updated_at,
      highlights: d.highlights ? d.highlights.split(',') : [],
      costs: {
        accommodation: {
          BUDGET: d.accommodation_budget,
          STANDARD: d.accommodation_standard,
          LUXURY: d.accommodation_luxury
        },
        transportation: {
          PUBLIC: d.transportation_public,
          PRIVATE: d.transportation_private,
          LUXURY: d.transportation_luxury
        },
        food: {
          budget: d.food_budget,
          standard: d.food_standard,
          luxury: d.food_luxury
        }
      }
    };
  }

  static async updateDestination(id, { name, image_url, description, highlights, accommodation_budget, accommodation_standard, accommodation_luxury, transportation_public, transportation_private, transportation_luxury, food_budget, food_standard, food_luxury }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Update destination data
      const updateFields = [];
      const updateValues = [];

      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (image_url) {
        updateFields.push('image = ?');
        updateValues.push(image_url);
      }
      if (description) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }

      if (updateFields.length > 0) {
        await conn.execute(
          `UPDATE next_destinations SET ${updateFields.join(', ')} WHERE id = ?`,
          [...updateValues, id]
        );
      }

      // Update highlights
      if (highlights && Array.isArray(highlights)) {
        // Delete existing highlights
        await conn.execute('DELETE FROM next_destination_highlights WHERE destination_id = ?', [id]);
        
        // Insert new highlights
        for (const highlight of highlights) {
          await conn.execute(
            'INSERT INTO next_destination_highlights (destination_id, highlight) VALUES (?, ?)',
            [id, highlight]
          );
        }
      }

      // Update costs
      const [existingCosts] = await conn.execute(
        'SELECT * FROM next_destination_costs WHERE destination_id = ?',
        [id]
      );

      if (existingCosts.length > 0) {
        // Update existing costs
        await conn.execute(
          `UPDATE next_destination_costs SET 
            accommodation_budget = ?, 
            accommodation_standard = ?, 
            accommodation_luxury = ?, 
            transportation_public = ?, 
            transportation_private = ?, 
            transportation_luxury = ?, 
            food_budget = ?, 
            food_standard = ?, 
            food_luxury = ?
          WHERE destination_id = ?`,
          [
            accommodation_budget,
            accommodation_standard,
            accommodation_luxury,
            transportation_public,
            transportation_private,
            transportation_luxury,
            food_budget,
            food_standard,
            food_luxury,
            id
          ]
        );
      } else {
        // Insert new costs
        await conn.execute(
          `INSERT INTO next_destination_costs (
            destination_id, 
            accommodation_budget, 
            accommodation_standard, 
            accommodation_luxury, 
            transportation_public, 
            transportation_private, 
            transportation_luxury, 
            food_budget, 
            food_standard, 
            food_luxury
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            accommodation_budget,
            accommodation_standard,
            accommodation_luxury,
            transportation_public,
            transportation_private,
            transportation_luxury,
            food_budget,
            food_standard,
            food_luxury
          ]
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

  static async deleteDestination(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      // Delete related data first (foreign keys will handle this automatically)
      const [result] = await conn.execute('DELETE FROM next_destinations WHERE id = ?', [id]);
      
      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * TRANSPORT RATES
   */
  static async createTransport({ destination_name, flight_economy, flight_business, flight_first }) {
    const [result] = await db.execute(
      'INSERT INTO next_transport_from_jakarta (destination_name, flight_economy, flight_business, flight_first) VALUES (?, ?, ?, ?)',
      [destination_name.toUpperCase(), flight_economy, flight_business, flight_first]
    );
    return result.insertId;
  }

  static async findAllTransport() {
    const [rows] = await db.execute('SELECT * FROM next_transport_from_jakarta ORDER BY destination_name ASC');
    return rows;
  }

  static async findTransportById(id) {
    const [rows] = await db.execute('SELECT * FROM next_transport_from_jakarta WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateTransport(id, { destination_name, flight_economy, flight_business, flight_first }) {
    const [result] = await db.execute(
      'UPDATE next_transport_from_jakarta SET destination_name = ?, flight_economy = ?, flight_business = ?, flight_first = ? WHERE id = ?',
      [destination_name.toUpperCase(), flight_economy, flight_business, flight_first, id]
    );
    return result.affectedRows > 0;
  }

  static async deleteTransport(id) {
    const [result] = await db.execute('DELETE FROM next_transport_from_jakarta WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * ACTIVITIES
   */
  static async createActivity({ destination_id, name, cost, type }) {
    const [result] = await db.execute(
      'INSERT INTO next_activities (destination_id, name, cost, type) VALUES (?, ?, ?, ?)',
      [destination_id, name, cost, type || 'basic']
    );
    return result.insertId;
  }

  static async findAllActivities() {
    const [rows] = await db.execute(`
      SELECT a.*, d.name as destination_name 
      FROM next_activities a
      JOIN next_destinations d ON a.destination_id = d.id
      ORDER BY d.name ASC, a.name ASC
    `);
    return rows;
  }

  static async findActivitiesByDestination(destinationId) {
    const [rows] = await db.execute(
      'SELECT * FROM next_activities WHERE destination_id = ? ORDER BY name ASC',
      [destinationId]
    );
    return rows;
  }

  static async findActivityById(id) {
    const [rows] = await db.execute('SELECT * FROM next_activities WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateActivity(id, { name, cost, type }) {
    const [result] = await db.execute(
      'UPDATE next_activities SET name = ?, cost = ?, type = ? WHERE id = ?',
      [name, cost, type || 'basic', id]
    );
    return result.affectedRows > 0;
  }

  static async deleteActivity(id) {
    const [result] = await db.execute('DELETE FROM next_activities WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * SEASONS
   */
  static async createSeason({ destination_id, season_type, months }) {
    const [result] = await db.execute(
      'INSERT INTO next_seasons (destination_id, season_type, months) VALUES (?, ?, ?)',
      [destination_id, season_type, months]
    );
    return result.insertId;
  }

  static async findAllSeasons() {
    const [rows] = await db.execute(`
      SELECT s.*, d.name as destination_name 
      FROM next_seasons s
      JOIN next_destinations d ON s.destination_id = d.id
      ORDER BY d.name ASC, s.season_type ASC
    `);
    return rows;
  }

  static async findSeasonsByDestination(destinationId) {
    const [rows] = await db.execute(
      'SELECT * FROM next_seasons WHERE destination_id = ? ORDER BY season_type ASC',
      [destinationId]
    );
    return rows;
  }

  static async findSeasonById(id) {
    const [rows] = await db.execute('SELECT * FROM next_seasons WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateSeason(id, { season_type, months }) {
    const [result] = await db.execute(
      'UPDATE next_seasons SET season_type = ?, months = ? WHERE id = ?',
      [season_type, months, id]
    );
    return result.affectedRows > 0;
  }

  static async deleteSeason(id) {
    const [result] = await db.execute('DELETE FROM next_seasons WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Next;
