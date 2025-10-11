const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

let bot = null;

// Initialize bot with polling for user commands
if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
  // Use polling in development, webhook in production
  const usePolling = process.env.NODE_ENV !== 'production';
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: usePolling });
  console.log(`✅ Telegram Bot initialized (${usePolling ? 'polling' : 'webhook'} mode)`);
  
  // Setup command handlers if polling
  if (usePolling) {
    setupCommandHandlers();
  }
} else {
  console.warn('⚠️  Telegram Bot not configured');
}

// Command handlers for user interactions
function setupCommandHandlers() {
  if (!bot) return;

  // /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'User';
    
    bot.sendMessage(chatId, 
      `👋 Halo ${userName}!\n\n` +
      `Selamat datang di *Pergimmikan Savings Bot*!\n\n` +
      `📱 *Fitur yang tersedia:*\n` +
      `/tabung - Submit tabungan baru\n` +
      `/saldo - Cek saldo tabungan\n` +
      `/riwayat - Lihat riwayat tabungan\n` +
      `/help - Bantuan\n\n` +
      `_Kirim /tabung untuk mulai menabung!_`,
      { parse_mode: 'Markdown' }
    );
  });

  // /help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId,
      `📖 *BANTUAN PERGIMMIKAN SAVINGS BOT*\n\n` +
      `*Cara Submit Tabungan:*\n` +
      `1. Kirim /tabung\n` +
      `2. Kirim jumlah tabungan (contoh: 500000)\n` +
      `3. Kirim keterangan (contoh: Tabungan Gunung Rinjani)\n` +
      `4. Kirim foto bukti transfer\n` +
      `5. Selesai! Tunggu approval admin\n\n` +
      `*Perintah Lain:*\n` +
      `/saldo - Cek saldo\n` +
      `/riwayat - Lihat riwayat\n` +
      `/cancel - Batalkan proses\n\n` +
      `_Butuh bantuan? Hubungi admin_`,
      { parse_mode: 'Markdown' }
    );
  });

  // /tabung command - Start savings submission
  bot.onText(/\/tabung/, (msg) => {
    const chatId = msg.chat.id;
    
    // Store user state (in production, use Redis/Database)
    userStates.set(chatId, { 
      step: 'amount',
      data: {}
    });
    
    bot.sendMessage(chatId,
      `💰 *SUBMIT TABUNGAN BARU*\n\n` +
      `Silakan kirim *jumlah tabungan* yang ingin Anda setorkan.\n\n` +
      `Contoh: 500000\n\n` +
      `_Kirim /cancel untuk membatalkan_`,
      { parse_mode: 'Markdown' }
    );
  });

  // /cancel command
  bot.onText(/\/cancel/, (msg) => {
    const chatId = msg.chat.id;
    userStates.delete(chatId);
    
    bot.sendMessage(chatId,
      `❌ Proses dibatalkan.\n\n` +
      `Kirim /tabung untuk mulai lagi.`
    );
  });

  // /link command - Get Telegram ID for linking
  bot.onText(/\/link/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    const telegramUsername = msg.from.username || msg.from.first_name;
    
    bot.sendMessage(chatId,
      `🔗 *HUBUNGKAN TELEGRAM*\n\n` +
      `Untuk menghubungkan Telegram Anda dengan akun Pergimmikan:\n\n` +
      `📝 *Telegram ID Anda:*\n` +
      `\`${telegramId}\`\n\n` +
      `📱 *Username:* ${telegramUsername}\n\n` +
      `*Cara menghubungkan:*\n` +
      `1. Login ke website Pergimmikan\n` +
      `2. Buka menu Profil/Settings\n` +
      `3. Masukkan Telegram ID di atas\n` +
      `4. Simpan\n\n` +
      `Setelah terhubung, Anda bisa submit tabungan via Telegram dengan /tabung\n\n` +
      `_Copy Telegram ID di atas_`,
      { parse_mode: 'Markdown' }
    );
  });

  // Handle text messages (for multi-step form)
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Skip if it's a command
    if (text && text.startsWith('/')) return;
    
    // Check if user is in a flow
    const userState = userStates.get(chatId);
    if (!userState) return;
    
    try {
      if (userState.step === 'amount') {
        // Validate amount
        const amount = parseFloat(text);
        if (isNaN(amount) || amount <= 0) {
          bot.sendMessage(chatId, '❌ Jumlah tidak valid. Kirim angka yang benar (contoh: 500000)');
          return;
        }
        
        userState.data.amount = amount;
        userState.step = 'description';
        userStates.set(chatId, userState);
        
        bot.sendMessage(chatId,
          `✅ Jumlah: Rp ${amount.toLocaleString('id-ID')}\n\n` +
          `📝 Sekarang kirim *keterangan* tabungan Anda.\n\n` +
          `Contoh: Tabungan untuk Gunung Rinjani`,
          { parse_mode: 'Markdown' }
        );
        
      } else if (userState.step === 'description') {
        userState.data.description = text;
        userState.step = 'receipt';
        userStates.set(chatId, userState);
        
        bot.sendMessage(chatId,
          `✅ Keterangan: ${text}\n\n` +
          `📸 Terakhir, kirim *foto bukti transfer* Anda.\n\n` +
          `_Kirim foto sebagai gambar (bukan file)_`,
          { parse_mode: 'Markdown' }
        );
      }
    } catch (error) {
      console.error('Error handling message:', error);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan. Silakan coba lagi dengan /tabung');
      userStates.delete(chatId);
    }
  });

  // Handle photo uploads
  bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const userState = userStates.get(chatId);
    
    if (!userState || userState.step !== 'receipt') return;
    
    try {
      bot.sendMessage(chatId, '⏳ Memproses tabungan Anda...');
      
      // Get the largest photo
      const photo = msg.photo[msg.photo.length - 1];
      const fileId = photo.file_id;
      
      // Get file info
      const file = await bot.getFile(fileId);
      const photoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      
      // Store submission data
      userState.data.receipt_url = photoUrl;
      userState.data.telegram_user_id = msg.from.id.toString();
      userState.data.telegram_username = msg.from.username || msg.from.first_name;
      
      // Check if user exists in database
      const UserModel = require('../models/user.model');
      const Savings = require('../models/savings.model');
      
      const user = await UserModel.findByTelegramId(userState.data.telegram_user_id);
      
      if (!user) {
        // User not registered
        bot.sendMessage(chatId,
          `❌ *TELEGRAM BELUM TERDAFTAR*\n\n` +
          `Telegram Anda belum terhubung dengan akun Pergimmikan.\n\n` +
          `📝 *Cara mendaftar:*\n` +
          `1. Login ke website Pergimmikan\n` +
          `2. Buka Profil/Settings\n` +
          `3. Hubungkan Telegram dengan ID: \`${userState.data.telegram_user_id}\`\n\n` +
          `_Atau hubungi admin untuk bantuan_`,
          { parse_mode: 'Markdown' }
        );
        
        // Still send to admin for manual processing
        await bot.sendPhoto(TELEGRAM_CHAT_ID, photoUrl, {
          caption: 
            `⚠️ *NEW SAVINGS FROM UNREGISTERED USER*\n\n` +
            `👤 *Telegram User:* ${userState.data.telegram_username}\n` +
            `🆔 *Telegram ID:* ${userState.data.telegram_user_id}\n` +
            `💰 *Amount:* Rp ${userState.data.amount.toLocaleString('id-ID')}\n` +
            `📝 *Description:* ${userState.data.description}\n` +
            `📱 *Via:* Telegram Bot\n\n` +
            `⚠️ *User belum terdaftar di database*\n` +
            `_Manual processing required_`,
          parse_mode: 'Markdown'
        });
        
        userStates.delete(chatId);
        return;
      }
      
      // User found! Save to database
      const savingsId = await Savings.create({
        user_id: user.id,
        amount: userState.data.amount,
        description: userState.data.description,
        receipt_url: photoUrl,
        transaction_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        jenis_transaksi: 'setoran'
      });
      
      // Send notification to admin (text only in development)
      const notifMessage = 
        `🔔 *NEW SAVINGS FROM TELEGRAM*\n\n` +
        `👤 *User:* ${user.full_name || user.username}\n` +
        `📱 *Telegram:* ${userState.data.telegram_username}\n` +
        `💰 *Amount:* Rp ${userState.data.amount.toLocaleString('id-ID')}\n` +
        `📝 *Description:* ${userState.data.description}\n` +
        `🆔 *Transaction ID:* \`${savingsId}\`\n\n` +
        `📝 *Status:* ⏳ *PENDING APPROVAL*`;
      
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (isProduction) {
        // Production: Try to send photo
        try {
          await bot.sendPhoto(TELEGRAM_CHAT_ID, photoUrl, {
            caption: notifMessage,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { 
                    text: '✅ Approve', 
                    callback_data: `approve_${savingsId}` 
                  },
                  { 
                    text: '❌ Reject', 
                    callback_data: `reject_${savingsId}` 
                  }
                ]
              ]
            }
          });
        } catch (photoError) {
          console.warn('⚠️  Failed to send photo:', photoError.message);
          // Fallback to text
          await bot.sendMessage(TELEGRAM_CHAT_ID, notifMessage + `\n\n📸 Receipt URL: ${photoUrl}`, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { 
                    text: '✅ Approve', 
                    callback_data: `approve_${savingsId}` 
                  },
                  { 
                    text: '❌ Reject', 
                    callback_data: `reject_${savingsId}` 
                  }
                ]
              ]
            }
          });
        }
      } else {
        // Development: Send text only
        console.log('⚠️  Development mode: Photo saved locally, sending text notification only');
        await bot.sendMessage(TELEGRAM_CHAT_ID, notifMessage + `\n\n📸 Receipt saved locally\n_(Photo not sent in development mode)_`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { 
                  text: '✅ Approve', 
                  callback_data: `approve_${savingsId}` 
                },
                { 
                  text: '❌ Reject', 
                  callback_data: `reject_${savingsId}` 
                }
              ]
            ]
          }
        });
      }
      
      // Confirm to user
      bot.sendMessage(chatId,
        `✅ *TABUNGAN BERHASIL DIKIRIM!*\n\n` +
        `💰 Jumlah: Rp ${userState.data.amount.toLocaleString('id-ID')}\n` +
        `📝 Keterangan: ${userState.data.description}\n` +
        `🆔 Transaction ID: \`${savingsId}\`\n\n` +
        `⏳ Tabungan Anda sedang menunggu persetujuan admin.\n` +
        `Anda akan mendapat notifikasi setelah disetujui.\n\n` +
        `Terima kasih! 🙏`,
        { parse_mode: 'Markdown' }
      );
      
      // Clear user state
      userStates.delete(chatId);
      
    } catch (error) {
      console.error('Error processing photo:', error);
      bot.sendMessage(chatId, `❌ Gagal memproses tabungan: ${error.message}\n\nSilakan coba lagi dengan /tabung`);
      userStates.delete(chatId);
    }
  });
}

// Store user states (in production, use Redis/Database)
const userStates = new Map();

class TelegramService {
  // Expose bot instance for webhook
  static get bot() {
    return bot;
  }

  /**
   * Send savings notification to admin with receipt image
   */
  static async sendSavingsNotification(data) {
    if (!bot) {
      console.warn('Telegram bot not configured');
      return { success: false, error: 'Bot not configured' };
    }

    const message = `
🔔 *NEW SAVINGS NOTIFICATION*

👤 *User:* ${data.user_name}
💰 *Amount:* Rp ${data.amount.toLocaleString('id-ID')}
🎯 *Journey:* ${data.journey_title}
📅 *Date:* ${new Date().toLocaleString('id-ID', { 
  timeZone: 'Asia/Jakarta',
  dateStyle: 'full',
  timeStyle: 'short'
})}
📱 *Payment:* ${data.payment_method}
🆔 *Transaction ID:* \`${data.transaction_id}\`

📝 *Status:* ⏳ *PENDING APPROVAL*

_Silakan approve atau reject transaksi ini_
    `.trim();

    try {
      // Check if receipt image exists
      if (data.receipt_url) {
        // Build photo URL
        const photoUrl = data.receipt_url.startsWith('http') 
          ? data.receipt_url 
          : `${process.env.FRONTEND_URL || 'http://localhost:5173'}${data.receipt_url}`;
        
        // Check if in production (URL is accessible from internet)
        const isProduction = process.env.NODE_ENV === 'production' || 
                            (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes('localhost'));
        
        if (isProduction) {
          // Production: Send photo
          try {
            await bot.sendPhoto(TELEGRAM_CHAT_ID, photoUrl, {
              caption: message,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    { 
                      text: '✅ Approve', 
                      callback_data: `approve_${data.transaction_id}` 
                    },
                    { 
                      text: '❌ Reject', 
                      callback_data: `reject_${data.transaction_id}` 
                    }
                  ]
                ]
              }
            });
            console.log(`✅ Telegram notification with photo sent for transaction ${data.transaction_id}`);
          } catch (photoError) {
            console.warn('⚠️  Failed to send photo, sending text only:', photoError.message);
            // Fallback: send text only with link
            await bot.sendMessage(TELEGRAM_CHAT_ID, message + `\n\n📸 Receipt: ${photoUrl}`, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    { 
                      text: '✅ Approve', 
                      callback_data: `approve_${data.transaction_id}` 
                    },
                    { 
                      text: '❌ Reject', 
                      callback_data: `reject_${data.transaction_id}` 
                    }
                  ],
                  [
                    {
                      text: '📸 View Receipt',
                      url: photoUrl
                    }
                  ]
                ]
              }
            });
          }
        } else {
          // Development: Send text only (localhost URL not accessible)
          console.log('⚠️  Development mode: Sending text without photo (localhost not accessible from Telegram)');
          await bot.sendMessage(TELEGRAM_CHAT_ID, message + `\n\n📸 Receipt: ${data.receipt_url}\n_(Photo not sent in development mode)_`, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { 
                    text: '✅ Approve', 
                    callback_data: `approve_${data.transaction_id}` 
                  },
                  { 
                    text: '❌ Reject', 
                    callback_data: `reject_${data.transaction_id}` 
                  }
                ]
              ]
            }
          });
          console.log(`✅ Telegram notification sent (without photo) for transaction ${data.transaction_id}`);
        }
      } else {
        // No receipt, send text only
        await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { 
                  text: '✅ Approve', 
                  callback_data: `approve_${data.transaction_id}` 
                },
                { 
                  text: '❌ Reject', 
                  callback_data: `reject_${data.transaction_id}` 
                }
              ]
            ]
          }
        });
        console.log(`✅ Telegram notification sent for transaction ${data.transaction_id}`);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Telegram notification error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send approval confirmation
   */
  static async sendApprovalConfirmation(data) {
    if (!bot) return { success: false };

    const message = `
✅ *SAVINGS APPROVED*

🆔 *Transaction ID:* \`${data.transaction_id}\`
💰 *Amount:* Rp ${data.amount.toLocaleString('id-ID')}
👤 *User:* ${data.user_name}

📝 *Status:* ✅ *APPROVED*
👨‍💼 *Approved by:* ${data.admin_name || 'Admin'}
⏰ *Time:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
    `.trim();

    try {
      await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
        parse_mode: 'Markdown'
      });
      return { success: true };
    } catch (error) {
      console.error('Telegram approval error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send rejection confirmation
   */
  static async sendRejectionConfirmation(data) {
    if (!bot) return { success: false };

    const message = `
❌ *SAVINGS REJECTED*

🆔 *Transaction ID:* \`${data.transaction_id}\`
💰 *Amount:* Rp ${data.amount.toLocaleString('id-ID')}
👤 *User:* ${data.user_name}

📝 *Status:* ❌ *REJECTED*
👨‍💼 *Rejected by:* ${data.admin_name || 'Admin'}
⏰ *Time:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
📋 *Reason:* ${data.reason || 'No reason provided'}
    `.trim();

    try {
      await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
        parse_mode: 'Markdown'
      });
      return { success: true };
    } catch (error) {
      console.error('Telegram rejection error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send test message
   */
  static async sendTestMessage() {
    if (!bot) {
      return { success: false, error: 'Bot not configured' };
    }

    const message = `
🤖 *TELEGRAM BOT TEST*

✅ Bot is working correctly!
📅 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

_This is a test message from Pergimmikan Savings Bot_
    `.trim();

    try {
      await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
        parse_mode: 'Markdown'
      });
      return { success: true, message: 'Test message sent!' };
    } catch (error) {
      console.error('Telegram test error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle callback queries from inline buttons
   */
  static async handleCallback(callbackQuery) {
    if (!bot) return;

    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;

    try {
      if (data.startsWith('approve_')) {
        const transactionId = data.replace('approve_', '');
        
        await bot.editMessageText(
          `✅ *Transaction ${transactionId} APPROVED*\n\n_Processing approval..._`,
          {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown'
          }
        );

        // TODO: Call API to approve transaction
        // This will be implemented in the controller
        
      } else if (data.startsWith('reject_')) {
        const transactionId = data.replace('reject_', '');
        
        await bot.editMessageText(
          `❌ *Transaction ${transactionId} REJECTED*\n\n_Processing rejection..._`,
          {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown'
          }
        );

        // TODO: Call API to reject transaction
        // This will be implemented in the controller
      }

      await bot.answerCallbackQuery(callbackQuery.id, {
        text: 'Processing...'
      });
    } catch (error) {
      console.error('Callback handling error:', error.message);
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: 'Error processing request',
        show_alert: true
      });
    }
  }

  /**
   * Setup webhook for callback buttons
   */
  static setupWebhook(webhookUrl) {
    if (!bot) return;

    bot.setWebHook(`${webhookUrl}/api/telegram/webhook`)
      .then(() => console.log('✅ Telegram webhook set'))
      .catch(err => console.error('❌ Webhook error:', err.message));
  }

  /**
   * Get bot info
   */
  static async getBotInfo() {
    if (!bot) return null;

    try {
      const info = await bot.getMe();
      return info;
    } catch (error) {
      console.error('Get bot info error:', error.message);
      return null;
    }
  }
}

module.exports = TelegramService;
