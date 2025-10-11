/**
 * @swagger
 * tags:
 *   name: Savings
 *   description: API untuk manajemen tabungan (savings) PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Saving:
 *       type: object
 *       required:
 *         - amount
 *         - date
 *         - description
 *         - jenis_transaksi
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik transaksi tabungan
 *         amount:
 *           type: number
 *           format: float
 *           description: Jumlah uang (dalam Rupiah)
 *         date:
 *           type: string
 *           format: date
 *           description: Tanggal transaksi (YYYY-MM-DD)
 *         description:
 *           type: string
 *           description: Keterangan transaksi
 *         receipt_url:
 *           type: string
 *           description: URL bukti transaksi
 *         jenis_transaksi:
 *           type: string
 *           enum: [setoran, penarikan]
 *           description: Jenis transaksi (setoran atau penarikan)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan record
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir update record
 */

/**
 * @swagger
 * /api/tabungan:
 *   get:
 *     summary: Mendapatkan daftar transaksi tabungan
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jenis
 *         schema:
 *           type: string
 *           enum: [setoran, penarikan, all]
 *         description: Filter berdasarkan jenis transaksi
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transaksi mulai dari tanggal (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transaksi sampai tanggal (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daftar transaksi tabungan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSaldo:
 *                   type: number
 *                   description: Total saldo tabungan
 *                 totalSetoran:
 *                   type: number
 *                   description: Total setoran
 *                 totalPenarikan:
 *                   type: number
 *                   description: Total penarikan
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Saving'
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

// Dokumentasi endpoint GET /api/tabungan/{id} dihapus sesuai permintaan

// Dokumentasi endpoint GET /api/tabungan/saldo dihapus sesuai permintaan

/**
 * @swagger
 * /api/tabungan:
 *   post:
 *     summary: Menambahkan transaksi tabungan baru
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - date
 *               - description
 *               - jenis_transaksi
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Jumlah uang (dalam Rupiah)
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal transaksi (YYYY-MM-DD)
 *               description:
 *                 type: string
 *                 description: Keterangan transaksi
 *               jenis_transaksi:
 *                 type: string
 *                 enum: [setoran, penarikan]
 *                 description: Jenis transaksi
 *               receipt:
 *                 type: string
 *                 format: binary
 *                 description: Bukti transaksi (opsional untuk penarikan)
 *     responses:
 *       201:
 *         description: Transaksi berhasil ditambahkan
 *       400:
 *         description: Data tidak valid atau saldo tidak cukup untuk penarikan
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

// Dokumentasi endpoint PUT /api/tabungan/{id} dihapus sesuai permintaan

// Dokumentasi endpoint DELETE /api/tabungan/{id} dihapus sesuai permintaan
