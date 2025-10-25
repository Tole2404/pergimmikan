# 🚀 RUN SEO MIGRATION

## ✅ CARA PAKAI:

### **Step 1: Buka Terminal di folder server**
```bash
cd server
```

### **Step 2: Run Migration**
```bash
node src/database/migrate-seo.js
```

### **Expected Output:**
```
🚀 Starting SEO Management Migration...

📊 Creating seo_settings table...
✅ seo_settings table created!

📊 Creating seo_templates table...
✅ seo_templates table created!

📝 Inserting default SEO settings...
✅ Default SEO settings inserted!

📝 Inserting SEO templates...
✅ SEO templates inserted!

📊 Creating indexes...
✅ Index idx_page_type created!
✅ Index idx_page_id created!
✅ Index idx_is_active created!

📊 Migration Results:

✅ SEO Settings: 5 rows
   - home: PERGIMMIKAN - Sekumpulan Pertemanan Mengabadikan...
   - team: Tim PERGIMMIKAN - Anggota Petualang Indonesia...
   - journey: Cerita Perjalanan PERGIMMIKAN - Petualangan di...
   - gallery: Galeri Foto PERGIMMIKAN - Dokumentasi Petualang...
   - about: Tentang PERGIMMIKAN - Komunitas Petualangan Ind...

✅ SEO Templates: 3 rows
   - journey_detail: {title} - Cerita Perjalanan PERGIMMIKAN
   - team_member: {name} - Tim PERGIMMIKAN
   - gallery_album: {title} - Galeri PERGIMMIKAN

🎉 Migration completed successfully!

✅ Tables created:
   - seo_settings
   - seo_templates

✅ Default data inserted:
   - 5 SEO settings (home, team, journey, gallery, about)
   - 3 SEO templates (journey_detail, team_member, gallery_album)

🚀 You can now access SEO Management in admin panel!
   URL: http://localhost:5173/dashboard/seo
```

---

## ✅ VERIFY:

### **Check Database:**
```sql
-- Check tables exist
SHOW TABLES LIKE 'seo%';

-- Check data
SELECT * FROM seo_settings;
SELECT * FROM seo_templates;
```

---

## 🔄 ROLLBACK (If Needed):

### **Run Rollback:**
```bash
node src/database/rollback-seo.js
```

**WARNING:** This will delete all SEO tables and data!

---

## 🧪 TEST:

### **After Migration:**

1. **Start Backend:**
   ```bash
   npm start
   ```

2. **Test API:**
   ```bash
   curl http://localhost:5000/api/seo/home
   ```

3. **Start Frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```

4. **Access Admin:**
   ```
   http://localhost:5173/dashboard/seo
   ```

5. **Should see:**
   - ✅ 5 SEO settings in table
   - ✅ 3 templates
   - ✅ No more 500 error!

---

## 🎯 TROUBLESHOOTING:

### **Error: Cannot find module '../config/database'**
**Solution:** Make sure you're in `server` folder
```bash
cd server
node src/database/migrate-seo.js
```

### **Error: Access denied for user**
**Solution:** Check `.env` file database credentials
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=db_gimmik3
```

### **Error: Table already exists**
**Solution:** Migration already run! Check data:
```sql
SELECT * FROM seo_settings;
```

### **Want to re-run migration:**
```bash
# 1. Rollback first
node src/database/rollback-seo.js

# 2. Run migration again
node src/database/migrate-seo.js
```

---

## 📁 FILES:

- **Migration:** `server/src/database/migrate-seo.js`
- **Rollback:** `server/src/database/rollback-seo.js`
- **SQL Version:** `server/src/database/seo_management_migration.sql`

---

## ✅ AFTER MIGRATION:

**You can now:**
- ✅ Access SEO Management in admin panel
- ✅ View/Edit/Add/Delete SEO settings
- ✅ Edit templates
- ✅ Preview SEO
- ✅ No more 500 errors!

**URL:** `http://localhost:5173/dashboard/seo`

---

**🎉 DONE! Run migration now:**

```bash
cd server
node src/database/migrate-seo.js
```
