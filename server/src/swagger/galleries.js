/**
 * @swagger
 * tags:
 *   name: Galleries
 *   description: API untuk manajemen galeri foto PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Gallery:
 *       type: object
 *       required:
 *         - caption
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik galeri
 *         caption:
 *           type: string
 *           description: Keterangan foto
 *         imageUrl:
 *           type: string
 *           description: URL gambar
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan
 *         author:
 *           type: string
 *           description: Nama pembuat/pengunggah
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *     
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID tag
 *         name:
 *           type: string
 *           description: Nama tag
 */

/**
 * @swagger
 * /api/galleries:
 *   get:
 *     summary: Mendapatkan daftar galeri foto
 *     tags: [Galleries]
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama tag
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan caption
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah maksimum item yang dikembalikan
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Jumlah item yang dilewati (untuk pagination)
 *     responses:
 *       200:
 *         description: Daftar galeri berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total jumlah galeri
 *                 galleries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gallery'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/galleries/tags:
 *   get:
 *     summary: Mendapatkan daftar semua tag (publik)
 *     tags: [Galleries]
 *     responses:
 *       200:
 *         description: Daftar tag berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/galleries/tags/all:
 *   get:
 *     summary: Mendapatkan daftar semua tag (admin)
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar tag berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/galleries/{id}:
 *   get:
 *     summary: Mendapatkan detail galeri berdasarkan ID
 *     tags: [Galleries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID galeri
 *     responses:
 *       200:
 *         description: Detail galeri berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gallery'
 *       404:
 *         description: Galeri tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/galleries:
 *   post:
 *     summary: Menambahkan galeri foto baru
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - caption
 *               - date
 *               - author
 *               - images
 *             properties:
 *               caption:
 *                 type: string
 *                 description: Keterangan foto
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal pengambilan foto (YYYY-MM-DD)
 *               author:
 *                 type: string
 *                 description: Nama pembuat/pengunggah foto
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Foto-foto untuk galeri
 *               tags[]:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array ID tag untuk galeri (gunakan nama field 'tags[]')
 *     responses:
 *       201:
 *         description: Galeri berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/galleries/{id}:
 *   put:
 *     summary: Memperbarui data galeri
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID galeri
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *                 description: Keterangan foto
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal pengambilan foto (YYYY-MM-DD)
 *               author:
 *                 type: string
 *                 description: Nama pembuat/pengunggah foto
 *               tags[]:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array ID tag untuk galeri (gunakan nama field 'tags[]')
 *               keepExistingImages:
 *                 type: string
 *                 enum: ['true']
 *                 description: Set 'true' untuk mempertahankan gambar yang ada (jika tidak upload gambar baru)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Foto-foto baru untuk mengganti yang lama (opsional)
 *     responses:
 *       200:
 *         description: Galeri berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Galeri tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/galleries/{id}:
 *   delete:
 *     summary: Menghapus galeri
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID galeri
 *     responses:
 *       200:
 *         description: Galeri berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Gallery successfully deleted
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Galeri tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/galleries/tags:
 *   post:
 *     summary: Membuat tag baru
 *     tags: [Galleries]
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
 *                 description: Nama tag baru
 *     responses:
 *       201:
 *         description: Tag berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/galleries/tags/{id}:
 *   delete:
 *     summary: Menghapus tag
 *     tags: [Galleries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID tag
 *     responses:
 *       200:
 *         description: Tag berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tag successfully deleted
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Tag tidak ditemukan
 *       500:
 *         description: Server error
 */
