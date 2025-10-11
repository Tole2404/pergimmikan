require('dotenv').config();
const db = require('./src/config/database');

async function checkNotifications() {
  console.log('🔍 Checking Notifications in Database...\n');
  
  try {
    // Check if table exists
    const [tables] = await db.execute("SHOW TABLES LIKE 'notifications'");
    
    if (tables.length === 0) {
      console.log('❌ Notifications table does not exist!');
      console.log('💡 Run: node run-notification-migration.js');
      process.exit(1);
    }
    
    console.log('✅ Notifications table exists\n');
    
    // Check all notifications
    const [notifications] = await db.execute(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10'
    );
    
    console.log(`📊 Total notifications: ${notifications.length}\n`);
    
    if (notifications.length === 0) {
      console.log('⚠️  No notifications found in database!');
      console.log('\n💡 To create test notification, run:');
      console.log('   node test-notification.js');
    } else {
      console.log('📋 Recent notifications:');
      console.log('─'.repeat(80));
      notifications.forEach((notif, index) => {
        console.log(`${index + 1}. [${notif.is_read ? '✓' : '○'}] ${notif.title}`);
        console.log(`   User ID: ${notif.user_id} | Type: ${notif.type}`);
        console.log(`   Message: ${notif.message.substring(0, 60)}...`);
        console.log(`   Created: ${notif.created_at}`);
        console.log('─'.repeat(80));
      });
    }
    
    // Check users
    const [users] = await db.execute('SELECT id, username FROM users');
    console.log(`\n👥 Total users: ${users.length}`);
    if (users.length > 0) {
      console.log('Users:');
      users.forEach(user => {
        console.log(`   - ${user.username} (ID: ${user.id})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkNotifications();
