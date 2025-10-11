/**
 * @swagger
 * tags:
 *   name: Legacies
 *   description: API untuk manajemen legacies PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Legacy:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - year
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik legacy
 *         title:
 *           type: string
 *           description: Judul legacy
 *         description:
 *           type: string
 *           description: Deskripsi legacy
 *         year:
 *           type: integer
 *           description: Tahun legacy
 *         imageUrl:
 *           type: string
 *           description: URL gambar legacy
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
 * /api/legacies:
 *   get:
 *     summary: Mendapatkan daftar legacies
 *     tags: [Legacies]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan tahun
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan judul atau deskripsi
 *     responses:
 *       200:
 *         description: Daftar legacies berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Legacy'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/legacies/{id}:
 *   get:
 *     summary: Mendapatkan detail legacy berdasarkan ID
 *     tags: [Legacies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID legacy
 *     responses:
 *       200:
 *         description: Detail legacy berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Legacy'
 *       404:
 *         description: Legacy tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/legacies:
 *   post:
 *     summary: Menambahkan legacy baru
 *     tags: [Legacies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - year
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul legacy
 *               description:
 *                 type: string
 *                 description: Deskripsi legacy
 *               year:
 *                 type: integer
 *                 description: Tahun legacy
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar legacy
 *     responses:
 *       201:
 *         description: Legacy berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/legacies/{id}:
 *   put:
 *     summary: Memperbarui data legacy
 *     tags: [Legacies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID legacy
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul legacy
 *               description:
 *                 type: string
 *                 description: Deskripsi legacy
 *               year:
 *                 type: integer
 *                 description: Tahun legacy
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar legacy baru (opsional)
 *     responses:
 *       200:
 *         description: Legacy berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Legacy tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/legacies/{id}:
 *   delete:
 *     summary: Menghapus legacy
 *     tags: [Legacies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID legacy
 *     responses:
 *       200:
 *         description: Legacy berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Legacy tidak ditemukan
 *       500:
 *         description: Server error
 */
