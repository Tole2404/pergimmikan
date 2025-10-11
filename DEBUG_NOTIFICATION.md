# 🔍 DEBUG NOTIFICATION SYSTEM

## ✅ Status Saat Ini:
- ✅ Database: 10 notifikasi sudah ada
- ✅ Backend: API endpoint ready
- ❓ Frontend: Bell tidak muncul / tidak ada badge

---

## 🚀 LANGKAH DEBUG

### **1. Refresh Frontend**
```bash
cd frontend
# Ctrl+C untuk stop, lalu:
npm run dev
```

### **2. Buka Browser & Login**
- Buka `http://localhost:5173`
- **Login** dengan salah satu user:
  - admin, joel, tole, fira, dll (ID 1-10 yang punya notifikasi)

### **3. Buka Console Browser**
- Tekan **F12**
- Pilih tab **Console**
- Lihat log yang muncul

### **4. Cek Log yang Harus Muncul:**

```
🔍 NotificationDropdown mounted
Token: ✅ Found (atau AdminToken: ✅ Found)
✅ Starting notification polling...
🔄 Polling unread count...
📬 Unread count: 1
```

### **5. Lihat Debug Box**
- Di kanan bawah browser akan ada **kotak putih**
- Isinya:
  ```
  🔔 Notification Debug
  Token: ✅ Found
  User: ✅ admin (atau username lain)
  Unread Count: 1
  Notifications (1):
    🎉 Notification System Test
  ```

---

## 🐛 KEMUNGKINAN MASALAH

### **Problem 1: Token Not Found**
**Console:**
```
Token: ❌ Not found
AdminToken: ❌ Not found
⚠️ No token found, notification disabled
```

**Solution:**
1. Logout
2. Login ulang
3. Refresh browser (F5)

---

### **Problem 2: Bell Tidak Muncul**
**Cek di Console:**
```javascript
localStorage.getItem('token')
localStorage.getItem('user')
```

Jika `null` → **Login ulang**

---

### **Problem 3: Badge = 0 (padahal ada notifikasi)**
**Cek Network Tab:**
1. F12 → Tab **Network**
2. Cari request: `/api/notifications/unread/count`
3. Lihat **Response**:
   ```json
   {"count": 1}
   ```

Jika response `{"count": 0}` → **User ID tidak match**

**Solution:**
```bash
# Cek user ID yang login
# Di console browser:
JSON.parse(localStorage.getItem('user')).id

# Cek notifikasi untuk user tersebut di database
cd server
node check-notifications.js
```

---

### **Problem 4: API Error 401 Unauthorized**
**Console:**
```
Error fetching notifications: 401
```

**Solution:**
Token expired atau invalid. **Login ulang**.

---

### **Problem 5: CORS Error**
**Console:**
```
Access to fetch blocked by CORS policy
```

**Solution:**
Server belum running atau CORS config salah.
```bash
cd server
npm run dev
```

---

## 🎯 EXPECTED RESULT

Setelah semua benar, Anda akan lihat:

### **1. Di Navbar:**
```
[TEAM] [NEXT] 🔔¹ [Profile Image ▼]
                ↑
            Bell dengan badge 1
```

### **2. Klik Bell:**
```
┌─────────────────────────────────┐
│ Notifications    Mark all read  │
├─────────────────────────────────┤
│ 🎉 Notification System Test     │
│ This is a test notification!    │
│ Your notification system is...  │
│ 4m ago                      ×   │
└─────────────────────────────────┘
```

### **3. Di Console:**
```
🔍 NotificationDropdown mounted
Token: ✅ Found
✅ Starting notification polling...
🔄 Polling unread count...
📬 Unread count: 1
```

---

## 📝 CHECKLIST

Pastikan semua ini sudah dilakukan:

- [ ] Migration sudah dijalankan (`node run-notification-migration.js`)
- [ ] Notifikasi ada di database (`node check-notifications.js`)
- [ ] Server backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] User sudah login
- [ ] Token ada di localStorage
- [ ] Browser sudah di-refresh (F5)
- [ ] Console tidak ada error merah

---

## 🆘 JIKA MASIH TIDAK MUNCUL

### **Test Manual API:**

```bash
# 1. Get token dari localStorage (di browser console)
localStorage.getItem('token')

# 2. Test API dengan curl atau Postman
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:5000/api/notifications/unread/count
```

Expected response:
```json
{"count": 1}
```

Jika response error → **Backend issue**  
Jika response OK tapi UI tidak update → **Frontend issue**

---

## 📞 NEXT STEPS

1. **Refresh frontend** dan **login**
2. **Buka console** (F12)
3. **Screenshot** console log
4. **Screenshot** debug box (kanan bawah)
5. Kirim screenshot untuk analisis lebih lanjut

---

**Debug mode sudah aktif! Silakan test sekarang.** 🔍
