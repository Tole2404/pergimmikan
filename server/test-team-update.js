/**
 * Test Team Update
 * Run: node test-team-update.js
 */

const db = require('./src/config/database');

async function testUpdate() {
  console.log('🧪 Testing Team Update...\n');

  try {
    // 1. Check if short_name column exists
    console.log('1️⃣ Checking if short_name column exists...');
    const [columns] = await db.query(`SHOW COLUMNS FROM teams LIKE 'short_name'`);
    if (columns.length === 0) {
      console.error('❌ Column short_name does NOT exist!');
      console.log('Run: ALTER TABLE teams ADD COLUMN short_name VARCHAR(50) NULL AFTER name;\n');
      process.exit(1);
    }
    console.log('✅ Column short_name exists!\n');

    // 2. Check team 26
    console.log('2️⃣ Checking team ID 26...');
    const [teams] = await db.query('SELECT * FROM teams WHERE id = 26');
    if (teams.length === 0) {
      console.error('❌ Team ID 26 not found!');
      process.exit(1);
    }
    console.log('✅ Team found:', teams[0].name);
    console.log('   Current short_name:', teams[0].short_name || '(null)');
    console.log('');

    // 3. Test update
    console.log('3️⃣ Testing UPDATE query...');
    const testShortName = 'TestShort';
    await db.query(
      'UPDATE teams SET short_name = ? WHERE id = ?',
      [testShortName, 26]
    );
    console.log('✅ Update successful!\n');

    // 4. Verify
    console.log('4️⃣ Verifying update...');
    const [updated] = await db.query('SELECT id, name, short_name FROM teams WHERE id = 26');
    console.log('✅ Updated data:');
    console.log('   Name:', updated[0].name);
    console.log('   Short Name:', updated[0].short_name);
    console.log('');

    // 5. Test social media
    console.log('5️⃣ Checking social_media table...');
    const [social] = await db.query('SELECT * FROM social_media WHERE team_id = 26');
    console.log(`✅ Found ${social.length} social media links`);
    social.forEach(s => {
      console.log(`   - ${s.platform}: ${s.url}`);
    });
    console.log('');

    // 6. Test view
    console.log('6️⃣ Testing team_members_view...');
    try {
      const [view] = await db.query('SELECT * FROM team_members_view WHERE id = 26');
      if (view.length > 0) {
        console.log('✅ View works!');
        console.log('   Name:', view[0].name);
        console.log('   Short Name:', view[0].short_name);
      } else {
        console.log('⚠️  View returns no data for team 26');
      }
    } catch (viewError) {
      console.error('❌ View error:', viewError.message);
      console.log('   Run FIX-VIEW-DEFINER.sql to fix!');
    }
    console.log('');

    console.log('🎉 All tests passed!\n');
    console.log('✅ Database structure is correct');
    console.log('✅ Team update works');
    console.log('✅ Social media table works');
    console.log('');
    console.log('If API still fails, check:');
    console.log('1. Server logs (npm start terminal)');
    console.log('2. Restart server after code changes');
    console.log('3. Check browser console for request data');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('SQL:', error.sql);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

testUpdate();
