# 💬 COMMENT & REACTION SYSTEM - COMPLETE GUIDE

## ✅ SISTEM SUDAH AKTIF!

Comment & Reaction system sudah terintegrasi di **Journey Detail Page**!

---

## 🎯 FITUR YANG TERSEDIA:

### **1. Comments:**
- ✅ **Create Comment** - Tulis komentar baru
- ✅ **Reply to Comment** - Balas komentar (nested replies)
- ✅ **Edit Comment** - Edit komentar sendiri
- ✅ **Delete Comment** - Hapus komentar sendiri
- ✅ **User Avatar** - Tampil foto profil user
- ✅ **Time Ago** - "Just now", "5m ago", "2h ago", dll
- ✅ **Real-time Update** - Otomatis refresh setelah action

### **2. Reactions:**
- ✅ **6 Reaction Types:**
  - 👍 Like
  - ❤️ Love
  - 😂 Haha
  - 😮 Wow
  - 😢 Sad
  - 😠 Angry
- ✅ **Reaction Picker** - Popup untuk pilih reaction
- ✅ **Change Reaction** - Ganti reaction
- ✅ **Remove Reaction** - Hapus reaction
- ✅ **Reaction Summary** - Lihat total & breakdown reactions

---

## 🚀 CARA MENGGUNAKAN:

### **Untuk User:**

#### **1. Memberikan Reaction:**
```
1. Buka Journey Detail
2. Scroll ke bawah setelah content
3. Klik tombol "React" atau emoji reaction
4. Pilih reaction yang diinginkan
5. Reaction langsung tersimpan!
```

#### **2. Menulis Comment:**
```
1. Scroll ke section "Comments"
2. Ketik komentar di text area
3. Klik tombol "Comment"
4. Komentar langsung muncul!
```

#### **3. Reply Comment:**
```
1. Klik tombol "Reply" di bawah comment
2. Ketik balasan
3. Klik "Reply"
4. Balasan muncul di bawah comment asli (indented)
```

#### **4. Edit Comment:**
```
1. Klik "Edit" di comment sendiri
2. Ubah text
3. Klik "Save" atau "Cancel"
```

#### **5. Delete Comment:**
```
1. Klik "Delete" di comment sendiri
2. Confirm delete
3. Comment terhapus (termasuk replies-nya)
```

---

## 📋 CARA MENAMBAHKAN KE PAGE LAIN:

### **Gallery Page:**

```jsx
import CommentSection from '../components/common/CommentSection';
import ReactionBar from '../components/common/ReactionBar';

// Di component Gallery Detail:
<ReactionBar contentType="gallery" contentId={galleryId} />
<CommentSection contentType="gallery" contentId={galleryId} />
```

### **Activity Page:**

```jsx
import CommentSection from '../components/common/CommentSection';
import ReactionBar from '../components/common/ReactionBar';

// Di component Activity Detail:
<ReactionBar contentType="activity" contentId={activityId} />
<CommentSection contentType="activity" contentId={activityId} />
```

---

## 🎨 CUSTOMIZATION:

### **Ubah Reaction Types:**

Edit file `ReactionBar.jsx`:

```javascript
const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  // Tambah atau ubah reaction di sini
];
```

### **Ubah Styling:**

Edit file CSS:
- `CommentSection.css` - Styling comments
- `ReactionBar.css` - Styling reactions

---

## 📡 API ENDPOINTS:

### **Comments:**
```
GET    /api/comments/:content_type/:content_id
POST   /api/comments
PUT    /api/comments/:id
DELETE /api/comments/:id
GET    /api/comments/:content_type/:content_id/count
```

### **Reactions:**
```
GET    /api/comments/reactions/:content_type/:content_id
POST   /api/comments/reactions
DELETE /api/comments/reactions/:content_type/:content_id
```

---

## 🧪 CARA TEST:

### **Test 1: Comment di Journey**
```
1. Buka Journey Detail (http://localhost:5173/journey/1)
2. Login jika belum
3. Scroll ke bawah
4. Lihat section "Comments"
5. Ketik comment dan submit
6. Comment muncul dengan avatar & username
```

### **Test 2: Reply Comment**
```
1. Klik "Reply" di comment yang ada
2. Ketik balasan
3. Submit
4. Reply muncul di bawah comment (indented)
```

### **Test 3: Reaction**
```
1. Klik tombol "React"
2. Pilih emoji (misal: ❤️ Love)
3. Reaction tersimpan
4. Tombol berubah jadi "Love" dengan emoji
5. Klik lagi untuk ganti reaction
```

### **Test 4: Edit & Delete**
```
1. Klik "Edit" di comment sendiri
2. Ubah text
3. Save
4. Atau klik "Delete" untuk hapus
```

---

## 💡 TIPS & BEST PRACTICES:

### **Untuk User:**
- ✅ Gunakan reaction untuk response cepat
- ✅ Tulis comment yang konstruktif
- ✅ Reply langsung ke comment yang relevan
- ✅ Edit typo daripada delete & repost

### **Untuk Developer:**
- ✅ Selalu validate input di backend
- ✅ Check authentication sebelum action
- ✅ Handle error dengan graceful
- ✅ Optimize query untuk performance

---

## 🐛 TROUBLESHOOTING:

### **Problem: Comment tidak muncul**
**Solution:**
1. Check console browser (F12)
2. Pastikan API endpoint benar
3. Cek token authentication
4. Refresh page

### **Problem: Reaction tidak tersimpan**
**Solution:**
1. Pastikan sudah login
2. Check network tab untuk API call
3. Lihat response error
4. Cek database connection

### **Problem: Edit/Delete tidak bisa**
**Solution:**
1. Pastikan comment milik user sendiri
2. Check user_id di localStorage
3. Verify token valid

---

## 📊 DATABASE SCHEMA:

### **Comments Table:**
```sql
comments
├── id (INT, PRIMARY KEY)
├── content_type (VARCHAR) - 'journey', 'gallery', 'activity'
├── content_id (INT) - ID of the content
├── user_id (INT, FOREIGN KEY)
├── parent_id (INT, NULL) - For replies
├── comment (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### **Reactions Table:**
```sql
reactions
├── id (INT, PRIMARY KEY)
├── content_type (VARCHAR)
├── content_id (INT)
├── user_id (INT, FOREIGN KEY)
├── reaction_type (VARCHAR) - 'like', 'love', etc
└── created_at (TIMESTAMP)
```

---

## 🎯 NEXT FEATURES (Optional):

### **1. Mention System**
- @username untuk mention user
- Notifikasi saat di-mention

### **2. Comment Moderation**
- Admin bisa hide/delete any comment
- Report comment feature

### **3. Rich Text Editor**
- Bold, italic, link
- Emoji picker
- Image upload

### **4. Comment Sorting**
- Sort by newest/oldest
- Sort by most reactions
- Filter by user

---

## 📝 SUMMARY:

### **Yang Sudah Aktif:**
- ✅ Comment system di Journey Detail
- ✅ Reaction system (6 types)
- ✅ Reply/nested comments
- ✅ Edit & delete own comments
- ✅ Real-time update
- ✅ User avatar & username
- ✅ Time ago format

### **Cara Pakai:**
1. Buka Journey Detail
2. Scroll ke bawah
3. Klik "React" untuk reaction
4. Ketik di text area untuk comment
5. Klik "Reply" untuk balas comment

### **Cara Tambah ke Page Lain:**
```jsx
<ReactionBar contentType="gallery" contentId={id} />
<CommentSection contentType="gallery" contentId={id} />
```

---

**🎉 COMMENT & REACTION SYSTEM SIAP DIGUNAKAN!**

Silakan test dan explore fitur-fiturnya! 🚀
