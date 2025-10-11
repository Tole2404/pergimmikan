/**
 * @swagger
 * tags:
 *   name: Journeys
 *   description: API untuk manajemen perjalanan (journey) PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Journey:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - year
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik journey
 *         title:
 *           type: string
 *           description: Judul perjalanan
 *         description:
 *           type: string
 *           description: Deskripsi perjalanan
 *         year:
 *           type: integer
 *           description: Tahun perjalanan
 *         location:
 *           type: string
 *           description: Lokasi perjalanan
 *         mapUrl:
 *           type: string
 *           description: URL Google Maps lokasi
 *         photos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/JourneyPhoto'
 *     
 *     JourneyPhoto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID foto
 *         src:
 *           type: string
 *           description: URL gambar
 *         caption:
 *           type: string
 *           description: Keterangan foto
 */

/**
 * @swagger
 * /api/journeys:
 *   get:
 *     summary: Mendapatkan daftar perjalanan
 *     tags: [Journeys]
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
 *         description: Daftar perjalanan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Journey'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/journeys/{id}:
 *   get:
 *     summary: Mendapatkan detail perjalanan berdasarkan ID
 *     tags: [Journeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID perjalanan
 *     responses:
 *       200:
 *         description: Detail perjalanan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journey'
 *       404:
 *         description: Perjalanan tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/featured-journeys:
 *   get:
 *     summary: Mendapatkan daftar perjalanan unggulan
 *     tags: [Journeys]
 *     responses:
 *       200:
 *         description: Daftar perjalanan unggulan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Journey'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/journeys:
 *   post:
 *     summary: Menambahkan perjalanan baru
 *     tags: [Journeys]
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
 *                 description: Judul perjalanan
 *               description:
 *                 type: string
 *                 description: Deskripsi perjalanan
 *               year:
 *                 type: integer
 *                 description: Tahun perjalanan
 *               location:
 *                 type: string
 *                 description: Lokasi perjalanan
 *               mapUrl:
 *                 type: string
 *                 description: URL Google Maps lokasi
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Foto-foto perjalanan
 *               captions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Keterangan untuk setiap foto
 *     responses:
 *       201:
 *         description: Perjalanan berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/journeys/info/{id}:
 *   put:
 *     summary: Memperbarui informasi perjalanan
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID perjalanan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul perjalanan
 *               description:
 *                 type: string
 *                 description: Deskripsi perjalanan
 *               year:
 *                 type: integer
 *                 description: Tahun perjalanan
 *               location:
 *                 type: string
 *                 description: Lokasi perjalanan
 *               mapUrl:
 *                 type: string
 *                 description: URL Google Maps lokasi
 *               photosToDelete:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: ID foto yang akan dihapus
 *     responses:
 *       200:
 *         description: Informasi perjalanan berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Perjalanan tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/journeys/photos/{id}:
 *   post:
 *     summary: Menambahkan foto ke perjalanan
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID perjalanan
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - photos
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Foto-foto perjalanan
 *               captions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Keterangan untuk setiap foto
 *     responses:
 *       201:
 *         description: Foto berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Perjalanan tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/journeys/{id}:
 *   delete:
 *     summary: Menghapus perjalanan
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID perjalanan
 *     responses:
 *       200:
 *         description: Perjalanan berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Perjalanan tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/journeys/photo/{photoId}:
 *   delete:
 *     summary: Menghapus foto dari perjalanan
 *     tags: [Journeys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID foto
 *     responses:
 *       200:
 *         description: Foto berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Foto tidak ditemukan
 *       500:
 *         description: Server error
 */
