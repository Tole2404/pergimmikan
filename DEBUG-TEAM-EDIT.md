# 🔍 DEBUG TEAM EDIT ERROR

## 🎯 LANGKAH DEBUG:

### **1. Restart Server dengan Logging:**
```bash
cd server
# Ctrl+C untuk stop
npm start
```

### **2. Buka Browser Console:**
```
F12 → Console tab
```

### **3. Buka Server Console/Terminal:**
```
Lihat terminal dimana server running
```

### **4. Test Edit Team:**
```
1. Buka http://localhost:5173/dashboard/team
2. Click "Edit" pada member
3. Ubah short name atau upload foto
4. Click Save
```

### **5. Check Logs:**

**Browser Console akan show:**
```
Sending update for team ID: 26
FormData contents:
  name: ...
  short_name: ...
  role: ...
  linkedin: ...
  github: ...
  instagram: ...
```

**Server Console akan show:**
```
=== UPDATE TEAM MEMBER ===
Team ID: 26
Request body: { name: '...', short_name: '...', ... }
File: undefined
Updates to apply: { name: '...', short_name: '...', ... }
```

**Jika error, akan show:**
```
Error: [DETAIL ERROR MESSAGE]
  at ...
```

---

## 🔍 KEMUNGKINAN ERROR:

### **Error 1: Column not found**
```
Error: Unknown column 'short_name' in 'field list'
```
**Fix:** Run SQL untuk add column:
```sql
ALTER TABLE teams ADD COLUMN short_name VARCHAR(50) NULL AFTER name;
```

### **Error 2: View definer**
```
Error: The user specified as a definer does not exist
```
**Fix:** Recreate view (sudah dilakukan)

### **Error 3: Social media insert**
```
Error: Duplicate entry for key 'PRIMARY'
```
**Fix:** Check social_media table

### **Error 4: Image upload**
```
Error: ENOENT: no such file or directory
```
**Fix:** Create directory `/public/images/team`

---

## 📊 WHAT TO LOOK FOR:

**Di Server Console, cari:**
1. ✅ "=== UPDATE TEAM MEMBER ===" - Request diterima
2. ✅ "Updates to apply:" - Data yang akan di-update
3. ❌ "Error:" - Detail error message
4. ❌ Stack trace - Lokasi error

**Di Browser Console, cari:**
1. ✅ "FormData contents:" - Data yang dikirim
2. ❌ "Server error response:" - Response dari server
3. ❌ "Error updating team member:" - Error message

---

## 🎯 COPY ERROR MESSAGE:

**Setelah test, copy:**
1. **Full error dari server console**
2. **Full error dari browser console**
3. **Screenshot jika perlu**

---

## 🔧 QUICK CHECKS:

### **Check 1: Column exists?**
```sql
DESCRIBE teams;
```
Should show `short_name VARCHAR(50)`

### **Check 2: View works?**
```sql
SELECT * FROM team_members_view LIMIT 1;
```
Should return data

### **Check 3: Social media table?**
```sql
SELECT * FROM social_media WHERE team_id = 26;
```
Should return social links

---

## 📝 NEXT STEPS:

1. ✅ Restart server
2. ✅ Open browser console
3. ✅ Open server console
4. ✅ Test edit team
5. ✅ Copy error message
6. ✅ Share error dengan saya

---

**🎯 RESTART SERVER DAN TEST!**

**Kemudian share error message dari server console!**
