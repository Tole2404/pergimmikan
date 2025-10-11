/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API untuk autentikasi pengguna
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna reguler
 *     tags: [Authentication]
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
 *                 description: Username pengguna
 *               password:
 *                 type: string
 *                 description: Password pengguna
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
 *                 user:
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
 * /api/team/auth/login:
 *   post:
 *     summary: Login anggota tim
 *     tags: [Authentication]
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
 *                 description: Username anggota tim
 *               password:
 *                 type: string
 *                 description: Password anggota tim
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *       401:
 *         description: Username atau password salah
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/team/auth/profile:
 *   get:
 *     summary: Mendapatkan profil pengguna yang sedang login
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/team/auth/profile:
 *   put:
 *     summary: Memperbarui profil pengguna
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama lengkap
 *               username:
 *                 type: string
 *                 description: Username baru
 *               email:
 *                 type: string
 *                 description: Email baru
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/team/auth/profile/image:
 *   post:
 *     summary: Mengunggah gambar profil
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File gambar (JPG, JPEG, PNG, GIF)
 *     responses:
 *       200:
 *         description: Gambar profil berhasil diunggah
 *       400:
 *         description: Format file tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */
