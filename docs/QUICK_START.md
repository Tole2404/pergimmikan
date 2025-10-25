# ⚡ Quick Start Guide - PERGIMMIKAN

Panduan cepat untuk menjalankan PERGIMMIKAN dalam 5 menit!

---

## 🎯 Prerequisites

Pastikan sudah terinstall:
- ✅ Node.js (v16 atau lebih tinggi)
- ✅ MySQL (v8.0 atau lebih tinggi)
- ✅ Git

---

## 🚀 Installation (5 Menit)

### 1️⃣ Clone Repository (30 detik)

```bash
git clone https://github.com/Tole2404/pergimmikan.git
cd pergimmikan
```

### 2️⃣ Setup Database (1 menit)

```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE pergimmikan;
USE pergimmikan;

# Import schema (keluar dari MySQL dulu)
exit;

# Import dari terminal
mysql -u root -p pergimmikan < database/MOUNTAIN-TRACKS-SCHEMA.sql
mysql -u root -p pergimmikan < database/trip-calculator-schema.sql
mysql -u root -p pergimmikan < database/trip-calculator-sample-data.sql
```

### 3️⃣ Setup Backend (1.5 menit)

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env (sesuaikan dengan kredensial MySQL Anda)
# Minimal yang perlu diubah:
# - DB_PASS (password MySQL Anda)
# - JWT_SECRET (bisa pakai string random)

# Run migrations
node run-notification-migration.js
node run-comment-migration.js

# Start server
npm run dev
```

Server akan berjalan di `http://localhost:5000` ✅

### 4️⃣ Setup Frontend (1.5 menit)

Buka terminal baru:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` ✅

### 5️⃣ Akses Website (30 detik)

Buka browser dan akses:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/api-docs

---

## 🎉 Selesai!

Website sudah berjalan! Sekarang Anda bisa:

### Login sebagai User
1. Klik "Login" di navbar
2. Register akun baru atau gunakan akun yang ada

### Login sebagai Admin
1. Akses: http://localhost:5173/admin/login
2. Username: `admin`
3. Password: `admin123`

---

## 📱 Fitur yang Bisa Dicoba

### Untuk User:
- 🏠 **Home** - Lihat overview website
- 📷 **Gallery** - Browse foto-foto kenangan
- 📖 **Journey** - Baca cerita perjalanan
- 🗺️ **Map** - Explore lokasi di peta interaktif
- 🎯 **Activities** - Lihat daftar kegiatan
- 💰 **Savings** - Track tabungan perjalanan
- 🧮 **Trip Calculator** - Hitung biaya pendakian

### Untuk Admin:
- 📊 **Dashboard** - Lihat statistik
- ➕ **Create Content** - Tambah journey, gallery, dll
- ✏️ **Edit Content** - Update konten yang ada
- 🗑️ **Delete Content** - Hapus konten
- 👥 **User Management** - Kelola user

---

## 🔧 Troubleshooting

### Port sudah digunakan?

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Database connection error?

1. Cek MySQL service berjalan
2. Cek kredensial di `server/.env`
3. Pastikan database `pergimmikan` sudah dibuat

### Module not found?

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

Setelah berhasil menjalankan, baca dokumentasi lengkap:

- 📖 [README.md](../README.md) - Overview lengkap
- 🔧 [DEPLOYMENT.md](../DEPLOYMENT.md) - Panduan deployment
- 🤝 [CONTRIBUTING.md](../CONTRIBUTING.md) - Cara berkontribusi
- 🔒 [SECURITY.md](../SECURITY.md) - Security guidelines

---

## 💬 Butuh Bantuan?

- 📧 Email: your.email@example.com
- 💬 Telegram: @yourusername
- 🐛 Issues: [GitHub Issues](https://github.com/Tole2404/pergimmikan/issues)

---

**Selamat mencoba! 🎉**
