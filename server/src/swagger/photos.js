/**
 * @swagger
 * tags:
 *   name: Photos
 *   description: API untuk manajemen foto di PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Photo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik foto
 *         url:
 *           type: string
 *           description: URL foto
 *         caption:
 *           type: string
 *           description: Keterangan foto
 *         activityId:
 *           type: integer
 *           description: ID aktivitas terkait (jika ada)
 *         journeyId:
 *           type: integer
 *           description: ID perjalanan terkait (jika ada)
 *         galleryId:
 *           type: integer
 *           description: ID galeri terkait (jika ada)
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
 * /api/admin/activities/photos/{photoId}:
 *   delete:
 *     summary: Menghapus foto dari aktivitas
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID foto yang akan dihapus
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

/**
 * @swagger
 * /api/admin/journeys/photo/{photoId}:
 *   delete:
 *     summary: Menghapus foto dari perjalanan
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID foto yang akan dihapus
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

/**
 * @swagger
 * /api/admin/galleries/photos/{photoId}:
 *   delete:
 *     summary: Menghapus foto dari galeri
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID foto yang akan dihapus
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
