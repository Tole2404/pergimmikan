/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API untuk autentikasi pengguna
 *   - name: Team
 *     description: API untuk manajemen anggota tim
 *   - name: Activities
 *     description: API untuk manajemen aktivitas
 *   - name: Galleries
 *     description: API untuk manajemen galeri foto
 *   - name: Journeys
 *     description: API untuk manajemen perjalanan
 *   - name: Events
 *     description: API untuk manajemen acara
 *   - name: Quotes
 *     description: API untuk manajemen quotes
 *   - name: Legacies
 *     description: API untuk manajemen legacies
 *   - name: Savings
 *     description: API untuk manajemen tabungan
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Root
 *     description: Endpoint root untuk API PERGIMMIKAN
 *     responses:
 *       200:
 *         description: Informasi dasar tentang API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: PERGIMMIKAN API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 description:
 *                   type: string
 *                   example: API untuk platform PERGIMMIKAN
 */

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Mendapatkan daftar semua endpoint API
 *     description: Mengembalikan daftar semua endpoint yang tersedia di API
 *     responses:
 *       200:
 *         description: Daftar endpoint berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRoutes:
 *                   type: integer
 *                   description: Jumlah total endpoint
 *                 routes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         description: Path endpoint
 *                       methods:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: HTTP methods yang didukung
 *                       middlewares:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Middlewares yang digunakan
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Endpoint untuk memeriksa status API
 *     responses:
 *       200:
 *         description: API berjalan dengan baik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
