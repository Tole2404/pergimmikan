require('dotenv').config();
const { up } = require('./src/migrations/add_journey_coordinates');

async function runMigration() {
  console.log('🗺️  Running Journey Map Migration...\n');
  
  try {
    await up();
    console.log('\n✅ Migration completed successfully!');
    console.log('📋 Journey table is now ready for map coordinates.');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('   1. Update existing journeys with coordinates');
    console.log('   2. Add destination_type to journeys');
    console.log('   3. Start using the Interactive Map!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
