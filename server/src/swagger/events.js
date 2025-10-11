/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API untuk manajemen events PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - location
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik event
 *         title:
 *           type: string
 *           description: Judul event
 *         description:
 *           type: string
 *           description: Deskripsi event
 *         event_date:
 *           type: string
 *           format: date
 *           description: Tanggal event (YYYY-MM-DD)
 *         event_time:
 *           type: string
 *           description: Waktu event
 *         max_participants:
 *           type: integer
 *           description: Maksimum jumlah peserta
 *         registration_deadline:
 *           type: string
 *           format: date-time
 *           description: Batas waktu pendaftaran
 *         location:
 *           type: string
 *           description: Lokasi event
 *         imageUrl:
 *           type: string
 *           description: URL gambar event
 *         status:
 *           type: string
 *           enum: [upcoming, completed]
 *           description: Status event
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
 * /api/events:
 *   get:
 *     summary: Mendapatkan daftar events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, completed, all]
 *         description: Filter berdasarkan status event
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan judul atau deskripsi
 *     responses:
 *       200:
 *         description: Daftar events berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */

// Dokumentasi endpoint GET /api/events/{id} dihapus sesuai permintaan

// Dokumentasi endpoint GET /api/events/upcoming dihapus sesuai permintaan

/**
 * @swagger
 * /api/admin/events:
 *   post:
 *     summary: Menambahkan event baru
 *     tags: [Events]
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
 *               - event_date
 *               - location
 *               - event_time
 *               - max_participants
 *               - registration_deadline
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul event
 *               description:
 *                 type: string
 *                 description: Deskripsi event
 *               event_date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal event (YYYY-MM-DD)
 *               event_time:
 *                 type: string
 *                 description: Waktu event
 *               max_participants:
 *                 type: integer
 *                 description: Maksimum jumlah peserta
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Batas waktu pendaftaran
 *               location:
 *                 type: string
 *                 description: Lokasi event
 *               status:
 *                 type: string
 *                 enum: [upcoming, completed]
 *                 description: Status event
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar event
 *     responses:
 *       201:
 *         description: Event berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/events/{id}:
 *   put:
 *     summary: Memperbarui data event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID event
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Judul event
 *               description:
 *                 type: string
 *                 description: Deskripsi event
 *               event_date:
 *                 type: string
 *                 format: date
 *                 description: Tanggal event (YYYY-MM-DD)
 *               event_time:
 *                 type: string
 *                 description: Waktu event
 *               max_participants:
 *                 type: integer
 *                 description: Maksimum jumlah peserta
 *               registration_deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Batas waktu pendaftaran
 *               location:
 *                 type: string
 *                 description: Lokasi event
 *               status:
 *                 type: string
 *                 enum: [upcoming, completed]
 *                 description: Status event
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar event baru (opsional)
 *     responses:
 *       200:
 *         description: Event berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Event tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/events/{id}:
 *   delete:
 *     summary: Menghapus event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID event
 *     responses:
 *       200:
 *         description: Event berhasil dihapus
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
 *                   example: Event successfully deleted
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Event tidak ditemukan
 *       500:
 *         description: Server error
 */
