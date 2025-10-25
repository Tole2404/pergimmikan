# 🗺️ MAP API 404 ERROR FIX

## ❌ ERRORS:

```
GET /api/journeys/map/data - 404
GET /api/journeys/map/statistics - 404
```

---

## 🔍 ROOT CAUSE:

### **Code is CORRECT but server issue!**

✅ **Routes exist:** `journeys.routes.js`
```javascript
router.get('/map/data', journeyController.getJourneysForMap);
router.get('/map/statistics', journeyController.getMapStatistics);
```

✅ **Controllers exist:** `journey.controller.js`
```javascript
async getJourneysForMap(req, res, next) { ... }
async getMapStatistics(req, res, next) { ... }
```

✅ **Models exist:** `journey.model.js`
```javascript
static async findAllWithCoordinates() { ... }
static async getMapStatistics() { ... }
```

✅ **Registered in app.js:**
```javascript
app.use('/api/journeys', journeysRoutes);
```

### **Possible Issues:**

1. ❌ **Production server not restarted**
2. ❌ **Old code still running**
3. ❌ **Database missing columns (latitude, longitude)**
4. ❌ **PM2 not reloaded**

---

## ✅ SOLUTION:

### **Step 1: Check Database Columns**

**Run in phpMyAdmin:**
```sql
-- Check if journeys table has coordinates
DESC journeys;

-- Should have these columns:
-- latitude DECIMAL(10, 8)
-- longitude DECIMAL(11, 8)
```

**If missing, add columns:**
```sql
ALTER TABLE journeys 
ADD COLUMN latitude DECIMAL(10, 8) DEFAULT NULL,
ADD COLUMN longitude DECIMAL(11, 8) DEFAULT NULL;
```

---

### **Step 2: Restart Production Server**

**SSH to server:**
```bash
ssh user@pergimmikan.site
```

**Navigate to server directory:**
```bash
cd /path/to/server
```

**Restart with PM2:**
```bash
# Check PM2 status
pm2 list

# Restart all
pm2 restart all

# Or restart specific app
pm2 restart pergimmikan-api

# Check logs
pm2 logs
```

**Or restart with systemd:**
```bash
sudo systemctl restart pergimmikan-api
sudo systemctl status pergimmikan-api
```

**Or manual restart:**
```bash
# Kill old process
pkill -f "node.*server"

# Start new process
cd /path/to/server
npm start
# or
node src/index.js
```

---

### **Step 3: Verify Routes Registered**

**Test locally first:**
```bash
cd server
npm start
```

**Test endpoint:**
```bash
curl http://localhost:5000/api/journeys/map/data
curl http://localhost:5000/api/journeys/map/statistics
```

**Expected:**
```json
// /api/journeys/map/data
[
  {
    "id": 1,
    "title": "Journey Title",
    "latitude": -6.200000,
    "longitude": 106.816666,
    "location": "Jakarta"
  }
]

// /api/journeys/map/statistics
{
  "totalJourneys": 10,
  "totalLocations": 5,
  "totalDistance": 1234.56
}
```

---

## 🔧 DEBUGGING:

### **Test 1: Check if Server Running**
```bash
curl https://apiv1.pergimmikan.site/api/journeys
```

**If works:**
- ✅ Server running
- ✅ Base route works
- ❌ Map routes not registered

**If fails:**
- ❌ Server down
- ❌ Need to restart

---

### **Test 2: Check Route Registration**

**Add debug log in app.js:**
```javascript
// After route registration
console.log('Registered routes:');
app._router.stack.forEach(r => {
  if (r.route) {
    console.log(r.route.path);
  }
});
```

**Should see:**
```
/api/journeys/map/data
/api/journeys/map/statistics
```

---

### **Test 3: Check Database**

**Run query:**
```sql
-- Check if coordinates exist
SELECT id, title, latitude, longitude 
FROM journeys 
WHERE latitude IS NOT NULL 
LIMIT 5;
```

**If empty:**
- Journeys have no coordinates
- Need to populate data

---

## 📊 DATABASE FIX:

### **Check Table Structure:**
```sql
SHOW COLUMNS FROM journeys LIKE '%lat%';
SHOW COLUMNS FROM journeys LIKE '%long%';
```

**Expected:**
```
+------------+----------------+------+-----+---------+-------+
| Field      | Type           | Null | Key | Default | Extra |
+------------+----------------+------+-----+---------+-------+
| latitude   | decimal(10,8)  | YES  |     | NULL    |       |
| longitude  | decimal(11,8)  | YES  |     | NULL    |       |
+------------+----------------+------+-----+---------+-------+
```

---

### **Add Missing Columns:**
```sql
-- Add latitude and longitude if missing
ALTER TABLE journeys 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8) DEFAULT NULL;

-- Add index for faster queries
CREATE INDEX idx_coordinates ON journeys(latitude, longitude);
```

---

### **Populate Sample Data:**
```sql
-- Update existing journeys with coordinates
UPDATE journeys 
SET 
  latitude = -6.200000,
  longitude = 106.816666
WHERE id = 1;

UPDATE journeys 
SET 
  latitude = -7.250445,
  longitude = 112.768845
WHERE id = 2;
```

---

## 🚀 DEPLOYMENT CHECKLIST:

### **Pre-deployment:**
- [ ] Database has latitude/longitude columns
- [ ] Routes tested locally
- [ ] Code committed to git

### **Deployment:**
- [ ] Pull latest code on server
- [ ] Install dependencies: `npm install`
- [ ] Restart server: `pm2 restart all`
- [ ] Check logs: `pm2 logs`

### **Post-deployment:**
- [ ] Test map data endpoint
- [ ] Test map statistics endpoint
- [ ] Check frontend map loads

---

## 💻 PRODUCTION DEPLOYMENT:

### **Option 1: Using PM2**

```bash
# SSH to server
ssh user@pergimmikan.site

# Navigate to project
cd /var/www/pergimmikan-api

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Restart PM2
pm2 restart all

# Check status
pm2 status

# Monitor logs
pm2 logs --lines 50
```

---

### **Option 2: Using Git Hooks**

**Create deploy script:**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying PERGIMMIKAN API..."

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Run migrations if any
npm run migrate

# Restart server
pm2 restart pergimmikan-api

# Check status
pm2 status

echo "✅ Deployment complete!"
```

**Make executable:**
```bash
chmod +x deploy.sh
```

**Run:**
```bash
./deploy.sh
```

---

### **Option 3: Manual Restart**

```bash
# Find process
ps aux | grep node

# Kill process
kill -9 <PID>

# Start server
cd /var/www/pergimmikan-api
NODE_ENV=production node src/index.js &

# Or with nohup
nohup node src/index.js > logs/app.log 2>&1 &
```

---

## 🧪 TESTING:

### **Test Locally:**
```bash
# Start server
cd server
npm start

# Test endpoints
curl http://localhost:5000/api/journeys/map/data
curl http://localhost:5000/api/journeys/map/statistics
```

---

### **Test Production:**
```bash
# Test map data
curl https://apiv1.pergimmikan.site/api/journeys/map/data

# Test map statistics
curl https://apiv1.pergimmikan.site/api/journeys/map/statistics

# Test with verbose
curl -v https://apiv1.pergimmikan.site/api/journeys/map/data
```

**Expected Response:**
```json
// 200 OK
[
  {
    "id": 1,
    "title": "Journey to Bali",
    "latitude": -8.3405,
    "longitude": 115.0920,
    "location": "Bali"
  }
]
```

**If 404:**
- Server not restarted
- Routes not registered
- Old code running

---

## 🔍 CHECK SERVER LOGS:

### **PM2 Logs:**
```bash
# Real-time logs
pm2 logs

# Last 100 lines
pm2 logs --lines 100

# Specific app
pm2 logs pergimmikan-api

# Error logs only
pm2 logs --err
```

---

### **Check for Errors:**
```bash
# Check if routes registered
grep "map/data" logs/app.log

# Check for 404 errors
grep "404" logs/app.log

# Check for startup errors
grep "Error" logs/app.log
```

---

## 📝 QUICK FIX SCRIPT:

**Create:** `fix-map-api.sh`

```bash
#!/bin/bash

echo "🔧 Fixing Map API..."

# 1. Check database
echo "📊 Checking database..."
mysql -u root -p db_gimmik3 -e "DESC journeys;" | grep -E "latitude|longitude"

# 2. Restart server
echo "🔄 Restarting server..."
pm2 restart all

# 3. Wait for startup
sleep 3

# 4. Test endpoints
echo "🧪 Testing endpoints..."
curl -s https://apiv1.pergimmikan.site/api/journeys/map/data | jq '.'
curl -s https://apiv1.pergimmikan.site/api/journeys/map/statistics | jq '.'

echo "✅ Done!"
```

---

## ✅ SOLUTION SUMMARY:

### **Problem:**
- Map API returns 404
- Routes exist in code
- But not working in production

### **Cause:**
1. Server not restarted after code update
2. Database missing columns
3. Old code still running

### **Fix:**
1. ✅ Check database has latitude/longitude
2. ✅ Restart production server
3. ✅ Test endpoints
4. ✅ Check logs

---

## 🎯 ACTION REQUIRED:

### **1. SSH to Server:**
```bash
ssh user@pergimmikan.site
```

### **2. Restart Server:**
```bash
pm2 restart all
```

### **3. Test:**
```bash
curl https://apiv1.pergimmikan.site/api/journeys/map/data
```

### **4. If Still 404:**
```bash
# Check logs
pm2 logs

# Check database
mysql -u root -p -e "DESC db_gimmik3.journeys;"

# Verify code
cat /path/to/server/src/routes/journeys.routes.js | grep map
```

---

**🗺️ MAP API SHOULD WORK AFTER RESTART!**

**Steps:**
1. ✅ Restart server: `pm2 restart all`
2. ✅ Check database has coordinates
3. ✅ Test endpoints
4. ✅ Monitor logs

**If still fails, check:**
- Database columns exist
- Code deployed correctly
- Server actually restarted
- No errors in logs

---

**📁 Files to check:**
- `server/src/routes/journeys.routes.js` ✅
- `server/src/controllers/journey.controller.js` ✅
- `server/src/models/journey.model.js` ✅
- `server/src/app.js` ✅

**All code is correct! Just need to restart server!** 🚀
