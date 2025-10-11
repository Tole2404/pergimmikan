/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: API untuk manajemen aktivitas PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - time
 *         - location
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik aktivitas
 *         title:
 *           type: string
 *           description: Judul aktivitas
 *         date:
 *           type: string
 *           format: date
 *           description: Tanggal aktivitas (YYYY-MM-DD)
 *         time:
 *           type: string
 *           description: Waktu aktivitas
 *         location:
 *           type: string
 *           description: Lokasi aktivitas
 *         description:
 *           type: string
 *           description: Deskripsi aktivitas
 *         imageUrl:
 *           type: string
 *           description: URL gambar utama aktivitas
 *         status:
 *           type: string
 *           enum: [upcoming, completed]
 *           description: Status aktivitas
 *         categoryId:
 *           type: integer
 *           description: ID kategori aktivitas
 *         category:
 *           $ref: '#/components/schemas/ActivityCategory'
 *         gallery:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ActivityGallery'
 *     
 *     ActivityCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID kategori
 *         name:
 *           type: string
 *           description: Nama kategori
 *     
 *     ActivityGallery:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID foto
 *         imageUrl:
 *           type: string
 *           description: URL gambar
 *         caption:
 *           type: string
 *           description: Keterangan foto
 */

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Mendapatkan daftar aktivitas
 *     tags: [Activities]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, completed, all]
 *         description: Filter berdasarkan status aktivitas
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan ID kategori
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan judul atau deskripsi
 *     responses:
 *       200:
 *         description: Daftar aktivitas berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/activities/categories:
 *   get:
 *     summary: Mendapatkan daftar kategori aktivitas
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivityCategory'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Mendapatkan detail aktivitas berdasarkan ID
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID aktivitas
 *     responses:
 *       200:
 *         description: Detail aktivitas berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
 *       404:
 *         description: Aktivitas tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/activities:
 *   post:
 *     summary: Menambahkan aktivitas baru
 *     tags: [Activities]
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
 *               - date
 *               - time
 *               - location
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul aktivitas
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal aktivitas (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 description: Waktu aktivitas
 *               location:
 *                 type: string
 *                 description: Lokasi aktivitas
 *               description:
 *                 type: string
 *                 description: Deskripsi aktivitas
 *               status:
 *                 type: string
 *                 enum: [upcoming, completed]
 *                 description: Status aktivitas
 *               category_id:
 *                 type: integer
 *                 description: ID kategori aktivitas
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar utama aktivitas
 *     responses:
 *       201:
 *         description: Aktivitas berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/activities/{id}:
 *   put:
 *     summary: Memperbarui data aktivitas
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID aktivitas
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul aktivitas
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal aktivitas (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 description: Waktu aktivitas
 *               location:
 *                 type: string
 *                 description: Lokasi aktivitas
 *               description:
 *                 type: string
 *                 description: Deskripsi aktivitas
 *               status:
 *                 type: string
 *                 enum: [upcoming, completed]
 *                 description: Status aktivitas
 *               category_id:
 *                 type: integer
 *                 description: ID kategori aktivitas
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar utama aktivitas
 *     responses:
 *       200:
 *         description: Aktivitas berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Aktivitas tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/activities/{id}:
 *   delete:
 *     summary: Menghapus aktivitas
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID aktivitas
 *     responses:
 *       200:
 *         description: Aktivitas berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Aktivitas tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/activities/{id}/gallery:
 *   post:
 *     summary: Menambahkan foto ke galeri aktivitas
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID aktivitas
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Foto-foto untuk galeri
 *               captions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Keterangan untuk setiap foto
 *     responses:
 *       201:
 *         description: Foto berhasil ditambahkan ke galeri
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Aktivitas tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/activities/gallery/{photoId}:
 *   delete:
 *     summary: Menghapus foto dari galeri aktivitas
 *     tags: [Activities]
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
