require('dotenv').config();
const NotificationHelper = require('./src/utils/notificationHelper');
const User = require('./src/models/user.model');

async function testNotification() {
  console.log('🧪 Testing Notification System...\n');
  
  try {
    // Get all users
    const users = await User.findAll();
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 Please create a user account first.');
      process.exit(1);
    }
    
    console.log(`✅ Found ${users.length} user(s) in database:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (ID: ${user.id})`);
    });
    
    console.log('\n📤 Sending test notification to all users...');
    
    // Send test notification
    const success = await NotificationHelper.sendToAllUsers({
      type: NotificationHelper.TYPES.SYSTEM,
      title: '🎉 Notification System Test',
      message: 'This is a test notification! Your notification system is working perfectly. Bell icon should show badge now.',
      link: '/'
    });
    
    if (success) {
      console.log('✅ Test notification sent successfully!');
      console.log('\n📋 Next steps:');
      console.log('   1. Refresh your browser (F5)');
      console.log('   2. Check the bell icon 🔔 in navbar');
      console.log('   3. You should see a badge with number 1');
      console.log('   4. Click the bell to see the notification');
      console.log('\n🎯 Notification system is ready to use!');
    } else {
      console.log('❌ Failed to send test notification');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testNotification();
