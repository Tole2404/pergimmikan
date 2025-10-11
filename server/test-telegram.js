require('dotenv').config();
const TelegramService = require('./src/services/telegram.service');

async function testTelegram() {
  console.log('🤖 Testing Telegram Bot...\n');

  // Test 1: Send test message
  console.log('📤 Sending test message...');
  const testResult = await TelegramService.sendTestMessage();
  console.log('Result:', testResult);
  console.log('');

  // Test 2: Send savings notification without receipt
  console.log('📤 Sending savings notification (without receipt)...');
  const notifResult = await TelegramService.sendSavingsNotification({
    user_name: 'John Doe',
    amount: 500000,
    journey_title: 'Gunung Rinjani 2025',
    payment_method: 'Bank Transfer',
    transaction_id: 'TRX-TEST-001'
  });
  console.log('Result:', notifResult);
  console.log('');

  // Test 3: Send savings notification with receipt
  console.log('📤 Sending savings notification (with receipt)...');
  const notifWithPhotoResult = await TelegramService.sendSavingsNotification({
    user_name: 'Jane Smith',
    amount: 750000,
    journey_title: 'Pantai Bali 2025',
    payment_method: 'Upload Bukti Transfer',
    transaction_id: 'TRX-TEST-002',
    receipt_url: 'https://via.placeholder.com/600x400.png?text=Bukti+Transfer' // Test image
  });
  console.log('Result:', notifWithPhotoResult);
  console.log('');

  // Test 3: Get bot info
  console.log('ℹ️  Getting bot info...');
  const botInfo = await TelegramService.getBotInfo();
  if (botInfo) {
    console.log('Bot Name:', botInfo.first_name);
    console.log('Bot Username:', `@${botInfo.username}`);
    console.log('Bot ID:', botInfo.id);
  }

  console.log('\n✅ Test completed!');
  process.exit(0);
}

testTelegram().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
