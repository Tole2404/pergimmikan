# 🎓 PERGIMMIKAN - Website Kenangan Kuliah

<div align="center">

![PERGIMMIKAN](https://img.shields.io/badge/PERGIMMIKAN-Memories%20Forever-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Platform berbagi kenangan masa kuliah - Jalan-jalan, nongkrong, dan cerita bersama teman-teman**

[Demo](#demo) • [Fitur](#-fitur-utama) • [Teknologi](#-teknologi) • [Instalasi](#-instalasi) • [API Docs](#-api-documentation)

</div>

---

## 📖 Tentang Proyek

**PERGIMMIKAN** adalah website kenangan masa kuliah yang dibuat untuk mengabadikan momen-momen berharga bersama teman-teman kuliah. Platform ini memungkinkan pengguna untuk:

- 📸 **Berbagi foto** perjalanan dan kegiatan bersama
- 📝 **Menulis cerita** perjalanan (journey) 
- 🗺️ **Melacak lokasi** tempat yang pernah dikunjungi
- 💰 **Mengelola tabungan** untuk rencana perjalanan berikutnya
- 📅 **Mengatur acara** dan kegiatan bersama
- 💬 **Berinteraksi** melalui komentar dan reaksi
- 🔔 **Notifikasi real-time** untuk update terbaru

> **Proyek Skripsi:** Website ini juga merupakan bagian dari tugas akhir (skripsi) dengan tema **Web Service**, mengimplementasikan arsitektur RESTful API dan best practices dalam pengembangan web modern.

---

## ✨ Fitur Utama

### 🎯 Fitur Inti

| Fitur | Deskripsi |
|-------|-----------|
| **🏠 Landing Page** | Halaman utama dengan animasi modern dan informasi lengkap |
| **👥 Team Profile** | Profil anggota tim dengan social media integration |
| **📷 Gallery** | Galeri foto dengan masonry layout dan lightbox |
| **📖 Journey/Stories** | Cerita perjalanan dengan detail lengkap dan GPS tracking |
| **🎯 Activities** | Daftar kegiatan dan acara yang pernah dilakukan |
| **📅 Events** | Kalender acara dan event mendatang |
| **🗺️ Interactive Map** | Peta interaktif dengan marker lokasi yang pernah dikunjungi |
| **💰 Savings Tracker** | Sistem tabungan untuk rencana perjalanan |
| **🧮 Trip Calculator** | Kalkulator biaya perjalanan gunung dengan data real |

### 🚀 Fitur Advanced

#### 1. **Notification System** 🔔
- Real-time in-app notifications
- Badge counter untuk unread notifications
- Auto-trigger saat ada konten baru
- 5 jenis notifikasi: Journey, Savings, Events, Activities, Gallery
- Mark as read/delete functionality
- Navigate langsung ke konten terkait

#### 2. **Comment & Reaction System** 💬
- Sistem komentar dengan nested replies
- 6 jenis reaksi: 👍 ❤️ 😂 😮 😢 😠
- Edit/delete komentar sendiri
- Real-time update
- User avatar dan timestamp

#### 3. **Trip Calculator** 🧮
- Perhitungan biaya pendakian gunung
- Data real dari berbagai operator
- Estimasi biaya transportasi, basecamp, equipment
- Export ke PDF
- Flexible quantity system

#### 4. **SEO Optimization** 🔍
- Dynamic meta tags untuk setiap halaman
- Open Graph tags untuk social media sharing
- Structured data (JSON-LD)
- Sitemap generation
- Google Analytics integration

#### 5. **Admin Dashboard** 👨‍💼
- CRUD operations untuk semua konten
- User management
- Analytics dan statistics
- Content moderation
- Export data ke Excel/PDF

---

## 🛠️ Teknologi

### Frontend
```json
{
  "framework": "React 18.2.0",
  "build-tool": "Vite 6.2.0",
  "routing": "React Router DOM 6.22.0",
  "ui-library": [
    "Bootstrap 5.3.3",
    "Ant Design 5.24.3",
    "React Bootstrap 2.10.9"
  ],
  "animation": [
    "Framer Motion 12.4.10",
    "GSAP 3.12.7",
    "AOS 2.3.4"
  ],
  "maps": "React Leaflet 4.2.1",
  "charts": "Chart.js 4.4.8",
  "icons": [
    "React Icons 5.5.0",
    "FontAwesome 6.7.2"
  ],
  "utilities": [
    "Axios 1.10.0",
    "SweetAlert2 11.17.2",
    "React Toastify 11.0.5",
    "date-fns 4.1.0"
  ]
}
```

### Backend
```json
{
  "runtime": "Node.js",
  "framework": "Express 4.18.2",
  "database": "MySQL 2 (via Sequelize 6.37.7)",
  "authentication": "JWT (jsonwebtoken 9.0.0)",
  "security": [
    "bcryptjs 2.4.3",
    "helmet 7.0.0",
    "cors 2.8.5"
  ],
  "file-upload": "Multer 2.0.1",
  "api-docs": [
    "Swagger JSDoc 6.2.8",
    "Swagger UI Express 5.0.1"
  ],
  "logging": "Winston 3.8.2",
  "telegram-bot": "node-telegram-bot-api 0.66.0"
}
```

### Database
- **MySQL** - Relational database
- **Sequelize ORM** - Object-Relational Mapping
- **Database Views** - Optimized queries
- **Migrations** - Version control untuk database schema

---

## 📦 Instalasi

### Prerequisites
- Node.js >= 16.x
- MySQL >= 8.0
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/Tole2404/pergimmikan.git
cd pergimmikan
```

### 2. Setup Database

#### Buat Database
```sql
CREATE DATABASE pergimmikan;
USE pergimmikan;
```

#### Import Schema
```bash
# Import schema utama
mysql -u root -p pergimmikan < database/MOUNTAIN-TRACKS-SCHEMA.sql

# Import data trip calculator
mysql -u root -p pergimmikan < database/trip-calculator-schema.sql
mysql -u root -p pergimmikan < database/trip-calculator-sample-data.sql

# Import data tambahan
mysql -u root -p pergimmikan < database/SMART-TRANSPORTATION.sql
mysql -u root -p pergimmikan < database/REAL-PRICES-UPDATE.sql
```

#### Jalankan Migrations
```bash
cd server

# Migration untuk notifications
node run-notification-migration.js

# Migration untuk comments
node run-comment-migration.js

# Migration lainnya (jika ada)
node src/migrations/create_notifications_table.js
```

#### Fix Database Views (jika error)
```bash
mysql -u root -p pergimmikan < FIX-VIEW-DEFINER.sql
```

### 3. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
```

#### Konfigurasi `.env`
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pergimmikan
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Jalankan Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:5000`

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
```

#### Konfigurasi `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=PERGIMMIKAN
```

#### Jalankan Frontend
```bash
# Development mode
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

Frontend akan berjalan di `http://localhost:5173`

---

## 🚀 Cara Menggunakan

### Untuk User

#### 1. **Akses Website**
```
http://localhost:5173
```

#### 2. **Login**
- Klik tombol "Login" di navbar
- Gunakan kredensial yang sudah terdaftar
- Atau register akun baru

#### 3. **Jelajahi Fitur**
- **Home**: Lihat overview dan statistik
- **Gallery**: Browse foto-foto kenangan
- **Journey**: Baca cerita perjalanan
- **Activities**: Lihat daftar kegiatan
- **Map**: Explore lokasi di peta interaktif
- **Savings**: Track tabungan perjalanan
- **Trip Calculator**: Hitung biaya pendakian

#### 4. **Interaksi**
- 💬 Komentar di journey
- 👍 Berikan reaksi
- 🔔 Cek notifikasi
- 📤 Share konten

### Untuk Admin

#### 1. **Login Admin**
```
http://localhost:5173/admin/login
```
Default credentials:
- Username: `admin`
- Password: `admin123`

#### 2. **Dashboard Admin**
- Manage semua konten (CRUD)
- User management
- View analytics
- Export data

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Gunakan JWT token di header:
```
Authorization: Bearer <your_token>
```

### Endpoints

#### 🔐 Authentication
```http
POST   /api/auth/register          # Register user baru
POST   /api/auth/login             # Login user
POST   /api/auth/admin/login       # Login admin
GET    /api/auth/profile           # Get user profile
PUT    /api/auth/profile           # Update profile
```

#### 📖 Journey/Stories
```http
GET    /api/journeys               # Get all journeys
GET    /api/journeys/:id           # Get journey by ID
POST   /api/journeys               # Create journey (admin)
PUT    /api/journeys/:id           # Update journey (admin)
DELETE /api/journeys/:id           # Delete journey (admin)
```

#### 📷 Gallery
```http
GET    /api/gallery                # Get all photos
GET    /api/gallery/:id            # Get photo by ID
POST   /api/gallery                # Upload photo (admin)
DELETE /api/gallery/:id            # Delete photo (admin)
```

#### 🎯 Activities
```http
GET    /api/activities             # Get all activities
GET    /api/activities/:id         # Get activity by ID
POST   /api/activities             # Create activity (admin)
PUT    /api/activities/:id         # Update activity (admin)
DELETE /api/activities/:id         # Delete activity (admin)
```

#### 📅 Events
```http
GET    /api/events                 # Get all events
GET    /api/events/:id             # Get event by ID
POST   /api/events                 # Create event (admin)
PUT    /api/events/:id             # Update event (admin)
DELETE /api/events/:id             # Delete event (admin)
```

#### 👥 Team
```http
GET    /api/team                   # Get all team members
GET    /api/team/:id               # Get team member by ID
POST   /api/team                   # Add team member (admin)
PUT    /api/team/:id               # Update team member (admin)
DELETE /api/team/:id               # Delete team member (admin)
```

#### 💰 Savings
```http
GET    /api/savings                # Get savings summary
GET    /api/savings/transactions   # Get all transactions
POST   /api/savings/deposit        # Add deposit
POST   /api/savings/withdraw       # Add withdrawal
```

#### 🔔 Notifications
```http
GET    /api/notifications          # Get all notifications
GET    /api/notifications/unread   # Get unread notifications
GET    /api/notifications/unread/count  # Get unread count
PUT    /api/notifications/:id/read      # Mark as read
PUT    /api/notifications/read-all      # Mark all as read
DELETE /api/notifications/:id           # Delete notification
```

#### 💬 Comments
```http
GET    /api/comments/:type/:id     # Get comments
POST   /api/comments               # Create comment
PUT    /api/comments/:id           # Update comment
DELETE /api/comments/:id           # Delete comment
```

#### 👍 Reactions
```http
GET    /api/comments/reactions/:type/:id  # Get reactions
POST   /api/comments/reactions            # Add reaction
DELETE /api/comments/reactions/:type/:id  # Remove reaction
```

#### 🧮 Trip Calculator
```http
GET    /api/mountains              # Get all mountains
GET    /api/mountains/:id/routes   # Get mountain routes
POST   /api/trip-calculator/calculate  # Calculate trip cost
```

### Swagger Documentation
Akses dokumentasi lengkap di:
```
http://localhost:5000/api-docs
```

---

## 📁 Struktur Proyek

```
pergimmikan/
├── frontend/                    # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc
│   │   ├── components/        # React components
│   │   │   ├── common/       # Reusable components
│   │   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   │   └── sections/     # Page sections
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin pages
│   │   │   └── ...           # Public pages
│   │   ├── routes/           # Route configuration
│   │   ├── utils/            # Utility functions
│   │   ├── middleware/       # Auth middleware
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Helper functions
│   │   ├── migrations/       # Database migrations
│   │   └── app.js            # Express app setup
│   ├── uploads/              # Uploaded files
│   ├── package.json
│   └── .env
│
├── database/                    # Database files
│   ├── migrations/           # SQL migrations
│   ├── MOUNTAIN-TRACKS-SCHEMA.sql
│   ├── trip-calculator-schema.sql
│   └── ...
│
├── docs/                        # Documentation
│   ├── PROJECT_SUMMARY.md
│   ├── NOTIFICATION_SYSTEM_GUIDE.md
│   ├── COMMENT_SYSTEM_GUIDE.md
│   └── ...
│
└── README.md                    # This file
```

---

## 🎨 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Gallery
![Gallery](docs/screenshots/gallery.png)

### Journey Detail
![Journey Detail](docs/screenshots/journey-detail.png)

### Interactive Map
![Map](docs/screenshots/map.png)

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## 🧪 Testing

### Backend Testing
```bash
cd server

# Run all tests
npm test

# Run specific test
npm test -- notification.test.js

# Run with coverage
npm test -- --coverage
```

### Frontend Testing
```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Manual Testing
1. Test semua endpoint di Swagger UI
2. Test user flow dari landing hingga checkout
3. Test admin CRUD operations
4. Test notification system
5. Test comment & reaction system

---

## 🚀 Deployment

### Deploy ke cPanel

#### 1. **Persiapan**
- Upload semua file ke cPanel
- Setup Node.js app di cPanel
- Import database

#### 2. **Setup Backend**
```bash
cd server
npm install --production
```

#### 3. **Setup Frontend**
```bash
cd frontend
npm run build
# Upload folder dist/ ke public_html
```

#### 4. **Konfigurasi**
- Update `.env` dengan kredensial production
- Setup SSL certificate
- Configure domain

Lihat panduan lengkap: [CPANEL-QUICK-GUIDE.md](CPANEL-QUICK-GUIDE.md)

### Deploy ke VPS/Cloud

#### Menggunakan PM2
```bash
# Install PM2
npm install -g pm2

# Start backend
cd server
pm2 start src/app.js --name pergimmikan-api

# Setup auto-restart
pm2 startup
pm2 save
```

#### Menggunakan Docker
```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Database Connection Error**
```
Error: ER_ACCESS_DENIED_ERROR
```
**Solusi:**
- Cek kredensial database di `.env`
- Pastikan MySQL service running
- Cek user privileges

#### 2. **CORS Error**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solusi:**
- Update `CORS_ORIGIN` di `.env`
- Restart backend server

#### 3. **JWT Token Invalid**
```
Error: jwt malformed
```
**Solusi:**
- Logout dan login ulang
- Clear localStorage
- Generate new JWT_SECRET

#### 4. **File Upload Error**
```
Error: LIMIT_FILE_SIZE
```
**Solusi:**
- Compress gambar sebelum upload
- Update `multer` config untuk max file size

#### 5. **Notification Not Showing**
**Solusi:**
- Refresh browser (Ctrl+R)
- Tunggu 10 detik (polling interval)
- Cek token di localStorage
- Lihat console untuk error

### Debug Mode
```bash
# Backend
DEBUG=* npm run dev

# Frontend
VITE_DEBUG=true npm run dev
```

---

## 📚 Documentation

### Dokumentasi Lengkap
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Overview proyek
- [NOTIFICATION_SYSTEM_GUIDE.md](NOTIFICATION_SYSTEM_GUIDE.md) - Panduan notification system
- [COMMENT_SYSTEM_GUIDE.md](COMMENT_SYSTEM_GUIDE.md) - Panduan comment system
- [TRIP-CALCULATOR-README.md](TRIP-CALCULATOR-README.md) - Panduan trip calculator
- [SEO-IMPLEMENTATION-COMPLETE.md](SEO-IMPLEMENTATION-COMPLETE.md) - Panduan SEO
- [CPANEL-QUICK-GUIDE.md](CPANEL-QUICK-GUIDE.md) - Panduan deploy ke cPanel

### API Documentation
- Swagger UI: `http://localhost:5000/api-docs`
- Postman Collection: [Download](docs/postman/PERGIMMIKAN.postman_collection.json)

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan ikuti langkah berikut:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards
- Follow ESLint rules
- Write meaningful commit messages
- Add comments untuk kode kompleks
- Update documentation jika perlu

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

### Developer
- **Nama Anda** - Full Stack Developer
  - GitHub: [@Tole2404](https://github.com/Tole2404)
  - Email: your.email@example.com

### Contributors
Terima kasih kepada semua teman-teman yang telah berkontribusi dalam proyek ini! 🎉

---

## 🙏 Acknowledgments

- **Dosen Pembimbing** - Untuk bimbingan dan arahan
- **Teman-teman Kuliah** - Untuk kenangan yang indah
- **Open Source Community** - Untuk tools dan libraries yang luar biasa

### Technologies & Libraries
- [React](https://reactjs.org/) - UI Framework
- [Express](https://expressjs.com/) - Backend Framework
- [MySQL](https://www.mysql.com/) - Database
- [Leaflet](https://leafletjs.com/) - Interactive Maps
- [Chart.js](https://www.chartjs.org/) - Data Visualization
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

## 📞 Contact & Support

### Butuh Bantuan?
- 📧 Email: your.email@example.com
- 💬 Telegram: @yourusername
- 🐛 Issues: [GitHub Issues](https://github.com/Tole2404/pergimmikan/issues)

### Social Media
- 🌐 Website: https://pergimmikan.com
- 📸 Instagram: @pergimmikan
- 📘 Facebook: /pergimmikan

---

## 🎯 Roadmap

### Version 1.0 (Current) ✅
- [x] Basic CRUD operations
- [x] Authentication & Authorization
- [x] Gallery & Journey
- [x] Interactive Map
- [x] Notification System
- [x] Comment & Reaction System
- [x] Trip Calculator
- [x] SEO Optimization

### Version 1.1 (Planned) 🚧
- [ ] WebSocket untuk real-time updates
- [ ] Push notifications (browser)
- [ ] Email notifications
- [ ] Advanced search & filters
- [ ] User profiles & customization
- [ ] Mobile app (React Native)

### Version 2.0 (Future) 💡
- [ ] AI-powered recommendations
- [ ] Social media integration
- [ ] Live chat
- [ ] Video support
- [ ] Multi-language support
- [ ] Dark mode

---

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/Tole2404/pergimmikan?style=social)
![GitHub forks](https://img.shields.io/github/forks/Tole2404/pergimmikan?style=social)
![GitHub issues](https://img.shields.io/github/issues/Tole2404/pergimmikan)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Tole2404/pergimmikan)

---

<div align="center">

### 💙 Made with Love for PERGIMMIKAN

**Mengabadikan Kenangan, Merajut Persahabatan**

---

**⭐ Jika project ini bermanfaat, jangan lupa kasih star! ⭐**

[⬆ Back to Top](#-pergimmikan---website-kenangan-kuliah)

</div>
