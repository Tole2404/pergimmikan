require('dotenv').config();
const { up } = require('./src/migrations/create_comments_table');

async function runMigration() {
  console.log('🚀 Running comments & reactions table migration...\n');
  
  try {
    await up();
    console.log('\n✅ Migration completed successfully!');
    console.log('📋 Comments & Reactions tables are ready to use.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
