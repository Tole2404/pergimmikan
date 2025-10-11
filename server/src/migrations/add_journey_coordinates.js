const db = require('../config/database');

const up = async () => {
  try {
    console.log('🗺️  Adding coordinates columns to journeys table...');
    
    // Add latitude, longitude, and destination_type columns
    await db.query(`
      ALTER TABLE journey_years 
      ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) NULL,
      ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) NULL,
      ADD COLUMN IF NOT EXISTS destination_type VARCHAR(50) NULL COMMENT 'gunung, pantai, hutan, air_terjun, etc'
    `);
    
    console.log('✅ Coordinates columns added successfully!');
    console.log('');
    console.log('📝 Note: You can now add coordinates to journeys:');
    console.log('   - latitude: Decimal (e.g., -8.1077 for Semeru)');
    console.log('   - longitude: Decimal (e.g., 112.9225 for Semeru)');
    console.log('   - destination_type: gunung, pantai, hutan, air_terjun, gua, danau');
    console.log('');
    
    // Show example update query
    console.log('💡 Example update query:');
    console.log(`
      UPDATE journeys 
      SET latitude = -8.1077, 
          longitude = 112.9225, 
          destination_type = 'gunung' 
      WHERE location LIKE '%Semeru%';
    `);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
};

const down = async () => {
  try {
    console.log('🔄 Removing coordinates columns from journeys table...');
    
    await db.query(`
      ALTER TABLE journey_years 
      DROP COLUMN IF EXISTS latitude,
      DROP COLUMN IF EXISTS longitude,
      DROP COLUMN IF EXISTS destination_type
    `);
    
    console.log('✅ Coordinates columns removed successfully!');
  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
    throw error;
  }
};

module.exports = { up, down };
