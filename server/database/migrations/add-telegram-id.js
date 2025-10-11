require('dotenv').config();
const db = require('../../src/config/database');

async function addTelegramIdToUsers() {
  console.log('🔄 Running migration: Add telegram_id to users table...\n');

  try {
    // Check if columns already exist
    console.log('1️⃣ Checking if columns already exist...');
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME IN ('telegram_id', 'telegram_username')
    `);

    if (columns.length > 0) {
      console.log('⚠️  Columns already exist. Skipping migration.');
      console.log('   Existing columns:', columns.map(c => c.COLUMN_NAME).join(', '));
      process.exit(0);
    }

    // Add telegram_id column
    console.log('2️⃣ Adding telegram_id column...');
    await db.execute(`
      ALTER TABLE users 
      ADD COLUMN telegram_id VARCHAR(50) NULL UNIQUE AFTER email
    `);
    console.log('✅ telegram_id column added');

    // Add telegram_username column
    console.log('3️⃣ Adding telegram_username column...');
    await db.execute(`
      ALTER TABLE users 
      ADD COLUMN telegram_username VARCHAR(100) NULL AFTER telegram_id
    `);
    console.log('✅ telegram_username column added');

    // Add index for faster lookup
    console.log('4️⃣ Adding index for telegram_id...');
    try {
      await db.execute(`
        CREATE INDEX idx_telegram_id ON users(telegram_id)
      `);
      console.log('✅ Index idx_telegram_id created');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⚠️  Index already exists, skipping...');
      } else {
        throw error;
      }
    }

    // Verify columns
    console.log('\n5️⃣ Verifying migration...');
    const [verifyColumns] = await db.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME IN ('telegram_id', 'telegram_username')
      ORDER BY ORDINAL_POSITION
    `);

    console.log('\n📋 Column details:');
    console.table(verifyColumns);

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Link user Telegram ID:');
    console.log('   UPDATE users SET telegram_id = \'YOUR_TELEGRAM_ID\', telegram_username = \'@username\' WHERE id = 1;');
    console.log('\n2. Test with Telegram bot:');
    console.log('   - Send /link to get your Telegram ID');
    console.log('   - Send /tabung to submit savings');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run migration
addTelegramIdToUsers();
