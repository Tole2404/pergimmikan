/**
 * @swagger
 * tags:
 *   name: API Keys
 *   description: Manajemen API keys untuk akses ke API PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     apiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-KEY
 *       description: API key untuk mengakses API PERGIMMIKAN
 *   schemas:
 *     ApiKey:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik API key
 *         name:
 *           type: string
 *           description: Nama deskriptif untuk API key
 *         key:
 *           type: string
 *           description: API key value (hanya ditampilkan saat pembuatan)
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: Daftar izin yang dimiliki API key
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan API key
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal kedaluwarsa API key (opsional)
 *         lastUsed:
 *           type: string
 *           format: date-time
 *           description: Terakhir kali API key digunakan
 *         createdBy:
 *           type: integer
 *           description: ID admin yang membuat API key
 */

/**
 * @swagger
 * /api/admin/api-keys:
 *   get:
 *     summary: Mendapatkan daftar API keys
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar API keys berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ApiKey'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/api-keys:
 *   post:
 *     summary: Membuat API key baru
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama deskriptif untuk API key
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [read, write, delete]
 *                 description: Daftar izin yang dimiliki API key
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Tanggal kedaluwarsa API key (opsional)
 *     responses:
 *       201:
 *         description: API key berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 key:
 *                   type: string
 *                   description: API key value (hanya ditampilkan sekali)
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/api-keys/{id}:
 *   get:
 *     summary: Mendapatkan detail API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID API key
 *     responses:
 *       200:
 *         description: Detail API key berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiKey'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       404:
 *         description: API key tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/api-keys/{id}:
 *   put:
 *     summary: Memperbarui API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama deskriptif untuk API key
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [read, write, delete]
 *                 description: Daftar izin yang dimiliki API key
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Tanggal kedaluwarsa API key (opsional)
 *     responses:
 *       200:
 *         description: API key berhasil diperbarui
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       404:
 *         description: API key tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/api-keys/{id}:
 *   delete:
 *     summary: Menghapus API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID API key
 *     responses:
 *       200:
 *         description: API key berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       404:
 *         description: API key tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/api-keys/{id}/regenerate:
 *   post:
 *     summary: Regenerasi API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID API key
 *     responses:
 *       200:
 *         description: API key berhasil diregenerasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 key:
 *                   type: string
 *                   description: API key value baru (hanya ditampilkan sekali)
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       404:
 *         description: API key tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/verify-api-key:
 *   get:
 *     summary: Memverifikasi API key
 *     tags: [API Keys]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: API key valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: API key tidak valid
 *       500:
 *         description: Server error
 */
