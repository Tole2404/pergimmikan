/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API untuk manajemen pengguna PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik pengguna
 *         username:
 *           type: string
 *           description: Nama pengguna
 *         email:
 *           type: string
 *           format: email
 *           description: Alamat email pengguna
 *         fullName:
 *           type: string
 *           description: Nama lengkap pengguna
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: Peran pengguna
 *         profileImage:
 *           type: string
 *           description: URL gambar profil
 *         bio:
 *           type: string
 *           description: Biografi singkat pengguna
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal pembuatan akun
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal terakhir update akun
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Mendapatkan daftar pengguna
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, user, all]
 *         description: Filter berdasarkan peran pengguna
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan username atau email
 *     responses:
 *       200:
 *         description: Daftar pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Mendapatkan detail pengguna berdasarkan ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Detail pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       404:
 *         description: Pengguna tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Menambahkan pengguna baru
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Alamat email pengguna
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Kata sandi pengguna
 *               fullName:
 *                 type: string
 *                 description: Nama lengkap pengguna
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 description: Peran pengguna
 *               bio:
 *                 type: string
 *                 description: Biografi singkat pengguna
 *     responses:
 *       201:
 *         description: Pengguna berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Memperbarui data pengguna
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Alamat email pengguna
 *               fullName:
 *                 type: string
 *                 description: Nama lengkap pengguna
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 description: Peran pengguna
 *               bio:
 *                 type: string
 *                 description: Biografi singkat pengguna
 *     responses:
 *       200:
 *         description: Pengguna berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       404:
 *         description: Pengguna tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Menghapus pengguna
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki izin
 *       404:
 *         description: Pengguna tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Mendapatkan profil pengguna yang sedang login
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Memperbarui profil pengguna
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Alamat email pengguna
 *               fullName:
 *                 type: string
 *                 description: Nama lengkap pengguna
 *               bio:
 *                 type: string
 *                 description: Biografi singkat pengguna
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Gambar profil baru
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Mengubah kata sandi pengguna
 *     tags: [Users]
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
