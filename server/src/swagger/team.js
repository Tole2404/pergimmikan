/**
 * @swagger
 * tags:
 *   name: Team
 *   description: API untuk manajemen anggota tim PERGIMMIKAN
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamMember:
 *       type: object
 *       required:
 *         - name
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unik anggota tim
 *         name:
 *           type: string
 *           description: Nama lengkap anggota tim
 *         username:
 *           type: string
 *           description: Username untuk login
 *         role:
 *           type: string
 *           description: Peran dalam tim (Ketua, Momi, Anggota)
 *         bio:
 *           type: string
 *           description: Biografi singkat
 *         imageUrl:
 *           type: string
 *           description: URL foto profil
 *         socialMedia:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SocialMedia'
 *     
 *     SocialMedia:
 *       type: object
 *       properties:
 *         platform:
 *           type: string
 *           description: Nama platform (Instagram, Twitter, dll)
 *         url:
 *           type: string
 *           description: URL profil media sosial
 */

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Mendapatkan daftar anggota tim
 *     tags: [Team]
 *     description: Mengembalikan daftar semua anggota tim PERGIMMIKAN
 *     responses:
 *       200:
 *         description: Daftar anggota tim berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMember'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/team/{id}:
 *   get:
 *     summary: Mendapatkan detail anggota tim berdasarkan ID
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID anggota tim
 *     responses:
 *       200:
 *         description: Detail anggota tim berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMember'
 *       404:
 *         description: Anggota tim tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/team:
 *   post:
 *     summary: Menambahkan anggota tim baru
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama lengkap anggota tim
 *               username:
 *                 type: string
 *                 description: Username untuk login
 *               password:
 *                 type: string
 *                 description: Password untuk login
 *               role:
 *                 type: string
 *                 description: Peran dalam tim
 *               bio:
 *                 type: string
 *                 description: Biografi singkat
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Foto profil anggota tim
 *               socialMedia:
 *                 type: string
 *                 description: JSON string berisi array media sosial
 *     responses:
 *       201:
 *         description: Anggota tim berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/team/{id}:
 *   put:
 *     summary: Memperbarui data anggota tim
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID anggota tim
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama lengkap anggota tim
 *               username:
 *                 type: string
 *                 description: Username untuk login
 *               password:
 *                 type: string
 *                 description: Password baru (opsional)
 *               role:
 *                 type: string
 *                 description: Peran dalam tim
 *               bio:
 *                 type: string
 *                 description: Biografi singkat
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Foto profil anggota tim
 *               socialMedia:
 *                 type: string
 *                 description: JSON string berisi array media sosial
 *     responses:
 *       200:
 *         description: Anggota tim berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Anggota tim tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/team/{id}:
 *   delete:
 *     summary: Menghapus anggota tim
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID anggota tim
 *     responses:
 *       200:
 *         description: Anggota tim berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Anggota tim tidak ditemukan
 *       500:
 *         description: Server error
 */
