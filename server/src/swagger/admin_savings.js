/**
 * @swagger
 * tags:
 *   name: AdminSavings
 *   description: API untuk manajemen tabungan oleh admin PERGIMMIKAN
 */

/**
 * @swagger
 * /api/admin/tabungan:
 *   get:
 *     summary: Mendapatkan daftar semua transaksi tabungan
 *     tags: [AdminSavings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar transaksi tabungan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Saving'
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/tabungan/summary:
 *   get:
 *     summary: Mendapatkan ringkasan tabungan
 *     tags: [AdminSavings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ringkasan tabungan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSaldo:
 *                   type: number
 *                   description: Total saldo tabungan seluruh anggota
 *                 totalSetoran:
 *                   type: number
 *                   description: Total setoran
 *                 totalPenarikan:
 *                   type: number
 *                   description: Total penarikan
 *                 verifiedSaldo:
 *                   type: number
 *                   description: Total saldo terverifikasi
 *                 pendingSaldo:
 *                   type: number
 *                   description: Total saldo pending
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/tabungan/{id}:
 *   get:
 *     summary: Mendapatkan detail transaksi tabungan berdasarkan ID
 *     tags: [AdminSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID transaksi tabungan
 *     responses:
 *       200:
 *         description: Detail transaksi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Saving'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Transaksi tidak ditemukan
 *       500:
 *         description: Server error
 */

// Dokumentasi endpoint GET /api/admin/tabungan/user/{userId} dihapus sesuai permintaan

/**
 * @swagger
 * /api/admin/tabungan/{id}/verify:
 *   put:
 *     summary: Memverifikasi transaksi tabungan
 *     tags: [AdminSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID transaksi tabungan
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 description: Status verifikasi transaksi
 *               receiptFile:
 *                 type: string
 *                 format: binary
 *                 description: File bukti transaksi (opsional)
 *     responses:
 *       200:
 *         description: Transaksi berhasil diverifikasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Saving'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Transaksi tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/tabungan/{id}:
 *   delete:
 *     summary: Menghapus transaksi tabungan
 *     tags: [AdminSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID transaksi tabungan
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Transaksi tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/tabungan/export-pdf:
 *   post:
 *     summary: Mengekspor data tabungan ke PDF
 *     tags: [AdminSavings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exportAll:
 *                 type: boolean
 *                 description: Jika true, ekspor semua data tabungan
 *               userId:
 *                 type: integer
 *                 description: ID pengguna untuk ekspor tabungan spesifik user
 *               userName:
 *                 type: string
 *                 description: Nama pengguna untuk header laporan
 *     responses:
 *       200:
 *         description: PDF berhasil digenerate
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/tabungan/export-pdf/all:
 *   get:
 *     summary: Mengekspor semua data tabungan ke PDF
 *     tags: [AdminSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: Token autentikasi (opsional jika menggunakan header Authorization)
 *     responses:
 *       200:
 *         description: PDF berhasil digenerate
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/tabungan/export-pdf/{userId}:
 *   get:
 *     summary: Mengekspor data tabungan pengguna tertentu ke PDF
 *     tags: [AdminSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nama pengguna untuk header laporan
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: Token autentikasi (opsional jika menggunakan header Authorization)
 *     responses:
 *       200:
 *         description: PDF berhasil digenerate
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */
