require('dotenv').config();
const db = require('./src/config/database');

async function checkUserTelegram() {
  console.log('🔍 Checking User Telegram Data...\n');

  try {
    // Get all users with telegram data
    const [users] = await db.execute(`
      SELECT 
        id, 
        username, 
        full_name, 
        email,
        telegram_id, 
        telegram_username,
        status
      FROM users 
      ORDER BY id
    `);

    console.log('📋 All Users:');
    console.table(users.map(u => ({
      ID: u.id,
      Username: u.username,
      Name: u.full_name,
      Email: u.email,
      'Telegram ID': u.telegram_id || '(not linked)',
      'Telegram Username': u.telegram_username || '(not linked)',
      Status: u.status
    })));

    // Count linked users
    const linkedCount = users.filter(u => u.telegram_id).length;
    console.log(`\n📊 Statistics:`);
    console.log(`   Total users: ${users.length}`);
    console.log(`   Linked to Telegram: ${linkedCount}`);
    console.log(`   Not linked: ${users.length - linkedCount}`);

    // Show linked users
    const linkedUsers = users.filter(u => u.telegram_id);
    if (linkedUsers.length > 0) {
      console.log('\n✅ Users with Telegram linked:');
      linkedUsers.forEach(u => {
        console.log(`   • ${u.full_name || u.username} (ID: ${u.id})`);
        console.log(`     Telegram ID: ${u.telegram_id}`);
        console.log(`     Telegram Username: ${u.telegram_username || '(not set)'}`);
      });
    }

    console.log('\n✅ Check completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

checkUserTelegram();
