# 🔔 IN-APP NOTIFICATION SYSTEM - PERGIMMIKAN

## ✅ SISTEM SUDAH LENGKAP!

Notification system telah berhasil diimplementasikan dengan fitur lengkap:
- ✅ Database table untuk notifications
- ✅ Backend API endpoints
- ✅ Frontend notification bell dengan badge
- ✅ Real-time polling setiap 30 detik
- ✅ Notification dropdown dengan animasi
- ✅ Mark as read/unread functionality
- ✅ Delete notifications
- ✅ Auto-trigger untuk journey baru

---

## 📋 CARA SETUP

### 1. **Jalankan Database Migration**

```bash
cd server
node run-notification-migration.js
```

Output yang diharapkan:
```
🚀 Running notification table migration...

✅ Notifications table created successfully

✅ Migration completed successfully!
📋 Notifications table is ready to use.
```

### 2. **Restart Backend Server**

```bash
npm start
# atau
npm run dev
```

### 3. **Restart Frontend**

```bash
cd frontend
npm run dev
```

---

## 🎯 FITUR YANG TERSEDIA

### **Frontend Features:**
- 🔔 **Bell Icon** di navbar (hanya muncul saat login)
- 🔴 **Badge Counter** menampilkan jumlah notifikasi belum dibaca
- 📋 **Dropdown Menu** dengan list notifikasi
- ✅ **Mark as Read** - klik notifikasi untuk mark as read
- 🗑️ **Delete** - hapus notifikasi individual
- 📖 **Auto Navigate** - klik notifikasi langsung ke link terkait
- 🔄 **Auto Refresh** - polling setiap 30 detik
- 📱 **Responsive** - support mobile & desktop

### **Backend Features:**
- 📊 **Full CRUD** untuk notifications
- 👥 **Multi-user Support** - kirim ke 1 user atau semua user
- 🎨 **Notification Types** - journey, savings, event, activity, dll
- 🔗 **Deep Linking** - notifikasi bisa link ke halaman spesifik
- 🧹 **Auto Cleanup** - hapus notifikasi lama otomatis

---

## 🚀 CARA MENGGUNAKAN

### **A. Trigger Otomatis (Sudah Diimplementasi)**

Notifikasi otomatis terkirim saat:
1. ✅ **Journey Baru** - Admin create journey → semua user dapat notif

### **B. Trigger Manual (Tambahkan di Controller)**

Contoh penggunaan di controller lain:

#### **1. Notifikasi Savings Update**
```javascript
// Di savings.controller.js
const NotificationHelper = require('../utils/notificationHelper');

// Setelah deposit berhasil
await NotificationHelper.notifySavingsUpdate(userId, amount, 'deposit');
```

#### **2. Notifikasi Event Baru**
```javascript
// Di event.controller.js
const NotificationHelper = require('../utils/notificationHelper');

// Setelah create event
await NotificationHelper.notifyNewEvent(eventTitle, eventDate);
```

#### **3. Notifikasi Activity Baru**
```javascript
// Di activity.controller.js
const NotificationHelper = require('../utils/notificationHelper');

// Setelah create activity
await NotificationHelper.notifyNewActivity(activityTitle);
```

#### **4. Notifikasi Custom**
```javascript
const NotificationHelper = require('../utils/notificationHelper');

// Kirim ke 1 user
await NotificationHelper.sendToUser(userId, {
  type: NotificationHelper.TYPES.SYSTEM,
  title: 'Custom Title',
  message: 'Custom message here',
  link: '/custom-link'
});

// Kirim ke semua user
await NotificationHelper.sendToAllUsers({
  type: NotificationHelper.TYPES.SYSTEM,
  title: 'Announcement',
  message: 'Important announcement for all members',
  link: null
});
```

---

## 📡 API ENDPOINTS

### **User Endpoints** (Require Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications |
| GET | `/api/notifications/unread` | Get unread notifications |
| GET | `/api/notifications/unread/count` | Get unread count |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete notification |
| DELETE | `/api/notifications/read/all` | Delete all read |

### **Example API Calls**

```javascript
// Get notifications
fetch('http://localhost:5000/api/notifications', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Mark as read
fetch('http://localhost:5000/api/notifications/123/read', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎨 NOTIFICATION TYPES

```javascript
NotificationHelper.TYPES = {
  JOURNEY: 'journey',      // 📖 Journey related
  COMMENT: 'comment',      // 💬 Comments
  SAVINGS: 'savings',      // 💰 Savings/tabungan
  EVENT: 'event',          // 📅 Events
  ACTIVITY: 'activity',    // 🎯 Activities
  TEAM: 'team',            // 👥 Team updates
  GALLERY: 'gallery',      // 📸 Gallery photos
  LEGACY: 'legacy',        // 🏆 Legacy
  QUOTE: 'quote',          // 💭 Quotes
  SYSTEM: 'system'         // 🔔 System messages
};
```

Setiap type akan menampilkan emoji yang berbeda di UI.

---

## 💡 TIPS & BEST PRACTICES

### **1. Jangan Block Request**
```javascript
// ✅ GOOD - Non-blocking
NotificationHelper.notifyNewJourney(id, title, author)
  .catch(err => console.error('Failed to send notification:', err));

// ❌ BAD - Blocking
await NotificationHelper.notifyNewJourney(id, title, author);
```

### **2. Gunakan Type yang Tepat**
```javascript
// ✅ GOOD
NotificationHelper.TYPES.JOURNEY

// ❌ BAD
'journey' // Hardcoded string
```

### **3. Keep Messages Short**
```javascript
// ✅ GOOD
message: 'New journey: "Summer Trip 2023"'

// ❌ BAD
message: 'Hey there! We just wanted to let you know that...' // Too long
```

### **4. Always Provide Links**
```javascript
// ✅ GOOD
link: `/journey/${journeyId}`

// ⚠️ OK - Jika memang tidak ada link spesifik
link: null
```

---

## 🔧 TROUBLESHOOTING

### **Problem: Bell icon tidak muncul**
**Solution:** 
- Pastikan user sudah login
- Check localStorage ada `token` dan `user`
- Refresh halaman

### **Problem: Notifikasi tidak muncul**
**Solution:**
1. Check database apakah ada data di table `notifications`
2. Check console browser untuk error
3. Pastikan token valid
4. Check network tab untuk API call

### **Problem: Badge counter tidak update**
**Solution:**
- Tunggu 30 detik (polling interval)
- Atau refresh halaman
- Check API `/api/notifications/unread/count`

### **Problem: Migration error**
**Solution:**
```sql
-- Manual create table jika migration gagal
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);
```

---

## 📊 DATABASE SCHEMA

```sql
notifications
├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
├── user_id (INT, FOREIGN KEY → users.id)
├── type (VARCHAR(50)) - journey, savings, event, etc
├── title (VARCHAR(255)) - Notification title
├── message (TEXT) - Notification message
├── link (VARCHAR(255), NULLABLE) - Deep link
├── is_read (BOOLEAN, DEFAULT FALSE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🎯 NEXT STEPS (Optional Enhancements)

### **1. WebSocket untuk Real-time** (Advanced)
- Install `socket.io`
- Instant notification tanpa polling
- No delay

### **2. Push Notifications** (Advanced)
- Browser push notification
- Notif meski tidak buka website
- Perlu service worker

### **3. Email Notifications** (Optional)
- Weekly summary email
- Important notifications via email
- Perlu email service (SendGrid/Mailgun)

### **4. Notification Preferences**
- User bisa pilih notif apa yang mau diterima
- Mute notifications
- Custom notification settings

---

## 📝 FILE STRUCTURE

```
server/
├── src/
│   ├── models/
│   │   └── notification.model.js          ✅ Model
│   ├── controllers/
│   │   └── notification.controller.js     ✅ Controller
│   ├── routes/
│   │   └── notifications.routes.js        ✅ Routes
│   ├── utils/
│   │   └── notificationHelper.js          ✅ Helper
│   └── migrations/
│       └── create_notifications_table.js  ✅ Migration
└── run-notification-migration.js          ✅ Migration Script

frontend/
└── src/
    ├── components/
    │   └── common/
    │       ├── NotificationDropdown.jsx   ✅ Component
    │       └── NotificationDropdown.css   ✅ Styles
    └── utils/
        └── notificationService.js         ✅ API Service
```

---

## ✨ SUMMARY

**Notification System** sudah **100% READY** untuk digunakan!

### **Yang Sudah Dibuat:**
1. ✅ Database table
2. ✅ Backend API (8 endpoints)
3. ✅ Frontend UI component
4. ✅ Auto-trigger untuk journey
5. ✅ Helper utilities
6. ✅ Complete documentation

### **Cara Mulai:**
1. Run migration: `node run-notification-migration.js`
2. Restart server
3. Login ke aplikasi
4. Bell icon akan muncul di navbar
5. Create journey baru → notifikasi otomatis terkirim!

### **Untuk Menambah Notifikasi Lain:**
Tinggal tambahkan di controller yang relevan:
```javascript
const NotificationHelper = require('../utils/notificationHelper');
await NotificationHelper.notifyXXX(...);
```

---

**🎉 SELAMAT! Notification system siap digunakan!**

Jika ada pertanyaan atau butuh bantuan, silakan tanya! 🚀
