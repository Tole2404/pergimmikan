/**
 * @swagger
 * tags:
 *   name: Quotes
 *   description: API untuk manajemen quotes PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Quote:
 *       type: object
 *       required:
 *         - content
 *         - author
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik quote
 *         content:
 *           type: string
 *           description: Isi quote
 *         author:
 *           type: string
 *           description: Penulis quote
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan quote
 */

/**
 * @swagger
 * /api/quotes:
 *   get:
 *     summary: Mendapatkan daftar quotes
 *     tags: [Quotes]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah maksimum quote yang dikembalikan
 *       - in: query
 *         name: random
 *         schema:
 *           type: boolean
 *         description: Jika true, mengembalikan quote secara acak
 *     responses:
 *       200:
 *         description: Daftar quotes berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/quotes/{id}:
 *   get:
 *     summary: Mendapatkan detail quote berdasarkan ID
 *     tags: [Quotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID quote
 *     responses:
 *       200:
 *         description: Detail quote berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       404:
 *         description: Quote tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/quotes/random:
 *   get:
 *     summary: Mendapatkan quote secara acak
 *     tags: [Quotes]
 *     responses:
 *       200:
 *         description: Quote acak berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       404:
 *         description: Tidak ada quote yang tersedia
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/quotes:
 *   post:
 *     summary: Menambahkan quote baru
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - author
 *             properties:
 *               content:
 *                 type: string
 *                 description: Isi quote
 *               author:
 *                 type: string
 *                 description: Penulis quote
 *     responses:
 *       201:
 *         description: Quote berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/quotes/{id}:
 *   put:
 *     summary: Memperbarui data quote
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID quote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Isi quote
 *               author:
 *                 type: string
 *                 description: Penulis quote
 *     responses:
 *       200:
 *         description: Quote berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Quote tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/quotes/{id}:
 *   delete:
 *     summary: Menghapus quote
 *     tags: [Quotes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID quote
 *     responses:
 *       200:
 *         description: Quote berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Quote tidak ditemukan
 *       500:
 *         description: Server error
 */
