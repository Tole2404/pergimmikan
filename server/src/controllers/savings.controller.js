const Savings = require('../models/savings.model');
const ApiError = require('../utils/apiError');
const NotificationHelper = require('../utils/notificationHelper');
const TelegramService = require('../services/telegram.service');

class SavingsController {
  // Get user's savings
  async getUserSavings(req, res, next) {
    try {
      const userId = req.user.id;
      console.log('[Savings] Getting savings for user:', userId);
      
      // Get summary with error handling
      let summary = null;
      try {
        summary = await Savings.getUserSavingsSummary(userId);
      } catch (err) {
        console.error('[Savings] Error getting summary:', err.message);
        // Return default summary if error
        summary = {
          total_savings: 0,
          total_approved: 0,
          total_pending: 0,
          total_rejected: 0
        };
      }
      
      // Get history with error handling
      let history = [];
      try {
        history = await Savings.getUserSavingsHistory(userId);
      } catch (err) {
        console.error('[Savings] Error getting history:', err.message);
        // Return empty array if error
        history = [];
      }
      
      console.log('[Savings] Summary:', summary);
      console.log('[Savings] History count:', history.length);
      
      res.json({
        summary: summary || {},
        history: history || [],
        data: history || []
      });
    } catch (error) {
      console.error('[Savings] Error in getUserSavings:', error);
      next(error);
    }
  }

  // Submit new savings deposit
  async submitDeposit(req, res, next) {
    try {
      const { amount, description, transaction_date } = req.body;
      const user_id = req.user.id;
      const receipt_url = req.file ? `/images/receipts/${req.file.filename}` : null;

      if (!receipt_url) {
        throw new ApiError(400, 'Receipt image is required');
      }

      if (!amount || isNaN(parseFloat(amount))) {
        throw new ApiError(400, 'Valid amount is required');
      }

      const savingsId = await Savings.create({
        user_id,
        amount: parseFloat(amount),
        description,
        receipt_url,
        transaction_date: transaction_date || (() => {
          // Gunakan zona waktu Asia/Jakarta
          const now = new Date();
          const jakartaDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
          return jakartaDate.toISOString().split('T')[0];
        })(),
        jenis_transaksi: 'setoran' // Tambahkan jenis transaksi
      });

      // Send response immediately with basic data (don't wait for findById)
      res.status(201).json({
        id: savingsId,
        user_id,
        amount: parseFloat(amount),
        description,
        receipt_url,
        status: 'pending',
        jenis_transaksi: 'setoran',
        created_at: new Date().toISOString()
      });
      
      // Send notifications asynchronously (in background)
      setImmediate(() => {
        // Send notification to user
        NotificationHelper.notifySavingsUpdate(user_id, parseFloat(amount), 'deposit')
          .catch(err => console.error('Failed to send notification:', err));
        
        // Send Telegram notification to admin with receipt
        TelegramService.sendSavingsNotification({
          user_name: req.user.full_name || req.user.username,
          amount: parseFloat(amount),
          journey_title: description || 'Tabungan Umum',
          payment_method: 'Upload Bukti Transfer',
          transaction_id: savingsId,
          receipt_url: receipt_url // Include receipt URL
        }).catch(err => console.error('Telegram notification failed:', err));
      });
    } catch (error) {
      next(error);
    }
  }

  // Submit withdrawal (penarikan dana)
  async submitPenarikan(req, res, next) {
    try {
      const { jumlah, keterangan, tanggal_transaksi } = req.body;
      const id_pengguna = req.user.id;

      if (!jumlah || isNaN(parseFloat(jumlah))) {
        throw new ApiError(400, 'Jumlah penarikan harus valid');
      }

      // Periksa saldo pengguna menggunakan metode baru
      const saldoTersedia = await Savings.hitungSaldoTersedia(id_pengguna);
      
      console.log(`[Penarikan] User ID: ${id_pengguna}, Jumlah: ${jumlah}, Saldo tersedia: ${saldoTersedia}`);

      if (parseFloat(jumlah) > saldoTersedia) {
        throw new ApiError(400, `Saldo tidak mencukupi untuk penarikan sebesar ini. Saldo tersedia: ${saldoTersedia}`);
      }

      // Untuk penarikan, gunakan nilai default untuk receipt_url
      // Buat placeholder receipt untuk penarikan
      const receipt_url = '/images/receipts/withdrawal-placeholder.png';

      const savingsId = await Savings.create({
        user_id: id_pengguna,
        amount: -parseFloat(jumlah), // Nilai negatif untuk penarikan
        description: keterangan || 'Penarikan dana',
        receipt_url, // Gunakan placeholder untuk penarikan
        transaction_date: tanggal_transaksi || (() => {
          // Gunakan zona waktu Asia/Jakarta
          const now = new Date();
          const jakartaDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
          return jakartaDate.toISOString().split('T')[0];
        })(),
        status: 'pending', // Default status pending, perlu verifikasi admin
        jenis_transaksi: 'penarikan'
      });

      const newWithdrawal = await Savings.findById(savingsId);
      res.status(201).json(newWithdrawal);
    } catch (error) {
      next(error);
    }
  }

  // Get user's savings history
  async getSavingsHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const history = await Savings.getUserSavingsHistory(userId, limit);
      
      res.json({ data: history });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SavingsController();
