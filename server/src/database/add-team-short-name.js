/**
 * Add short_name column to teams table
 * Run: node src/database/add-team-short-name.js
 */

const db = require('../config/database');

async function addShortName() {
  console.log('🚀 Adding short_name column to teams table...\n');

  try {
    // Check if column already exists
    const [columns] = await db.query(`
      SHOW COLUMNS FROM teams LIKE 'short_name'
    `);

    if (columns.length > 0) {
      console.log('ℹ️  Column short_name already exists!\n');
      process.exit(0);
    }

    // Add short_name column
    console.log('📊 Adding short_name column...');
    await db.query(`
      ALTER TABLE teams 
      ADD COLUMN short_name VARCHAR(50) NULL AFTER name
    `);
    console.log('✅ Column short_name added!\n');

    // Show result
    const [teams] = await db.query('SELECT id, name, short_name FROM teams LIMIT 5');
    console.log('📊 Sample data:');
    teams.forEach(t => {
      console.log(`   - ${t.name} (short: ${t.short_name || 'not set'})`);
    });

    console.log('\n🎉 Migration completed successfully!\n');
    console.log('✅ Column added: short_name VARCHAR(50)');
    console.log('✅ Position: After name column');
    console.log('\n📝 You can now add short names in Team Management!');
    console.log('   Example: "Muhammad Rizki" → short_name: "Rizki"\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration
addShortName();
