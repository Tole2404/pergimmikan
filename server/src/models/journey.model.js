const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

class Journey {
  static async findAll() {
    try {
      // First get all journeys
      const [journeys] = await db.query(`
        SELECT * FROM journey_years
        ORDER BY year DESC
      `);

      // Then get photos for each journey
      for (const journey of journeys) {
        const [photos] = await db.query(`
          SELECT id, image_src as src, caption
          FROM journey_photos
          WHERE journey_year_id = ?
        `, [journey.id]);
        
        journey.photos = photos;
      }

      return journeys;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      // Get journey by id
      const [journeys] = await db.query(`
        SELECT * FROM journey_years
        WHERE id = ?
      `, [id]);

      if (journeys.length === 0) {
        return null;
      }

      const journey = journeys[0];

      // Get photos for this journey
      const [photos] = await db.query(`
        SELECT id, image_src as src, caption
        FROM journey_photos
        WHERE journey_year_id = ?
      `, [journey.id]);
      
      journey.photos = photos;

      return journey;
    } catch (error) {
      throw error;
    }
  }

  static async findByYear(year) {
    try {
      // Get journey by year
      const [journeys] = await db.query(`
        SELECT * FROM journey_years
        WHERE year = ?
      `, [year]);

      if (journeys.length === 0) {
        return null;
      }

      const journey = journeys[0];

      // Get photos for this journey
      const [photos] = await db.query(`
        SELECT id, image_src as src, caption
        FROM journey_photos
        WHERE journey_year_id = ?
      `, [journey.id]);
      
      journey.photos = photos;

      return journey;
    } catch (error) {
      throw error;
    }
  }

  static async create(journeyData, files) {
    try {
      // Check if journey for this year already exists
      const existingJourney = await this.findByYear(journeyData.year);
      
      if (existingJourney) {
        // Update existing journey
        await this.update(existingJourney.id, journeyData, files);
        return existingJourney.id;
      }

      // Create new journey
      const [result] = await db.query(`
        INSERT INTO journey_years (year, title, description)
        VALUES (?, ?, ?)
      `, [journeyData.year, journeyData.title, journeyData.description]);

      const journeyId = result.insertId;

      // Add photos if any
      if (files && files.length > 0) {
        await this._addPhotos(journeyId, journeyData.year, files, journeyData.captions);
      }

      return journeyId;
    } catch (error) {
      throw error;
    }
  }

  // New method to add a single photo to a journey
  static async addPhoto(journeyId, photoData) {
    try {
      const { file, caption, year } = photoData;
      
      // Insert photo record
      const [result] = await db.query(`
        INSERT INTO journey_photos (journey_year_id, image_src, caption)
        VALUES (?, ?, ?)
      `, [
        journeyId, 
        `/images/journey/${year}/${file.filename}`,
        caption || ''
      ]);
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // New method to update a photo caption
  static async updatePhotoCaption(imageSrc, caption) {
    try {
      await db.query(`
        UPDATE journey_photos
        SET caption = ?
        WHERE image_src = ?
      `, [caption || '', imageSrc]);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async _addPhotos(journeyId, year, files, captions) {
    try {
      // Process each photo
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const caption = captions && captions[i] ? captions[i] : '';

        // Insert photo record
        await db.query(`
          INSERT INTO journey_photos (journey_year_id, image_src, caption)
          VALUES (?, ?, ?)
        `, [
          journeyId, 
          `/images/journey/${year}/${file.filename}`,
          caption
        ]);
      }
    } catch (error) {
      throw error;
    }
  }

  static async update(id, journeyData, files) {
    try {
      // Build dynamic UPDATE query to only update provided fields
      const updates = [];
      const values = [];

      if (journeyData.year !== undefined) {
        updates.push('year = ?');
        values.push(journeyData.year);
      }
      if (journeyData.title !== undefined) {
        updates.push('title = ?');
        values.push(journeyData.title);
      }
      if (journeyData.description !== undefined) {
        updates.push('description = ?');
        values.push(journeyData.description);
      }
      if (journeyData.location !== undefined) {
        updates.push('location = ?');
        values.push(journeyData.location);
      }
      if (journeyData.latitude !== undefined) {
        updates.push('latitude = ?');
        values.push(journeyData.latitude);
      }
      if (journeyData.longitude !== undefined) {
        updates.push('longitude = ?');
        values.push(journeyData.longitude);
      }
      if (journeyData.destination_type !== undefined) {
        updates.push('destination_type = ?');
        values.push(journeyData.destination_type);
      }

      // Only run UPDATE if there are fields to update
      if (updates.length > 0) {
        values.push(id); // Add id for WHERE clause
        const query = `
          UPDATE journey_years
          SET ${updates.join(', ')}
          WHERE id = ?
        `;
        console.log('🔍 UPDATE QUERY:', query);
        console.log('🔍 UPDATE VALUES:', values);
        await db.query(query, values);
        console.log('✅ UPDATE EXECUTED');
      } else {
        console.log('⚠️  No fields to update');
      }

      // Add new photos if any
      if (files && files.length > 0) {
        await this._addPhotos(id, journeyData.year, files, journeyData.captions);
      }

      // Handle existing photos if needed
      if (journeyData.existingPhotos) {
        try {
          const existingPhotos = JSON.parse(journeyData.existingPhotos);
          
          for (const photo of existingPhotos) {
            await db.query(`
              UPDATE journey_photos
              SET caption = ?
              WHERE image_src = ?
            `, [photo.caption || '', photo.src]);
          }
        } catch (e) {
          console.error('Error processing existing photos:', e);
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all photos for a journey
  static async getJourneyPhotos(journeyId) {
    try {
      return await db.query(`
        SELECT id, image_src, caption
        FROM journey_photos
        WHERE journey_year_id = ?
      `, [journeyId]);
    } catch (error) {
      console.error(`Error getting photos for journey ID ${journeyId}:`, error);
      throw error;
    }
  }

  // Delete journey record only (without photos)
  static async deleteJourneyRecord(journeyId) {
    try {
      const [result] = await db.query(`
        DELETE FROM journey_years
        WHERE id = ?
      `, [journeyId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting journey record ID ${journeyId}:`, error);
      throw error;
    }
  }

  // Delete a single photo by ID
  static async deletePhoto(photoId) {
    try {
      // First get the photo details to find the file path
      const [photos] = await db.query(`
        SELECT jp.image_src, jy.year
        FROM journey_photos jp
        JOIN journey_years jy ON jp.journey_year_id = jy.id
        WHERE jp.id = ?
      `, [photoId]);

      if (photos.length === 0) {
        console.error(`Photo with ID ${photoId} not found`);
        return false;
      }

      const photo = photos[0];
      
      // Delete the physical file
      try {
        const imagePath = path.join(
          __dirname, 
          '../../public', 
          photo.image_src
        );
        
        console.log(`Attempting to delete file: ${imagePath}`);
        await fs.unlink(imagePath);
        console.log(`Successfully deleted file: ${imagePath}`);
      } catch (err) {
        console.error(`Failed to delete file for photo ID ${photoId}:`, err);
        // Continue with database deletion even if file deletion fails
      }

      // Delete the database record
      const [result] = await db.query(`
        DELETE FROM journey_photos
        WHERE id = ?
      `, [photoId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error in deletePhoto for ID ${photoId}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Get journey to find the year
      const journey = await this.findById(id);
      
      if (!journey) {
        throw new Error('Journey not found');
      }

      // Get all photos for this journey
      const [photos] = await db.query(`
        SELECT id, image_src
        FROM journey_photos
        WHERE journey_year_id = ?
      `, [id]);

      console.log(`Deleting ${photos.length} photos for journey ID ${id}`);

      // Hapus foto secara bertahap dalam batch kecil
      const BATCH_SIZE = 5; // Proses 5 foto sekaligus
      
      for (let i = 0; i < photos.length; i += BATCH_SIZE) {
        const batch = photos.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(photos.length/BATCH_SIZE)} (${batch.length} photos)`);
        
        // Hapus file foto dalam batch ini
        for (const photo of batch) {
          try {
            // Extract filename from image_src
            const imagePath = path.join(
              __dirname, 
              '../../public', 
              photo.image_src
            );
            
            await fs.unlink(imagePath);
            console.log(`Deleted file: ${photo.image_src}`);
          } catch (err) {
            console.error(`Failed to delete file: ${photo.image_src}`, err);
            // Continue with other deletions even if one fails
          }
        }
        
        // Hapus record foto dalam batch ini dari database
        const photoIds = batch.map(p => p.id);
        if (photoIds.length > 0) {
          await db.query(`
            DELETE FROM journey_photos
            WHERE id IN (${photoIds.map(() => '?').join(',')})
          `, photoIds);
          console.log(`Deleted ${photoIds.length} photo records from database`);
        }
      }

      // Delete journey record
      await db.query(`
        DELETE FROM journey_years
        WHERE id = ?
      `, [id]);
      console.log(`Deleted journey record ID ${id}`);

      return true;
    } catch (error) {
      console.error(`Error in delete journey ID ${id}:`, error);
      throw error;
    }
  }

  // Get all journeys with coordinates for map
  static async findAllWithCoordinates() {
    try {
      const [journeys] = await db.query(`
        SELECT 
          jy.id,
          jy.year,
          jy.title,
          jy.location,
          jy.description,
          jy.latitude,
          jy.longitude,
          jy.destination_type,
          COUNT(jp.id) as photos_count
        FROM journey_years jy
        LEFT JOIN journey_photos jp ON jy.id = jp.journey_year_id
        WHERE jy.latitude IS NOT NULL AND jy.longitude IS NOT NULL
        GROUP BY jy.id
        ORDER BY jy.year DESC
      `);

      // Get sample photos for each journey (max 3) and cover image
      for (const journey of journeys) {
        const [photos] = await db.query(`
          SELECT id, image_src as src, caption
          FROM journey_photos
          WHERE journey_year_id = ?
          LIMIT 3
        `, [journey.id]);
        
        journey.sample_photos = photos;
        // Set cover_image as first photo if available
        journey.cover_image = photos.length > 0 ? photos[0].src : null;
      }

      return journeys;
    } catch (error) {
      throw error;
    }
  }

  // Get map statistics
  static async getMapStatistics() {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(DISTINCT id) as total_destinations,
          COUNT(DISTINCT CASE WHEN destination_type = 'gunung' THEN id END) as total_mountains,
          COUNT(DISTINCT CASE WHEN destination_type = 'pantai' THEN id END) as total_beaches,
          COUNT(DISTINCT CASE WHEN destination_type = 'hutan' THEN id END) as total_forests,
          COUNT(DISTINCT CASE WHEN destination_type = 'air_terjun' THEN id END) as total_waterfalls,
          COUNT(DISTINCT location) as unique_locations
        FROM journey_years
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      `);

      // Get destination type distribution
      const [typeDistribution] = await db.query(`
        SELECT 
          destination_type,
          COUNT(*) as count
        FROM journey_years
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND destination_type IS NOT NULL
        GROUP BY destination_type
        ORDER BY count DESC
      `);

      // Get most visited locations
      const [topLocations] = await db.query(`
        SELECT 
          location,
          destination_type,
          COUNT(*) as visit_count,
          MAX(year) as last_visit
        FROM journey_years
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        GROUP BY location, destination_type
        ORDER BY visit_count DESC, last_visit DESC
        LIMIT 5
      `);

      return {
        summary: stats[0],
        type_distribution: typeDistribution,
        top_locations: topLocations
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Journey;
