const db = require('../config/database');

const up = async () => {
  try {
    console.log('📍 Adding location column to journey_years table...');
    
    await db.query(`
      ALTER TABLE journey_years 
      ADD COLUMN IF NOT EXISTS location VARCHAR(255) NULL AFTER description
    `);
    
    console.log('✅ Location column added successfully!');
    console.log('');
    console.log('📝 Note: You can now add location to journeys:');
    console.log('   - location: String (e.g., "Gunung Semeru, Jawa Timur")');
    console.log('');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
};

const down = async () => {
  try {
    console.log('🔄 Removing location column from journey_years table...');
    
    await db.query(`
      ALTER TABLE journey_years 
      DROP COLUMN IF EXISTS location
    `);
    
    console.log('✅ Location column removed successfully!');
  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
    throw error;
  }
};

module.exports = { up, down };
