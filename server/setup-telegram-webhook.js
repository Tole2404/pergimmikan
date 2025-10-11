require('dotenv').config();
const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://pergimmikan.site/api/telegram/webhook';

async function setupWebhook() {
  console.log('🤖 Setting up Telegram Webhook...\n');

  if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found in .env');
    process.exit(1);
  }

  try {
    // Set webhook
    console.log(`📡 Setting webhook to: ${WEBHOOK_URL}`);
    const setWebhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;
    const response = await axios.post(setWebhookUrl, {
      url: WEBHOOK_URL,
      allowed_updates: ['message', 'callback_query']
    });

    if (response.data.ok) {
      console.log('✅ Webhook set successfully!');
      console.log('   URL:', WEBHOOK_URL);
    } else {
      console.log('❌ Failed to set webhook:', response.data);
    }

    // Get webhook info
    console.log('\n📋 Webhook Info:');
    const infoUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const infoResponse = await axios.get(infoUrl);
    console.log(JSON.stringify(infoResponse.data.result, null, 2));

    console.log('\n✅ Setup completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure your server is running');
    console.log('2. Make sure webhook URL is accessible from internet');
    console.log('3. Test by clicking buttons in Telegram');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }

  process.exit(0);
}

setupWebhook();
