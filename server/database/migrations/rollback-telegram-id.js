require('dotenv').config();
const db = require('../../src/config/database');

async function rollbackTelegramId() {
  console.log('🔄 Rolling back migration: Remove telegram_id from users table...\n');

  try {
    // Check if columns exist
    console.log('1️⃣ Checking if columns exist...');
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME IN ('telegram_id', 'telegram_username')
    `);

    if (columns.length === 0) {
      console.log('⚠️  Columns do not exist. Nothing to rollback.');
      process.exit(0);
    }

    console.log('   Found columns:', columns.map(c => c.COLUMN_NAME).join(', '));

    // Drop index first
    console.log('\n2️⃣ Dropping index idx_telegram_id...');
    try {
      await db.execute(`DROP INDEX idx_telegram_id ON users`);
      console.log('✅ Index dropped');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('⚠️  Index does not exist, skipping...');
      } else {
        console.warn('⚠️  Error dropping index:', error.message);
      }
    }

    // Drop telegram_username column
    if (columns.some(c => c.COLUMN_NAME === 'telegram_username')) {
      console.log('3️⃣ Dropping telegram_username column...');
      await db.execute(`ALTER TABLE users DROP COLUMN telegram_username`);
      console.log('✅ telegram_username column dropped');
    }

    // Drop telegram_id column
    if (columns.some(c => c.COLUMN_NAME === 'telegram_id')) {
      console.log('4️⃣ Dropping telegram_id column...');
      await db.execute(`ALTER TABLE users DROP COLUMN telegram_id`);
      console.log('✅ telegram_id column dropped');
    }

    // Verify rollback
    console.log('\n5️⃣ Verifying rollback...');
    const [verifyColumns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME IN ('telegram_id', 'telegram_username')
    `);

    if (verifyColumns.length === 0) {
      console.log('✅ Rollback verified - columns removed');
    } else {
      console.log('⚠️  Some columns still exist:', verifyColumns.map(c => c.COLUMN_NAME).join(', '));
    }

    console.log('\n✅ Rollback completed successfully!');

  } catch (error) {
    console.error('\n❌ Rollback failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run rollback
rollbackTelegramId();
