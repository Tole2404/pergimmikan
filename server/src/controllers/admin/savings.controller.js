const Savings = require('../../models/savings.model');
const ApiError = require('../../utils/apiError');
const puppeteer = require('puppeteer-core');

class AdminSavingsController {
  // Get all savings with filters
  async getAllSavings(req, res, next) {
    try {
      console.log('[AdminSavings] Fetching all savings');
      const { status, search, limit = 100, page = 1, sort = 'created_at', order = 'desc' } = req.query;
      const offset = (page - 1) * limit;
      
      let savings;
      if (search) {
        console.log('[AdminSavings] Searching for:', search);
        savings = await Savings.search(search);
      } else {
        console.log('[AdminSavings] Fetching with filters:', { status, limit, offset, sort, order });
        
        // Error handling untuk kasus tabel kosong
        try {
          savings = await Savings.findAll({ 
            status, 
            limit, 
            offset,
            sortBy: sort,
            sortOrder: order.toUpperCase()
          });
        } catch (dbError) {
          console.error('[AdminSavings] Database error:', dbError);
          
          // Jika tabel kosong atau belum ada, kirim array kosong
          savings = [];
        }
      }
      
      console.log('[AdminSavings] Results:', savings ? savings.length : 0, 'records found');
      res.json(savings || []);
    } catch (error) {
      console.error('[AdminSavings] Error in getAllSavings:', error.message);
      next(error);
    }
  }

  // Get savings by ID
  async getSavingsById(req, res, next) {
    try {
      console.log('[AdminSavings] Fetching savings by ID:', req.params.id);
      const savings = await Savings.findById(req.params.id);
      if (!savings) {
        console.log('[AdminSavings] Savings not found:', req.params.id);
        throw new ApiError(404, 'Savings record not found');
      }
      console.log('[AdminSavings] Savings found:', savings);
      res.json(savings);
    } catch (error) {
      console.error('[AdminSavings] Error in getSavingsById:', error.message);
      next(error);
    }
  }

  // Get savings by user ID
  async getUserSavings(req, res, next) {
    try {
      console.log('[AdminSavings] Fetching user savings:', req.params.userId);
      const userId = req.params.userId;
      const summary = await Savings.getUserSavingsSummary(userId);
      const history = await Savings.getUserSavingsHistory(userId, 100);
      
      console.log('[AdminSavings] User savings summary:', summary);
      console.log('[AdminSavings] User savings history:', history);
      res.json({
        summary,
        history
      });
    } catch (error) {
      console.error('[AdminSavings] Error in getUserSavings:', error.message);
      next(error);
    }
  }

  // Verify savings (approve or reject)
  async verifySavings(req, res, next) {
    try {
      console.log('[AdminSavings] Verifying savings:', req.params.id);
      const { status, adminNotes } = req.body;
      const savingsId = req.params.id;
      
      if (!['approved', 'rejected'].includes(status)) {
        console.log('[AdminSavings] Invalid status:', status);
        throw new ApiError(400, 'Status must be either "approved" or "rejected"');
      }
      
      const savings = await Savings.findById(savingsId);
      if (!savings) {
        console.log('[AdminSavings] Savings not found:', savingsId);
        throw new ApiError(404, 'Savings record not found');
      }
      
      if (savings.status !== 'pending') {
        console.log('[AdminSavings] Savings already verified:', savingsId);
        throw new ApiError(400, 'Only pending savings can be verified');
      }
      
      // Get admin ID safely
      const adminId = req.admin?.id || 1; // Default to admin ID 1 if not available
      console.log('[AdminSavings] Admin ID for verification:', adminId);
      
      // Periksa apakah ini adalah penarikan (amount negatif atau jenis_transaksi = penarikan)
      const isPenarikan = savings.jenis_transaksi === 'penarikan' || parseFloat(savings.amount) < 0;
      console.log('[AdminSavings] Is withdrawal:', isPenarikan, 'Amount:', savings.amount, 'Type:', savings.jenis_transaksi);
      
      // Jika ini penarikan dan disetujui, periksa apakah ada bukti pembayaran yang diupload
      let receipt_url = savings.receipt_url;
      if (isPenarikan && status === 'approved' && req.file) {
        // Jika ada file yang diupload, gunakan path file tersebut
        receipt_url = `/images/receipts/${req.file.filename}`;
        console.log('[AdminSavings] Receipt uploaded for withdrawal:', receipt_url);
      }
      
      const updateData = {
        status,
        admin_id: adminId,
        admin_notes: adminNotes || null
      };
      
      // Hanya update receipt_url jika ada file yang diupload
      if (req.file) {
        updateData.receipt_url = receipt_url;
      }
      
      const updated = await Savings.updateStatus(savingsId, updateData);
      
      if (!updated) {
        console.log('[AdminSavings] Failed to update savings status:', savingsId);
        throw new ApiError(500, 'Failed to update savings status');
      }
      
      const updatedSavings = await Savings.findById(savingsId);
      console.log('[AdminSavings] Savings verified:', updatedSavings);
      res.json(updatedSavings);
    } catch (error) {
      console.error('[AdminSavings] Error in verifySavings:', error.message);
      next(error);
    }
  }

  // Delete savings record
  async deleteSavings(req, res, next) {
    try {
      console.log('[AdminSavings] Deleting savings:', req.params.id);
      const deleted = await Savings.delete(req.params.id);
      if (!deleted) {
        console.log('[AdminSavings] Savings not found:', req.params.id);
        throw new ApiError(404, 'Savings record not found');
      }
      console.log('[AdminSavings] Savings deleted:', req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('[AdminSavings] Error in deleteSavings:', error.message);
      next(error);
    }
  }

  // Get savings summary statistics
  async getSavingsSummary(req, res, next) {
    try {
      console.log('[AdminSavings] Fetching savings summary');
      
      // Error handling untuk kasus tabel kosong
      let summary;
      try {
        summary = await Savings.getSummary();
      } catch (dbError) {
        console.error('[AdminSavings] Database error in summary:', dbError);
        
        // Buat dummy summary jika error
        summary = {
          total_approved: 0,
          total_pending: 0,
          total_rejected: 0,
          member_count: 0
        };
      }
      
      console.log('[AdminSavings] Summary:', summary);
      res.json(summary);
    } catch (error) {
      console.error('[AdminSavings] Error in getSavingsSummary:', error.message);
      next(error);
    }
  }

  // Export savings data to PDF using Puppeteer
  async exportToPDF(req, res, next) {
    try {
      // Tangani input dari form submission atau JSON request
      let requestData = req.body;
      if (typeof requestData.exportAll === 'string') {
        // Data dari form submission, konversi tipe
        requestData.exportAll = requestData.exportAll === 'true';
      }
      
      console.log('[Savings Controller] Export to PDF request received:', requestData);
      
      // Periksa apakah request untuk mengekspor semua pengguna
      const exportAll = requestData.exportAll;
      // Jika tidak exportAll, dapatkan userId dan userName
      const userId = exportAll ? null : requestData.userId;
      const userName = requestData.userName || 'User';
      
      let savingsData;
      
      // Menggunakan API yang benar sesuai ORM (Sequelize)
      if (exportAll) {
        // Dapatkan semua data tabungan
        savingsData = await Savings.findAll({ 
          limit: 500,
          order: [['createdAt', 'DESC']]
        });
        
        console.log(`[Savings Controller] Fetched all savings data (${savingsData.length} records) for PDF export`);
      } else {
        // Dapatkan data tabungan untuk pengguna tertentu
        if (Savings.getUserSavingsHistory) {
          // Gunakan fungsi helper jika tersedia
          savingsData = await Savings.getUserSavingsHistory(userId, 500);
        } else {
          // Fallback ke query standar
          savingsData = await Savings.findAll({ 
            where: { user_id: userId },
            limit: 500,
            order: [['createdAt', 'DESC']]
          });
        }
        
        console.log(`[Savings Controller] Fetched savings data for user ${userId} (${savingsData.length} records) for PDF export`);
      }
      
      // Jika tidak ada data tabungan, kembalikan error
      if (!savingsData || savingsData.length === 0) {
        console.log('[Savings Controller] No savings data found, returning error');
        return res.status(404).json({
          status: 'error',
          message: 'Savings record not found'
        });
      }
      
      // PENDEKATAN BARU: Menggunakan Puppeteer untuk membuat PDF
      console.log('[Savings Controller] Initializing puppeteer for PDF generation');
      
      // Buat browser instance
      const isProduction = process.env.NODE_ENV === 'production';
      const executablePath = isProduction 
        ? '/usr/bin/google-chrome' // Path di server Linux, pastikan Chrome terinstall
        : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; // Path di Windows

      const browser = await puppeteer.launch({ 
        headless: true, 
        executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--single-process'
        ]
      });
      
      // Buat halaman baru
      const page = await browser.newPage();
      
      // Format data untuk tabel HTML
      let tableRows = '';
      let totalAmount = 0;
      let verifiedAmount = 0;
      let pendingAmount = 0;
      
      savingsData.forEach(saving => {
        const createdAt = new Date(saving.createdAt || saving.created_at).toLocaleDateString('id-ID');
        const username = saving.user_name || (saving.user ? saving.user.name : `User ${saving.user_id}`);
        const amount = parseFloat(saving.amount || 0);
        const status = saving.status || 'pending';
        const paymentMethod = saving.payment_method || 'Unknown';
        
        tableRows += `
          <tr>
            <td>${createdAt}</td>
            <td>${username}</td>
            <td style="text-align:right">Rp ${amount.toLocaleString('id-ID')}</td>
            <td>${status}</td>
            <td>${paymentMethod}</td>
          </tr>
        `;
        
        // Update totals
        totalAmount += amount;
        if (status === 'verified' || status === 'approved') {
          verifiedAmount += amount;
        } else {
          pendingAmount += amount;
        }
      });
      
      // Membuat HTML
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Laporan Tabungan</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 30px;
              color: #333;
            }
            h1, h2 {
              text-align: center;
              color: #2c3e50;
            }
            .date {
              text-align: right;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .summary {
              margin-top: 30px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 5px;
            }
            .summary h3 {
              margin-top: 0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Laporan Tabungan</h1>
          <h2>${exportAll ? 'Semua Pengguna' : `Pengguna: ${userName}`}</h2>
          <div class="date">Tanggal: ${new Date().toLocaleDateString('id-ID')}</div>
          
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pengguna</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Metode</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          <div class="summary">
            <h3>Ringkasan</h3>
            <p>Total Tabungan: Rp ${totalAmount.toLocaleString('id-ID')}</p>
            <p>Tabungan Terverifikasi: Rp ${verifiedAmount.toLocaleString('id-ID')}</p>
            <p>Tabungan Pending: Rp ${pendingAmount.toLocaleString('id-ID')}</p>
          </div>
        </body>
        </html>
      `;
      
      // Set content dan layout PDF
      await page.setContent(htmlContent);
      
      console.log('[Savings Controller] HTML content set, generating PDF...');
      
      // Buat PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      
      // Tutup browser
      await browser.close();
      
      console.log('[Savings Controller] PDF generated successfully');
      
      // Kirim response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="savings_report_${new Date().toISOString().slice(0,10)}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
      
      console.log('[Savings Controller] PDF sent to client');
    } catch (error) {
      console.error('[Savings Controller] Error exporting to PDF:', error);
      next(error);
    }
  }
}

module.exports = new AdminSavingsController();
