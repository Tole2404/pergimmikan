const express = require('express');
const router = express.Router();
const TelegramService = require('../services/telegram.service');
const Savings = require('../models/savings.model');

// Webhook endpoint untuk Telegram callback
router.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    console.log('[Telegram Webhook] Received update:', JSON.stringify(update, null, 2));

    // Handle callback query (button clicks)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data;
      const chatId = callbackQuery.message.chat.id;
      const messageId = callbackQuery.message.message_id;

      console.log('[Telegram Webhook] Callback data:', data);

      // Parse callback data
      if (data.startsWith('approve_')) {
        const transactionId = data.replace('approve_', '');
        console.log('[Telegram Webhook] Approving transaction:', transactionId);

        try {
          // Get transaction
          const savings = await Savings.findById(transactionId);
          
          if (!savings) {
            await TelegramService.bot.editMessageText(
              `❌ Transaction ${transactionId} not found`,
              {
                chat_id: chatId,
                message_id: messageId
              }
            );
            return res.sendStatus(200);
          }

          if (savings.status !== 'pending') {
            await TelegramService.bot.editMessageText(
              `⚠️ Transaction ${transactionId} already processed (${savings.status})`,
              {
                chat_id: chatId,
                message_id: messageId
              }
            );
            return res.sendStatus(200);
          }

          // Approve transaction
          await Savings.updateStatus(transactionId, {
            status: 'approved',
            admin_id: 1, // Default admin ID (bisa diganti)
            admin_notes: 'Approved via Telegram'
          });

          // Update message
          await TelegramService.bot.editMessageText(
            `✅ *TRANSACTION APPROVED*\n\n` +
            `🆔 Transaction ID: \`${transactionId}\`\n` +
            `💰 Amount: Rp ${savings.amount.toLocaleString('id-ID')}\n` +
            `👤 User: ${savings.user_full_name || savings.user_name}\n\n` +
            `📝 Status: ✅ *APPROVED*\n` +
            `⏰ Time: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n` +
            `👨‍💼 Approved via: Telegram Bot`,
            {
              chat_id: chatId,
              message_id: messageId,
              parse_mode: 'Markdown'
            }
          );

          console.log('[Telegram Webhook] Transaction approved:', transactionId);

        } catch (error) {
          console.error('[Telegram Webhook] Error approving:', error);
          await TelegramService.bot.editMessageText(
            `❌ Error approving transaction: ${error.message}`,
            {
              chat_id: chatId,
              message_id: messageId
            }
          );
        }

      } else if (data.startsWith('reject_')) {
        const transactionId = data.replace('reject_', '');
        console.log('[Telegram Webhook] Rejecting transaction:', transactionId);

        try {
          // Get transaction
          const savings = await Savings.findById(transactionId);
          
          if (!savings) {
            await TelegramService.bot.editMessageText(
              `❌ Transaction ${transactionId} not found`,
              {
                chat_id: chatId,
                message_id: messageId
              }
            );
            return res.sendStatus(200);
          }

          if (savings.status !== 'pending') {
            await TelegramService.bot.editMessageText(
              `⚠️ Transaction ${transactionId} already processed (${savings.status})`,
              {
                chat_id: chatId,
                message_id: messageId
              }
            );
            return res.sendStatus(200);
          }

          // Reject transaction
          await Savings.updateStatus(transactionId, {
            status: 'rejected',
            admin_id: 1, // Default admin ID
            admin_notes: 'Rejected via Telegram'
          });

          // Update message
          await TelegramService.bot.editMessageText(
            `❌ *TRANSACTION REJECTED*\n\n` +
            `🆔 Transaction ID: \`${transactionId}\`\n` +
            `💰 Amount: Rp ${savings.amount.toLocaleString('id-ID')}\n` +
            `👤 User: ${savings.user_full_name || savings.user_name}\n\n` +
            `📝 Status: ❌ *REJECTED*\n` +
            `⏰ Time: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n` +
            `👨‍💼 Rejected via: Telegram Bot`,
            {
              chat_id: chatId,
              message_id: messageId,
              parse_mode: 'Markdown'
            }
          );

          console.log('[Telegram Webhook] Transaction rejected:', transactionId);

        } catch (error) {
          console.error('[Telegram Webhook] Error rejecting:', error);
          await TelegramService.bot.editMessageText(
            `❌ Error rejecting transaction: ${error.message}`,
            {
              chat_id: chatId,
              message_id: messageId
            }
          );
        }
      }

      // Answer callback query
      await TelegramService.bot.answerCallbackQuery(callbackQuery.id, {
        text: 'Processing...'
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('[Telegram Webhook] Error:', error);
    res.sendStatus(500);
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Telegram webhook is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
