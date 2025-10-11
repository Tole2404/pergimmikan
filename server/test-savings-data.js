require('dotenv').config();
const db = require('./src/config/database');

async function testSavingsData() {
  console.log('🔍 Testing Savings Data...\n');

  try {
    // Test 1: Check if savings table exists
    console.log('1️⃣ Checking savings table...');
    const [tables] = await db.execute("SHOW TABLES LIKE 'savings'");
    if (tables.length === 0) {
      console.log('❌ Table "savings" not found!');
      console.log('   Run this SQL to create table:');
      console.log('   CREATE TABLE savings (...);');
      return;
    }
    console.log('✅ Table "savings" exists\n');

    // Test 2: Check table structure
    console.log('2️⃣ Checking table structure...');
    const [columns] = await db.execute("DESCRIBE savings");
    console.log('Columns:', columns.map(c => c.Field).join(', '));
    console.log('');

    // Test 3: Count total records
    console.log('3️⃣ Counting records...');
    const [count] = await db.execute("SELECT COUNT(*) as total FROM savings");
    console.log(`Total records: ${count[0].total}\n`);

    // Test 4: Get sample data
    console.log('4️⃣ Sample data (first 5 records)...');
    const [samples] = await db.execute(`
      SELECT id, user_id, amount, description, status, created_at 
      FROM savings 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    console.table(samples);

    // Test 5: Check users
    console.log('5️⃣ Checking users...');
    const [users] = await db.execute("SELECT id, username, full_name FROM users LIMIT 5");
    console.log('Sample users:');
    console.table(users);

    // Test 6: Test getUserSavingsSummary for user ID 1
    console.log('6️⃣ Testing getUserSavingsSummary for user_id = 1...');
    try {
      const [summary] = await db.execute(`
        SELECT 
          COALESCE(SUM(CASE WHEN status IN ('approved', 'verified') THEN amount ELSE 0 END), 0) as total_approved,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as total_pending,
          COALESCE(SUM(CASE WHEN status = 'rejected' THEN amount ELSE 0 END), 0) as total_rejected,
          COALESCE(SUM(CASE WHEN status IN ('approved', 'verified') THEN amount ELSE 0 END), 0) as saldo_tersedia
        FROM savings
        WHERE user_id = 1
      `);
      console.log('Summary for user 1:');
      console.table(summary);
    } catch (err) {
      console.log('❌ Error:', err.message);
    }

    // Test 7: Test getUserSavingsHistory for user ID 1
    console.log('7️⃣ Testing getUserSavingsHistory for user_id = 1...');
    try {
      const [history] = await db.execute(`
        SELECT 
          s.*,
          u.username as user_name,
          u.full_name as user_full_name
        FROM savings s
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.user_id = 1
        ORDER BY s.created_at DESC
        LIMIT 10
      `);
      console.log(`Found ${history.length} records for user 1`);
      if (history.length > 0) {
        console.table(history);
      }
    } catch (err) {
      console.log('❌ Error:', err.message);
    }

    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testSavingsData();
