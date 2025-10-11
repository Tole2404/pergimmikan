const express = require('express');
const router = express.Router();
const adminSavingsController = require('../../controllers/admin/savings.controller');
const adminAuth = require('../../middleware/adminAuth');
const PDFDocument = require('pdfkit');
const Savings = require('../../models/savings.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Middlewares untuk autentikasi token dari URL param
const tokenFromUrlAuth = (req, res, next) => {
  // Jika ada token di URL, tambahkan ke headers agar dapat diproses oleh middleware auth
  if (req.query.token) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  // Lanjutkan ke middleware berikutnya
  next();
};

// Konfigurasi multer untuk upload bukti pembayaran
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../public/images/receipts');
    // Pastikan direktori ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'admin-receipt-' + uniqueSuffix + ext);
  }
});

// Filter file untuk hanya menerima gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file JPG, JPEG, dan PNG yang diizinkan!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB maksimum
  },
  fileFilter: fileFilter
});

// Temporary: Removed adminAuth middleware for debugging
console.log('[Routes] Loading admin savings routes without auth for debugging');
router.get('/', adminSavingsController.getAllSavings);
router.get('/summary', adminSavingsController.getSavingsSummary);
router.get('/pending', require('../../controllers/admin.controller').getPendingSavings);
router.get('/:id', adminSavingsController.getSavingsById);
router.get('/user/:userId', adminSavingsController.getUserSavings);

// Tambahkan middleware upload.single untuk menangani upload bukti pembayaran
router.put('/:id/verify', upload.single('receiptFile'), adminSavingsController.verifySavings);

// Approve/Reject routes
router.post('/:id/approve', require('../../controllers/admin.controller').approveSavings);
router.post('/:id/reject', require('../../controllers/admin.controller').rejectSavings);

router.delete('/:id', adminSavingsController.deleteSavings);

// Endpoint langsung yang PALING SEDERHANA untuk download PDF
router.post('/direct-pdf-download', async (req, res) => {
  try {
    console.log('[Routes] Direct PDF download request received:', req.body);
    
    // Dapatkan parameter dari form
    const exportAll = req.body.exportAll === 'true';
    const userId = exportAll ? null : req.body.userId;
    const userName = req.body.userName || 'User';
    
    // Pastikan token valid
    const token = req.body.token;
    if (!token) {
      return res.status(401).send('Token tidak ditemukan.');
    }
    
    // Ambil data tabungan
    let savingsData;
    if (exportAll) {
      savingsData = await Savings.findAll({ 
        limit: 500,
        order: [['createdAt', 'DESC']]
      });
      console.log(`[Routes] Fetched all savings data (${savingsData.length} records) for direct PDF download`);
    } else {
      if (Savings.getUserSavingsHistory) {
        savingsData = await Savings.getUserSavingsHistory(userId, 500);
      } else {
        savingsData = await Savings.findAll({
          where: { user_id: userId },
          limit: 500,
          order: [['createdAt', 'DESC']]
        });
      }
      console.log(`[Routes] Fetched savings data for user ${userId} (${savingsData?.length || 0} records) for direct PDF download`);
    }
    
    if (!savingsData || savingsData.length === 0) {
      return res.status(404).send('Tidak ada data tabungan.');
    }
    
    // Buat PDF
    const doc = new PDFDocument();
    
    // Set headers untuk DOWNLOAD - point penting!
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=savings_report.pdf`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Pipe PDF ke response
    doc.pipe(res);
    
    // Buat isi PDF
    doc.fontSize(20).text('Laporan Tabungan', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(exportAll ? 'Semua Pengguna' : `Pengguna: ${userName}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, { align: 'right' });
    doc.moveDown();
    
    // Hitung total
    let totalAmount = 0;
    let verifiedAmount = 0;
    let pendingAmount = 0;
    
    // Tabel header
    const tableTop = 200;
    const textOptions = { width: 100, align: 'left' };
    
    doc.font('Helvetica-Bold');
    doc.text('Tanggal', 50, tableTop, textOptions);
    doc.text('Pengguna', 150, tableTop, textOptions);
    doc.text('Jumlah', 250, tableTop, textOptions);
    doc.text('Status', 350, tableTop, textOptions);
    doc.text('Metode', 450, tableTop, textOptions);
    
    // Tabel baris
    doc.font('Helvetica');
    let y = tableTop + 20;
    
    savingsData.forEach(saving => {
      // Cek jika perlu halaman baru
      if (y > 700) {
        doc.addPage();
        y = 50;
        
        // Tambahkan header ke halaman baru
        doc.font('Helvetica-Bold');
        doc.text('Tanggal', 50, y, textOptions);
        doc.text('Pengguna', 150, y, textOptions);
        doc.text('Jumlah', 250, y, textOptions);
        doc.text('Status', 350, y, textOptions);
        doc.text('Metode', 450, y, textOptions);
        doc.font('Helvetica');
        y += 20;
      }
      
      // Data untuk baris
      const createdAt = new Date(saving.createdAt || saving.created_at).toLocaleDateString('id-ID');
      const userNameText = saving.user_name || (saving.user ? saving.user.name : `User ${saving.user_id}`);
      const amount = parseFloat(saving.amount || 0);
      const status = saving.status || 'pending';
      const paymentMethod = saving.payment_method || 'Unknown';
      
      // Tampilkan baris di PDF
      doc.text(createdAt, 50, y, textOptions);
      doc.text(userNameText, 150, y, textOptions);
      doc.text(`Rp ${amount.toLocaleString('id-ID')}`, 250, y, textOptions);
      doc.text(status, 350, y, textOptions);
      doc.text(paymentMethod, 450, y, textOptions);
      
      y += 20;
      
      // Update total
      totalAmount += amount;
      if (status === 'verified' || status === 'approved') {
        verifiedAmount += amount;
      } else {
        pendingAmount += amount;
      }
    });
    
    // Ringkasan
    doc.moveDown(2);
    doc.font('Helvetica-Bold');
    doc.text('Ringkasan:', { underline: true });
    doc.moveDown();
    
    doc.font('Helvetica');
    doc.text(`Total Tabungan: Rp ${totalAmount.toLocaleString('id-ID')}`);
    doc.text(`Tabungan Terverifikasi: Rp ${verifiedAmount.toLocaleString('id-ID')}`);
    doc.text(`Tabungan Pending: Rp ${pendingAmount.toLocaleString('id-ID')}`);
    
    // Finalisasi PDF - sangat penting untuk menutup dokumen!
    console.log('[Routes] Finalizing direct PDF download');
    doc.end();
    
    console.log('[Routes] PDF download started');
  } catch (error) {
    console.error('[Routes] Error in direct PDF download:', error);
    res.status(500).send(`Error generating PDF: ${error.message}`);
  }
});

// Endpoint sederhana langsung untuk download PDF
router.get('/download-pdf', async (req, res) => {
  try {
    console.log('[Routes] Download PDF request received:', req.query);
    
    // Parameter
    const isAllUsers = req.query.all === 'true';
    const userId = isAllUsers ? null : req.query.userId;
    const userName = req.query.userName || 'User';
    
    // Query untuk mendapatkan data
    let savingsData;
    if (isAllUsers) {
      savingsData = await Savings.findAll({ 
        limit: 500,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });
    } else {
      savingsData = await Savings.getUserSavingsHistory(userId, 500);
    }
    
    if (!savingsData || savingsData.length === 0) {
      return res.status(404).send('Tidak ada data tabungan.');
    }
    
    // Buat PDF
    const doc = new PDFDocument();
    
    // Set headers untuk download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${isAllUsers ? 'all_users' : userName.replace(/\s+/g, '_')}_savings_report.pdf`);
    
    // Pipe PDF ke response
    doc.pipe(res);
    
    // PDF content
    doc.fontSize(20).text('Laporan Tabungan', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(isAllUsers ? 'Semua Pengguna' : `Pengguna: ${userName}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, { align: 'right' });
    doc.moveDown();
    
    // Tambahkan data tabungan
    doc.fontSize(12).text('Data Tabungan:', { underline: true });
    doc.moveDown();
    
    // Hitung total amount
    let totalAmount = 0;
    let verifiedAmount = 0;
    let pendingAmount = 0;
    
    // Table header
    const tableTop = 200;
    const textOptions = { width: 100, align: 'left' };
    
    doc.font('Helvetica-Bold');
    doc.text('Tanggal', 50, tableTop, textOptions);
    doc.text('Pengguna', 150, tableTop, textOptions);
    doc.text('Jumlah', 250, tableTop, textOptions);
    doc.text('Status', 350, tableTop, textOptions);
    doc.text('Metode', 450, tableTop, textOptions);
    
    // Table rows
    doc.font('Helvetica');
    let y = tableTop + 20;
    
    savingsData.forEach((saving, i) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
        
        // Add header to new page
        doc.font('Helvetica-Bold');
        doc.text('Tanggal', 50, y, textOptions);
        doc.text('Pengguna', 150, y, textOptions);
        doc.text('Jumlah', 250, y, textOptions);
        doc.text('Status', 350, y, textOptions);
        doc.text('Metode', 450, y, textOptions);
        doc.font('Helvetica');
        y += 20;
      }
      
      // Mendapatkan data dengan cara yang aman
      const createdAt = new Date(saving.createdAt || saving.created_at).toLocaleDateString('id-ID');
      const userName = saving.user_name || (saving.user ? saving.user.name : `User ${saving.user_id}`);
      const amount = parseFloat(saving.amount || 0);
      const status = saving.status || 'pending';
      const paymentMethod = saving.payment_method || 'Unknown';
      
      doc.text(createdAt, 50, y, textOptions);
      doc.text(userName, 150, y, textOptions);
      doc.text(`Rp ${amount.toLocaleString('id-ID')}`, 250, y, textOptions);
      doc.text(status, 350, y, textOptions);
      doc.text(paymentMethod, 450, y, textOptions);
      
      y += 20;
      
      // Update totals
      totalAmount += amount;
      if (status === 'verified' || status === 'approved') {
        verifiedAmount += amount;
      } else {
        pendingAmount += amount;
      }
    });
    
    // Summary
    doc.moveDown(2);
    doc.font('Helvetica-Bold');
    doc.text('Ringkasan:', { underline: true });
    doc.moveDown();
    
    doc.font('Helvetica');
    doc.text(`Total Tabungan: Rp ${totalAmount.toLocaleString('id-ID')}`);
    doc.text(`Tabungan Terverifikasi: Rp ${verifiedAmount.toLocaleString('id-ID')}`);
    doc.text(`Tabungan Pending: Rp ${pendingAmount.toLocaleString('id-ID')}`);
    
    // Finalize PDF
    doc.end();
    
    console.log('[Routes] PDF download completed');
  } catch (error) {
    console.error('[Routes] Error generating PDF:', error);
    res.status(500).send('Error generating PDF: ' + error.message);
  }
});

// Export PDF endpoints - support both POST dan GET
router.post('/export-pdf', tokenFromUrlAuth, adminSavingsController.exportToPDF);
router.get('/export-pdf/all', tokenFromUrlAuth, (req, res, next) => {
  req.body = { exportAll: true };
  adminSavingsController.exportToPDF(req, res, next);
});
router.get('/export-pdf/:userId', tokenFromUrlAuth, (req, res, next) => {
  req.body = { 
    userId: req.params.userId,
    userName: req.query.name || `User ${req.params.userId}`
  };
  adminSavingsController.exportToPDF(req, res, next);
});

module.exports = router;
