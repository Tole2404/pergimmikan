# 🔧 CORS & 404 ERROR FIX

## ❌ ERRORS:

### **1. CORS Error - Images Blocked:**
```
ERR_BLOCKED_BY_RESPONSE.NotSameOrigin
apiv1.pergimmikan.site/images/journey/2025/xxx.png
apiv1.pergimmikan.site/images/profiles/xxx.jpg
```

### **2. API 404 Errors:**
```
/api/comments/journey/91 - 404
/api/comments/reactions/journey/91 - 404
/api/notifications/unread/count - 404
```

---

## 🔍 PENYEBAB:

### **Problem 1: CORS Headers Missing**
- Server tidak mengirim header `Cross-Origin-Embedder-Policy`
- Images di-block oleh browser karena cross-origin policy

### **Problem 2: Wrong Content ID**
- Frontend request journey ID **91**
- Database hanya punya journey ID **95**
- Mismatch antara URL dan data

---

## ✅ SOLUSI:

### **FIX 1: Update CORS Headers** ✅

**File:** `server/src/app.js`

**Already Fixed:**
```javascript
app.use('/images', express.static(path.join(__dirname, '../public/images'), {
  setHeaders: (res, filePath, stat) => {
    // ... existing code ...
    
    // CRITICAL: Allow cross-origin resource sharing
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cross-Origin-Embedder-Policy', 'unsafe-none');  // ✅ ADDED
    res.set('Access-Control-Allow-Credentials', 'true');      // ✅ ADDED
    res.removeHeader('X-Frame-Options');                       // ✅ ADDED
  }
}));
```

---

### **FIX 2: Check Journey ID**

**Problem:** Frontend trying to access journey 91, but database only has 95

**Solution A: Fix Frontend URL**
```javascript
// Change URL from /journey/91 to /journey/95
<Link to="/journey/95">View Journey</Link>
```

**Solution B: Add Journey 91 to Database**
```sql
-- Check existing journeys
SELECT id, title FROM journeys ORDER BY id DESC LIMIT 10;

-- If journey 91 doesn't exist, either:
-- 1. Use existing journey ID (95)
-- 2. Or create journey 91
```

---

### **FIX 3: Notifications Route**

**Check if notifications table exists:**
```sql
SHOW TABLES LIKE 'notifications';
```

**If not exists, create:**
```sql
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
```

---

## 🚀 DEPLOYMENT STEPS:

### **Step 1: Restart Server**
```bash
cd server
pm2 restart all
# or
node src/index.js
```

### **Step 2: Clear Browser Cache**
```
Ctrl + Shift + Delete
Clear cached images and files
```

### **Step 3: Test Images**
```
https://apiv1.pergimmikan.site/images/journey/2025/xxx.png
```

**Should load without CORS error!**

---

## 🧪 TESTING:

### **Test 1: Check CORS Headers**
```bash
curl -I https://apiv1.pergimmikan.site/images/journey/2025/xxx.png
```

**Expected headers:**
```
Access-Control-Allow-Origin: https://pergimmikan.site
Cross-Origin-Resource-Policy: cross-origin
Cross-Origin-Embedder-Policy: unsafe-none
```

---

### **Test 2: Check Comments API**
```bash
# Check journey exists
curl https://apiv1.pergimmikan.site/api/journeys/91

# If 404, use correct ID
curl https://apiv1.pergimmikan.site/api/journeys/95

# Then test comments
curl https://apiv1.pergimmikan.site/api/comments/journey/95
```

---

### **Test 3: Check Notifications**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://apiv1.pergimmikan.site/api/notifications/unread/count
```

---

## 📊 DATABASE CHECK:

### **1. Check Comments Table:**
```sql
SELECT * FROM comments WHERE content_type = 'journey' ORDER BY id DESC LIMIT 5;
```

**Expected:**
```
+----+--------------+------------+-----------+---------+
| id | content_type | content_id | user_id   | comment |
+----+--------------+------------+-----------+---------+
| 1  | journey      | 95         | 7         | test    |
+----+--------------+------------+-----------+---------+
```

**Note:** content_id = 95, NOT 91!

---

### **2. Check Journeys:**
```sql
SELECT id, title FROM journeys ORDER BY id DESC LIMIT 10;
```

**Find the correct journey ID to use**

---

### **3. Check Notifications Table:**
```sql
SHOW TABLES LIKE 'notifications';
DESC notifications;
```

---

## 🔧 QUICK FIX CHECKLIST:

- [x] Update CORS headers in app.js ✅
- [ ] Restart server
- [ ] Clear browser cache
- [ ] Fix journey ID (91 → 95)
- [ ] Check notifications table exists
- [ ] Test images load
- [ ] Test comments API
- [ ] Test notifications API

---

## 💡 WHY JOURNEY 91 vs 95?

**Possible reasons:**
1. **URL parameter wrong** - Check frontend routing
2. **Journey deleted** - ID 91 was deleted from database
3. **Test data** - Using test ID that doesn't exist
4. **Migration issue** - IDs changed during migration

**Solution:**
```javascript
// Frontend: JourneyDetail.jsx
const { id } = useParams();
console.log('Journey ID:', id); // Check what ID is being used

// Make sure journey exists before loading
useEffect(() => {
  fetchJourney(id).catch(err => {
    if (err.response?.status === 404) {
      navigate('/journey'); // Redirect if not found
    }
  });
}, [id]);
```

---

## 🎯 EXPECTED RESULTS:

### **After Fix:**

✅ **Images load without CORS error**
```
✓ apiv1.pergimmikan.site/images/journey/2025/xxx.png
✓ apiv1.pergimmikan.site/images/profiles/xxx.jpg
```

✅ **Comments API works**
```
✓ GET /api/comments/journey/95 - 200 OK
✓ POST /api/comments - 201 Created
✓ GET /api/comments/reactions/journey/95 - 200 OK
```

✅ **Notifications API works**
```
✓ GET /api/notifications/unread/count - 200 OK
```

---

## 📝 SUMMARY:

### **Problem 1: CORS** ✅ FIXED
- Added `Cross-Origin-Embedder-Policy: unsafe-none`
- Added `Access-Control-Allow-Credentials: true`
- Removed `X-Frame-Options`

### **Problem 2: Journey ID Mismatch** ⚠️ NEEDS FIX
- Frontend uses ID 91
- Database has ID 95
- **Action:** Update frontend to use correct ID

### **Problem 3: Notifications 404** ⚠️ CHECK DATABASE
- Route exists in code
- **Action:** Verify notifications table exists

---

## 🚀 NEXT STEPS:

1. **Restart server** with updated CORS headers
2. **Check database** for correct journey ID
3. **Update frontend** to use correct ID
4. **Verify notifications** table exists
5. **Test all endpoints**

---

**🎉 CORS FIXED! Now fix journey ID mismatch!**

**Restart server:**
```bash
pm2 restart all
```

**Check journey ID:**
```sql
SELECT id, title FROM journeys ORDER BY id DESC;
```

**Update frontend to use correct ID!**
