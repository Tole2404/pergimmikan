/**
 * @swagger
 * tags:
 *   name: Admin Authentication
 *   description: API untuk autentikasi admin PERGIMMIKAN
 */

/**
 * @swagger
 * /api/admin/auth/login:
 *   post:
 *     summary: Login admin
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username admin
 *               password:
 *                 type: string
 *                 description: Password admin
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token untuk autentikasi
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Username atau password salah
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/auth/profile:
 *   get:
 *     summary: Mendapatkan profil admin yang sedang login
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil admin berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/auth/change-password:
 *   put:
 *     summary: Mengubah kata sandi admin
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Kata sandi saat ini
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Kata sandi baru
 *     responses:
 *       200:
 *         description: Kata sandi berhasil diubah
 *       400:
 *         description: Kata sandi saat ini tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/auth/logout:
 *   post:
 *     summary: Logout admin
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */
