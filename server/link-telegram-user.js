require('dotenv').config();
const db = require('./src/config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function linkTelegramUser() {
  console.log('🔗 LINK TELEGRAM USER TO ACCOUNT\n');

  try {
    // Show all users
    console.log('📋 Available users:');
    const [users] = await db.execute(`
      SELECT id, username, full_name, email, telegram_id, telegram_username 
      FROM users 
      ORDER BY id
    `);
    
    console.table(users.map(u => ({
      ID: u.id,
      Username: u.username,
      Name: u.full_name,
      Email: u.email,
      'Telegram ID': u.telegram_id || '(not linked)',
      'Telegram Username': u.telegram_username || '(not linked)'
    })));

    // Get user input
    const userId = await question('\n👤 Enter User ID to link: ');
    
    if (!userId || isNaN(userId)) {
      console.log('❌ Invalid User ID');
      process.exit(1);
    }

    // Check if user exists
    const [userCheck] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (userCheck.length === 0) {
      console.log('❌ User not found');
      process.exit(1);
    }

    const user = userCheck[0];
    console.log(`\n✅ User found: ${user.full_name || user.username}`);

    if (user.telegram_id) {
      console.log(`⚠️  User already linked to Telegram ID: ${user.telegram_id}`);
      const overwrite = await question('Do you want to overwrite? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Cancelled');
        process.exit(0);
      }
    }

    // Get Telegram info
    console.log('\n📱 Enter Telegram information:');
    console.log('   (User can get this by sending /link to the bot)');
    
    const telegramId = await question('Telegram ID: ');
    if (!telegramId) {
      console.log('❌ Telegram ID is required');
      process.exit(1);
    }

    const telegramUsername = await question('Telegram Username (optional, e.g., @username): ');

    // Update user
    console.log('\n⏳ Linking Telegram to user...');
    await db.execute(
      'UPDATE users SET telegram_id = ?, telegram_username = ? WHERE id = ?',
      [telegramId, telegramUsername || null, userId]
    );

    // Verify
    const [updated] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    const updatedUser = updated[0];

    console.log('\n✅ Successfully linked!');
    console.log('\n📋 Updated user info:');
    console.table([{
      ID: updatedUser.id,
      Username: updatedUser.username,
      Name: updatedUser.full_name,
      'Telegram ID': updatedUser.telegram_id,
      'Telegram Username': updatedUser.telegram_username
    }]);

    console.log('\n🎉 User can now submit savings via Telegram!');
    console.log('   Tell them to send /tabung to the bot');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run
linkTelegramUser();
