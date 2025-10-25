# 🔧 CPANEL NODEJS SELECTOR - INSTALL DEPENDENCIES

## ❌ ERROR:

```
Cloudlinux NodeJS Selector demands to store node modules for application 
in separate folder (virtual environment) pointed by symlink called "node_modules". 
That's why application should not contain folder/file with such name in application root
```

---

## 🔍 ROOT CAUSE:

### **CloudLinux NodeJS Selector menggunakan Virtual Environment!**

**Normal hosting:**
```
/home/user/app/
  ├── node_modules/     ← Direct folder
  ├── package.json
  └── src/
```

**CloudLinux hosting:**
```
/home/user/app/
  ├── node_modules      ← Symlink (not folder!)
  ├── package.json
  └── src/

/home/user/nodevenv/app/
  └── lib/
      └── node_modules/ ← Real modules here
```

**Jangan install via SSH!** Harus lewat cPanel NodeJS Selector!

---

## ✅ SOLUTION:

### **Install Dependencies via cPanel NodeJS Selector**

### **Step 1: Login to cPanel**

```
https://pergimmikan.site:2083
atau
https://cpanel.pergimmikan.site
```

**Login credentials:**
- Username: `dinq6531`
- Password: [your cPanel password]

---

### **Step 2: Open NodeJS Selector**

1. **Scroll down** ke section "SOFTWARE"
2. **Click** "Setup Node.js App"
3. **Find your application** (apipergimmikan)

---

### **Step 3: Install Dependencies**

**Method A: Via NodeJS Selector Interface**

1. **Click** your app name (apipergimmikan)
2. **Scroll down** to "Detected configuration files"
3. **Click** "Run NPM Install" button
4. **Wait** for installation (may take 1-2 minutes)
5. **Check** status - should show "Installed"

---

**Method B: Via Terminal in cPanel**

1. **Click** "Terminal" icon in cPanel
2. **Run setup command:**

```bash
# Enter virtual environment
source /home/dinq6531/nodevenv/apipergimmikan/22/bin/activate

# Navigate to app
cd /home/dinq6531/apipergimmikan

# Install dependencies
npm install

# Exit virtual environment
deactivate
```

---

**Method C: Via NodeJS Selector Terminal**

1. **In NodeJS Selector**, click your app
2. **Click** "Run Terminal" or "Enter to virtual environment"
3. **Run:**

```bash
npm install
```

4. **Wait** for completion
5. **Restart** app via NodeJS Selector

---

### **Step 4: Restart Application**

**In NodeJS Selector:**
1. **Click** "Stop App" button
2. **Wait** 2-3 seconds
3. **Click** "Start App" button
4. **Check** status - should show "Running"

---

### **Step 5: Verify Installation**

**Test API:**
```
https://apiv1.pergimmikan.site/api/journeys
```

**Should return:**
```json
{
  "journeys": [...],
  "total": 10
}
```

---

## 📋 CPANEL NODEJS SELECTOR GUIDE:

### **App Configuration:**

**Application root:**
```
/home/dinq6531/apipergimmikan
```

**Application URL:**
```
https://apiv1.pergimmikan.site
```

**Application startup file:**
```
src/app.js
or
src/index.js
```

**Node.js version:**
```
22.x (or latest LTS)
```

**Environment:**
```
production
```

---

### **Environment Variables:**

**In NodeJS Selector:**
1. **Click** your app
2. **Scroll** to "Environment variables"
3. **Add** variables:

```
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=dinq6531_pergimmikan
DB_PASS=your_password
DB_NAME=dinq6531_pergimmikan
JWT_SECRET=your_secret
```

---

## 🔧 TROUBLESHOOTING:

### **Error: node_modules already exists**

**Solution:**
```bash
# SSH to server
ssh dinq6531@pergimmikan.site

# Remove node_modules if it's a folder (not symlink)
cd /home/dinq6531/apipergimmikan
rm -rf node_modules

# Then use NodeJS Selector to install
```

---

### **Error: Cannot find module**

**Solution:**
1. **Go to NodeJS Selector**
2. **Click** "Run NPM Install"
3. **Wait** for completion
4. **Restart** app

---

### **Error: App won't start**

**Check logs:**
```bash
# In cPanel Terminal
cd /home/dinq6531/apipergimmikan
tail -f logs/app.log

# Or check NodeJS Selector logs
# Click app → View logs
```

---

## 📊 DEPLOYMENT WORKFLOW:

### **Correct Deployment Steps:**

```
1. Local Development
   ├── Make changes
   ├── Test locally
   └── Git commit & push

2. Server Deployment
   ├── Login to cPanel
   ├── Open Terminal or File Manager
   ├── Navigate to app folder
   ├── Git pull origin main
   └── DON'T run npm install here!

3. NodeJS Selector
   ├── Open Setup Node.js App
   ├── Click your app
   ├── Click "Run NPM Install"
   ├── Wait for completion
   └── Click "Restart App"

4. Test
   └── Visit API URL
```

---

## 🎯 AUTOMATED DEPLOYMENT:

### **Create Deploy Script for cPanel:**

**File:** `cpanel-deploy.sh`

```bash
#!/bin/bash

echo "🚀 Deploying to cPanel..."

# Navigate to app
cd /home/dinq6531/apipergimmikan

# Pull latest code
git pull origin main

# Enter virtual environment
source /home/dinq6531/nodevenv/apipergimmikan/22/bin/activate

# Install dependencies
npm install --production

# Exit virtual environment
deactivate

# Restart app via NodeJS Selector API (if available)
# Or manually restart via cPanel interface

echo "✅ Deployment complete!"
echo "⚠️  Please restart app via cPanel NodeJS Selector"
```

**Make executable:**
```bash
chmod +x cpanel-deploy.sh
```

**Run:**
```bash
./cpanel-deploy.sh
```

---

## 📝 IMPORTANT NOTES:

### **DO NOT:**
❌ Run `npm install` directly in SSH without virtual environment
❌ Create `node_modules` folder manually
❌ Delete the `node_modules` symlink

### **DO:**
✅ Use cPanel NodeJS Selector to install dependencies
✅ Use "Run NPM Install" button
✅ Restart app after installing dependencies
✅ Check logs if errors occur

---

## 🔍 CHECK VIRTUAL ENVIRONMENT:

### **Verify symlink:**
```bash
# SSH to server
cd /home/dinq6531/apipergimmikan

# Check if node_modules is a symlink
ls -la node_modules

# Should show:
# lrwxrwxrwx 1 dinq6531 dinq6531 ... node_modules -> /home/dinq6531/nodevenv/apipergimmikan/22/lib/node_modules
```

**If it's a folder (not symlink):**
```bash
# Remove it
rm -rf node_modules

# Let NodeJS Selector recreate it
# Go to cPanel → NodeJS Selector → Run NPM Install
```

---

## 🎨 CPANEL NODEJS SELECTOR INTERFACE:

### **Main Screen:**
```
┌─────────────────────────────────────────┐
│ Setup Node.js App                       │
├─────────────────────────────────────────┤
│ Applications:                           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ apipergimmikan                      │ │
│ │ Node.js: 22.18.0                    │ │
│ │ Status: Running ●                   │ │
│ │ URL: https://apiv1.pergimmikan.site│ │
│ │                                     │ │
│ │ [Stop App] [Restart] [Edit]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [+ Create Application]                  │
└─────────────────────────────────────────┘
```

### **App Details Screen:**
```
┌─────────────────────────────────────────┐
│ Application: apipergimmikan             │
├─────────────────────────────────────────┤
│ Node.js version: 22.18.0                │
│ Application mode: production            │
│ Application root: /home/.../apipergim...│
│ Application URL: https://apiv1.per...   │
│ Application startup file: src/app.js    │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Detected configuration files        │ │
│ │ package.json ✓                      │ │
│ │                                     │ │
│ │ [Run NPM Install] [Run NPM Update]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Environment variables:                  │
│ NODE_ENV=production                     │
│ PORT=5000                               │
│ [+ Add Variable]                        │
│                                         │
│ [Save] [Restart] [Delete]               │
└─────────────────────────────────────────┘
```

---

## ✅ STEP-BY-STEP VISUAL GUIDE:

### **1. Login to cPanel**
```
→ Go to: https://pergimmikan.site:2083
→ Enter username: dinq6531
→ Enter password: [your password]
→ Click "Log in"
```

### **2. Find NodeJS Selector**
```
→ Scroll down to "SOFTWARE" section
→ Look for "Setup Node.js App" icon
→ Click it
```

### **3. Select Your App**
```
→ Find "apipergimmikan" in the list
→ Click on the app name
→ App details page opens
```

### **4. Install Dependencies**
```
→ Scroll to "Detected configuration files"
→ See "package.json ✓"
→ Click "Run NPM Install" button
→ Wait for progress bar (1-2 minutes)
→ See "Installation complete ✓"
```

### **5. Restart App**
```
→ Click "Restart" button at bottom
→ Wait for "Restarting..." message
→ See "Status: Running ●"
```

### **6. Test API**
```
→ Open new tab
→ Go to: https://apiv1.pergimmikan.site/api/journeys
→ Should see JSON response
→ ✅ Success!
```

---

## 🚀 QUICK FIX SUMMARY:

### **Problem:**
- Cannot run `npm install` via SSH
- CloudLinux uses virtual environment
- Need to use cPanel NodeJS Selector

### **Solution:**
1. ✅ Login to cPanel
2. ✅ Open "Setup Node.js App"
3. ✅ Click your app (apipergimmikan)
4. ✅ Click "Run NPM Install"
5. ✅ Wait for completion
6. ✅ Click "Restart"
7. ✅ Test API

---

## 📞 IF STILL NOT WORKING:

### **Contact Hosting Support:**
```
Subject: NodeJS App Dependencies Installation

Hi,

I need help installing dependencies for my Node.js application:
- App: apipergimmikan
- Path: /home/dinq6531/apipergimmikan
- Issue: Cannot install node_modules via SSH
- Need: Install dependencies via NodeJS Selector

Can you help run "npm install" for this app?

Thanks!
```

---

**🎯 USE CPANEL NODEJS SELECTOR, NOT SSH!**

**Steps:**
1. cPanel → Setup Node.js App
2. Click app → Run NPM Install
3. Restart app
4. Test API

**That's it!** 🎉
