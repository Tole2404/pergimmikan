require('dotenv').config();
const { up } = require('./src/migrations/create_notifications_table');

async function runMigration() {
  console.log('🚀 Running notification table migration...\n');
  
  try {
    await up();
    console.log('\n✅ Migration completed successfully!');
    console.log('📋 Notifications table is ready to use.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
