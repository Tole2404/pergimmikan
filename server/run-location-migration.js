require('dotenv').config();
const { up } = require('./src/migrations/add_location_column');

async function runMigration() {
  console.log('📍 Running Location Column Migration...\n');
  
  try {
    await up();
    console.log('\n✅ Migration completed successfully!');
    console.log('📋 Journey table now has location column.');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('   1. Update journeys with location data');
    console.log('   2. Run coordinate update script');
    console.log('   3. View the map!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
