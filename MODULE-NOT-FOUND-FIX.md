# 🔧 MODULE NOT FOUND ERROR FIX

## ❌ ERROR:

```
Error: Cannot find module 'node-telegram-bot-api'
Require stack:
- /home/dinq6531/apipergimmikan/src/services/telegram.service.js
```

---

## 🔍 ROOT CAUSE:

### **Module exists in package.json but not installed!**

✅ **package.json has it:**
```json
"node-telegram-bot-api": "^0.66.0"
```

❌ **But node_modules missing it!**

**Reason:**
- `npm install` not run after deployment
- `node_modules` not uploaded (correct, shouldn't be)
- Dependencies not installed on production server

---

## ✅ SOLUTION:

### **SSH to Production Server & Install Dependencies**

```bash
# 1. SSH to server
ssh dinq6531@pergimmikan.site

# 2. Navigate to project directory
cd /home/dinq6531/apipergimmikan

# 3. Install dependencies
npm install

# 4. Restart server
# If using PM2:
pm2 restart all

# If using systemd:
sudo systemctl restart pergimmikan-api

# If using LiteSpeed (your case):
# Just refresh - it will auto-restart
```

---

## 🚀 DETAILED STEPS:

### **Step 1: Connect to Server**

```bash
ssh dinq6531@pergimmikan.site
# Enter password when prompted
```

---

### **Step 2: Navigate to Project**

```bash
cd /home/dinq6531/apipergimmikan
pwd
# Should show: /home/dinq6531/apipergimmikan
```

---

### **Step 3: Check Current State**

```bash
# Check if package.json exists
ls -la package.json

# Check node_modules
ls -la node_modules/ | head

# Check if telegram module exists
ls node_modules/ | grep telegram
```

**If missing:**
```
ls: cannot access 'node_modules/node-telegram-bot-api': No such file or directory
```

---

### **Step 4: Install Dependencies**

```bash
# Install all dependencies
npm install

# Or install specific module
npm install node-telegram-bot-api

# Wait for installation to complete
# Should see: added XXX packages
```

**Expected output:**
```
added 150 packages, and audited 151 packages in 30s

15 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

---

### **Step 5: Verify Installation**

```bash
# Check if module installed
ls node_modules/node-telegram-bot-api

# Should show files:
# index.js  package.json  src/  ...
```

---

### **Step 6: Restart Server**

**For LiteSpeed (your hosting):**
```bash
# LiteSpeed auto-restarts on file change
# Just touch a file to trigger restart
touch restart.txt

# Or restart via control panel
# cPanel → LiteSpeed → Restart
```

**For PM2:**
```bash
pm2 restart all
pm2 logs
```

**For systemd:**
```bash
sudo systemctl restart pergimmikan-api
sudo systemctl status pergimmikan-api
```

---

### **Step 7: Test API**

```bash
# Test from server
curl http://localhost:5000/api/journeys

# Test from outside
curl https://apiv1.pergimmikan.site/api/journeys
```

**Expected:**
```json
{
  "journeys": [...],
  "total": 10
}
```

---

## 📋 DEPLOYMENT CHECKLIST:

### **Every time you deploy:**

```bash
# 1. SSH to server
ssh dinq6531@pergimmikan.site

# 2. Navigate to project
cd /home/dinq6531/apipergimmikan

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm install --production

# 5. Run migrations (if any)
# npm run migrate

# 6. Restart server
touch restart.txt
# or pm2 restart all

# 7. Check logs
tail -f logs/app.log
# or pm2 logs

# 8. Test API
curl https://apiv1.pergimmikan.site/api/journeys
```

---

## 🔧 AUTOMATED DEPLOYMENT SCRIPT:

**Create:** `deploy.sh`

```bash
#!/bin/bash

echo "🚀 Deploying PERGIMMIKAN API..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project
cd /home/dinq6531/apipergimmikan || exit

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed${NC}"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

# Restart server
echo "🔄 Restarting server..."
touch restart.txt
# or: pm2 restart all

# Wait for restart
sleep 3

# Test API
echo "🧪 Testing API..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://apiv1.pergimmikan.site/api/journeys)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ API is running!${NC}"
else
    echo -e "${RED}❌ API test failed (HTTP $response)${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
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

## 🔍 TROUBLESHOOTING:

### **Error: npm not found**

```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

---

### **Error: Permission denied**

```bash
# Fix permissions
sudo chown -R dinq6531:dinq6531 /home/dinq6531/apipergimmikan
chmod -R 755 /home/dinq6531/apipergimmikan
```

---

### **Error: EACCES npm install**

```bash
# Use --unsafe-perm flag
npm install --unsafe-perm

# Or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

### **Error: Module still not found after install**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Restart server
touch restart.txt
```

---

## 📊 CHECK INSTALLATION:

### **Verify all required modules:**

```bash
# Check package.json dependencies
cat package.json | grep dependencies -A 20

# Check installed modules
ls node_modules/ | wc -l
# Should show ~150+ packages

# Check specific module
ls -la node_modules/node-telegram-bot-api

# Test require
node -e "require('node-telegram-bot-api'); console.log('✅ Module found!')"
```

---

## 🎯 QUICK FIX (One-liner):

```bash
ssh dinq6531@pergimmikan.site "cd /home/dinq6531/apipergimmikan && npm install && touch restart.txt"
```

---

## 📝 COMMON MISTAKES:

### **1. Forgot to run npm install**
```bash
# ❌ Wrong
git pull
# Server crashes - modules missing!

# ✅ Correct
git pull
npm install
touch restart.txt
```

---

### **2. Used npm install --production but need devDependencies**
```bash
# If you need dev dependencies
npm install

# If production only (recommended)
npm install --production
```

---

### **3. node_modules uploaded to git**
```bash
# ❌ Don't do this!
git add node_modules/

# ✅ Use .gitignore
echo "node_modules/" >> .gitignore
```

---

## ✅ SOLUTION SUMMARY:

### **Problem:**
- Module exists in package.json
- But not in node_modules
- Server crashes on startup

### **Cause:**
- npm install not run after deployment
- Dependencies not installed

### **Fix:**
```bash
# 1. SSH to server
ssh dinq6531@pergimmikan.site

# 2. Install dependencies
cd /home/dinq6531/apipergimmikan
npm install

# 3. Restart server
touch restart.txt

# 4. Test
curl https://apiv1.pergimmikan.site/api/journeys
```

---

## 🚀 AFTER FIX:

### **Test API:**
```bash
curl https://apiv1.pergimmikan.site/api/journeys
curl https://apiv1.pergimmikan.site/api/journeys/map/data
curl https://apiv1.pergimmikan.site/api/journeys/map/statistics
```

**Expected:**
```
✅ 200 OK
✅ Data returned
✅ No errors
```

---

## 📁 FILES TO CHECK:

- ✅ `package.json` - Has all dependencies
- ✅ `node_modules/` - Should exist after npm install
- ✅ `package-lock.json` - Lock file for versions
- ❌ `.gitignore` - Should ignore node_modules

---

**🔧 RUN npm install ON SERVER NOW!**

**Command:**
```bash
ssh dinq6531@pergimmikan.site "cd /home/dinq6531/apipergimmikan && npm install"
```

**Then refresh API and it should work!** 🎉
